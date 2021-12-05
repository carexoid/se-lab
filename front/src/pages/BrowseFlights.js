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
import $ from 'jquery';


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



//TODO change prices, possibly write custom Label Format
const mockMaxPrice = 10000;

const emptyParams = {
    id: '',
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

    const {
        values,
        setValues,
        handleInputChange,
        resetForm
    } = useForm(emptyParams);

    const handleSubmit = e => {
        e.preventDefault()
        setShowList(true)

        const newY = getOffset(document.getElementById('search-button')).top
        console.log(newY)

        $("html, body").animate({
            scrollTop: newY 
        });
    }

    useEffect(() => {
        console.log(values)
    },[values])

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
                
                {/* TODO pass also lists of codes and cities */}
                <Filters
                    values={values}
                    setValues={setValues}
                    maxPrice={mockMaxPrice}
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