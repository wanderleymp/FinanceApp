import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { LoginForm } from '../components/Auth/LoginForm';
import { ProtectedRoute } from '../components/ProtectedRoute';

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
        <Route path="/login" element={<LoginForm />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/persons" 
          element={
            <ProtectedRoute>
              <PersonsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movement-statuses" 
          element={
            <ProtectedRoute>
              <MovementStatusList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/list-sales" 
          element={
            <ProtectedRoute>
              <ListSales />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movements" 
          element={
            <ProtectedRoute>
              <TestMovementsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Novas rotas de Contratos */}
        <Route 
          path="/contracts" 
          element={
            <ProtectedRoute>
              <ContractsList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contracts/new" 
          element={
            <ProtectedRoute>
              <NewContract />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contract-types" 
          element={
            <ProtectedRoute>
              <ContractTypes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/contract-statuses" 
          element={
            <ProtectedRoute>
              <ContractStatuses />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
