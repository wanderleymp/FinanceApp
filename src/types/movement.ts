export interface Movement {
  movement_id: number;
  movement_date: string;
  person_id: number;
  total_amount: string;
  license_id: number;
  created_at: string;
  discount: string;
  addition: string;
  total_items: string;
  description: string | null;
  movement_type_id: number;
  movement_status_id: number;
  is_template: boolean;
  person_name: string;
  movement_type_name: string;
  movement_status_name: string;
}

export interface MovementPagination {
  currentPage: number;
  pageSize: number;
  totalPages: number | null;
}

export interface MovementResponse {
  movements: Movement[];
  pagination: MovementPagination;
}

export interface GetMovementsParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  movementTypeId?: number;
  movementStatusId?: number;
}

export interface GetMovementsResponse {
  movements: Movement[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number | null;
  };
}
