import { Router } from 'express';
import { MovementStatusController } from '../controllers/MovementStatusController';
import { authMiddleware } from '../middlewares/authMiddleware';

const movementStatusRoutes = Router();

// Listar status de movimentação
movementStatusRoutes.get('/', 
  authMiddleware, 
  MovementStatusController.listMovementStatuses
);

// Obter status de movimentação por ID
movementStatusRoutes.get('/:id', 
  authMiddleware, 
  MovementStatusController.getMovementStatusById
);

// Criar novo status de movimentação
movementStatusRoutes.post('/', 
  authMiddleware, 
  MovementStatusController.createMovementStatus
);

// Atualizar status de movimentação
movementStatusRoutes.put('/:id', 
  authMiddleware, 
  MovementStatusController.updateMovementStatus
);

// Excluir status de movimentação
movementStatusRoutes.delete('/:id', 
  authMiddleware, 
  MovementStatusController.deleteMovementStatus
);

export { movementStatusRoutes };
