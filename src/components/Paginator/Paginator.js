import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Paginator = (props) => {
    const { totalPages, setPage } = props;
    return (
        <Stack spacing={2}>
            <Pagination
                count={totalPages}
                color="primary"
                style={{ display: 'flex', justifyContent: 'center' }}
                onChange={(event, value) => setPage(value - 1)}
            />
        </Stack>
    );
}
export default Paginator;