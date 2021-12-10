import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Box, Button } from '@material-ui/core';

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
        marginLeft: 'auto',
        marginRight:'auto'
    },
    text: {
        lineHeight: '200%',
        textAlign: 'left'
    },
    button: {
        width: 200,
    }
}));

function PaymentError() {
    const orderId = window.location.href.split('=')[1];
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div className={classes.box}>
            <div className={classes.spacing}>
                <ErrorIcon style={{ fill: theme.palette.secondary.main, fontSize: 200, }} />
            </div>
            <Typography variant='h2' className={classes.spacing}>Error</Typography>

            <Box className={classes.spacing} style={{width: '80%'}}>
                <Typography className={classes.text}>
                    Payment was declined.
                </Typography>

                <Typography className={classes.text}>
                    An error occured during transaction. Your tickets are temporarily booked, you can try to pay again now or pay later from your History page.
                    Note, that after a certain period of time booking will disappear, and tickets will be available for purchase to other users.
                </Typography>
            </Box>

            <Box textAlign='center'>
                <form action={`/api/chief/booking/${orderId}`} method="POST">
                    <Button
                        id='payment-error-try-again-button'
                        color="primary"
                        size='large'
                        variant="contained"
                        className={classes.button}
                        //onClick={props.sendOrder}
                        type='submit'
                    >
                        Try Again
                    </Button>
                </form>
            </Box>

        </div>
     );
}

export default PaymentError;