export interface IDiContainer {
  register<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
}

class DIContainer implements IDiContainer {
  private instances = new Map<string, () => unknown>();

  register<T>(key: string, factory: () => T): void {
    this.instances.set(key, factory);
  }

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
