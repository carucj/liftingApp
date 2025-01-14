import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TierComponent from '../TierComponent';
import { expect, vi } from 'vitest';
import { DispatchContext } from '../LiftStateAndContext';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

const exerciseT1 = {
    id: 't1TestId', tier: "T1", name: "Squat", sets: 5, targetWeight: 0, targetReps: 3, addSets: false,
    setResults: Array.from({ length: 5 }, (idx) => ({
        id: `T1TestId${idx}`,
        setNumber: idx + 1,
        actWeight: "",
        actReps: "",
        isSetComplete: false
    }))
}
const exerciseT2 = {
    id: 't2TestId', tier: "T2", name: "Bench Press", sets: 3, targetWeight: 135, targetReps: 10, addSets: true,
    setResults: Array.from({ length: 3 }, (idx) => ({
        id: `T2TestId${idx}`,
        setNumber: idx + 1,
        actWeight: "",
        actReps: "",
        isSetComplete: false
    }))
}

describe('TierComponent', () => {

    test('should render the name of the exercise', () => {
        render(<TierComponent exercise={exerciseT1} />);
        const exerciseName = screen.getByText('Squat');
        expect(exerciseName).toBeInTheDocument();
    });

    test('should render a LiftComponent for each set of exercise in the tier', () => {
        render(<TierComponent exercise={exerciseT1} />);
        const liftComponents = screen.getAllByTestId('LiftComponent');
        expect(liftComponents).toHaveLength(5);
    });

    test('should render an add set button for T2 or greater exercises', () => {
        userEvent.setup();

        render(<TierComponent exercise={exerciseT1} />);
        expect(screen.queryByRole('button', { name: 'addSetButton' })).not.toBeInTheDocument()
        cleanup();

        render(<TierComponent exercise={exerciseT2} />);
        expect(screen.queryByRole('button', { name: 'addSetButton' })).toBeInTheDocument()
    })

    test('should call dispatch with the correct action when the add set button is clicked', async () => {
        const user = userEvent.setup();
        const dispatch = vi.fn();

        render(
            <DispatchContext.Provider value={dispatch}>
                <TierComponent exercise={exerciseT2} />
            </DispatchContext.Provider>
        );

        const addSetButton = screen.getByRole('button', { name: 'addSetButton' });
        await user.click(addSetButton);
        expect(dispatch).toHaveBeenCalledWith({ type: 'addSet', id: exerciseT2.id });
    });
});