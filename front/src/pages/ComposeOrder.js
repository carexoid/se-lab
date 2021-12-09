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
import { Form } from '../components/useForm';
import $, { ajax } from 'jquery';
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
    spacingTop: {
        marginTop: theme.spacing(4),
    },
    button: {
        width: 300
    },
    box: {
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
    },
    note: {
        color: theme.palette.fadedtext.main,
        fontSize: 10,
    },
});


const emptyFlight = {
    airport_id: 0,
    airport_name: "",
    arrival_at: "",
    business_min_price: null,
    business_remaining: 0,
    city: "",
    departure_at: "",
    direction: 0,
    distance: 0,
    duration: 0,
    econom_min_price: null,
    econom_remaining: 0,
    id: 0
};

class ComposeOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showInfo: true,
            activeChoosePM: false,
            flight: emptyFlight,
            tickets: {
                econom: [],
                business: [],
            },
            body: {},
            order: {
                class: 'econom',
                quantity: 1,
                comment: "",
            },
        }

        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.composeParameters = this.composeParameters.bind(this);
        this.composeOrder = this.composeOrder.bind(this);
        this.composeBody = this.composeBody.bind(this);
        this.setActiveChoosePM = this.setActiveChoosePM.bind(this);
        this.setOrder = this.setOrder.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const url = window.location.href;
        const flightId = url.substring(url.lastIndexOf('/') + 1);

        $.ajax({
            type: 'GET',
            url: `/api/chief/flights/${flightId}`,
            headers: { 'Accept': 'application/json' },
            success: ((responseJSON) => {
                console.log(responseJSON)
                if (responseJSON.econom_remaining === 0) {
                    this.setOrder('class', 'business')
                }
                this.setState({ flight: responseJSON })

            }).bind(this)
        })

        $.ajax({
            type: 'GET',
            url: `/api/chief/flights/${flightId}/tickets`,
            headers: { 'Accept': 'application/json' },
            success: ((responseJSON) => {
                console.log('ticket list: ', responseJSON)
                this.setState({ tickets: responseJSON })
            }).bind(this)
        })
    }

    composeParameters(useBonuses) {
        const price = this.state.order.class === 'econom' ? this.state.flight.econom_min_price : this.business_min_price
        const str = '?flightId=' + this.state.flight.id +
            '?class=' + this.state.order.class +
            '?price=' + price +
            '?quantity=' + this.state.order.quantity +
            '?comment=' + this.state.order.comment +
            '?bonuses=' + useBonuses;

        return str;
    }

    composeOrder() {
        let body = {
            tickets: this.state.tickets[this.state.order.class].slice(
                0, this.state.order.quantity
            ).map((x => {
                return {
                    flight_id: this.state.flight.id,
                    seat: x.seat,
                }
            }).bind(this)),
            type: 'online',           
        }
        if (this.state.order.comment === '') { }
        else {
            body = {
                ...body,
                comment: this.state.order.comment
            }
        }
        console.log('body: ', body)

        this.setState({ body: body })
    }

    composeBody() {
        let body = {
            tickets: this.state.tickets[this.state.order.class].slice(
                0, this.state.order.quantity
            ).map((x => {
                return {
                    flight_id: this.state.flight.id,
                    seat: x.seat,
                }
            }).bind(this)),
            type: 'offline',
        }
        if (this.state.order.comment === '') { }
        else {
            body = {
                ...body,
                comment: this.state.order.comment
            }
        }
        console.log('body: ', body)

        return body
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
                    flightId={this.state.flight.id}
                />

                <div>
                    <Typography variant="h2" className={classes.spacingTop}>Order Tickets for Flight Kyiv — {this.state.flight.city}</Typography>
                    <Typography className={classes.note}>All required fields are marked with *</Typography>
                    <Box className={classes.spacing}>
                        <Typography display='inline'>Flight Information</Typography>
                        <IconButton
                            id='order-hide-info'
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
                                <DisplayFlight flight={this.state.flight} />
                            </Paper>
                        }

                        <OrderDetails
                            order={this.state.order}
                            setOrder={this.setOrder}
                            flight={this.state.flight}
                            composeOrder={this.composeOrder}
                        />

                        <Box textAlign='center' className={classes.spacing}>
                            <Button
                                id='order-choose-pm'
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
                            requestBody={this.state.body}
                            composeBody={this.composeBody}
                            order={this.state.order}
                            tickets={this.state.tickets}
                            flight={this.state.flight}
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