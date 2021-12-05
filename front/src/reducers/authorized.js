const authorizedReducer = (
    state = localStorage.getItem('auth') === 'true' ? true : false, action
) => {
    if (action.type === "MARK_TRUE")
        localStorage.setItem('auth', true)
    if (action.type === "MARK_FALSE")
        localStorage.setItem('auth', false)
    return state;
}

export default authorizedReducer;