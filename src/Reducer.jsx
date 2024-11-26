const initialState = (initialValues) => {
    return [{
        week: 1,
        id: 'W1',
        page: 1,
        data:
            initialValues.map((initialValue) => ({
                day: initialValue.day,
                id: `W1d${initialValue.day}`,
                completeDay: false,
                exercises: initialValue.lifts.map((lift) => ({
                    ...lift,
                    id: `W1d${initialValue.day}${lift.name.trim()}`,
                    setResults: Array.from({ length: lift.sets }, (value, idx) => ({
                        id: `W1d${initialValue.day}${lift.name.trim()}s${idx + 1}`,
                        setNumber: idx + 1,
                        actWeight: 0,
                        actReps: 0,
                        completeExercise: false
                    }))
                }))
            })),
    }]
}

function reducer(state, action) {

    const updatedState = state.map(weeklyLift => ({
        ...weeklyLift,
        page: weeklyLift.page < 4 ? weeklyLift.page + 1 : weeklyLift.page,
        data: weeklyLift.data.map(datum => ({
            ...datum,
            completeDay: action.id === datum.id ? !datum.completeDay : datum.completeDay
        }))
    }));

    const allDaysComplete = state.every(weeklyLift => {
        const completedDays = weeklyLift.data.filter(datum => datum.completeDay).length;
        return completedDays >= weeklyLift.data.length - 1;
    });

    const prevWeek = state[state.length - 1];

    const newWeekEntry = {
        id: `W${prevWeek.week + 1}`,
        week: prevWeek.week + 1,
        page: 1,
        data: prevWeek.data.map((datum) => ({
            id: `W1d${datum.day}`,
            day: datum.day,
            completeDay: false,
            exercises: datum.exercises.map((exercise) => {
                const updatedExercise = { ...exercise };
                if (exercise.tier === "T1") {
                    if (
                        exercise.setResults[4]?.completeExercise === true && exercise.targetReps === 3 && exercise.setResults[4]?.actReps <= 5) {
                        updatedExercise.sets = 6;
                        updatedExercise.targetReps = 2;
                    } else if (
                        exercise.setResults[5]?.completeExercise === true && exercise.targetReps === 2 && exercise.setResults[5]?.actReps <= 3) {
                        updatedExercise.sets = 10;
                        updatedExercise.targetReps = 1;
                    } else if (
                        exercise.setResults[9]?.completeExercise === true && exercise.targetReps === 1 && exercise.setResults[9]?.actReps <= 1) {
                        updatedExercise.sets = 5;
                        updatedExercise.targetReps = 3;
                    }
                }
                return {
                    ...updatedExercise,
                    id: `W1d${datum.day}${exercise.name.trim()}`,
                    targetWeight:
                        exercise.name === 'Squat' || exercise.name === 'Deadlift'
                            ? exercise.targetWeight + 10
                            : exercise.targetWeight + 5,
                    setResults: Array.from({ length: updatedExercise.sets }, (value, idx) => ({
                        id: `W1d${datum.day}${exercise.name.trim()}s${idx + 1}`,
                        actWeight: 0,
                        actReps: 0,
                        completeExercise: false,
                    })),
                };
            }),
        })),
    };

    switch (action.type) {
        case 'completeDay':
            if (allDaysComplete) {
                return [...updatedState, newWeekEntry];
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

        case 'addExercise':
            return state.map(weeklyLift =>
                weeklyLift.id === action.id ? {
                    ...weeklyLift,
                    data: weeklyLift.data.map(datum =>
                        datum.id === action.nestedId ? {
                            ...datum,
                            exercises: [...datum.exercises,
                            {
                                id: `W1d${datum.day}${action.name.trim()}`,
                                tier: "Added",
                                name: action.name,
                                sets: action.sets,
                                targetWeight: action.targetWeight,
                                targetReps: action.targetReps,
                                addSets: true,
                                setResults: Array.from({ length: action.sets }, (value, idx) => ({
                                    id: `W1d${datum.day}${action.name.trim()}s${idx + 1}`,
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
                                id: `W1d${datum.day}${action.name.trim()}s${exercise.setResults.length}`,
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

export { reducer, initialState };