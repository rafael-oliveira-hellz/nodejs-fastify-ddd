export interface IDiContainer {
  register<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
}

class DIContainer implements IDiContainer {
  private instances = new Map<string, () => unknown>();

  /**
   * Register a factory function with a key in the container.
   *
   * @param {string} key - The key for the factory function.
   * @param {() => T} factory - The factory function to be registered.
   */
  register<T>(key: string, factory: () => T): void {
    this.instances.set(key, factory);
  }

  /**
   * Resolves the value associated with the key from the container.
   *
   * @param {string} key - The key to resolve the value.
   * @return {T} The resolved value.
   */
  resolve<T>(key: string): T {
    const factory = this.instances.get(key);
    if (!factory) {
      throw new Error(`No factory found for ${key}`);
    }
    return (factory as () => T)();
  }
}

const diContainer = new DIContainer();
export default diContainer;
