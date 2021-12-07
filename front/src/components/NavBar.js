import { ButtonGroup, Container, Box, Button, Grid } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Link as RLink } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InfoIcon from '@material-ui/icons/Info';
import FlightIcon from '@material-ui/icons/Flight';
import { connect } from 'react-redux';
import { logIn, logOut, authTrue, authFalse } from '../actions/';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import netlifyIdentity from 'netlify-identity-widget';
import netlifyAuth from '../netlifyAuth'

const useStyles = makeStyles((theme) => ({
    box: {
        position: 'relative',
        right: 0,
        top: 0,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 0,
        //overflow: 'scroll',
    },
    boxLeft: {
        position: 'relative',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        height: '100%',
        width: '75%',
        display: "flex",
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    boxRight: {
        position: 'relative',
        top: 0,
        right: 0,
        margin: 0,
        padding: 0,
        height: '100%',
        width: '25%',
        display: "flex",
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        overflow: 'hidden'
    },
    light: {
        color: theme.palette.primary.main
    },
    paper: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    }
}));

const StyledMenu = withStyles((theme) => ({
    paper: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    list: {
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: theme.palette.primary.contrastText,
        },
    }
}))(Menu);

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.darkBlue.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.darkBlue.contrastText,
            },
        },
    },
}))(MenuItem);

function NavBar({ auth, authFalse, authTrue, email, logIn, logOut }) {
    const user = netlifyIdentity.currentUser();
    
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [authState, setAuthState] = useState(user !== null);
    const [clickLogout, setClickLogout] = useState(!auth);

    useEffect(() => {
        console.log({ user });
        console.log('authState: ', authState)
    },[])

    /* useEffect(() => {
        setAuthState(!clickLogout)
    }, [clickLogout]) */

    useEffect(() => {
        console.log('new authState: ', authState)
    }, [authState])

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleLogInClick = (event) => {
        logIn(1, 'a@gmail.com');
        authTrue();
        setClickLogout(false);
        netlifyAuth.authenticate((user)=>{console.log('user: ',user)})
    }
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            bgcolor='primary.main'
            style={{
                top: 0,
                width: '100%',
                position: '-webkit - sticky', /* Required for Safari */
                position: 'sticky',
                zIndex: 1,
            }}
        >
            <Container fixed
                className={classes.container}
            >

                <Box className={classes.boxLeft}>
                    <ButtonGroup size="large" variant="text" color='primary'>
                        <Button component={RLink} to='/'> Browse Flights </Button>
                        <Button component={RLink} to='/help'> Help </Button>
                        <Button component={RLink} to='/about'> About Us </Button>
                    </ButtonGroup>
                </Box>

                <Box className={classes.boxRight}>
                    {authState ?
                        <div>
                            <Button
                                size="large"
                                variant="text"
                                color='primary'
                                startIcon={<AccountCircleIcon style={{ fill: '#ececec', fontSize: 25 }} />}
                                disableFocusRipple
                                aria-haspopup="true"                               
                                onClick={handleProfileClick}
                            >
                                My Profile
                            </Button>
                            <StyledMenu
                                color='primary'
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                elevation={1}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <StyledMenuItem onClick={handleClose} component={RLink} to='/profile'>
                                    <ListItemIcon>
                                        <InfoIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Profile Info</ListItemText>
                                </StyledMenuItem>
                                <StyledMenuItem onClick={handleClose} component={RLink} to='/history'>
                                    <ListItemIcon>
                                        <FlightIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Order History</ListItemText>
                                </StyledMenuItem>
                                <StyledMenuItem
                                    onClick={() => {
                                        authFalse();
                                        logOut();
                                        handleClose();
                                        setClickLogout(true);
                                    }}
                                >
                                    <ListItemIcon>
                                        <ExitToAppIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Logout</ListItemText>
                                </StyledMenuItem>
                            </StyledMenu>
                        </div>

                        :
                        <Button
                            size="large"
                            variant="text"
                            color='primary'
                            onClick={handleLogInClick}
                        >
                            Login or Sign Up
                        </Button>
                    }
                </Box>
            </Container>
        </Box>
    );
}

//VERY IMPORTANT THINGS
const mapStateToProps = state => ({
    id: state.user.id,
    email: state.user.email,
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (id, email) => dispatch(logIn(id, email)),
        logOut: () => dispatch(logOut()),
        authTrue: () => dispatch(authTrue()),
        authFalse: () => dispatch(authFalse()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);