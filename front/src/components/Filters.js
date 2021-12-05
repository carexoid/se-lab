import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormControl, Grid, MenuItem,  Select, Slider, Typography, TextField } from '@material-ui/core';
import { Form } from './useForm';

const useStyles = makeStyles((theme) => ({
    grid: {
        padding: theme.spacing(1),
    },
    input: {
        width: 300,
    },
    slider: {
        width: '80%',
    },
}));

const marksTime = [
    {
        value: 0,
        label: '00:00',
    },
    {
        value: 360,
        label: '06:00',
    },
    {
        value: 720,
        label: '12:00',
    },
    {
        value: 1080,
        label: '18:00',
    },
    {
        value: 1439,
        label: '23:59',
    },
];



function valueLabelFormat(value) {
    let hours = Math.floor(value / 60);
    let hourBegin = 60 * hours;
    let minutes = value - hourBegin;

    let str1 = hours.toString().padStart(2, "0");
    let str2 = minutes.toString().padStart(2, "0");

    return `${str1}:${str2}`;
}

function Filters(props) {
    const classes = useStyles();
    const marksDuration = [...Array(props.maxDuraion)].map((x, i) => { return { value: i+1, label: `${i+1} h` } })
    const marksPrice = [...Array(props.maxPrice/1000+1)].map((x, i) => { return { value: 1000*i, label: i === 0 ? '0 $' :`${i}k $` } })

    const handleChangeSlider = (event, newValue, name) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        props.setValues({
            ...props.values,
            [name + "Begin"]: newValue[0],
            [name + "End"]: newValue[1],
        })
    };

    return (
        <Form onSubmit={props.handleSubmit}>
            <Grid container spacing={5} alignItems="center" className={classes.grid}>
                <Grid item xs={12} md={2}>
                    <Typography>Destination:</Typography>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Autocomplete
                        value={props.values.destination}
                        onInputChange={(event, newInputValue) => {
                            props.setValues({
                                ...props.values,
                                destination: newInputValue
                            })
                        }}
                        className={classes.input}
                        size="small"
                        id="combo-box-destination"
                        options={props.cities}
                        //getOptionLabel={(option) => option.city}
                        renderInput={(params) => <TextField {...params} placeholder="Chernivtsi" variant="outlined" />}
                    />
                </Grid>

                <Grid item xs={12} md={2}>
                    <Typography>Date:</Typography>
                </Grid>
                <Grid item xs={12} md={10}>
                    <TextField
                        value={props.values.date}
                        onChange={(event) => {
                            props.setValues({
                                ...props.values,
                                date: event.target.value
                            })
                        }}
                        className={classes.input}
                        id="date"
                        type="date"
                        variant='outlined'
                        size="small"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={2}>
                    <Typography>Flight Code:</Typography>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Autocomplete
                        value={props.values.id}
                        onInputChange={(event, newInputValue) => {
                            props.setValues({
                                ...props.values,
                                id: newInputValue
                            })
                        }}
                        className={classes.input}
                        size="small"
                        id="combo-box-code"
                        options={props.flightIDs}
                        renderInput={(params) => <TextField {...params} placeholder="00001" variant="outlined" />}
                    />
                </Grid>

                <Grid item xs={12} md={2}>
                    <Typography>Flight Duration:</Typography>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Slider
                        value={[props.values.durationBegin, props.values.durationEnd]}
                        onChange={(event, newValue, activeThumb) => {
                            handleChangeSlider(event, newValue, 'duration')
                        }}
                        className={classes.slider}
                        defaultValue={[props.values.durationBegin, props.values.durationEnd]}
                        step={1}
                        min={1}
                        max={props.maxDuraion}
                        marks={marksDuration}
                        valueLabelDisplay="auto"
                        aria-labelledby="non-linear-slider"
                    />
                </Grid>

                <Grid item xs={12} md={2}>
                    <Typography>Departure Time:</Typography>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Slider
                        value={[props.values.timeBegin, props.values.timeEnd]}
                        onChange={(event, newValue, activeThumb) => {
                            handleChangeSlider(event, newValue, 'time')
                        }}
                        className={classes.slider}
                        valueLabelFormat={valueLabelFormat}
                        defaultValue={[props.values.timeBegin, props.values.timeEnd]}
                        step={1}
                        min={0}
                        max={1439}
                        marks={marksTime}
                        valueLabelDisplay="auto"
                        aria-labelledby="non-linear-slider"
                    />
                </Grid>

                <Grid item xs={12} md={2}>
                    <Typography>Price:</Typography>
                </Grid>
                <Grid item xs={12} md={10}>
                    <Slider
                        value={[props.values.priceBegin, props.values.priceEnd]}
                        onChange={(event, newValue, activeThumb) => {
                            handleChangeSlider(event, newValue, 'price')
                        }}
                        className={classes.slider}
                        defaultValue={[props.values.priceBegin, props.values.priceEnd]}
                        step={1}
                        min={1}
                        max={props.maxPrice}
                        marks={marksPrice}
                        color='secondary'
                        valueLabelDisplay="auto"
                        aria-labelledby="non-linear-slider"
                    />
                </Grid>

            </Grid>
        </Form>
     );
}

export default Filters;