import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Grid, Typography, Link, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    spacing: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    spacingSmall: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    bold: {
        fontWeight: 800,
    },
    blueText: {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
    },
    box: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        width: '100%',
    },
    paper: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        padding: theme.spacing(2),
        backgroundColor: theme.palette.papers.main,
    },
}));

function AboutUs() {
    const classes = useStyles();
    return (<div>
        <Typography variant='h2'>About Us</Typography>

        <Paper className={classes.paper}>
            <Typography variant='h4' className={classes.spacingSmall}>Who are we?</Typography>

            <Typography className={classes.spacingSmall}>
                We are the best airport in the world that will take you to your dreams through white fluffy clouds!
                We work with numerous aviacompanies and provide nice, comfortable and cheap flights all around the world.
            </Typography>

        </Paper>

        <Paper className={classes.paper}>
            <Typography variant='h4' className={classes.spacingSmall}>Where can you find us?</Typography>

            <Typography className={classes.spacingSmall}>
                You can find us at <span className={classes.bold}>4d, Akademika Hlushkova Ave, Kyiv, Ukraine</span>. We look forward to meeting you!
            </Typography>

        </Paper>

        <Paper className={classes.paper}>
            <Typography variant='h4' className={classes.spacingSmall}>Contact us</Typography>

            <Typography className={classes.spacingSmall}>
                Email: shlyahdomrii@dreams.com
            </Typography>

            <Typography className={classes.spacingSmall}>
                Hotline: +380000000000
            </Typography>

        </Paper>
    </div> );
}

export default AboutUs;