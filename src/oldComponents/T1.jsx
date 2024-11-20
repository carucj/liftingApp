// // 5,6,10 sets of 3,2,1 reps with defined rep scheme and weights and last set is a + set
// // Progression in rep scheme is based on previous lifts e.g. if you only get 3 reps on the + set of 5x3, then it goes to 6 sets of 2
// // Calls Lift component
// // Calculate est. max based on input weight and reps of + set
// import { Box } from "@mui/material";
// import LiftComponent from "../LiftComponent";
// import { v4 as uuid } from 'uuid'
// import { useState } from 'react';
// // import useStyles from "./useStyles"

// export default function T1({ setCount = 5, weight }) {
//     const repsCalc = (set) => {
//         switch (set) {
//             //need to add error case for setProgress or some way to enforce only these values
//             case 5:
//                 return 3;
//             case 6:
//                 return 2;
//             case 10:
//                 return 1;
//         }
//     }

//     const [setsArray, setSetsArray] = useState(
//         Array.from({ length: setCount }, () => ({
//             id: uuid(),
//             actWeight: 0,
//             actReps: 0,
//             complete: false
//         })
//         ))


//     const recordSet = (id, weight, reps) => {
//         setSetsArray((currSets) => {
//             return currSets.map((set) => {
//                 if (set.id === id) {
//                     return { ...set, actWeight: weight, actReps: reps, complete: !set.complete }
//                 }
//                 return { ...set }
//             })
//         })
//     }

//     //this might belong in a different component
//     //need to indicate last set as + set somehow, maybe that becomes its own component
//     //const EstimateMax = (estReps, estWeight) => estReps * estWeight / 30 + estWeight


//     const setupArray = Array(setCount).fill({ reps: repsCalc(setCount) });

//     const setArray = setupArray.map((reps) => ({ ...reps, id: uuid() }));

//     return (
//         <Box sx={{ padding: '10px', margin: '0.25em 1em ', backgroundColor: '#9cd4ff', border: '1px solid #ddd', borderRadius: 5 }}>
//             {
//                 setArray.map((set, idx) =>
//                     <LiftComponent
//                         key={set.id}
//                         setNumber={idx + 1}
//                         targetWeight={weight}
//                         targetReps={set.reps}
//                     />
//                 )}

//         </Box>
//     )
// }

// {/* <p>Estimated Max: {EstimateMax(reps, weight)} </p> */ }

