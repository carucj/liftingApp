import LiftComponent from "./LiftComponent"
import { Box } from "@mui/material";
import { useContext } from 'react';
import { DispatchContext } from './LiftStateAndContext'; //StateContext,
import { IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function TierComponent({ exercise }) { //id
    // const weeklyLifts = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    // Find the current exercise from the state
    // const exercise = weeklyLifts.flatMap(week => week.data.exercises)
    //     .find(exercise => exercise.id === id);

    return (
        <Box sx={{ padding: '10px', margin: '1em', backgroundColor: '#9cd4ff', border: '1px solid #ddd', borderRadius: 5 }}>
            <Box>{exercise.name}</Box>
            {exercise.setResults.map((setResult, idx) =>
                <LiftComponent
                    key={setResult.id}
                    exercise={exercise}
                    setResult={setResult}
                    setNumber={idx + 1}
                />
            )}
            {exercise.addSets &&
                <IconButton onClick={() => dispatch({ type: 'addSet', id: exercise.id })}>
                    <AddIcon sx={{ '& .MuiSvgIcon-root': { fontSize: 40 }, border: "1px black", backgroundColor: "white", borderRadius: 20, }} />
                </IconButton>
            }
        </Box>
    )
}

