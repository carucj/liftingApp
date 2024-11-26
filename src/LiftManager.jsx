import { Box, Button, Container, Pagination, Typography, IconButton, TextField, FormControl, MenuItem } from "@mui/material";
import { useState, useContext } from "react";
import { StateContext, DispatchContext } from './LiftStateAndContext';
import TierComponent from "./TierComponent";
import AddIcon from '@mui/icons-material/Add';

//when addExerciseFormVisible is changed, Lift Manager has to rerender but this is causing an error because the whole app tries to rerender and they conflict 
//If I use useEffect

export default function LiftManager() {
    const weeklyLifts = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const [addExerciseFormVisible, setAddExerciseFormVisible] = useState(false);
    const [newExercise, setNewExercise] = useState({ name: '', sets: 1, targetWeight: 0, targetReps: 0 }); //need to define this array to fit the new exercise fields
    const [tab, setTab] = useState(
        weeklyLifts.find(weeklyLift =>
            weeklyLift.data.completeDay === false
        ) || 1
    )
    // const tiers = ['T2', 'T3']
    const sets = [{ value: 1 }, { value: 2 }, { value: 3 }]

    const handlePageChange = (event, value) => {
        event.preventDefault()
        weeklyLifts.map((weeklyLift) => {
            dispatch({ type: 'setPage', id: weeklyLift.id, page: value })
        });
    };

    const handleTabChange = (event, Value) => {
        event.preventDefault()
        setTab(Value);
    };
    const handleAddExercise = (event) => {
        event.preventDefault()
        setAddExerciseFormVisible(!addExerciseFormVisible)
    }

    const handleNewExerciseChange = (event) => {
        event.preventDefault()
        const value = event.target.value === '' ? '' : event.target.value;
        switch (event.target.name) {
            // case 'tier':
            //     setNewExercise({ ...newExercise, tier: value })
            //     break;
            case 'name':
                setNewExercise({ ...newExercise, name: value })
                break;
            case 'sets':
                setNewExercise({ ...newExercise, sets: value })
                break;
            case 'targetWeight':
                setNewExercise({ ...newExercise, targetWeight: value })
                break;
            case 'targetReps':
                setNewExercise({ ...newExercise, targetReps: value })
                break;
            default:
                break;
        }
    }

    const handleSubmitExercise = (event, weeklyliftid, dayid) => {
        event.preventDefault();
        setAddExerciseFormVisible(false)
        dispatch({
            type: 'addExercise', id: weeklyliftid, nestedId: dayid,
            name: newExercise.name, sets: newExercise.sets, targetWeight: newExercise.targetWeight, targetReps: newExercise.targetReps
        })
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {
                weeklyLifts.map((weeklyLift) =>
                    weeklyLift.data.map((datum) => (
                        weeklyLift.page === datum.day && tab === weeklyLift.week &&
                        <Container maxWidth="md" key={weeklyLift.id} >
                            {/* Title Box */}
                            <Box sx={{
                                padding: '10px',
                                margin: '0.25em 1em ',
                                backgroundColor: '#9cd4ff',
                                border: '1px solid #ddd',
                                borderRadius: 5,
                                color: "white",
                            }}>
                                <Typography variant="h4" sx={{ textAlign: 'center' }}>
                                    Week {weeklyLift.week}, Day {datum.day}
                                </Typography>
                            </Box>
                            {/* Render a Tier Component for each exercise for each day */}
                            {datum.exercises.map((exercise) => (<TierComponent key={exercise.id} exercise={exercise} />))}
                            <Box sx={{ padding: '10px', margin: '0.25em 1em ', backgroundColor: '#9cd4ff', border: '1px solid #ddd', borderRadius: 5, justifyContent: 'center' }}>
                                <IconButton onClick={handleAddExercise} type="button">
                                    <Typography variant="h6" sx={{ margin: 1, color: 'white' }}>
                                        Add Exercise
                                    </Typography>
                                    <AddIcon sx={{ '& .MuiSvgIcon-root': { fontSize: 40 }, border: "1px black", backgroundColor: "white", borderRadius: 20, }} />
                                </IconButton>
                            </Box>
                            {
                                addExerciseFormVisible && (<form>
                                    <FormControl
                                        sx={{
                                            m: 1,
                                            backgroundColor: '#f5fbff',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 2,
                                            alignItems: 'center',
                                            flexWrap: 'nowrap'
                                        }}
                                    >
                                        <TextField
                                            label="Exercise Name"
                                            name="name"
                                            value={newExercise.name}
                                            onChange={handleNewExerciseChange}
                                            type="string"
                                            id="exercise-name-input"
                                            aria-describedby="exercise-name-input"
                                        />
                                        {/* <TextField
                                            id="Exercise Tier"
                                            namne="tier"
                                            select
                                            label="Tier"
                                            defaultValue="T2"
                                        > 
                                            {tiers.map((tier, idx) => (<MenuItem key={idx} value={tier}></MenuItem>))}
                                        </TextField>*/}
                                        <TextField
                                            id="Exercise Sets"
                                            name="sets"
                                            select
                                            label="Sets"
                                            defaultValue={1}
                                            onChange={handleNewExerciseChange}
                                        >
                                            {sets.map((set) => (<MenuItem key={set.value} value={set.value}>{set.value}</MenuItem>))}
                                        </TextField>
                                        <TextField
                                            label="Exercise Weight"
                                            name='targetWeight'
                                            value={newExercise.targetWeight}
                                            onChange={handleNewExerciseChange}
                                            type="number"
                                            id="exercise-name-input"
                                            aria-describedby="exercise-weight-input"
                                        />
                                        <TextField
                                            label="Exercise Reps"
                                            name="targetReps"
                                            value={newExercise.targetReps}
                                            onChange={handleNewExerciseChange}
                                            type="number"
                                            id="exercise-reps-input"
                                            aria-describedby="exercise-name-input"
                                        />
                                    </FormControl>

                                    <Button
                                        onClick={(event) => handleSubmitExercise(event, weeklyLift.id, datum.id)}
                                        // weeklyliftid={weeklyLift.id}
                                        // dayid={datum.id}
                                        // onClick={handleSubmitExercise}
                                        type="button"
                                        size="large"
                                        sx={{ backgroundColor: '#30a5ff', margin: "15px", color: 'white' }}
                                    >
                                        Submit Exercise
                                    </Button>
                                </form>)}
                            {/* Complete Day Button */}
                            <Button
                                onClick={() => dispatch({ type: 'completeDay', id: datum.id })}
                                size="large"
                                sx={{ backgroundColor: '#30a5ff', margin: "15px" }}
                                variant="contained"
                            >
                                Complete Workout
                            </Button>
                        </Container >
                    ))
                )
            },
            {/* page selector to change the day of the week */}
            {
                weeklyLifts.map((weeklyLift) =>
                    tab === weeklyLift.week &&
                    <Container key={weeklyLift.id} sx={{ display: "flex", justifyContent: "center" }}>
                        <h3>Day</h3>
                        <Pagination
                            label="Day"
                            variant="outlined"
                            shape="rounded"
                            size="large"
                            count={4}
                            page={weeklyLift.page}
                            onChange={handlePageChange} />
                    </Container>
                )
            }
            {/* Tab selector for each week */}
            <Container sx={{ display: "flex", justifyContent: "center" }}>
                <h3>Week</h3>
                <Pagination
                    label="Week"
                    variant="outlined"
                    shape="rounded"
                    size="large"
                    count={weeklyLifts.length}
                    page={tab}
                    onChange={handleTabChange} />
            </Container>
        </Container >
    )
}