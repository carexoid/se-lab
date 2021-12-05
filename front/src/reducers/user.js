const initialState = {
    id: localStorage.getItem('id'),
    email: localStorage.getItem('email'),
}

const noUser = {
    id: -1,
    email: '',
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOG_IN':
            localStorage.setItem('id', action.payload.id)
            localStorage.setItem('email', action.payload.email)
            //Object.assign({}, state, initialState)
            return state;
        case 'LOG_OUT':
            localStorage.setItem('id', noUser.id)
            localStorage.setItem('email', noUser.email)
            return state;
        default:
            return state
    }
}

export default userReducer