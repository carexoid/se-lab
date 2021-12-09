import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import { Box, DialogContent, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { Button, Grid } from '@material-ui/core';
import { Link as RLink } from 'react-router-dom';
import netlifyIdentity from 'netlify-identity-widget';
import $ from "jquery";

const useStyles = makeStyles((theme) => ({
    box: {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 300
    },
}));

function PMDialog(props) {
    const user = netlifyIdentity.currentUser();
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Dialog
            open={true}
        >

            <Box textAlign='center' className={classes.box}>
                <DialogContent>
                    <DialogTitle>
                        {"Choose Payment Method"}
                    </DialogTitle>
                </DialogContent>
                <DialogActions
                    disableSpacing
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <form
                                action={`/api/chief/crutched_booking?body=${encodeURIComponent(JSON.stringify(props.requestBody))}&token=${user.token.access_token}`
                                }
                                method="POST"
                            >
                                <Button
                                    id='order-dialog-p-online'
                                    color="primary"
                                    size='large'
                                    variant="contained"
                                    className={classes.button}
                                    type='submit'
                                >
                                    Pay Online
                                </Button>
                            </form>
                        </Grid>

                        {props.bonuses &&
                            <Grid item xs={12}>
                                <Button
                                    id='order-dialog-p-bonuses'
                                    color="primary"
                                    size='large'
                                    variant="contained"
                                    className={classes.button}
                                    component={RLink} to={`/bonuses${props.composeParameters(true)}`}
                                >
                                    Pay Online with Bonuses
                                </Button>
                            </Grid>}

                       {/*  <Grid item xs={12}>
                            <Button
                                id='order-dialog-p-offline'
                                color="primary"
                                size='large'
                                variant="contained"
                                className={classes.button}
                                onClick={() => {
                                    $.ajax({
                                        type: 'POST',
                                        url: `/api/chief/crutched_booking?body=${encodeURIComponent(JSON.stringify(props.composeOrder(false)))}&token=${user.token.access_token}`,
                                        headers: {
                                            'Authorization': 'Bearer ' + user.token.access_token,
                                        },
                                        success: responseJSON => {
                                            window.location.href = `/payment/success?order_id=${responseJSON.order_id}`
                                        },
                                    })
                                }}
                            >
                                Pay Offline
                            </Button>
                        </Grid> */}

                        <Grid item xs={12}>
                            <Button
                                id='order-dialog-cancel'
                                color="secondary"
                                size='large'
                                variant="contained"
                                className={classes.button}
                                onClick={() => {
                                    props.setActiveChoosePM(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid>

                    </Grid>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default PMDialog;