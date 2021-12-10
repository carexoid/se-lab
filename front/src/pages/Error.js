import SearchIcon from '@material-ui/icons/Search';
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
        width: 350,
    }
}));

function Error() {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div className={classes.box}>
            <div className={classes.spacing}>
                <SearchIcon style={{ fill: '#3a404f', fontSize: 200, }} />
            </div>
            <Typography variant='h2' className={classes.spacing}>Page Not Found</Typography>

            <Box className={classes.spacing} style={{ width: '80%' }}>
                <Typography className={classes.text}>
                    Looks like this page doesn't exist! Check if it's here later and go back to main page.
                </Typography>
            </Box>

            <Box textAlign='center'>
                <Button
                    id='payment-error-try-again-button'
                    color="primary"
                    size='large'
                    variant="contained"
                    className={classes.button}
                    component={RLink} to='/'
                >
                    Go back to Browse Flights
                </Button>
            </Box>

        </div>
    );
}

export default Error;