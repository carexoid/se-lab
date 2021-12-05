import { Typography, Paper } from '@material-ui/core';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@mui/material';
import InfoIcon from '@material-ui/icons/Info';
import DataGridTable from '../components/DataGridTable';
import { Link } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    spacing: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    note: {
        color: theme.palette.fadedtext.main,
        fontSize: 10,
    },
    paper: {
        verticalAlign: 'middle',
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        '& > *': {
            //margin: theme.spacing(6),
            width: '100%',
        },
        padding: theme.spacing(2),
        backgroundColor: theme.palette.papers.main,
    },
    blueText: {
        color: theme.palette.primary.main,
    }
}));


/* valueGetter: (params) =>
    `${params.flight}`, */

const columns = [
    {
        field: 'id',
        headerName: 'Order ID',
        //width: 100,
    },
    {
        field: 'flightId',
        headerName: 'Flight Code',
        //width: '10%',
        renderCell: (param) => (
            <Typography>
                {param.row.tickets[0].flight.id}
                <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {}}
                    display='inline'
                >
                    <InfoIcon/>
                </IconButton>
            </Typography>
        ),
    },
    {
        field: 'created_at',
        headerName: 'Created At',
        width: 250,
    },
    {
        field: 'class',
        headerName: 'Class',
        //width: 100,
        valueGetter: (param) =>
            `${param.row.tickets[0].type === 0 ? 'Econom' : 'Business'}`,
    },
    {
        field: 'quantity',
        headerName: 'Tickets',
        //width: 100,
        valueGetter: (param) =>
            `${param.row.tickets.length}`,
    },
    /* {
        field: 'cost',
        headerName: 'Cost',
    }, */
    {
        field: 'bonuses_used',
        headerName: 'Bonuses Used',
        width: 150,
    },
];

const orders = [{
    bonuses_added: "7024",
    bonuses_used: "100",
    created_at: "Sun, 28 Nov 2021 22:02:57 GMT",
    id: 3,
    state: 1,
    tickets: [
        {
            flight: {
                arrival_at: "Tue, 30 Nov 2021 17:12:00 GMT",
                departure_at: "Tue, 30 Nov 2021 11:34:00 GMT",
                direction: {
                    id: 4,
                    to: {
                        city: "London",
                        id: 4,
                        info: "airport bigger than Novovolynsk",
                        name: "Heathrow"
                    }
                },
                distance: 3512,
                id: 4
            },
            price: 150,
            seat: 43,
            type: 1
        },
        {
            flight: {
                arrival_at: "Tue, 30 Nov 2021 17:12:00 GMT",
                departure_at: "Tue, 30 Nov 2021 11:34:00 GMT",
                direction: {
                    id: 4,
                    to: {
                        city: "London",
                        id: 4,
                        info: "airport bigger than Novovolynsk",
                        name: "Heathrow"
                    }
                },
                distance: 3512,
                id: 4
            },
            price: 150,
            seat: 44,
            type: 1
        }
    ]
}]

function History() {
    const classes = useStyles();
    let bonuses = 111;

    useEffect(() => {
        //fetch history
    }, [])

    return (<div>
        <Typography variant='h2'>Order History</Typography>
               
        <Paper className={classes.paper}>
            <Typography variant='h4'>Bonuses: {bonuses}</Typography>
            <Typography className={classes.spacing}>You have {bonuses} Bonuses available.</Typography>
            <Typography className={classes.spacing}>
                You can use Bonuses for discounts when ordering tickets. <Link href='/help' className={classes.blueText}>Learn more about Bonuses.</Link>
            </Typography>
        </Paper>
        
        <DataGridTable
            list={orders}
            columns={columns}
        />
        <Typography className={classes.note}>* Note, that orders older than a year are not stored.</Typography>
    </div> );
}

export default History;