import { GenericCommandRepository } from '../../infrastructure/database/GenericCommandRepository';
import { ITransactional } from '../../infrastructure/database/interfaces/ITransactional';
import { ICommandHandler } from '../commands/contracts/ICommandHandler';

/**
 * Executes a transactional operation based on the provided original method and database connection.
 */
export function Transactional<TCommand, TResult>() {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    /**
     * Executes a transactional operation based on the provided original method and database connection.
     *
     * @param {unknown[]} args - The arguments passed to the function.
     */
    descriptor.value = async function (...args: unknown[]) {
      const transactional = this as ICommandHandler<TCommand, TResult>;
      const repository =
        transactional.repository as GenericCommandRepository<TResult>;
      const dbConnection: ITransactional = repository.getDbConnection();
      try {
        await dbConnection.beginTransaction();
        const result = await originalMethod.apply(this, args);
        await dbConnection.commit();
        return result;
      } catch (error) {
        await dbConnection.rollback();
        console.error('Transaction failed, rolled back:', error);
        throw error;
      } finally {
        await dbConnection.disconnect();
      }
    };
  };
}
