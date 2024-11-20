import { Box, Button, Container, Pagination, Typography } from "@mui/material";
import { useState, useContext } from "react";
import { StateContext, DispatchContext } from './LiftStateAndContext';
import TierComponent from "./TierComponent";

//maybe just add pagination for week as well as day...

export default function LiftManager() {
    const weeklyLifts = useContext(StateContext);
    const dispatch = useContext(DispatchContext);
    const [tab, setTab] = useState(
        weeklyLifts.find(weeklyLift =>
            weeklyLift.data.completeDay === false
        ) || 1
    )
    const handlePageChange = (event, value) => {
        weeklyLifts.map((weeklyLift) => {
            dispatch({ type: 'setPage', id: weeklyLift.id, page: value })
        })
        console.log(value)
    }
    const handleTabChange = (event, Value) => {
        setTab(Value);
        console.log(Value)
    };
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
                            <Button
                                onClick={() => dispatch({ type: 'completeDay', id: datum.id })}
                                sx={{ backgroundColor: '#30a5ff', margin: "15px" }}
                                variant="contained"
                            >
                                Complete Workout
                            </Button>
                        </Container >
                    ))
                )},
            { //give a different page selector for each week and only display the one that controls the week
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
                )}
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



{/* <Box sx={{ padding: '10px', margin: '0.25em 1em ', backgroundColor: '#9cd4ff', border: '1px solid #ddd', borderRadius: 5, justifyContent: 'center' }}>
<IconButton>
    <AddIcon />
</IconButton>
</Box> */}

