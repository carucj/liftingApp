import { createContext, useReducer, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

const StateContext = createContext();
const DispatchContext = createContext();

const dayLifts = [
    {
        day: 1,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Squat", sets: 5, targetWeight: 250, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Bench Press", sets: 3, targetWeight: 135, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Pullups", sets: 3, targetWeight: 0, targetReps: 15, addSets: true
            }
        ],
        complete: false
    },
    {
        day: 2,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Overhead Press", sets: 5, targetWeight: 135, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Romanian Deadlift", sets: 3, targetWeight: 135, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Bent Over Row", sets: 3, targetWeight: 135, targetReps: 15, addSets: true
            }
        ],
        complete: false
    },
    {
        day: 3,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Bench Press", sets: 5, targetWeight: 185, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Front Squat", sets: 3, targetWeight: 185, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Pullup", sets: 3, targetWeight: 0, targetReps: 15, addSets: true
            }],
        complete: false
    },
    {
        day: 4,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Deadlift", sets: 5, targetWeight: 285, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Overhead Press", sets: 3, targetWeight: 100, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Bent Over Row", sets: 3, targetWeight: 135, targetReps: 15, addSets: true
            }],
        complete: false
    }
]
//need to rerun this somehow
const initialState = (dayLifts) => {
    return [{
        id: uuid(),
        week: 1,
        page: 1,
        data:
            dayLifts.map((dayLift) => ({
                id: uuid(),
                day: dayLift.day,
                completeDay: dayLift.complete,
                exercises: dayLift.lifts.map((lift) => ({
                    ...lift,
                    setResults: Array.from({ length: lift.sets }, () => ({
                        id: uuid(),
                        actWeight: 0,
                        actReps: 0,
                        completeExercise: false
                    }))
                }))
            })),
    }]
}

const InitialData = initialState(dayLifts) //JSON.parse(localStorage.getItem('weeklyLifts')) ||


function reducer(state, action) {

    const updatedState = state.map(weeklyLift => ({
        ...weeklyLift,
        data: weeklyLift.data.map(datum => ({
            ...datum,
            completeDay: action.id === datum.id ? !datum.completeDay : datum.completeDay
        }))
    }));

    const allDaysComplete = state.every(weeklyLift => {
        const completedDays = weeklyLift.data.filter(datum => datum.completeDay).length;
        return completedDays >= weeklyLift.data.length - 1;
    });

    const newWeekEntries = {
        id: uuid(),
        week: state.length + 1,
        page: 1,
        data:
            dayLifts.map((dayLift) => ({
                id: uuid(),
                day: dayLift.day,
                completeDay: dayLift.complete,
                exercises: dayLift.lifts.map((lift) => ({
                    ...lift,
                    setResults: Array.from({ length: lift.sets }, () => ({
                        id: uuid(),
                        actWeight: 0,
                        actReps: 0,
                        completeExercise: false
                    }))
                }))
            }))
    }
    switch (action.type) {
        case 'completeDay':
            if (allDaysComplete) {
                return [...updatedState, newWeekEntries];
            }
            return updatedState;
        case 'recordSet':
            return state.map(weeklyLift => ({
                ...weeklyLift,
                data: weeklyLift.data.map(datum => ({
                    ...datum,
                    exercises: datum.exercises.map(exercise => ({
                        ...exercise,
                        setResults: exercise.setResults.map(setResult =>
                            setResult.id === action.id
                                ? { ...setResult, actWeight: action.actWeight, actReps: action.actReps, completeExercise: !setResult.completeExercise }
                                : setResult
                        )
                    }))
                }))
            }));
        //need to add in the id of the week and the day that the exercise is added to
        //see copilot for what to do
        case 'addExercise':
            return state.map(weeklyLift =>
                weeklyLift.id === action.id ? {
                    ...weeklyLift,
                    data: weeklyLift.data.map(datum =>
                        datum.id === action.nestedId ? {
                            ...datum,
                            //exercises is an array of object, so to map over each one, we want to return exercises and then add one at the end
                            exercises: [...datum.exercises,
                            {
                                id: uuid(),
                                tier: "Added",
                                name: action.name,
                                sets: action.sets,
                                targetWeight: action.targetWeight,
                                targetReps: action.targetReps,
                                addSets: true,
                                setResults: Array.from({ length: action.sets }, () => ({
                                    id: uuid(),
                                    actWeight: 0,
                                    actReps: 0,
                                    completeExercise: false
                                }))
                            }
                            ]
                        } : datum
                    )
                } : weeklyLift
            )


        case 'setPage':
            return state.map(weeklyLift => ({
                ...weeklyLift,
                page: action.page
            }));
        case 'addSet':
            return state.map(weeklyLift => ({
                ...weeklyLift,
                data: weeklyLift.data.map(datum => ({
                    ...datum,
                    exercises: datum.exercises.map(exercise =>
                        exercise.id === action.id ? {
                            ...exercise,
                            sets: exercise.sets + 1,
                            setResults: [...exercise.setResults,
                            {
                                id: uuid(),
                                actWeight: 0,
                                actReps: 0,
                                complete: false
                            }]
                        } : exercise
                    )
                }))
            }));
        case 'deleteSet':
            return state.map(weeklyLift => ({
                ...weeklyLift,
                data: weeklyLift.data.map(datum => ({
                    ...datum,
                    exercises: datum.exercises.map(exercise => ({
                        ...exercise,
                        setResults: exercise.setResults.filter(setResult => setResult.id !== action.id)
                    }))
                }))
            }));
        default:
            throw new Error();
    }
}

function StateProvider({ children }) {
    const [weeklyLifts, dispatch] = useReducer(reducer, InitialData)
    console.log(weeklyLifts)

    useEffect(() => {
        localStorage.setItem('weeklyLifts', JSON.stringify(weeklyLifts))
    }, [weeklyLifts]);

    return (
        <StateContext.Provider value={weeklyLifts}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

export { StateProvider, StateContext, DispatchContext };