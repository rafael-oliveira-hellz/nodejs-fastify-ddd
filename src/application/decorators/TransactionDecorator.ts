import { ITransactional } from "../../infrastructure/database/interfaces/ITransactional";

export function Transactional() {
  return function (
    _target: unknown,
    _propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const transactional: ITransactional = this as unknown as ITransactional;

      try {
        await transactional.beginTransaction();
        const result = await originalMethod.apply(this, args);
        await transactional.commit();
        return result;
      } catch (error) {
        await transactional.rollback();
        console.error("Transaction failed, rolled back:", error);
        throw error;
      }
    };
  };
}
