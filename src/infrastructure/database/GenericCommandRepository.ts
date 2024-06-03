import { ICommandRepository } from './interfaces/ICommandRepository';
import { ITransactional } from './interfaces/ITransactional';

export class GenericCommandRepository<T>
  implements ICommandRepository<T>, ITransactional
{
  private dbConnection: ITransactional & ICommandRepository<T>;
  private _isConnected: boolean = false;

  /**
   * Constructor for GenericCommandRepository class.
   *
   * @param {ITransactional & ICommandRepository<T>} dbConnection - The database connection for the repository.
   */
  constructor(
    dbConnection: ITransactional & ICommandRepository<T>,
    private tableOrCollectionName: string,
  ) {
    this.dbConnection = dbConnection;
  }
  disconnect(): Promise<void> {
    return this.dbConnection.disconnect();
  }

  /**
   * Retrieves the database connection.
   *
   * @return {ITransactional} The database connection.
   */
  public getDbConnection(): ITransactional {
    return this.dbConnection;
  }

  /**
   * Check if the connection is established.
   *
   * @return {boolean} the connection status
   */
  isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * A description of the entire function.
   * @param {Partial<T>} entity - description of parameter
   * @return {Promise<T>} description of return value
   */
  async create(_: string, entity: Partial<T>): Promise<T> {
    return await this.dbConnection.create(this.tableOrCollectionName, entity);
  }

  /**
   * A description of the entire function.
   * @param {string | number} id - description of parameter
   * @param {Partial<T>} entity - description of parameter
   * @return {Promise<void>} description of return value
   */
  async update(
    _: string,
    id: string | number,
    entity: Partial<T>,
  ): Promise<void> {
    await this.dbConnection.update(this.tableOrCollectionName, id, entity);
  }

  /**
   * A description of the entire function.
   *
   * @param {string | number} id - description of parameter
   * @return {Promise<void>} description of return value
   */
  async delete(_: string, id: string | number): Promise<void> {
    await this.dbConnection.delete(this.tableOrCollectionName, id);
  }

  /**
   * A description of the entire function.
   *
   * @return {Promise<void>} description of return value
   */
  async beginTransaction(): Promise<void> {
    await this.dbConnection.beginTransaction();
  }

  /**
   * A description of the entire function.
   *
   * @return {Promise<void>} description of return value
   */
  async commit(): Promise<void> {
    await this.dbConnection.commit();
  }

  /**
   * A description of the entire function.
   *
   * @return {Promise<void>} description of return value
   */
  async rollback(): Promise<void> {
    await this.dbConnection.rollback();
  }
}
