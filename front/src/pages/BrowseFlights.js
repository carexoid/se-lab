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
import moment from 'moment';
//import 'moment-timezone';


const useStyles = makeStyles((theme) => ({
    paper: {
        verticalAlign: 'middle',
        '& > *': {
            //margin: theme.spacing(6),
            width: '100%',
            /* height: theme.spacing(16), */
        },
        padding: theme.spacing(2),
        backgroundColor: theme.palette.papers.main,
    },
    buttonBox: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
    },
    spacing: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
}));


/* function convertTimeZone(time, zone) {
    var format = 'ddd, DD MMM YYYY HH:mm:ss z';
    let mt = moment(time, format).tz(zone)
    return mt
} */

function getHours(s) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s - h * 3600) / 60)
    return h.toString()+':'+m.toString().padStart(2,'0')
}

const columns = [
    {
        field: 'id',
        headerName: 'Code',
        renderCell: (params) => (
            <Link id={`browse-link-${params.id}`} href={`/view/${params.id}`}>{params.id.toString().padStart(5,'0')}</Link>
        ),
    },
    {
        field: 'city',
        headerName: 'Destination',
    },
    {
        field: 'departure',
        headerName: 'Departure',
        width:200,
        valueGetter: (params) => new Date(params.row.departure_at)
    },
    {
        field: 'arrival',
        headerName: 'Arrival',
        width: 200,
        valueGetter: (params) => new Date(params.row.arrival_at)
    },
    {
        field: 'duration',
        headerName: 'Duration, h',
        valueGetter: (params) => getHours(params.row.duration)
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
        valueGetter: (params) => `${params.row.econom_remaining !== 0 ?
            `${params.row.econom_min_price}$+`
            :
            params.row.business_remaining !== 0 ? `${params.row.business_min_price}$` : '—'}`
    },
];

//change prices
const maxPrice = 5000;
const maxDuraion = 10;

const emptyParams = {
    id: '',
    destination: '',
    date: '',
    durationBegin: 1,
    durationEnd: maxDuraion,
/*     timeBegin: 0,
    timeEnd: 1439, */
    priceBegin: 1,
    priceEnd: maxPrice,
};

function generateReqStr(values) {
    const getFormatString = (date, time) => {
        let mt = moment(date, 'YYYY-MM-DD')
        let h = Math.floor(time / 60)
        mt.hour(h)
        mt.minute(Math.floor(time-h*60))
        return moment(mt).format('YYYY-MM-DD kk:mm:ss', 'en-GB')
    }
    
    const id = values.id !== emptyParams.id ? '?number=' + +values.id : ''
    const c = values.destination !== emptyParams.destination ? '?city=' + values.destination : ''

    let mdt = ''
    if (values.date !== emptyParams.date)
        mdt = '?min_departure_time=' + getFormatString(values.date, 0) +
            '?max_departure_time=' + getFormatString(values.date, 1439)

    let md = ''
    if (values.durationBegin !== emptyParams.durationBegin || values.durationEnd !== emptyParams.durationEnd)
        md = '?min_duration=' + (3600 * values.durationBegin) +
            '?max_duration=' + (3600 * values.durationEnd)
    
    let mp = ''
    if (values.priceBegin !== emptyParams.priceBegin || values.priceEnd !== emptyParams.priceEnd)
        mp = '?min_price=' + values.priceBegin +
            '?max_price=' + values.priceEnd    

    return id+c+mdt+md+mp
}

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
    const [flights, setFlights] = useState([])

    const {
        values,
        setValues,
        handleInputChange,
        resetForm
    } = useForm(emptyParams);

    const handleSubmit = e => {
        e.preventDefault()
        console.log(generateReqStr(values))
        
        $.ajax({
            type: 'GET',
            url: `${generateReqStr(values) !== '' ? `/api/chief/flights${generateReqStr(values)}` : '/api/chief/flights'}`,
            headers: { 'Accept': 'application/json' },
            success: function (responseJSON) {
                console.log(responseJSON)
                setFlights(responseJSON.flights)
                
                setShowList(true)
                const newY = getOffset(document.getElementById('browse-search-button')).top
                $("html, body").animate({
                    scrollTop: newY
                });
            },
        });
       
    }

    //componentDidMount
    useEffect(() => {
        $.ajax({
            type: 'GET',
            url: '/api/chief/flight_ids',
            headers:{'Accept': 'application/json'},
            success: function (responseJSON) {
                //console.log(responseJSON.ids) 
                setFlightIdAC(responseJSON.ids.map(x => x.toString().padStart(5, "0")))
            },
        });

        $.ajax({
            type: 'GET',
            url: '/api/chief/cities',
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
        <Typography variant='h2'>Browse flights</Typography>

        <div className={classes.spacing}>
            <Typography display='inline'>Filters</Typography>
            <IconButton
                id='browse-hide-filters'
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
                id='browse-search-button'
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