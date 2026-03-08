export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginate<T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginatedResult<T> {
  const { page, limit } = options;
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}
