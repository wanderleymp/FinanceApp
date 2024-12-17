import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Dashboard = lazy(() => import('../components/Dashboard/Dashboard'));
const PersonsList = lazy(() => import('../components/Persons/PersonsList'));
const MovementStatusList = lazy(() => import('../components/MovementStatuses/MovementStatusList'));
const ListSales = lazy(() => import('../components/Sales/ListSales'));
const MovementsPage = lazy(() => import('../components/Movements/MovementsPage'));
const TestMovementsPage = lazy(() => import('../pages/TestMovementsPage'));

// Novas importações para Contratos
const ContractsList = lazy(() => import('../components/Contracts/ContractsList'));
const NewContract = lazy(() => import('../components/Contracts/NewContract'));
const ContractTypes = lazy(() => import('../components/Contracts/ContractTypes'));
const ContractStatuses = lazy(() => import('../components/Contracts/ContractStatuses'));

const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
    <CircularProgress />
  </Box>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/persons" element={<PersonsList />} />
        <Route path="/movement-statuses" element={<MovementStatusList />} />
        <Route path="/list-sales" element={<ListSales />} />
        <Route path="/movements" element={<TestMovementsPage />} />
        
        {/* Novas rotas de Contratos */}
        <Route path="/contracts" element={<ContractsList />} />
        <Route path="/contracts/new" element={<NewContract />} />
        <Route path="/contract-types" element={<ContractTypes />} />
        <Route path="/contract-statuses" element={<ContractStatuses />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
