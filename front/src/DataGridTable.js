import { Box, Typography } from '@material-ui/core';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

function DataGridTable(props) {
    return (<div>{
        props.list.length === 0 ?
            <Box
                textAlign='center'
            >
                <Typography>Nothing was found.</Typography>
            </Box>
            :
            <DataGrid
                rows={props.list}
                columns={props.columns}
                disableSelectionOnClick
                autoHeight
                /* autoPageSize */
            />
    } </div>);
}

export default DataGridTable;