export class SQLiteMock {
    // Mock del método openDatabase que se usa en tu servicio
    openDatabase(options: any): Promise<any> {
      return Promise.resolve({
        transaction: (callback: Function) => {
          // Llama al callback de la transacción con un mock de 'executeSql'
          callback({
            executeSql: (query: string, params: any[], success: Function, error: Function) => {
              // Simula una ejecución exitosa de la consulta SQL
              if (query === 'SELECT * FROM pedidos WHERE estatus = ?') {
                success({
                  rows: {
                    length: 2,
                    item: (index: number) => ({ id: index + 1, nombre: `Pedido ${index + 1}` })
                  }
                });
              } else {
                // Si no se reconoce la consulta, simula un error
                error('Error al ejecutar SQL');
              }
            }
          });
        }
      });
    }
  
    // Mock del método executeSql que se puede llamar directamente
    executeSql(query: string, params: any[]): Promise<any> {
      // Aquí puedes agregar diferentes casos de simulación según las consultas SQL
      if (query === 'SELECT * FROM pedidos WHERE estatus = ?') {
        return Promise.resolve({
          rows: {
            length: 2,
            item: (index: number) => ({ id: index + 1, nombre: `Pedido ${index + 1}` })
          }
        });
      } else {
        return Promise.reject('Error al ejecutar SQL');
      }
    }
  
    // Métodos adicionales para simular insert y delete si los necesitas en tus pruebas
    delete(query: string, params: any[]): Promise<any> {
      return Promise.resolve({ rows: { length: 0 } });
    }
  
    insert(query: string, params: any[]): Promise<any> {
      return Promise.resolve({ rows: { length: 1, item: () => ({ id: 1 }) } });
    }
  }
  