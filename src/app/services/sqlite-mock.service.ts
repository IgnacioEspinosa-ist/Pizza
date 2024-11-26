export class SQLiteMock {
    create(options: any): Promise<any> {
      return Promise.resolve(); 
    }
  
    openDatabase(options: any): Promise<any> {
      return Promise.resolve({
        transaction: (callback: Function) => {
       
          callback({
            executeSql: (query: string, params: any[], success: Function, error: Function) => {
              
              if (query === 'SELECT * FROM pedidos WHERE estatus = ?') {
                success({
                  rows: { length: 2, item: () => ({ id: 1, nombre: 'Pedido 1' }) }
                });
              } else {
                
                error('Error al ejecutar SQL');
              }
            }
          });
        }
      });
    }
  
    executeSql(query: string, params: any[]): Promise<any> {
      return Promise.resolve({ rows: { length: 1, item: () => ({ id: 1 }) } });
    }
  
    delete(query: string, params: any[]): Promise<any> {
      return Promise.resolve({ rows: { length: 0 } });
    }
  
    insert(query: string, params: any[]): Promise<any> {
      return Promise.resolve({ rows: { length: 1, item: () => ({ id: 1 }) } });
    }
  }
  