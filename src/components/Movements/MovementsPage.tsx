import React, { useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import MovementsList from './MovementsList';

const MovementsPage: React.FC = () => {
  useEffect(() => {
    console.log('MovementsPage mounted');
    return () => {
      console.log('MovementsPage unmounted');
    };
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Movimentos
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MovementsList />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MovementsPage;
