import { Typography, Paper, DialogContent, Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@mui/material';
import InfoIcon from '@material-ui/icons/Info';
import $ from "jquery";
import DataGridTable from '../components/DataGridTable';
import { Link } from '@material-ui/core';
import netlifyIdentity from 'netlify-identity-widget';
import DisplayFlight from '../components/DisplayFlight';
import PaymentIcon from '@material-ui/icons/Payment';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFGenerator from '../components/PDFGenerator';

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
    },
    text: {
        fontSize: 14,
    }
}));





function History({ auth, setAuth }) {
    const user = netlifyIdentity.currentUser();
    const [orders, setOrders] = useState([]);
    const [bonus, setBonus] = useState(0);
    const [showFlight, setShowFlight] = useState(false)
    const classes = useStyles();

    const columns = [
        {
            field: 'id',
            headerName: 'Order ID',
        },
        {
            field: 'flightId',
            headerName: 'Flight Code',
            //width: '10%',
            renderCell: (param) => (
                <Typography className={classes.text}>
                    {param.row.tickets[0].flight.id.toString().padStart(5, '0')}
                    <IconButton
                        id={`history-flight-info-${param.row.tickets[0].flight.id}`}
                        color="primary"
                        size="small"
                        onClick={() => { setShowFlight(true) }}
                        display='inline'
                    >
                        <InfoIcon />
                    </IconButton>

                    <Dialog
                        open={showFlight}
                    >
                        <DialogContent>
                            <DialogTitle>
                                Kyiv — {param.row.tickets[0].flight.city}
                            </DialogTitle>
                            <DisplayFlight flight={param.row.tickets[0].flight} />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                id='order-dialog-cancel'
                                size='large'
                                variant="text"
                                onClick={() => {
                                    setShowFlight(false)
                                }}
                            >
                                OK
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Typography>
            ),
        },
        {
            field: 'state',
            headerName: 'Status',
            width: 150,
            renderCell: (param) => {
                return param.row.state === 1 ? "Completed" :
                    <Typography className={classes.text}>
                        Waiting for Payment
                        <form action={`/api/chief/booking/${param.row.id}&token=${user.token.access_token}`} method="POST">
                            <IconButton
                                id={`history-pay-button-${param.row.id}`}
                                color="primary"
                                size="small"
                                type='submit'
                                display='inline'
                            >
                                <PaymentIcon />
                            </IconButton>
                        </form>
                    </Typography>
            }
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
        {
            field: 'full_price',
            headerName: 'Cost, $',
        },
        {
            field: 'bonuses_used',
            headerName: 'Bonuses Used',
            width: 150,
        },
        {
            field: 'get_info',
            headerName: 'Details',
            renderCell: (param) =>
                <Typography className={classes.text}>
                    <PDFDownloadLink document={<PDFGenerator order={param.row} />} fileName={`order_information_${param.row.id}.pdf`}>
                        <IconButton
                            id={`history-pay-button-${param.row.id}`}
                            color="primary"
                            size="small"
                            type='submit'
                            display='inline'
                        >
                            <SaveAltIcon />
                        </IconButton>
                    </PDFDownloadLink>
                </Typography>
        }
    ];


    useEffect(() => {
        $.ajax({
            type: 'GET',
            url: 'api/chief/account/history',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + user.token.access_token
            },
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
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + user.token.access_token
            },
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