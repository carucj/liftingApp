import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LiftManager from '../LiftManager';
import { expect, test, vi } from 'vitest';
import { DispatchContext, StateContext } from '../LiftStateAndContext';

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
const exerciseT3 = {
    id: 't3TestId', tier: "T3", name: "Pullups", sets: 5, targetWeight: 175, targetReps: 15, addSets: false,
    setResults: Array.from({ length: 5 }, (idx) => ({
        id: `T3TestId${idx}`,
        setNumber: idx + 1,
        actWeight: "",
        actReps: "",
        isSetComplete: false
    }))
}

//wrote these out in comments then wrote the tests with cody so i need to edit each one to actually work lol
//
//tests:
//  render title
//  render each tier component
//  render add exercise button
//  edit workout/submit workout button functionality
//  tab changes
//  page changes 

const mockDispatch = vi.fn();

const mockStateIncompleteDay = [{
    id: 'W1',
    week: 1,
    page: 1,
    data: [{
        day: 1,
        id: 'W1d1',
        isDayComplete: false,
        exercises: [exerciseT1, exerciseT2, exerciseT3]
    }]
}]

const mockStateCompleteDay = [{
    id: 'W1',
    week: 1,
    page: 1,
    data: [{
        day: 1,
        id: 'W1d1',
        isDayComplete: true,
        exercises: [exerciseT1, exerciseT2, exerciseT3]
    }]
}]
const renderWithMockState = (mockState) =>
    render(
        <StateContext.Provider value={mockState}>
            <DispatchContext.Provider value={mockDispatch}>
                <LiftManager />
            </DispatchContext.Provider>
        </StateContext.Provider>
    );

describe('LiftManager Rendering', () => {
    test('should render week and day numbers in title box', () => {
        renderWithMockState(mockStateIncompleteDay);
        const title = screen.getByTestId('titleBox')
        expect(title).toBeInTheDocument();
        expect(title).toHaveTextContent('Week 1, Day 1')
    })

    test('should render each tier component', () => {
        renderWithMockState(mockStateIncompleteDay);
        const tierComponents = screen.getAllByTestId('TierComponent');
        expect(tierComponents).toHaveLength(3);
    })
    test('should render add exercise button', () => {
        renderWithMockState(mockStateIncompleteDay);
        const addExerciseButton = screen.getByTestId('addExerciseButton');
        expect(addExerciseButton).toBeInTheDocument();
        expect(addExerciseButton).toHaveTextContent('Add Exercise');
    })

    test('should render edit workout/complete workout button based on day completion status ', async () => {
        renderWithMockState(mockStateIncompleteDay);
        const completeWorkoutButton = screen.getByTestId('completeDayButton');
        expect(completeWorkoutButton).toBeInTheDocument();
        expect(completeWorkoutButton).toHaveTextContent('Complete Workout');
        cleanup();

        renderWithMockState(mockStateCompleteDay);
        const editWorkoutButton = screen.getByTestId('completeDayButton');
        expect(editWorkoutButton).toBeInTheDocument();
        expect(editWorkoutButton).toHaveTextContent('Edit Workout');
    })
    test('should render page buttons', () => {
        renderWithMockState(mockStateIncompleteDay);
        const pages = screen.getByTestId('pagination');
        expect(pages).toBeInTheDocument();
    })
    test('should render tab buttons', () => {
        renderWithMockState(mockStateIncompleteDay);
        const tabs = screen.getByTestId('tabulation');
        expect(tabs).toBeInTheDocument();
    })
})

describe('LiftManager', () => {

    test('should call correct handler and make form visible when the add exercise button is clicked', async () => {
        const user = userEvent.setup();
        renderWithMockState(mockStateIncompleteDay)
        const addExerciseButton = screen.getByTestId('addExerciseButton');
        await user.click(addExerciseButton);
        const addExerciseForm = screen.getByTestId('addExerciseForm');
        expect(addExerciseForm).toBeInTheDocument();
        await user.click(addExerciseButton);
        expect(addExerciseForm).not.toBeInTheDocument();
    });

    test('should call dispatch with the correct action when the page is changed', async () => {
        const user = userEvent.setup();
        renderWithMockState(mockStateIncompleteDay);

        const pageInput = screen.getByTestId('pagination'); //, { name: '2' }
        const button = screen.getByRole('button', { name: '2' });
        await user.click(button);
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'setPage', page: 2 });
    });

    test('should call the correct handler when the week is changed', async () => {
        const user = userEvent.setup();
        renderWithMockState(mockStateIncompleteDay);

        const weekInput = screen.getByRole('textbox', { name: 'weekInput' });
        await user.type(weekInput, '2');
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'setWeek', week: 2 });
    });
})