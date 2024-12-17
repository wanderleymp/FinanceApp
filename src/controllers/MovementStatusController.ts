import { Request, Response } from 'express';
import { MovementStatusService } from '../services/MovementStatusService';

export class MovementStatusController {
  static async listMovementStatuses(req: Request, res: Response) {
    try {
      const { status_name, page = 1, limit = 10 } = req.query;
      
      const result = await MovementStatusService.listMovementStatuses(
        String(status_name || ''), 
        Number(page), 
        Number(limit)
      );
      
      res.json(result);
    } catch (error) {
      console.error('Erro ao listar status de movimentação:', error);
      res.status(500).json({ 
        message: 'Erro ao listar status de movimentação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async getMovementStatusById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const movementStatus = await MovementStatusService.getMovementStatusById(Number(id));
      
      if (!movementStatus) {
        return res.status(404).json({ message: 'Status de movimentação não encontrado' });
      }
      
      res.json(movementStatus);
    } catch (error) {
      console.error('Erro ao buscar status de movimentação:', error);
      res.status(500).json({ 
        message: 'Erro ao buscar status de movimentação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async createMovementStatus(req: Request, res: Response) {
    try {
      const { status_name, description, display_order } = req.body;
      
      if (!status_name) {
        return res.status(400).json({ message: 'Nome do status é obrigatório' });
      }
      
      const newMovementStatus = await MovementStatusService.createMovementStatus({
        status_name,
        description,
        display_order
      });
      
      res.status(201).json(newMovementStatus);
    } catch (error) {
      console.error('Erro ao criar status de movimentação:', error);
      res.status(500).json({ 
        message: 'Erro ao criar status de movimentação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async updateMovementStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status_name, description, display_order } = req.body;
      
      const updatedMovementStatus = await MovementStatusService.updateMovementStatus(
        Number(id), 
        { status_name, description, display_order }
      );
      
      res.json(updatedMovementStatus);
    } catch (error) {
      console.error('Erro ao atualizar status de movimentação:', error);
      res.status(500).json({ 
        message: 'Erro ao atualizar status de movimentação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  static async deleteMovementStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await MovementStatusService.deleteMovementStatus(Number(id));
      
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir status de movimentação:', error);
      res.status(500).json({ 
        message: 'Erro ao excluir status de movimentação',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}
