import { Container, Box, Grid, Typography, Link } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import InstagramIcon from '@material-ui/icons/Instagram';

const useStyles = makeStyles((theme) => ({
    textColor: {
        color: theme.palette.primary.contrastText
    },
    title: {
        fontWeight: 800,
        textTransform: 'uppercase'
    },
    line: {
        marginTop: theme.spacing(2),
        width: '100%',
        borderTop: `2px solid ${theme.palette.primary.contrastText}`
    },
    container: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        width: '100%',
    }
}));

function Footer() {
    const classes = useStyles()
    const theme = useTheme()

    return (
        <Box
            bgcolor='primary.main'
            style={{
                bottom: 0,
                width: '100%',
                zIndex: 1,
            }}
        >
            <Container fixed>
                <Box className={classes.container}>
                    <Grid container spacing={1}>
                        <Grid item xs={6} md={3}>
                            <Typography className={`${classes.textColor} ${classes.title}`}>Shlyah do mrii</Typography>
                        </Grid>
                        <Grid item xs={6} md={9}>
                            <Typography className={`${classes.textColor} ${classes.title}`}>Our Socials</Typography>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <Link href='/help' className={classes.textColor}>Help</Link>
                        </Grid>
                        <Grid item xs={6} md={9}>
                            <Link href='https://instagram.com/cyberknu?utm_medium=copy_link' className={classes.textColor}>
                                <InstagramIcon fill={theme.palette.primary.contrastText}/>
                            </Link>
                        </Grid>

                        <Grid item xs={6} md={3}>
                            <Link href='/about' className={classes.textColor}>About Us</Link>
                        </Grid>
                        <Grid item xs={6} md={9}>
                            <br/>
                        </Grid>

                        <Grid item xs={12}>
                            <Box className={classes.line}>
                                <Typography className={classes.textColor}>
                                    © Кібернетика — шлях до мрії, No Rights Reserved
                                </Typography>

                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Container>
        </Box>
     );
}

export default Footer;