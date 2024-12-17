import { Router } from 'express';
import { movementStatusRoutes } from './movementStatusRoutes';

const router = Router();

// Adicionar rotas de status de movimentação
router.use('/movement-status', movementStatusRoutes);

export { router };
