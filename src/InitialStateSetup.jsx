import { Button, FormControl, TextField, Box } from "@mui/material"
import { useState } from "react";
import { v4 as uuid } from 'uuid';

const dayLiftsInitArray = [
    {
        day: 1,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Squat", sets: 5, targetWeight: 0, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Bench Press", sets: 3, targetWeight: 5, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Pullups", sets: 3, targetWeight: 0, targetReps: 15, addSets: true
            }
        ]
    },
    {
        day: 2,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Overhead Press", sets: 5, targetWeight: 0, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Romanian Deadlift", sets: 3, targetWeight: 0, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Bent Over Row", sets: 3, targetWeight: 0, targetReps: 15, addSets: true
            }
        ]
    },
    {
        day: 3,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Bench Press", sets: 5, targetWeight: 0, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Squat", sets: 3, targetWeight: 0, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Pullups", sets: 3, targetWeight: 0, targetReps: 15, addSets: true
            }]
    },
    {
        day: 4,
        lifts: [
            {
                id: uuid(), tier: "T1", name: "Deadlift", sets: 5, targetWeight: 0, targetReps: 3, addSets: false
            },
            {
                id: uuid(), tier: "T2", name: "Overhead Press", sets: 3, targetWeight: 0, targetReps: 10, addSets: true
            },
            {
                id: uuid(), tier: "T3", name: "Bent Over Row", sets: 3, targetWeight: 0, targetReps: 15, addSets: true
            }]
    }
]

export default function InitialStateSetup({ setInitialValues }) {
    const [startingWeights, setStartingWeights] = useState({
        'Squat': 0,
        'Bench Press': 0,
        'Deadlift': 0,
        'Overhead Press': 0,
        'Bent Over Row': 0,
        'Romanian Deadlift': 0,
        'Pullups': 0
    })


    const handleWeightInputChange = (event) => {
        event.preventDefault()
        const value = event.target.value === '' ? '' : Number(event.target.value);

        switch (event.target.name) {
            case 'Squat':
                setStartingWeights({ ...startingWeights, 'Squat': value })
                break;
            case 'Bench Press':
                setStartingWeights({ ...startingWeights, 'Bench Press': value })
                break;
            case 'Overhead Press':
                setStartingWeights({ ...startingWeights, 'Overhead Press': value })
                break;
            case 'Deadlift':
                setStartingWeights({ ...startingWeights, 'Deadlift': value })
                break;
            case 'Bent Over Row':
                setStartingWeights({ ...startingWeights, 'Bent Over Row': value })
                break;
            case 'Romanian Deadlift':
                setStartingWeights({ ...startingWeights, 'Romanian Deadlift': value })
                break;
            case 'Pullups':
                setStartingWeights({ ...startingWeights, 'Pullups': value })
                break;
            default:
                break;
        }
    }

    const handleSubmitWeights = (event) => {
        event.preventDefault();

        dayLiftsInitArray.map((day) => {
            day.lifts.map((lift) => {
                if (lift.tier === 'T1') {
                    lift.targetWeight = Math.round(startingWeights[lift.name] * 0.85 / 5) * 5
                }
                else if (lift.tier === 'T2') {
                    lift.targetWeight = Math.round(startingWeights[lift.name] * 0.7 / 5) * 5
                }
                else {
                    lift.targetWeight = Math.round(startingWeights[lift.name] / 5) * 5
                }
            })
        })

        setInitialValues(dayLiftsInitArray)
    }


    return (
        <Box sx={{ padding: '10px', margin: '1em', backgroundColor: '#9cd4ff', border: '1px solid #ddd', borderRadius: 5 }}>
            <Box sx={{ padding: '10px', margin: '1em', backgroundColor: '#f5fbff', border: '1px solid #ddd', borderRadius: 5 }}>
                <h3>Tier 1 Lifts: Input your 5 rep max for each lift</h3>
                <form>
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
                            sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                            label="Squat Weight"
                            name="Squat"
                            value={startingWeights['Squat']}
                            onChange={handleWeightInputChange}
                            type="number"
                            id="Squat-weight-input"
                            aria-describedby="Squat-weight-input"
                        />
                        <TextField
                            sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                            label="Bench Press Weight"
                            name="Bench Press"
                            value={startingWeights['Bench Press']}
                            onChange={handleWeightInputChange}
                            type="number"
                            id="bench-press-weight-input"
                            aria-describedby="bench-press-weight-input"
                        />
                        <TextField
                            sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                            label="Overhead Press Weight"
                            name="Overhead Press"
                            value={startingWeights['Overhead Press']}
                            onChange={handleWeightInputChange}
                            type="number"
                            id="overhead-press-weight-input"
                            aria-describedby="overhead-press-weight-input"
                        />
                        <TextField
                            sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                            label="Deadlift Weight"
                            name="Deadlift"
                            value={startingWeights['Deadlift']}
                            onChange={handleWeightInputChange}
                            type="number"
                            id="Deadlift-weight-input"
                            aria-describedby="Deadlift-weight-input"
                        />
                    </FormControl>
                </form>
                <br></br>
                <h3>Other Lifts: Input a weight you could do for at least 15 reps</h3>
                <form>
                    <FormControl
                        sx={{
                            m: 1,
                            backgroundColor: '#f5fbff',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexWrap: 'nowrap'
                        }}
                    >
                        <TextField
                            sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                            label="Romanian Deadlift Weight"
                            name="Romanian Deadlift"
                            value={startingWeights['Romanian Deadlift']}
                            onChange={handleWeightInputChange}
                            type="number"
                            id="Romanian Deadlift-weight-input"
                            aria-describedby="Romanian Deadlift-weight-input"
                        />
                        <TextField
                            sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                            label="Bent Over Row Weight"
                            name="Bent Over Row"
                            value={startingWeights['Bent Over Row']}
                            onChange={handleWeightInputChange}
                            type="number"
                            id="Bent Over Row-weight-input"
                            aria-describedby="Bent Over Row-weight-input"
                        />
                        <TextField
                            sx={{ 'input[type=number]': { MozAppearance: 'textfield' }, backgroundColor: '#f5fbff' }}
                            label="Pullups Weight"
                            name="Pullups"
                            value={startingWeights['Pullups']}
                            onChange={handleWeightInputChange}
                            type="number"
                            id="Pullups-weight-input"
                            aria-describedby="Pullups-weight-input"
                        />
                    </FormControl>
                </form>
            </Box>
            <Button
                onClick={handleSubmitWeights}
                type="button"
                size="large"
                sx={{ backgroundColor: '#30a5ff', margin: "15px", color: 'white' }}
            >
                Submit
            </Button>
        </Box >


    )
}