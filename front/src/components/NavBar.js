import { ButtonGroup, Container, Box, Button } from '@material-ui/core';
import React from 'react';


function NavBar() {
    return (
        <Box
            bgcolor='primary.main'
            style={{
                top: 0,
                width: '100%',
                position: '-webkit - sticky', /* Required for Safari */
                position: 'sticky',
                zIndex: 1,
            }}           
        >
            <Container fixed
                style={{
                    padding: 0
                }}
            >
                <ButtonGroup size="large" variant="text" color='secondary'>
                    <Button>Browse Flights</Button>
                    <Button>Help</Button>
                    <Button>About Us</Button>
                </ButtonGroup>
            </Container>
        </Box>
     );
}

export default NavBar ;