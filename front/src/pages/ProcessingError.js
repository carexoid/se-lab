import ErrorIcon from '@material-ui/icons/Error';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Box, Button } from '@material-ui/core';
import { Link as RLink } from 'react-router-dom';

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
        marginRight: 'auto'
    },
    text: {
        lineHeight: '200%',
        textAlign: 'left'
    },
    button: {
        width: 200,
    }
}));

function ProcessingError() {
    const flightId = window.location.href.split('=')[1];
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div className={classes.box}>
            <div className={classes.spacing}>
                <ErrorIcon style={{ fill: theme.palette.secondary.main, fontSize: 200, }} />
            </div>
            <Typography variant='h2' className={classes.spacing}>Error</Typography>

            <Box className={classes.spacing} style={{ width: '80%' }}>
                <Typography className={classes.text}>
                    Oops, something went wrong during placing the order. You can try again later.
                </Typography>
            </Box>

            <Box textAlign='center'>
                <Button
                    id='payment-error-try-again-button'
                    color="primary"
                    size='large'
                    variant="contained"
                    className={classes.button}
                    component={RLink} to={`/place_order/${flightId}`}
                >
                    Try Again
                </Button>
            </Box>

        </div>
    );
}

export default ProcessingError;