import { Typography, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@mui/material';
import InfoIcon from '@material-ui/icons/Info';
import $ from "jquery";
import DataGridTable from '../components/DataGridTable';
import { Link } from '@material-ui/core';
import netlifyIdentity from 'netlify-identity-widget';

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
                {param.row.tickets[0].flight.id.toString().padStart(5, '0')}
                <IconButton
                    color="primary"
                    size="small"
                    onClick={() => { }}
                    display='inline'
                >
                    <InfoIcon />
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


function History({ auth, setAuth }) {
    const user = netlifyIdentity.currentUser();
    const [orders, setOrders] = useState([]);
    const [bonus, setBonus] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        $.ajax({
            type: 'GET',
            url: 'api/chief/account/history',
            //TODO add Authorization header
            headers: { 'Accept': 'application/json' },
            success: ((responseJSON) => {
                setOrders(responseJSON.orders.map(x => {
                    return {
                        ...x,
                        id: x.order_id
                    }
                }))
            })
        })

        $.ajax({
            type: 'GET',
            url: 'api/chief/account',
            //TODO add Authorization header
            headers: { 'Accept': 'application/json' },
            success: ((responseJSON) => {
                setBonus(responseJSON.bonuses)
            })
        })
    }, [])

    return (
        <div>

            <Typography variant='h2'>Order History</Typography>

            <Paper className={classes.paper}>
                <Typography variant='h4'>Bonuses: {bonus}</Typography>
                <Typography className={classes.spacing}>You have {bonus} Bonuses available.</Typography>
                <Typography className={classes.spacing}>
                    You can use Bonuses for discounts when ordering tickets. <Link href='/help#bonuses-help' className={classes.blueText}>Learn more about Bonuses.</Link>
                </Typography>
            </Paper>

            <DataGridTable
                list={orders}
                columns={columns}
            />
            <Typography className={classes.note}>* Note, that orders older than a year are not stored.</Typography>

        </div>
    );
}



export default History;