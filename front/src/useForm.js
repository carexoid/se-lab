import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core";

export function useForm(modelObject) {

    const [values, setValues] = useState(modelObject);

    const handleInputChange = (e, name) => {
        setValues({
            ...values,
            [name]: e.target.value
        })

        console.log(values)
    }

    const resetForm = () => {
        setValues(modelObject);
    }

    return {
        values,
        setValues,
        handleInputChange,
        resetForm
    }
}

const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '100%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form(props) {

    const classes = useStyles();
    const { children, onSubmit, ...other } = props;
    return (
        <form 
            autoComplete="off"
            onSubmit={onSubmit}
            {...other}>
            {children}
        </form>
    )
}