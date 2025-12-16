export interface PaginationParams {
  page: number
  limit?: number
  filters?: Record<string, any>
}

export interface PaginatedResponse<T> {
  items: T[]
  count: number
  maxPage: number
}

export interface DynamoDBPaginationParams {
  page?: number
  limit?: number
  indexName?: string
  filters?: Record<string, any>
  projectionExpression?: string
  lastEvaluatedKey?: Record<string, any>
}

export interface DynamoDBPaginatedResponse<T> {
  items: T[]
  count: number
  lastEvaluatedKey?: Record<string, any>
}
