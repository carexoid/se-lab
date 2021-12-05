import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Paper, Typography, IconButton, Button, DialogActions } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import DisplayFlight from '../components/DisplayFlight';
import MyBreadcrumbs from '../components/MyBreadcrumbs';
import { Box } from '@mui/material';
import OrderDetails from '../components/OrderDetails';
import PMDialog from '../components/PMDialog';
import BonusCheckout from '../components/BonusCheckout';
import Checkout from './Checkout';
import { Form } from '../components/useForm';


const styles = theme => ({
    paper: {
        verticalAlign: 'middle',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        '& > *': {
            //margin: theme.spacing(6),
            width: '100%',
        },
        padding: theme.spacing(2),
        backgroundColor: theme.palette.papers.main,
    },
    spacing: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(3),
    },
    button: {
        width: 300
    },
    box: {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


const flight = {
    id: 'KPNL145',
    destination: 'London',
    business_remaining: 3,
    econom_remaining: 4,
    price: 100,
};

class ComposeOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showInfo: true,
            activeChoosePM: false,
            flight: flight,
            order: {
                class: 'econom',
                quantity: 1,
                comment: "",
            },
        }

        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.composeParameters = this.composeParameters.bind(this);
        this.setActiveChoosePM = this.setActiveChoosePM.bind(this);
        this.setOrder = this.setOrder.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const url = window.location.href;
        const flightId = url.substring(url.lastIndexOf('/') + 1);

        //TODO fetch info about flight
    }

    composeParameters(useBonuses) {
        const str = '?flightid='+ this.state.flight.id +
            '?class=' + this.state.order.class +
            '?price=' + this.state.flight.price +
            '?quantity=' + this.state.order.quantity +
            '?comment=' + this.state.order.comment +
            '?bonuses=' + useBonuses;
        
        return str;
    }

    setActiveChoosePM(value) {
        this.setState({
            activeChoosePM: value
        })
    }

    setOrder(name, value) {
        this.setState({
            order: {
                ...this.state.order,
                [name]: value,
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        console.log(e)
        console.log("details submited")
        this.setActiveChoosePM(true)
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div>
                <MyBreadcrumbs
                    activeDetails={true}
                    flightId={flight.id}
                />

                <div>
                    <Typography variant="h2" className={classes.spacing}>Title about Flight</Typography>
                    <Box className={classes.spacing}>
                        <Typography display='inline'>Flight Information</Typography>
                        <IconButton
                            color="primary"
                            aria-label="show filters"
                            size="small"
                            onClick={() => this.setState({ showInfo: !this.state.showInfo })}
                            display='inline'
                        >
                            {this.state.showInfo ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </IconButton>
                    </Box>

                    <Form onSubmit={this.handleSubmit}>
                        {!this.state.showInfo ? null :
                            <Paper
                                className={classes.paper}
                            >
                                <DisplayFlight flight={flight} />
                            </Paper>
                        }

                        <OrderDetails
                            order={this.state.order}
                            setOrder={this.setOrder}
                            flight={flight}
                        />

                        <Box textAlign='center' className={classes.spacing}>
                            <Button
                                color="primary"
                                size='large'
                                variant="contained"
                                type='sumbit'
                            >
                                Choose Payment Method
                            </Button>
                        </Box>
                    </Form>

                    {!this.state.activeChoosePM ? null :
                        <PMDialog
                            setActiveChoosePM={this.setActiveChoosePM}
                            composeParameters={this.composeParameters}
                        />
                    }
                </div>

            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ComposeOrder);