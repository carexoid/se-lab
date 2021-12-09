export const logIn = (id, email) => ({
    type: 'LOG_IN',
    payload: {
        id: id,
        email: email,
    }
})

export const logOut = () => ({ type: "LOG_OUT" })

export const setAuth = (value) => ({ type: "SET", payload: value })