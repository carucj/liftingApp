import { v4 as uuid } from 'uuid'
import LiftComponent from "../LiftComponent";
import { Box } from "@mui/material";
// import useStyles from "./useStyles"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';

//need to record the setsArray with the Lift name and the Tier 
//then have a big array containing each of these arrays
//so we probably need to have a function that defines setArray in the lift manager and pass it into each TX component
//Need an array that contains each setsArray actually
const repCount = 10;
//Should actuals be its own array or should it be contained by the sets array?
export default function T2({ setCount = 3, weight }) {


    const [setsArray, setSetsArray] = useState(
        Array.from({ length: setCount }, () => ({
            id: uuid(),
            actWeight: 0,
            actReps: 0,
            complete: false
        })
        ))

    const recordSet = (id, weight, reps) => {
        setSetsArray((currSets) => {
            return currSets.map((set) => {
                if (set.id === id) {
                    return { ...set, actWeight: weight, actReps: reps, complete: !set.complete }
                }
                return { ...set }
            })
        })
    }

    const addSet = () => {
        setSetsArray((currSets) => {
            return [...currSets, {
                id: uuid(),
                actWeight: 0,
                actReps: 0,
                complete: false
            }]
        })
    }

    const deleteSet = (id) => {
        setSetsArray((currSets) => {
            return currSets.filter((set) => set.id !== id)
        })
    }

    return (
        <Box sx={{ padding: '10px', margin: '1em', backgroundColor: '#9cd4ff', border: '1px solid #ddd', borderRadius: 5 }}>
            {
                setsArray.map((set, idx) =>
                    <LiftComponent
                        key={set.id}
                        setNumber={idx + 1}
                        targetWeight={weight}
                        targetReps={repCount}
                        checked={set.complete}
                        deleteSet={() => deleteSet(set.id)}
                        completeSet={(weight, reps) => recordSet(set.id, weight, reps)}
                    />
                )}
            <IconButton onClick={addSet}>
                <AddIcon sx={{ '& .MuiSvgIcon-root': { fontSize: 40 }, border: "1px black", backgroundColor: "white", borderRadius: 20, }} />
            </IconButton>
        </Box>
    )
}
