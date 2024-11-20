import LiftComponent from "../LiftComponent"
import { v4 as uuid } from 'uuid'
import { Box } from "@mui/material";
// import useStyles from "./useStyles"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
//last set is up to 25 reps

const repCount = 15
export default function T3({ setCount = 3, weight }) {
    const [setsArray, setSetsArray] = useState(
        Array.from({ length: setCount }, () => ({
            id: uuid(),
            reps: repCount
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

    const deleteSet = (id) => {
        setSetsArray((currSets) => {
            return currSets.filter((set) => set.id !== id)
        })
    }

    const addSet = () => {
        setSetsArray((currSets) => {
            return [...currSets, { reps: repCount, id: uuid() }]
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