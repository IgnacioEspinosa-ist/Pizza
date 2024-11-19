export class StorageMock {
    set(key: string, value: any): Promise<void> {
      return Promise.resolve();
    }
  
    get<T>(key: string): Promise<T> {
      return Promise.resolve(null as any);
    }
  
    remove(key: string): Promise<void> {
      return Promise.resolve();
    }
  }
  