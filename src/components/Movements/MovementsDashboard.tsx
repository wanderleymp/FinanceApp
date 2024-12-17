import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader 
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency } from '../../utils/formatters';

const MovementsDashboard: React.FC = () => {
  // Dados mock - substituir por chamadas de API reais
  const dashboardData = {
    totalSales: 15000.00,
    totalPurchases: 10000.00,
    pendingMovements: 25,
    confirmedMovements: 50
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color 
  }: { 
    title: string, 
    value: number | string, 
    icon: React.ReactNode, 
    color: string 
  }) => (
    <Card>
      <CardHeader
        avatar={React.cloneElement(icon as React.ReactElement, { 
          sx: { color: color } 
        })}
        title={title}
      />
      <CardContent>
        <Typography variant="h5" color={color}>
          {typeof value === 'number' ? formatCurrency(value) : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Movimentos Geral
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Total de Vendas" 
            value={dashboardData.totalSales} 
            icon={<TrendingUpIcon />} 
            color="success.main" 
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Total de Compras" 
            value={dashboardData.totalPurchases} 
            icon={<TrendingDownIcon />} 
            color="error.main" 
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Movimentos Pendentes" 
            value={dashboardData.pendingMovements} 
            icon={<ReceiptIcon />} 
            color="warning.main" 
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatCard 
            title="Movimentos Confirmados" 
            value={dashboardData.confirmedMovements} 
            icon={<ReceiptIcon />} 
            color="success.main" 
          />
        </Grid>
      </Grid>

      {/* Adicionar mais seções conforme necessário */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ações Rápidas
        </Typography>
        {/* Adicionar botões de ação rápida */}
      </Box>
    </Box>
  );
};

export default MovementsDashboard;
