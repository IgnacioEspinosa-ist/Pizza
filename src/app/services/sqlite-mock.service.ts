export class SQLiteMock {
    create(options: any): Promise<any> {
      return Promise.resolve(); // Simula que el método `create` se ejecuta correctamente
    }
  
    openDatabase(options: any): Promise<any> {
      return Promise.resolve({
        transaction: (callback: Function) => {
          // Llama al callback de la transacción con un mock de 'executeSql'
          callback({
            executeSql: (query: string, params: any[], success: Function, error: Function) => {
              // Simula una ejecución exitosa de la consulta SQL
              if (query === 'SELECT * FROM pedidos WHERE estatus = ?') {
                success({
                  rows: { length: 2, item: () => ({ id: 1, nombre: 'Pedido 1' }) }
                });
              } else {
                // Llama al error si no se reconoce la consulta
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
  