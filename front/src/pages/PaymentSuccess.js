import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import PDFGenerator from '../components/PDFGenerator';
import React, { useState, useEffect } from 'react';
import $ from "jquery";

const useStyles = makeStyles((theme) => ({
    box: {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    spacing: {
        //marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        
    },
    text: {
        lineHeight: '200%',
        textAlign: 'left'
    }
}));

function Success() {
    const classes = useStyles();
    const theme = useTheme()
    const [order, setOrder] = useState({})
    const [show, setShow] = useState(false)

    useEffect(() => {
        const orderId = window.location.href.split('=')[1];

        $.ajax({
            type: 'GET',
            url: `/api/chief/order/${orderId}`,
            headers: { 'Accept': 'application/json' }, //add JWT
            success: (responseJSON) => {
                setOrder(responseJSON)
                setShow(true)
            }
        })
    }, [])
    
    return (
        <div className={classes.box}>
            <div className={classes.spacing}>
                <CheckCircleIcon style={{ fill: '#12a421 ', fontSize: 200, }} />
            </div>
            <Typography variant='h2' className={classes.spacing}>Success</Typography>
            
            <div className={classes.spacing}>
                <Typography className={classes.text}>
                    Thank you for flying with us! Check your bonuses which you can use for the next purchases.
                </Typography>

                <Typography className={classes.text}>
                    View and download information about your order as pdf now or later from your history.
                    {show && <PDFDownloadLink document={<PDFGenerator order={order} />} fileName={`order_information_${order.order_id}.pdf`} >
                        <IconButton
                            color={theme.palette.text.main}
                            size="large"
                            display='inline'
                        >
                            <SaveAltIcon style={{ fontSize: 40 }} />
                        </IconButton>
                    </PDFDownloadLink>}
                </Typography>
            </div>

            {show && <PDFViewer style={{ width: '100%', minHeight:550 }}>
                <PDFGenerator order={order}/>
            </PDFViewer>}
        </div>
    );
}

export default Success;