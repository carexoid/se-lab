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
import { logIn, logOut, setAuth } from '../actions/';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import netlifyIdentity from 'netlify-identity-widget';
import netlifyAuth from '../netlifyAuth'
import { event } from 'jquery';

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

function NavBar({setAuth}) {
    const user = netlifyIdentity.currentUser();
    
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [authState, setAuthState] = useState(user !== null);
    const [clickLogout, setClickLogout] = useState(user === null);

    useEffect(() => {
        console.log({ user });
        console.log('authState: ', authState)
        setAuth(authState)
    }, [])

    useEffect(() => {
        setAuthState(!clickLogout)
    }, [clickLogout])

    useEffect(() => {
        console.log('new authState: ', authState)
        setAuth(authState)
    }, [authState])

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleLogInClick = (event) => {
        netlifyAuth.authenticate((user) => {
            console.log('user: ', user)
            setClickLogout(false);
        })
    }
    const handleLogoutClick = (event) => {
        setClickLogout(true);
        netlifyAuth.signout(() => { console.log('sign out') })
        handleClose();
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
                position: '-webkit-sticky', /* Required for Safari */
                position: 'sticky',
                zIndex: 1,
            }}
        >
            <Container fixed
                className={classes.container}
            >

                <Box className={classes.boxLeft}>
                    <ButtonGroup size="large" variant="text" color='primary'>
                        <Button id='nav-browse-flights' component={RLink} to='/'> Browse Flights </Button>
                        <Button id='nav-help' component={RLink} to='/help'> Help </Button>
                        <Button id='nav-about' component={RLink} to='/about'> About Us </Button>
                    </ButtonGroup>
                </Box>

                <Box className={classes.boxRight}>
                    {authState ?
                        <div>
                            <Button
                                id='nav-my-profile'
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
                                <StyledMenuItem id='nav-profile-info' onClick={handleClose} component={RLink} to='/profile'>
                                    <ListItemIcon>
                                        <InfoIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Profile Info</ListItemText>
                                </StyledMenuItem>
                                <StyledMenuItem id='nav-history' onClick={handleClose} component={RLink} to='/history'>
                                    <ListItemIcon>
                                        <FlightIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Order History</ListItemText>
                                </StyledMenuItem>
                                <StyledMenuItem
                                    id='nav-logout'
                                    onClick={handleLogoutClick}
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
                            id="nav-login"
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
        setAuth: (value) => dispatch(setAuth(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);