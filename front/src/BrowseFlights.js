import React, { Component, useState, useEffect } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Slider, Typography, } from '@material-ui/core';
import $ from 'jquery';
import { useForm, Form } from './useForm';
import DataGridTable from './DataGridTable';
import { Link } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    paper: {
        verticalAlign: 'middle',
        '& > *': {
            margin: theme.spacing(6),
            width: '100%',
            /* height: theme.spacing(16), */
        },
        backgroundColor: '#f2f2f2',
    },
    grid: {
        padding: theme.spacing(1),
    },
    input: {
        width: 300,
    },
    slider: {
        width: '80%',
    },
    buttonBox: {
        margin: theme.spacing(6),
    },
}));

const mockCodes = [
    'KPNL145',
    'KNUGOVNO',
    '145LOVE145',
];

const mockCities = [
    'Rubizhne',
    'Paris',
    'London',
];

//TODO change prices, possibly write custom Label Format
const mockMaxPrice = 10000;

const marks = [
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

const emptyParams = {
    code: '',
    destination: '',
    date: '',
    durationOption: 0,
    timeBegin: 0,
    timeEnd: 1439,
    priceBegin: 0,
    priceEnd: mockMaxPrice,
};



const flights = [
    {
        id: 'KPNL145',
        destination: 'London',
    },
    {
        id: 'KNUGOVNO',
        destination: 'London',
    },
    {
        id: '145LOVE145',
        destination: 'London',
    },
];


//TODO style href!!!!
const columns = [
    {
        field: 'id',
        headerName: 'Code',
        width: 200,
        renderCell: (params) => (
            <Link href={`/view/${params.id}`}>{params.id}</Link>
        ),
    },
    {
        field: 'destination',
        headerName: 'Destination',
        width: 200,
    },
];

/* renderCell: (params) => (
            <Link href={'http://www.youtube.com'}>{params.code}</Link>
        ) */

//`/view/${params.code}`


function BrowseFlights() {
    const classes = useStyles();
    const [showFilters, setShowFilters] = useState(true);
    const [showList, setShowList] = useState(false);

    const {
        values,
        setValues,
        handleInputChange,
        resetForm
    } = useForm(emptyParams);

    const handleSubmit = e => {
        e.preventDefault()

        //TODO: fetch flights
    }

    useEffect(() => {
        console.log(values)
    },[values])

    const handleChangeSlider= (event, newValue, name) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        setValues({
            ...values,
            [name+"Begin"]: newValue[0],
            [name + "End"]: newValue[1],
        })
    };

    //TODO: fetch codes, cities

    return (<div>
        <div style={{}}>
            <Typography display='inline'>Filters</Typography>
            <IconButton
                color="primary"
                aria-label="show filters"
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                display='inline'
            >
                {showFilters ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
        </div>


        {!showFilters ? null :
            <Paper elevation={3} className={classes.paper}>
                <Form onSubmit={handleSubmit}>
                    <Grid container spacing={5} alignItems="center" className={classes.grid}>
                        <Grid item xs={12} md={2}>
                            <Typography>Flight Code:</Typography>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <Autocomplete
                                value={values.code}
                                onInputChange={(event, newInputValue) => {
                                    setValues({
                                        ...values,
                                        code: newInputValue
                                    })
                                }}
                                className={classes.input}
                                size="small"
                                id="combo-box-code"
                                options={mockCodes}
                                renderInput={(params) => <TextField {...params} placeholder="KPNL145" variant="outlined" />}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Typography>Destination:</Typography>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <Autocomplete
                                value={values.destination}
                                onInputChange={(event, newInputValue) => {
                                    setValues({
                                        ...values,
                                        destination: newInputValue
                                    })
                                }}
                                className={classes.input}
                                size="small"
                                id="combo-box-destination"
                                options={mockCities}
                                renderInput={(params) => <TextField {...params} placeholder="Rubizhne" variant="outlined" />}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Typography>Date:</Typography>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <TextField
                                value={values.date}
                                onChange={(event) => {
                                    setValues({
                                        ...values,
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
                            <Typography>Flight Duration:</Typography>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <FormControl
                                className={classes.input}
                                variant="outlined"
                                size='small'
                            >
                                <Select
                                    id="duration"
                                    value={values.durationOption}
                                    onChange={(event) => {
                                        setValues({
                                            ...values,
                                            durationOption: event.target.value
                                        })
                                    }}
                                >
                                    {/*TODO CHANGE VALUES FOR OPTIONS*/}
                                    <MenuItem value={0}>Any</MenuItem>
                                    <MenuItem value={2}>Short — 0-2 hr</MenuItem>
                                    <MenuItem value={6}>Medium — 2-6 hr</MenuItem>
                                    <MenuItem value={10}>Long — 6+ hr</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Typography>Departure Time:</Typography>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <Slider
                                value={[values.timeBegin,values.timeEnd]}
                                onChange={(event, newValue, activeThumb) => {
                                    handleChangeSlider(event, newValue, 'time')
                                }}
                                className={classes.slider}
                                valueLabelFormat={valueLabelFormat}
                                defaultValue={[values.timeBegin, values.timeEnd]}
                                step={1}
                                min={0}
                                max={1439}
                                marks={marks}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Typography>Price:</Typography>
                        </Grid>
                        <Grid item xs={12} md={10}>
                            <Slider
                                value={[values.priceBegin, values.priceEnd]}
                                onChange={(event, newValue, activeThumb) => {
                                    handleChangeSlider(event, newValue, 'price')
                                }}
                                className={classes.slider}
                                defaultValue={[values.priceBegin, values.priceEnd]}
                                step={1}
                                min={1}
                                max={mockMaxPrice}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                            />
                        </Grid>

                    </Grid>
                </Form>
            </Paper>           
        }
        
        <Box
            textAlign='center'
            className={classes.buttonBox}
        >
            <Button
                color='primary'
                size='large'
                variant="contained"
                startIcon={<SearchIcon />}
                className={classes.button}
                style={{
                    width: 300
                }}
                type="submit"
                onClick={() => { setShowList(true) }}
            >
                Search
            </Button>
        </Box>
        
        {showList ? <DataGridTable list={flights} columns={columns}/> : null}

    </div>);

}

//$(window).width() > 600 ? '100%' : 500
export default BrowseFlights;