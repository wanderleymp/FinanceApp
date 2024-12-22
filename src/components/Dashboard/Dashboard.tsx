import React from 'react';
import { Typography, Container, Grid, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Resumo Financeiro</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Últimas Transações</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Gráficos</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
