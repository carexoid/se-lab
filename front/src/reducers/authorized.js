const authorizedReducer = (
    state = false, action
) => {
    if (action.type === 'SET')
        return action.payload;
    return state;
}

export default authorizedReducer;