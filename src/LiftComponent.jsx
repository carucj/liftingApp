import { Checkbox, OutlinedInput, InputAdornment, FormHelperText, FormControl, Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useContext } from 'react';
import { DispatchContext } from './LiftStateAndContext';

export default function LiftComponent({ exercise, setResult, setNumber }) {
    const [weight, setWeight] = useState(setResult.actWeight);
    const [reps, setReps] = useState(setResult.actReps);
    const dispatch = useContext(DispatchContext);

    const handleChange = (e) => {
        e.preventDefault();

        const value = Math.round(e.target.value);
        const regex = /^(\d+)?$/ ///regex for positive integers that allows 0

        if (regex.test(e.target.value)) { //have to test the raw string input before conversion to number
            switch (e.target.name) {
                case 'weight':
                    setWeight(value);
                    break;
                case 'reps':
                    setReps(value);
                    break;
                default:
                    break;
            }
        }
    }

    const handleSubmit = () => {
        dispatch({ type: 'recordSet', id: setResult.id, actWeight: weight, actReps: reps })
    }

    return (
        <Box data-testid='LiftComponent'
            sx={{ display: "flex", border: 1, borderRadius: 5, margin: '5px', padding: "10px", backgroundColor: '#FFFFFF' }}>
            <p label='setInfo' style={{ color: "black" }}>Set {setNumber}:   {exercise.targetWeight}x{exercise.targetReps}</p>
            <form>
                <FormControl
                    disabled={setResult.isSetComplete}
                    sx={{ m: 1, width: '25ch', }} variant="outlined">
                    <OutlinedInput
                        value={weight}
                        name="weight"
                        type="number"
                        onChange={handleChange}
                        sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                        id="weight-input"
                        endAdornment={<InputAdornment position="end">lbs</InputAdornment>}
                        aria-describedby="weight-input"
                        inputProps={{ 'aria-label': 'weight', }}
                    />
                    <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
                </FormControl>

                <FormControl
                    disabled={setResult.isSetComplete}
                    sx={{ m: 1, width: '25ch', }} variant="outlined">
                    <OutlinedInput
                        value={reps}
                        name="reps"
                        type="number"
                        onChange={handleChange}
                        sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                        id="reps-input"
                        aria-describedby="reps-input"
                        inputProps={{ 'aria-label': 'reps', }}
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
                    checked={setResult.isSetComplete}
                    onChange={handleSubmit}
                />
            </form>
            {/* Should this info be contained in state? */}
            {
                ((setNumber > 3 && exercise.tier !== "T1") || exercise.tier === "Added") && //add targeting for added sets in T2 and T3 exercises
                <IconButton role="deleteButton" onClick={() => dispatch({ type: 'deleteSet', id: setResult.id })}>
                    <DeleteIcon
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 40 }, border: "1px black", backgroundColor: "white", borderRadius: 20, }} />
                </IconButton>
            }
        </Box >
    )
}
