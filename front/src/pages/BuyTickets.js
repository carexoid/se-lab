import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import { Paper, Typography, IconButton, Button } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import DisplayFlight from '../components/DisplayFlight';
import MyBreadcrumbs from '../components/MyBreadcrumbs';
import { Box } from '@mui/material';

const styles = theme => ({
    paper: {
        verticalAlign: 'middle',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
        '& > *': {
            //margin: theme.spacing(6),
            width: '100%',
        },
        padding: theme.spacing(2),
        backgroundColor: theme.palette.papers.main,
    },
    spacing: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
});


const flight = {
    id: 'KPNL145',
    destination: 'London',
    business_remaining: 1,
    econom_remaining: 1,
};

class BuyTickets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: true,
            activeDetails: true,
            activeChoosePM: false,
            activeCheckout: false,
            order: {
                flight: flight,
                class: 'economy',
                quantity: 1,
                comment: "",
            },
        }
        
        this.render = this.render.bind(this);
        this.setActiveDetails = this.setActiveDetails.bind(this);
        this.setActiveChoosePM = this.setActiveChoosePM.bind(this);
        this.setActiveCheckout = this.setActiveCheckout.bind(this);
        this.setOrder = this.setOrder.bind(this);
    }

    setActiveDetails(value) {
        this.setState({
            activeDetails: value
        })
    }

    setActiveChoosePM(value) {
        this.setState({
            activeChoosePM: value
        })
    }

    setActiveCheckout(value) {
        this.setState({
            activeCheckout: value
        })
    }

    setOrder(name, value) {
        this.setState({
            order: {
                ...this.state.order,
                [name] : value,
            }
        })
    }

    render() {
        const { classes } = this.props;
        return (<div>
            <MyBreadcrumbs
                activeViewFlight={false}
                activeDetails={this.state.activeDetails}
                setActiveDetails={this.setActiveDetails}
                activeChoosePM={this.state.activeChoosePM}
                setActiveChoosePM={this.setActiveChoosePM}
                activeCheckout={this.state.activeCheckout}
                setActiveCheckout={this.setActiveCheckout}
            />

            {!this.state.activeDetails ? null :
                <div>
                    <div>
                        <Typography display='inline'>Flight Information</Typography>
                        <IconButton
                            color="primary"
                            aria-label="show filters"
                            size="small"
                            onClick={() => this.setState({showInfo: !this.state.showInfo})}
                            display='inline'
                        >
                            {this.state.showInfo ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                        </IconButton>
                    </div>
                    
                    {!this.state.showInfo ? null :
                        <Paper
                            className={classes.paper}
                        >
                            <DisplayFlight flight={flight}/>
                        </Paper>
                    }
                    
                    <Box textAlign='center' className={classes.spacing}>
                        <Button
                            color="primary"
                            size='large'
                            variant="contained"
                            
                            onClick={() => {
                                this.setActiveDetails(false)
                                this.setActiveChoosePM(true)
                            }}
                        >
                            Choose Payment Method
                        </Button>
                    </Box>
                </div>
               
            }

            {!this.state.activeChoosePM ? null :
                <Typography>Choosing Payment Method!</Typography>
            }
        </div> );
    }
}
 
export default withStyles(styles, { withTheme: true })(BuyTickets);