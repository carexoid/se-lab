import { Typography, Button } from '@material-ui/core';
import React, {useState} from 'react';
import { connect } from 'react-redux';
import { logIn, logOut, authTrue, authFalse } from '../actions/';

function ProfileInfo({ id, email, auth, logIn, logOut, authFalse }) {
    const [thingyForRender, setThingyForRender] = useState(false)

    return (
        <div>
            <Typography>id: {localStorage.getItem('id')}</Typography>
            <Typography>email: {localStorage.getItem('email')}</Typography>
            <Typography>another Reducer: {auth ? 'true' : 'false' }</Typography>
            
            <Button
                onClick={() => {
                    logIn(1, 'a@gmail.com')
                    setThingyForRender(!thingyForRender)
                    //localStorage.setItem('email', 'a@gmail.com')
                    //localStorage.setItem('id', 1)
                }}
            >
                Log In
            </Button>

            <Button
                onClick={() => {
                    logOut()
                    authFalse()
                    setThingyForRender(!thingyForRender)
                }}
            >
                Log Out
            </Button>
        </div>
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
        logIn: (id, email) => dispatch(logIn(id,email)),
        logOut: () => dispatch(logOut()),
        authTrue: () => dispatch(authTrue()),
        authFalse: () => dispatch(authFalse()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);