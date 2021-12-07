import React, { useEffect, useState } from 'react';

import netlifyIdentity from 'netlify-identity-widget';
import Unauthorized from '../components/Unauthorized';
import { logIn, logOut, setAuth } from '../actions';
import { connect } from 'react-redux';
import ComposeOrder from './ComposeOrder';

function ProtectedWrapper({ auth, setAuth, children ,...props }) {
    const user = netlifyIdentity.currentUser();

    useEffect(() => {
        setAuth(user !== null)
    }, [])

    return (<div>
        {!auth ? <Unauthorized /> :
            <div>
                {children}
            </div>
        }
    </div>);
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

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedWrapper);