import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LiftComponent from '../LiftComponent';
import { expect, vi } from 'vitest';
import { DispatchContext } from '../LiftStateAndContext';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

const exercise = {
    tier: "T3",
    targetWeight: 100,
    targetReps: 10
}

const exerciseT1 = {
    tier: "T1",
    targetWeight: 100,
    targetReps: 3
}

const exerciseAdded = {
    tier: "Added",
    targetWeight: 100,
    targetReps: 3
}

const setResult = {
    id: 'testId',
    actWeight: null,
    actReps: null,
    isSetComplete: false
}

describe('LiftComponent', () => {

    test('should render the correct set number, weight, and reps for the label', () => {
        render(<LiftComponent exercise={exercise} setResult={setResult} setNumber={1} />)
        const str = `Set ${1}: ${exercise.targetWeight}x${exercise.targetReps}`
        const setInfo = screen.getByText(str)
        expect(setInfo).toBeInTheDocument()
    })

    test('should disable/enable inputs and submit form when checkbox is checked and unchecked', async () => {

        const user = userEvent.setup()
        const mockDispatch = vi.fn();

        const completedSetResult = {
            ...setResult,
            isSetComplete: true
        };

        const { rerender } =
            render(
                <DispatchContext.Provider value={mockDispatch}>
                    <LiftComponent exercise={exercise} setResult={setResult} setNumber={1} />
                </DispatchContext.Provider>
            );

        const checkbox = screen.getByRole('checkbox')
        const weightInput = screen.getByLabelText(/weight/i)
        const repsInput = screen.getByLabelText(/reps/i)

        expect(checkbox).not.toBeChecked()
        expect(weightInput).toBeEnabled()
        expect(repsInput).toBeEnabled()

        await userEvent.type(weightInput, '100')
        await userEvent.type(repsInput, '10')
        await user.click(checkbox)

        rerender(
            <DispatchContext.Provider value={mockDispatch}>
                <LiftComponent exercise={exercise} setResult={completedSetResult} setNumber={1} />
            </DispatchContext.Provider>
        );

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'recordSet',
            id: setResult.id,
            actWeight: parseInt(weightInput.value),
            actReps: parseInt(repsInput.value)
        });

        expect(checkbox).toBeChecked()
        expect(weightInput).toBeDisabled()
        expect(repsInput).toBeDisabled()
    })

    test('should call delete handler when delete button is clicked', async () => {
        const user = userEvent.setup()
        const mockDispatch = vi.fn();

        render(
            <DispatchContext.Provider value={mockDispatch}>
                <LiftComponent exercise={exercise} setResult={setResult} setNumber={4} />
            </DispatchContext.Provider>
        );

        const deleteButton = screen.getByRole('deleteButton')
        await user.click(deleteButton)

        expect(mockDispatch).toHaveBeenCalled()
    })

    test('should only allow positive numbers in weight and reps inputs', async () => {
        const user = userEvent.setup()
        render(<LiftComponent exercise={exercise} setResult={setResult} setNumber={1} />)

        const weightInput = screen.getByLabelText(/weight/i)
        const repsInput = screen.getByLabelText(/reps/i)

        await user.type(weightInput, '10')
        await user.type(repsInput, '10')
        expect(weightInput).toHaveValue(10)
        expect(repsInput).toHaveValue(10)

        await user.type(weightInput, '-10')
        await user.type(repsInput, '-10')
        expect(weightInput).toHaveValue(10)
        expect(repsInput).toHaveValue(10)

        await user.clear(weightInput)
        await user.clear(repsInput)
        await user.type(weightInput, 'Abc')
        await user.type(repsInput, 'Abc')
        expect(weightInput).toHaveValue(0)
        expect(repsInput).toHaveValue(0)

        await user.clear(weightInput)
        await user.clear(repsInput)
        await user.type(weightInput, '^%&')
        await user.type(repsInput, '^%&')
        expect(weightInput).toHaveValue(0)
        expect(repsInput).toHaveValue(0)

        await user.clear(weightInput)
        await user.clear(repsInput)
        await user.type(weightInput, 'null')
        await user.type(repsInput, 'null')
        expect(weightInput).toHaveValue(0)
        expect(repsInput).toHaveValue(0)

        await user.clear(weightInput)
        await user.clear(repsInput)
        await user.type(weightInput, '1+')
        await user.type(repsInput, '1+')
        expect(weightInput).toHaveValue(1)
        expect(repsInput).toHaveValue(1)

        await user.clear(weightInput)
        await user.clear(repsInput)
        await user.type(weightInput, '{backspace}1.1')
        await user.type(repsInput, '{backspace}1.1')
        expect(weightInput).toHaveValue(1)
        expect(repsInput).toHaveValue(1)


    })

    test('should render delete button only if exercise is t2 or t3 and setNumber is greater than 3 or exercise is added', () => {

        //test T3 exercise at set 1 and set 4
        render(<LiftComponent exercise={exercise} setResult={setResult} setNumber={1} />)
        expect(screen.queryByRole('deleteButton')).not.toBeInTheDocument()
        cleanup();

        render(<LiftComponent exercise={exercise} setResult={setResult} setNumber={4} />)
        expect(screen.queryByRole('deleteButton')).toBeInTheDocument()
        cleanup();

        //test T1 exercise at set 1 and set 4
        render(<LiftComponent exercise={exerciseT1} setResult={setResult} setNumber={1} />)
        expect(screen.queryByRole('deleteButton')).not.toBeInTheDocument()
        cleanup();

        render(<LiftComponent exercise={exerciseT1} setResult={setResult} setNumber={4} />)
        expect(screen.queryByRole('deleteButton')).not.toBeInTheDocument()
        cleanup();

        //test added exercise at set 1
        render(<LiftComponent exercise={exerciseAdded} setResult={setResult} setNumber={1} />)
        expect(screen.queryByRole('deleteButton')).toBeInTheDocument()

    })

    test('should call dipstach when delete button is clicked', async () => {
        const user = userEvent.setup()
        const mockDispatch = vi.fn();

        render(
            <DispatchContext.Provider value={mockDispatch}>
                <LiftComponent exercise={exercise} setResult={setResult} setNumber={4} />
            </DispatchContext.Provider>
        );

        const deleteButton = screen.getByRole('deleteButton')
        await user.click(deleteButton)

        expect(mockDispatch).toHaveBeenCalled()
    })

})