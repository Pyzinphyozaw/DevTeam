import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  UpdateResult,
  ObjectLiteral,
} from 'typeorm';

export type UpdateDataKeys<T> = keyof T & keyof DeepPartial<T>;

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  statusCode?: number;
}

export class BaseService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Creates a new entity using the provided data and saves it to the database.
   * @param entity - The data to create the entity with.
   * @returns An ApiResponse with the created entity data on success or an error message on failure
   */
  async create(entity: DeepPartial<T>): Promise<ApiResponse<T>> {
    try {
      // Create an instance of the entity using the provided data
      const createdEntity = this.repository.create(entity);

      // Save the created entity to the database
      const savedEntity = await this.repository.save(createdEntity);

      return { statusCode: 201, status: 'success', data: savedEntity };
    } catch (error: unknown) {
      // Explicitly cast the unknown catch variable for driver error code handling
      const err = error as { code?: string; detail?: string; message?: string };

      if (err.code === '23505') {
        return { statusCode: 409, status: 'error', message: err.detail };
      } else {
        return {
          statusCode: 500,
          status: 'error',
          message: err.message || 'Internal server error',
        };
      }
    }
  }

  /**
   * Updates an entity using dynamic properties and returns the updated record.
   */
  async update(
    where: FindOptionsWhere<T>,
    updateData: DeepPartial<T>,
    validColumns: string[]
  ): Promise<ApiResponse<T>> {
    try {
      // Extract and filter valid properties from updateData safely
      const updateQuery: Record<string, any> = {};
      const keys = Object.keys(updateData as object) as UpdateDataKeys<T>[];

      for (const key of keys) {
        if (
          Object.prototype.hasOwnProperty.call(updateData, key) &&
          validColumns.includes(key as string)
        ) {
          updateQuery[key as string] = (updateData as Record<string, any>)[
            key as string
          ];
        }
      }

      // Execute the update query using QueryBuilder
      const result: UpdateResult = await this.repository
        .createQueryBuilder()
        .update()
        .set(updateQuery)
        .where(where as any)
        .returning('*') // Use the RETURNING clause to get the updated row(s)
        .execute();

      if (result.affected && result.affected > 0) {
        return { statusCode: 200, status: 'success', data: result.raw[0] };
      } else {
        return {
          statusCode: 400,
          status: 'error',
          data: undefined,
          message: 'Invalid Data or Record Not Found',
        };
      }
    } catch (error: unknown) {
      const err = error as { code?: string; detail?: string; message?: string };
      if (err.code === '23505') {
        return { statusCode: 409, status: 'error', message: err.detail };
      } else {
        return {
          statusCode: 500,
          status: 'error',
          message: err.message || 'Internal server error',
        };
      }
    }
  }
}
