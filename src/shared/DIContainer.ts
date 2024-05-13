class DIContainer {
  private static instances = new Map<string, unknown>();

  static register<T>(name: string, instance: T): void {
    DIContainer.instances.set(name, instance);
  }

  static resolve<T>(name: string): T {
    const instance = DIContainer.instances.get(name);
    if (!instance) {
      throw new Error(`No instance found for ${name}`);
    }
    return instance as T;
  }
}

export default DIContainer;
