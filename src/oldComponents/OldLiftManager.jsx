// // Handles time, handles state and all that mostly
// // Each week the lifts increment some set amount based on upper/lower body
// // display week and day of week
// // Allow user to input lift names
// // Allow user to add sets as needed
// // Each week has 4 days, one for each lift
// // Calls base t1, t2,t3 setup
// //only 1 T1 per day
// // Allow adding new t2 and t3 exercises
// // Each day is saved as its own row in database

// //need to have overall app functionality with hard coded exercises and only the 3 base exercises before allowing adding exercises
// //need to have it so you can add exercises and lock t1,2,3 to the specific structure
// //need to be able to add new T2, T3, and 'Free structure' exercises

// import { Box, Button, Container, Pagination, Typography } from "@mui/material";
// import { useState, useReducer, createContext, useContext, } from "react";
// import T1 from "./T1";
// import T2 from "./T2";
// import T3 from "./T3";
// import { v4 as uuid } from 'uuid';
// // import IconButton from '@mui/material/IconButton';
// // import AddIcon from '@mui/icons-material/Add';

// //worry about T1 set progression later
// const setsByTier = [
//     { Tier: "T1", sets: 5, reps: 3 },
//     { Tier: "T2", sets: 3, reps: 10 },
//     { Tier: "T3", sets: 3, reps: 15 }
// ]

// const dayLifts = [
//     {
//         day: 1,
//         lifts: [{ tier: "T1", name: "Squat", weight: 0 }, { tier: "T2", name: "Bench Press", weight: 0 }, { tier: "T3", name: "Pullups", weight: 0 }]
//     },
//     {
//         day: 2,
//         lifts: [{ tier: "T1", name: "Overhead Press", weight: 0 }, { tier: "T2", name: "Romanian Deadlift", weight: 0 }, { tier: "T3", name: "Bent Over Row", weight: 0 }]
//     },
//     {
//         day: 3,
//         lifts: [{ tier: "T1", name: "Bench Press", weight: 0 }, { tier: "T2", name: "Front Squat", weight: 0 }, { tier: "T3", name: "Pullup", weight: 0 }]
//     },
//     {
//         day: 4,
//         lifts: [{ tier: "T1", name: "Deadlift", weight: 0 }, { tier: "T2", name: "Overhead Press", weight: 0 }, { tier: "T3", name: "Bent Over Row", weight: 0 }]
//     }
// ]

// function reducer(state, action) {
//     switch (action.type) {
//         case 'recordSet':
//             return {
//                 ...state,
//                 setsArray: state.setsArray.map((set) => {
//                     if (set.id === action.id) {
//                         return { ...set, actWeight: action.weight, actReps: action.reps, complete: !set.complete }
//                     }
//                     return { ...set }
//                 })
//             };
//         case 'addSet':
//             return {
//                 ...state,
//                 setsArray: [...state.setsArray, {
//                     id: uuid(),
//                     actWeight: 0,
//                     actReps: 0,
//                     complete: false
//                 }]
//             };
//         case 'deleteSet':
//             return {
//                 ...state,
//                 setsArray: state.setsArray.filter((set) => set.id !== action.id)
//             };
//         default:
//             throw new Error();
//     }
// }

// // old setsArray manipulating functions
// // const recordSet = (id, weight, reps) => {
// //     setSetsArray((currSets) => {
// //         return currSets.map((set) => {
// //             if (set.id === id) {
// //                 return { ...set, actWeight: weight, actReps: reps, complete: !set.complete }
// //             }
// //             return { ...set }
// //         })
// //     })
// // }

// // const addSet = () => {
// //     setSetsArray((currSets) => {
// //         return [...currSets, {
// //             id: uuid(),
// //             actWeight: 0,
// //             actReps: 0,
// //             complete: false
// //         }]
// //     })
// // }

// // const deleteSet = (id) => {
// //     setSetsArray((currSets) => {
// //         return currSets.filter((set) => set.id !== id)
// //     })
// // }


// const initialState = (dayLifts) => {
//     return dayLifts.map((dayLift) =>
//     ({
//         id: uuid(),
//         week: 1,
//         day: dayLift.day,
//         exercises: dayLift.lifts,
//         setsArray: setsByTier.map((tier) =>
//             Array.from({ length: tier.sets }, () => ({
//                 id: uuid(),
//                 targetReps: tier.reps,
//                 actWeight: 0,
//                 actReps: 0,
//                 complete: false
//             })))
//     })
//     )
// }

// export default function LiftManager() {
//     const [page, setPage] = useState(1);
//     const [weeklyLifts, dispatch] = useReducer(reducer, dayLifts, initialState)

//     // const [weeklyLifts, setWeeklyLifts] = useState(() =>
//     //     dayLifts.map((dayLift) =>
//     //     ({
//     //         id: uuid(),
//     //         week: 1,
//     //         day: dayLift.day,
//     //         dailyLift: dayLift.lifts,
//     //         setsArray: setsByTier.map((tier) =>
//     //             Array.from({ length: tier.sets }, () => ({
//     //                 id: uuid(),
//     //                 actWeight: 0,
//     //                 actReps: 0,
//     //                 complete: false
//     //             })))
//     //     })
//     //     ))
//     console.log(weeklyLifts)

//     const recordSet = (id, weight, reps) => {
//         dispatch({ type: 'recordSet', id, weight, reps })
//     }

//     const addSet = () => {
//         dispatch({ type: 'addSet' })
//     }

//     const deleteSet = (id) => {
//         dispatch({ type: 'deleteSet', id })
//     }


//     const handleChange = (event, value) => {
//         setPage(value);
//     };

//     //need to go through and set up a theme and do styles the right way
//     return (
//         <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             {
//                 weeklyLifts.map((weeklyLift) =>
//                     page === weeklyLift.day &&
//                     <Container maxWidth="md" key={weeklyLift.id} >
//                         <Box sx={{
//                             padding: '10px',
//                             margin: '0.25em 1em ',
//                             backgroundColor: '#9cd4ff',
//                             border: '1px solid #ddd',
//                             borderRadius: 5,
//                             color: "white",
//                         }}>
//                             <Typography variant="h4" sx={{ textAlign: 'center' }}>
//                                 Week {weeklyLift.week}, Day {weeklyLift.day}
//                             </Typography>

//                         </Box>
//                         <T1 key={1} setProgress={5} weight={250} />

//                         <T2 key={2} weight={205} />
//                         {/* <Box sx={{ padding: '10px', margin: '0.25em 1em ', backgroundColor: '#9cd4ff', border: '1px solid #ddd', borderRadius: 5, justifyContent: 'center' }}>
//                         <IconButton>
//                             <AddIcon />
//                         </IconButton>
//                     </Box> */}
//                         <T3 key={3} weight={185} />
//                         <Button sx={{ backgroundColor: '#30a5ff', margin: "15px" }} variant="contained">Complete Workout</Button>
//                     </Container >
//                 )
//             }
//             <Pagination
//                 variant="outlined"
//                 shape="rounded"
//                 size="large"
//                 count={4}
//                 page={page}
//                 onChange={handleChange} />
//         </Container >
//     )
// }

// //Don't need three Tier components, just one that takes in the needed functions and info to pass down 