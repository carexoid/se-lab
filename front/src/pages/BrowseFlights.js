import React, { useState, useEffect } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { Box, Paper, Typography, } from '@material-ui/core';
import { useForm } from '../components/useForm';
import DataGridTable from '../components/DataGridTable';
import { Link } from '@material-ui/core';
import Filters from '../components/Filters';
import $, { get, ajax } from "jquery";
/* import moment from 'moment';
import 'moment-timezone'; */


const useStyles = makeStyles((theme) => ({
    paper: {
        verticalAlign: 'middle',
        '& > *': {
            margin: theme.spacing(6),
            width: '100%',
            /* height: theme.spacing(16), */
        },
        backgroundColor: theme.palette.papers.main,
    },
    buttonBox: {
        margin: theme.spacing(6),
    },
}));



//change prices
const maxPrice = 5000;
const maxDuraion = 10;

const emptyParams = {
    id: '',
    destination: '',
    date: '',
    durationBegin: 0,
    durationEnd: maxDuraion,
    timeBegin: 0,
    timeEnd: 1439,
    priceBegin: 0,
    priceEnd: maxPrice,
};

const flights = [
    {
        id: 'KPNL145',
        city: 'London',
        departure_at: "Thu, 02 Dec 2021 14:40:00 GMT",
        econom_min_price: null,
        econom_remaining: 0,
        business_remaining: 0,
    },
    {
        id: 'KNUGOVNO',
        city: 'London',
        departure_at: "Sat, 04 Dec 2021 14:12:00 GMT",
        econom_min_price: 100,
        econom_remaining: 3,
        business_remaining: 4,
    },
    {
        id: '145LOVE145',
        city: 'London',
        departure_at: "Wed, 08 Dec 2021 22:12:00 GMT",
        econom_min_price: null,
        econom_remaining: 0,
        business_remaining: 5,
    },
];

/* function convertTimeZone(time, zone) {
    var format = 'ddd, DD MMM YYYY HH:mm:ss z';
    let mt = moment(time, format).tz(zone)
    return mt
} */

const columns = [
    {
        field: 'id',
        headerName: 'Code',
        renderCell: (params) => (
            <Link href={`/view/${params.id}`}>{params.id.toString().padStart(5,'0')}</Link>
        ),
    },
    {
        field: 'city',
        headerName: 'Destination',
        //valueGetter: (params) => params.city
    },
    {
        field: 'departure',
        headerName: 'Departure',
        width:200,
        valueGetter: (params) => new Date(params.row.departure_at)
    },
    {
        field: 'available',
        headerName: 'Seats Available',
        width: 130,
        valueGetter: (params) => params.row.econom_remaining + params.row.business_remaining
    },
    {
        field: 'price',
        headerName: 'Price',
        valueGetter: (params) => `${params.row.econom_min_price !== null
            ? `${params.row.econom_min_price}+` :'—'}`
    }
];

//toLocaleString('en-GB', { timeZone: 'Europe/ Kiev'})

function getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function BrowseFlights() {
    const classes = useStyles();
    const [showFilters, setShowFilters] = useState(true);
    const [showList, setShowList] = useState(false);
    const [flightIdAC, setFlightIdAC] = useState([])
    const [cityAC, setCityAC] = useState([])

    const {
        values,
        setValues,
        handleInputChange,
        resetForm
    } = useForm(emptyParams);

    const handleSubmit = e => {
        e.preventDefault()
        
        //send request
        
        setShowList(true)
        const newY = getOffset(document.getElementById('search-button')).top
        $("html, body").animate({
            scrollTop: newY 
        });
    }

    //componentDidMount
    useEffect(() => {
        $.ajax({
            type: 'GET',
            url: '/flight_ids',
            headers:{'Accept': 'application/json'},
            success: function (responseJSON) {
                //console.log(responseJSON.ids) 
                setFlightIdAC(responseJSON.ids.map(x => x.toString().padStart(5, "0")))
            },
        });

        $.ajax({
            type: 'GET',
            url: '/cities',
            headers: { 'Accept': 'application/json' },
            success: function (responseJSON) {
                const newView = responseJSON.cities.map(
                    x => x.city)
                //console.log(newView)
                setCityAC(newView)
            },
        });
    }, [])

    useEffect(() => {
        console.log(values)
    },[values])

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
                
                <Filters
                    flightIDs={flightIdAC}
                    cities={cityAC}
                    values={values}
                    setValues={setValues}
                    maxPrice={maxPrice}
                    maxDuraion={maxDuraion}
                    handleSubmit={handleSubmit}
                />
            </Paper>           
        }
        
        <Box
            textAlign='center'
            className={classes.buttonBox}
        >
            <Button
                id='search-button'
                color='primary'
                size='large'
                variant="contained"
                startIcon={<SearchIcon />}
                className={classes.button}
                style={{
                    width: 300
                }}
                type="submit"
                onClick={handleSubmit}
            >
                Search
            </Button>
        </Box>
        
        {showList ? <DataGridTable list={flights} columns={columns}/> : null}

    </div>);

}

//$(window).width() > 600 ? '100%' : 500
export default BrowseFlights;