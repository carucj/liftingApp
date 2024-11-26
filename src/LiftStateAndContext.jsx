import { createContext, useReducer, useEffect } from 'react';


const StateContext = createContext();
const DispatchContext = createContext();

//need to make a function that progresses the set structure of T1 lifts when a rep threshold is reached

function StateProvider({ children, reducer, initialState }) {
    //The issue is i'm passing in the weeklyLifts array into initialState instad of the initialValues array
    const [weeklyLifts, dispatch] = useReducer(reducer, initialState);
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