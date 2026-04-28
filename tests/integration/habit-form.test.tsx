import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '@/src/app/dashboard/page'
const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockRouter = {
  push: mockPush,
  replace: mockReplace,
}

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

vi.mock('@/src/lib/storage', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/src/lib/storage')>()
  return {
    ...actual,
    getSession: () => ({ userId: 'user-1', email: 'test@example.com' }),
  }
})

function seedHabit() {
  const habit = {
    id: 'habit-1',
    userId: 'user-1',
    name: 'Drink Water',
    description: 'Stay hydrated',
    frequency: 'daily',
    createdAt: '2026-01-01T00:00:00.000Z',
    completions: [],
  }
  localStorage.setItem('habit-tracker-habits', JSON.stringify([habit]))
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('create-habit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-form')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument()
    })
  })

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup()
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('create-habit-button'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-form')).toBeInTheDocument()
    })

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water')
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()
    })

    const habits = JSON.parse(
      localStorage.getItem('habit-tracker-habits') ?? '[]'
    )
    expect(habits.length).toBe(1)
    expect(habits[0].name).toBe('Drink Water')
    expect(habits[0].userId).toBe('user-1')
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    seedHabit()
    const user = userEvent.setup()
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('habit-edit-drink-water'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-form')).toBeInTheDocument()
    })

    const nameInput = screen.getByTestId('habit-name-input')
    await user.clear(nameInput)
    await user.type(nameInput, 'Drink More Water')
    await user.click(screen.getByTestId('habit-save-button'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-more-water')).toBeInTheDocument()
    })

    const habits = JSON.parse(
      localStorage.getItem('habit-tracker-habits') ?? '[]'
    )
    expect(habits[0].id).toBe('habit-1')
    expect(habits[0].userId).toBe('user-1')
    expect(habits[0].createdAt).toBe('2026-01-01T00:00:00.000Z')
    expect(habits[0].completions).toEqual([])
  })

  it('deletes a habit only after explicit confirmation', async () => {
    seedHabit()
    const user = userEvent.setup()
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()
    })

    await user.click(screen.getByTestId('habit-delete-drink-water'))

    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()
    })

    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()

    await user.click(screen.getByTestId('confirm-delete-button'))

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-drink-water')).not.toBeInTheDocument()
    })

    const habits = JSON.parse(
      localStorage.getItem('habit-tracker-habits') ?? '[]'
    )
    expect(habits.length).toBe(0)
  })

  it('toggles completion and updates the streak display', async () => {
    seedHabit()
    const user = userEvent.setup()
    render(<DashboardPage />)

    await waitFor(() => {
      expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()
    })

    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0')

    await user.click(screen.getByTestId('habit-complete-drink-water'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('1')
    })

    await user.click(screen.getByTestId('habit-complete-drink-water'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent('0')
    })
  })
})