export const logIn = (id, email) => ({
    type: 'LOG_IN',
    payload: {
        id: id,
        email: email,
    }
})

export const logOut = () => ({ type: "LOG_OUT" })

export const authTrue = () => ({ type: "MARK_TRUE" })

export const authFalse = () => ({ type: "MARK_FALSE" })