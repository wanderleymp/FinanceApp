import { PrismaClient } from '@prisma/client';
import { MovementStatus } from '../types/movement-status';

const prisma = new PrismaClient();

export class MovementStatusService {
  static async listMovementStatuses(
    statusName?: string, 
    page: number = 1, 
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const where = statusName 
      ? { status_name: { contains: statusName, mode: 'insensitive' } } 
      : {};

    const [total, movementStatuses] = await Promise.all([
      prisma.movement_statuses.count({ where }),
      prisma.movement_statuses.findMany({
        where,
        skip,
        take: limit,
        orderBy: { display_order: 'asc' }
      })
    ]);

    return {
      data: movementStatuses,
      meta: {
        total,
        per_page: limit,
        current_page: page,
        last_page: Math.ceil(total / limit)
      }
    };
  }

  static async getMovementStatusById(id: number) {
    return prisma.movement_statuses.findUnique({
      where: { movement_status_id: id }
    });
  }

  static async createMovementStatus(data: {
    status_name: string, 
    description?: string, 
    display_order?: number
  }) {
    return prisma.movement_statuses.create({
      data: {
        status_name: data.status_name,
        description: data.description,
        display_order: data.display_order,
        active: true
      }
    });
  }

  static async updateMovementStatus(
    id: number, 
    data: {
      status_name?: string, 
      description?: string, 
      display_order?: number
    }
  ) {
    return prisma.movement_statuses.update({
      where: { movement_status_id: id },
      data: {
        ...(data.status_name && { status_name: data.status_name }),
        ...(data.description && { description: data.description }),
        ...(data.display_order !== undefined && { display_order: data.display_order })
      }
    });
  }

  static async deleteMovementStatus(id: number) {
    return prisma.movement_statuses.delete({
      where: { movement_status_id: id }
    });
  }
}
