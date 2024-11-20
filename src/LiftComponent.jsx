import Checkbox from '@mui/material/Checkbox'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useContext } from 'react';
import { DispatchContext } from './LiftStateAndContext';

export default function LiftComponent({ exercise, setResult, setNumber }) {
    const [weight, setWeight] = useState(setResult.actWeight)
    const [reps, setReps] = useState(setResult.actReps)
    const dispatch = useContext(DispatchContext);

    const handleWeightChange = (evt) => {
        const value = evt.target.value === '' ? '' : Number(evt.target.value);
        setWeight(value)
    }
    const handleRepsChange = (evt) => {
        const value = evt.target.value === '' ? '' : Number(evt.target.value);
        setReps(value)
    }
    const handleSubmit = () => {
        dispatch({ type: 'recordSet', id: setResult.id, actWeight: weight, actReps: reps })
    }

    return (
        <Box
            sx={{ display: "flex", border: 1, borderRadius: 5, margin: '5px', padding: "10px", backgroundColor: '#FFFFFF' }}>
            <p style={{ color: "black" }}>Set {setNumber}:   {exercise.targetWeight}x{exercise.targetReps}</p>
            <form>
                <FormControl
                    disabled={setResult.completeExercise}
                    sx={{ m: 1, width: '25ch', }} variant="outlined">
                    <OutlinedInput
                        value={weight}
                        onChange={handleWeightChange}
                        type="number"
                        sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                        id="weight-input"
                        endAdornment={<InputAdornment position="end">lbs</InputAdornment>}
                        aria-describedby="weight-input"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                    <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
                </FormControl>

                <FormControl
                    disabled={setResult.completeExercise}
                    sx={{ m: 1, width: '25ch', }} variant="outlined">
                    <OutlinedInput
                        value={reps}
                        onChange={handleRepsChange}
                        type="number"
                        sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                        id="reps-input"
                        aria-describedby="reps-input"
                        inputProps={{
                            'aria-label': 'reps',
                        }}
                    />
                    <FormHelperText id="outlined-weight-helper-text">Reps</FormHelperText>
                </FormControl>
                <Checkbox
                    sx={{
                        '& .MuiSvgIcon-root': { fontSize: 50 },
                        '&.Mui-checked': {
                            color: '#30a5ff',
                        }
                    }}
                    checked={setResult.completeExercise}
                    onChange={handleSubmit}
                // inputProps={{ 'aria-label': 'controlled' }}
                />
            </form>
            {/* Should this info be contained in state? */}
            {setNumber > 3 && exercise.targetReps > 5 && //add targeting for added sets in T2 and T3 exercises
                <IconButton onClick={() => dispatch({ type: 'deleteSet', id: setResult.id })}>
                    <DeleteIcon
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 40 }, border: "1px black", backgroundColor: "white", borderRadius: 20, }} />
                </IconButton>
            }
        </Box >
    )
}
