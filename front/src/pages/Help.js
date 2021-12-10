import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Grid, Typography, Link, Paper} from '@material-ui/core';

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
        fontWeight: 700,
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

function Help() {
    const classes = useStyles();

    return (
        <div>
            <Typography variant='h2'>Help</Typography>

            <Paper className={classes.paper}>
                    <Typography variant='h4' className={classes.spacingSmall}>Browsing Flights</Typography>

                    <Typography variant='h5'>How to find Flights?</Typography>
                    <Typography className={classes.spacingSmall}>
                        Navigate to <Link className={classes.blueText} href='/'>Browse Flights</Link> page.
                        Click Search Button to view all flights, or enter some filter parameters to find specific flights.
                    </Typography>


                    <Typography variant='h5'>How to view information about Flight?</Typography>
                    <Typography className={classes.spacingSmall}>
                        Firstly, you have to perform a search.
                        Click on Flight Code of a flight which you are interested in. A new page with detailed information will appear.
                    </Typography>

            </Paper>

            <Paper className={classes.paper}>
                <Typography variant='h4' className={classes.spacingSmall}>Order Tickets</Typography>

                <Typography variant='h5'>How to buy a Ticket?</Typography>
                <Typography className={classes.spacingSmall}>
                    Only authorized users can buy tickets on this website.
                    Firstly, make sure that you have created an account and you are logged in.
                    Secondly, choose a flight and navigate to a page with detailed information about it.
                    Click on Buy Tickets Button. Fill order details and proceed to checkout.
                </Typography>


                <Typography variant='h5'>Available Payment Options</Typography>               
                <Typography className={classes.spacingSmall}>
                    There are three payment methods: Pay online, Pay online with Bonuses and Pay offline.
                    Pay online and Pay online with Bonuses (after specifying the amount of Bonuses to use) will redirect you to absolutely well trusted third party payment service,
                    which handles transactions.
                    Pay offline option requires you to pay in person at any checkout in our airport.
                    When choosing this option, make sure to have information about order (Order Id).
                </Typography>

                <Typography variant='h5'>I forgot to save information about my order!</Typography>
                <Typography className={classes.spacingSmall}>
                    Don't worry, you can view information about your orders anytime you wish!
                    Log in to your account and click on My Profile button in the navigation bar, then click on History.
                    You can view information on the site or you can download information about order on your local machine.
                    Note though that orders are stored for only one year.
                </Typography>

                <Typography variant='h5'>I want to cancel my order</Typography>
                <Typography className={classes.spacingSmall}>
                    To cancel your order, you should contact our Administrator.
                    You can find our contact information on the <Link className={classes.blueText} href='/about'>About Us</Link> page.
                    After cancelling the order our Communication team will in contact about a refund.
                </Typography>

                <Typography variant='h5'>Payment Error occured</Typography>
                <Typography className={classes.spacingSmall}>
                    When an error occured during transaction, your tickets are temporarily booked, you can try to pay again now or pay later from your History page.
                    Note, that after a certain period of time booking will disappear, and tickets will be available for purchase to other users.
                </Typography>

            </Paper>

            <Paper className={classes.paper}>
                <Typography variant='h4' className={classes.spacingSmall}>Account</Typography>
                
                <Typography variant='h5'>How to get an account?</Typography>
                <Typography className={classes.spacingSmall}>
                    Click on Login or Sign Up button in the navigation bar.
                    Choose Sign Up option and fill out required fields, then click Sign Up button.
                    Note that one email can have only one account.
                </Typography>

                <Typography variant='h5'>What information do we store?</Typography>
                <Typography className={classes.spacingSmall}>
                    We store only your email, account password, phone number (optional), personalized comment (optional), and your order history.
                    We do not store your financial information.
                </Typography>

                <Typography variant='h5'>How to edit or delete an account?</Typography>               
                <Typography className={classes.spacingSmall}>
                    Navigate to Profile Info via My Profile button in the navigation bar.
                    Here you can view and edit your profile information, change password and delete account permanently.
                    Note that after deletion account cannot be restored.
                </Typography>
            </Paper>

            <Paper className={classes.paper} id='bonuses-help'>
                <Typography variant='h4' className={classes.spacingSmall}>Bonuses</Typography>

                <Typography variant='h5'>What are Bonuses?</Typography>
                <Typography className={classes.spacingSmall}>
                    Bonuses are our discount currency.
                </Typography>

                <Typography variant='h5'>How to use Bonuses?</Typography>
                <Typography className={classes.spacingSmall}>
                    You can use Bonuses to get a discount on your orders.
                    When choosing payment method, pick Pay online with Bonuses.
                    Enter valid amount of Bonuses and proceed to checkout with discount.
                    Note, that you can't cover the entire cost with Bonuses.
                    For legal reasons at least 1$ should be transactioned for purchase to be properly registered.
                </Typography>

                <Typography variant='h5'>How to earn Bonuses?</Typography>
                <Typography className={classes.spacingSmall}>
                    You earn Bonuses each time when you order tickets.
                    Every mile of flight per every ticket gives you 1 Bonus, meaning if you've bought two tickets for a flight, you'll get twice as much bonuses as flight distance.
                </Typography>
            </Paper>
        </div>
     );
}

export default Help;