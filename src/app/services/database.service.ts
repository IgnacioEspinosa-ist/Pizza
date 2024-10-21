
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Roll } from './roll';
import { Usuario } from './usuario';
import { Comuna } from './comuna';
import { Direccion } from './direccion';
import { Auto } from './auto';
import { Categoria } from './categoria';
import { Producto } from './producto';
import { Pedido } from './pedido';
import { Detalle } from './detalle';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public database!: SQLiteObject;
  //listas

  public rolls: Roll[] = [];
  public usuarios: Usuario[] = [];
  public comunas: Comuna[] = [];
  public direcciones: Direccion[] = [];
  public autos: Auto[] = [];
  public categorias: Categoria[] = [];
  public productos: Producto[] = [];
  public pedidos: Pedido[] = [];
  public detalles: Detalle[] = [];

  // LOS INSERTS

  //Las Pizzas

  registroPizzaPepperoni: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Pizza Pepperoni', '', 12000, 10, 'assets/peperoni.webp');`;

  registroPizzaQueso: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Pizza de Queso', '', 8000, 10, 'assets/chees.webp');`;

  registroPizzaHawaiana: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Pizza Hawaiana', '', 10000, 10, 'assets/jawai.jfif');`;

  registroPizzaVegetariana: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Pizza Vegetariana', '', 8000, 10, 'assets/vegan.webp');`;

  registroPizzaJamonQueso: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Pizza Jamón-Queso', '', 8000, 10, 'assets/jam.png');`;

  registroChampizza: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Champizza', '', 12000, 10, 'assets/callam.png');`;

  registroPiboqueso: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Piboqueso', '', 15000, 10, 'assets/border.png');`;

  registroMasa: string = `
  INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto_PRODUCTO) 
  VALUES ('Masa', '', 1500, 10, 'assets/deep.png');`;

  //Los Usuarios


  registroUsuario: string = `INSERT INTO usuario (nombre,apellido,rut,correo,clave,telefono,id_roll) 
  VALUES ('Ignacio','Espinosa','21841456-0','ignacio@gmail.com','ñamñamñam','123456',1)`

  registroRepartidor1: string = `INSERT INTO usuario (nombre,apellido,rut,correo,clave,telefono,id_roll) 
  VALUES ('Pedro','Espinoza','217845965-0','pedro@gmail.com','miaumiaumiau','123456',2)`

  registroRepartidor2: string = `INSERT INTO usuario (nombre,apellido,rut,correo,clave,telefono,id_roll) 
  VALUES ('Javier','Soto','18789652-0','javier@gmail.com','enwarhammer','123456',2)`

  registroAdmin: string = `INSERT INTO usuario (nombre,apellido,rut,correo,clave,telefono,id_roll) 
  VALUES ('Benjamin','Leon','217856982-4','benja@gmail.com','adminrar','254152',3)`

  //



  //variable de tipo observable para ver el estado de la base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Tabla Roll
  tablaRoll: string = "CREATE TABLE IF NOT EXISTS roll (id_roll INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(50) NOT NULL);";

  // Tabla Usuario
  tablaUsuario: string = `CREATE TABLE IF NOT EXISTS usuario (
      id_user INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      rut VARCHAR(12) NOT NULL,
      correo VARCHAR(100) NOT NULL,
      clave VARCHAR(100) NOT NULL,
      telefono VARCHAR(15),
      id_roll INTEGER,
      foto_U BLOB,
      FOREIGN KEY(id_roll) REFERENCES roll(id_roll)
  );`;

  // Tabla Comuna
  tablaComuna: string = "CREATE TABLE IF NOT EXISTS comuna (id_comuna INTEGER PRIMARY KEY AUTOINCREMENT, nombre_comuna VARCHAR(100) NOT NULL);";

  // Tabla Direccion
  tablaDireccion: string = `CREATE TABLE IF NOT EXISTS direccion (
      id_direccion INTEGER PRIMARY KEY AUTOINCREMENT,
      id_comuna INTEGER NOT NULL,
      id_user INTEGER NOT NULL,
      descripcion TEXT NOT NULL,
      FOREIGN KEY(id_comuna) REFERENCES comuna(id_comuna),
      FOREIGN KEY(id_user) REFERENCES usuario(id_user)
  );`;

  // Tabla Categoria
  tablaCategoria: string = "CREATE TABLE IF NOT EXISTS categoria (id_cat INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(100) NOT NULL);";

  // Tabla Producto
  tablaProducto: string = `CREATE TABLE IF NOT EXISTS producto (
      id_prod INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL,
      foto_PRODUCTO BLOB,
      id_cat INTEGER,
      FOREIGN KEY(id_cat) REFERENCES categoria(id_cat)
  );`;

  // Tabla Pedido
  tablaPedido: string = `CREATE TABLE IF NOT EXISTS pedido (
      id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
      f_pedido DATE NOT NULL,
      id_user INTEGER NOT NULL,
      id_direccion INTEGER NOT NULL,
      total REAL NOT NULL,
      id_user_resp INTEGER,
      estatus VARCHAR(50) NOT NULL,
      FOREIGN KEY(id_user) REFERENCES usuario(id_user),
      FOREIGN KEY(id_direccion) REFERENCES direccion(id_direccion)
  );`;

  // Tabla Detalle
  tablaDetalle: string = `CREATE TABLE IF NOT EXISTS detalle (
      id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
      id_pedido INTEGER NOT NULL,
      id_prod INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY(id_pedido) REFERENCES pedido(id_pedido),
      FOREIGN KEY(id_prod) REFERENCES producto(id_prod)
  );`;

  // Tabla Auto
  tablaAuto: string = `CREATE TABLE IF NOT EXISTS auto (
      id_auto INTEGER PRIMARY KEY AUTOINCREMENT,
      placa VARCHAR(20) NOT NULL,
      modelo VARCHAR(100) NOT NULL,
      color VARCHAR(50) NOT NULL,
      id_user INTEGER NOT NULL,
      FOREIGN KEY(id_user) REFERENCES usuario(id_user)
  );`;


  //ACA SE TIENEN QUE PONER TODOS LOS INSERT INICIALES
  inserciones: string[] = [
    this.registroPizzaPepperoni,
    this.registroPizzaQueso,
    this.registroPizzaHawaiana,
    this.registroPizzaVegetariana,
    this.registroPizzaJamonQueso,
    this.registroChampizza,
    this.registroPiboqueso,
    this.registroMasa,
    this.registroUsuario,
    this.registroRepartidor1,
    this.registroRepartidor2,
    this.registroAdmin

  ];





  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.crearBD();
  }

  crearBD() {
    // Verificar la plataforma
    this.platform.ready().then(() => {
      // Crear la base de datos
      this.sqlite.create({
        name: 'deliveryza.db', // Cambié el nombre a 'deliveryza.db'
        location: 'default'
      }).then((bd: SQLiteObject) => {
        // Guardar mi conexión a la base de datos
        this.database = bd;
        // Llamar a la función de creación de tablas
        this.crearTablas();
        // Cambiar el observable del estado de la base de datos
        this.isDBReady.next(true);
      }).catch(e => {
        this.presentAlert('CrearBD()', 'Error: ' + JSON.stringify(e));
      });
    });
  }


  async crearTablas() {
    try {
      // Crear las tablas en el orden correcto
      await this.database.executeSql(this.tablaRoll, []);
      console.log("Tabla roll creada");

      await this.database.executeSql(this.tablaUsuario, []);
      console.log("Tabla usuario creada");

      await this.database.executeSql(this.tablaComuna, []);
      console.log("Tabla comuna creada");

      await this.database.executeSql(this.tablaDireccion, []);
      console.log("Tabla direccion creada");

      await this.database.executeSql(this.tablaCategoria, []);
      console.log("Tabla categoria creada");

      await this.database.executeSql(this.tablaProducto, []);
      console.log("Tabla producto creada");

      await this.database.executeSql(this.tablaPedido, []);
      console.log("Tabla pedido creada");

      await this.database.executeSql(this.tablaDetalle, []);
      console.log("Tabla detalle creada");

      await this.database.executeSql(this.tablaAuto, []);
      console.log("Tabla auto creada");

      for (const insert of this.inserciones) {
        await this.database.executeSql(insert, []);
        console.log("Producto insertado");
      }


    } catch (e) {
      this.presentAlert('CrearTabla()', 'Error: ' + JSON.stringify(e));
    }
  }

  // Método para mostrar alertas
  private async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  private productosList = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosList.asObservable();

  // Método para obtener todos los productos y emitir los resultados al BehaviorSubject
  fetchProductos() {
    this.database.executeSql('SELECT * FROM producto', []).then(res => {
      const productos: Producto[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        productos.push({
          id_prod: res.rows.item(i).id_prod,
          nombre: res.rows.item(i).nombre,

          precio: res.rows.item(i).precio,
          stock: res.rows.item(i).stock,
          foto: res.rows.item(i).foto_PRODUCTO,
          id_cat: res.rows.item(i).id_cat
        });
      }
      // Emitir los productos obtenidos
      this.productosList.next(productos);
    }).catch(e => {
      this.presentAlert('fetchProductos()', 'Error al obtener los productos: ' + JSON.stringify(e));
    });
  }

  async validarUsuario(username: string, password: string): Promise<any> {
    try {
      const query = 'SELECT * FROM usuario WHERE correo = ? AND clave = ?';
      const res = await this.database.executeSql(query, [username, password]);
      if (res.rows.length > 0) {
        // Si existe el usuario, devolver el primer resultado
        return res.rows.item(0);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error en la validación del usuario:', error);
      throw error;
    }
  }


  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const result = await this.database.executeSql(
        'SELECT * FROM usuario WHERE correo = ?',
        [email]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error buscando el correo', error);
      return false;
    }
  }


  getFotoUsuario(id_user: number): Observable<string | null> {
    return new Observable<string | null>((observer) => {
      this.database.executeSql('SELECT foto FROM usuario WHERE id_user = ?', [id_user])
        .then(res => {
          if (res.rows.length > 0) {
            observer.next(res.rows.item(0).foto); // Emitir la foto
          } else {
            observer.next(null); // Emitir null si no hay foto
          }
          observer.complete();
        })
        .catch(error => {
          console.error('Error al obtener la foto del usuario: ', error);
          observer.error(error); // Emitir el error
        });
    });
  }

  async updateUsuarioFoto(id_user: number, foto: string) {
    return new Promise<void>((resolve, reject) => {
      this.database.executeSql('UPDATE usuario SET foto = ? WHERE id_user = ?', [foto, id_user])
        .then(() => {
          resolve(); // Resuelve la promesa al completar
        })
        .catch((error) => {
          console.error('Error al actualizar la foto del usuario:', error);
          reject(error); // Rechaza la promesa en caso de error
        });
    });
  }


  getProductoById(id_prod: number) {
    return new Observable<Producto>((observer) => {
      this.database.executeSql('SELECT * FROM producto WHERE id_prod = ?', [id_prod])
        .then(res => {
          if (res.rows.length > 0) {
            const producto: Producto = {
              id_prod: res.rows.item(0).id_prod,
              nombre: res.rows.item(0).nombre,

              precio: res.rows.item(0).precio,
              stock: res.rows.item(0).stock,
              foto: res.rows.item(0).foto_PRODUCTO,
              id_cat: res.rows.item(0).id_cat
            };
            observer.next(producto);
          } else {
            observer.error('Producto no encontrado');
          }
          observer.complete();
        })
        .catch(error => {
          console.error('Error al obtener el producto:', error);
          observer.error(error);
        });
    });
  }

  getProductosById(productos: number[]) {
    let arregloProductos: Producto[] = []
    for (let i = 0; i < productos.length; i++) {
      this.database.executeSql('SELECT * FROM producto WHERE id_prod = ?', [productos[i]])
        .then(res => {
          if (res.rows.length > 0) {
            const producto: Producto = {
              id_prod: res.rows.item(0).id_prod,
              nombre: res.rows.item(0).nombre,

              precio: res.rows.item(0).precio,
              stock: res.rows.item(0).stock,
              foto: res.rows.item(0).foto_PRODUCTO,
              id_cat: res.rows.item(0).id_cat
            };
            arregloProductos.push(producto)


          }
        })
    }
    return arregloProductos;

  }

  //aqui

  buscarProductoPorId(id_prod: number): Promise<Producto | null> {
    return new Promise((resolve, reject) => {
      
      this.database.executeSql('SELECT * FROM producto WHERE id_prod = ?', [id_prod])
        .then(res => {
          if (res.rows.length > 0) {
            
            const producto: Producto = {
              id_prod: res.rows.item(0).id_prod,
              nombre: res.rows.item(0).nombre,
              precio: res.rows.item(0).precio,
              stock: res.rows.item(0).stock,
              foto: res.rows.item(0).foto_PRODUCTO,
              id_cat: res.rows.item(0).id_cat
            };
            resolve(producto);  
          } else {
            resolve(null); 
          }
        })
        .catch(error => {
          reject(error);  
        });
    });
  }
  

  




  addPedido(total: number, id_user: number, id_direccion: number) {
    return new Observable<number>((observer) => {
      const f_pedido = new Date().toISOString(); // Fecha del pedido
      const estatus = 'pendiente'; // Estado del pedido

      // Insertar el pedido en la tabla 'pedido'
      this.database.executeSql('INSERT INTO pedido (f_pedido, id_user, id_direccion, total, estatus) VALUES (?, ?, ?, ?, ?)',
        [f_pedido, id_user, id_direccion, total, estatus])
        .then(result => {
          const id_pedido = result.insertId; // Obtener el ID del pedido recién insertado
          observer.next(id_pedido); // Emitir el ID del pedido
          observer.complete();
        })
        .catch(error => {
          console.error('Error al agregar pedido:', error);
          observer.error(error);
        });
    });
  }

  addDetallePedido(id_pedido: number, carrito: Producto[]): Observable<void> {
    const sql = `INSERT INTO detalle (id_pedido, id_prod, cantidad, subtotal) VALUES (?, ?, ?, ?)`;

    return new Observable((observer) => {
      const queries = carrito.map(producto => {
        const subtotal = producto.precio * producto.stock; // Calcula el subtotal
        return this.database.executeSql(sql, [id_pedido, producto.id_prod, producto.stock, subtotal]);
      });

      Promise.all(queries)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }


  private pedidosPendientesSubject = new BehaviorSubject<Pedido[]>([]);
  public pedidosPendientes$ = this.pedidosPendientesSubject.asObservable();

  obtenerPedidosPendientes() {
    this.database.executeSql(`SELECT * FROM pedido WHERE estatus = 'pendiente'`, [])
      .then(res => {
        let pedidos: Pedido[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          pedidos.push({
            id_pedido: res.rows.item(i).id_pedido,
            f_pedido: res.rows.item(i).f_pedido,
            id_user: res.rows.item(i).id_user,
            id_direccion: res.rows.item(i).id_direccion,
            total: res.rows.item(i).total,
            id_user_resp: res.rows.item(i).id_user_resp,
            estatus: res.rows.item(i).estatus,

          });
        }
        this.pedidosPendientesSubject.next(pedidos); // Emitir los pedidos pendientes
      })
      .catch(error => {
        console.error('Error al obtener los pedidos pendientes:', error);
      });
  }

  // Método para marcar un pedido como entregado
  marcarPedidoComoEntregado(id_pedido: number): Observable<void> {
    return new Observable<void>((observer) => {
      this.database.executeSql(`UPDATE pedido SET estatus = 'entregado' WHERE id_pedido = ?`, [id_pedido])
        .then(() => {
          observer.next(); // Emitir el éxito
          observer.complete();
        })
        .catch(error => {
          console.error('Error al marcar el pedido como entregado:', error);
          observer.error(error); // Emitir el error
        });
    });
  }

  getProductosPorIds(ids: number[]): Observable<Producto[]> {
    return new Observable((observer) => {
      const placeholders = ids.map(() => '?').join(',');
      this.database.executeSql(`SELECT * FROM producto WHERE id_prod IN (${placeholders})`, ids)
        .then(res => {
          const productos: Producto[] = [];
          for (let i = 0; i < res.rows.length; i++) {
            productos.push(res.rows.item(i));
          }
          observer.next(productos); // Emitir los productos
          observer.complete();
        })
        .catch(error => {
          console.error('Error al obtener los productos por IDs: ', error);
          observer.error(error); // Emitir el error
        });
    });
  }

  getUserId(): Observable<number | null> {
    const sql = 'SELECT id_user FROM usuario WHERE ...'; // Lógica para seleccionar el usuario actual
    return from(this.database.executeSql(sql, []).then(res => {
      if (res.rows.length > 0) {
        return res.rows.item(0).id_user;
      }
      return null; // o lanzar un error si no se encuentra
    }));
  }

  // Método para obtener una dirección del usuario actual
  getDireccionByUserId(id_user: number): Observable<Direccion[]> {
    const sql = 'SELECT * FROM direccion WHERE id_user = ?';
    return from(this.database.executeSql(sql, [id_user]).then(res => {
      const direcciones: Direccion[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        direcciones.push(res.rows.item(i));
      }
      return direcciones;
    }));
  }

  updateProducto(producto: Producto): void {
    const sql = `
        UPDATE producto SET nombre = ?, precio = ?, stock = ?, foto = ?, id_cat = ? WHERE id_prod = ?`;

    this.database.executeSql(sql, [
      producto.nombre,
      producto.precio,
      producto.stock,
      producto.foto,
      producto.id_cat,
      producto.id_prod
    ])
      .then(() => {
        return this.refreshProductoList(); // Actualiza la lista de productos
      })
      .then(() => {
        this.presentAlert('Éxito', 'Producto actualizado correctamente.');
      })
      .catch((error) => {
        this.presentAlert('Error', 'No se pudo actualizar el producto.');
        console.error('Error al actualizar producto:', error);
      });
  }

  private refreshProductoList(): Promise<void> {
    const sql = "SELECT * FROM producto";
    return this.database.executeSql(sql, [])
      .then((data) => {
        this.productos = [];
        for (let i = 0; i < data.rows.length; i++) {
          this.productos.push(data.rows.item(i));
        }
      })
      .catch((error) => {
        console.error('Error al refrescar la lista de productos', error);
      });
  }

  insertProducto(producto: Producto): void {
    const sql = `
        INSERT INTO producto (nombre, precio, stock, foto, id_cat) 
        VALUES (?, ?, ?, ?, ?)`;

    this.database.executeSql(sql, [
      producto.nombre,
      producto.precio,
      producto.stock,
      producto.foto,
      producto.id_cat
    ])
      .then(() => {
        return this.refreshProductoList();  // Actualiza la lista de productos
      })
      .then(() => {
        this.presentAlert('Éxito', 'Producto añadido correctamente.');
      })
      .catch((error) => {
        this.presentAlert('Error', 'No se pudo añadir el producto.');
        console.error('Error al añadir producto:', error);
      });
  }

  async deleteProducto(id: number): Promise<void> {
    const sql = "DELETE FROM producto WHERE id_prod = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshProductoList();
      this.presentAlert('Éxito', 'Producto eliminado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar el producto.');
    }
  }

  fetchUsuarios(): Observable<Usuario[]> {
    return new Observable<Usuario[]>(observer => {
      this.database.executeSql('SELECT * FROM usuario', []).then(res => {
        const usuarios: Usuario[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          usuarios.push({
            id_user: res.rows.item(i).id_user,
            nombre: res.rows.item(i).nombre,
            apellido: res.rows.item(i).apellido,
            rut: res.rows.item(i).rut,
            correo: res.rows.item(i).correo,
            clave: res.rows.item(i).clave,
            telefono: res.rows.item(i).telefono,
            id_roll: res.rows.item(i).id_roll,
            foto: res.rows.item(i).foto_U
          });
        }
        observer.next(usuarios); // Emitir los usuarios obtenidos
        observer.complete(); // Completar el observable
      }).catch(e => {
        this.presentAlert('fetchUsuarios()', 'Error al obtener los usuarios: ' + JSON.stringify(e));
        observer.error(e); // Emitir el error
      });
    });
  }

  async insertUsuario(usuario: Usuario): Promise<void> {
    const sql = `
        INSERT INTO usuario (nombre, apellido, rut, correo, clave, telefono, id_roll, foto) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      await this.database.executeSql(sql, [
        usuario.nombre,
        usuario.apellido,
        usuario.rut,
        usuario.correo,
        usuario.clave,
        usuario.telefono,
        usuario.id_roll,
        usuario.foto
      ]);
      this.refreshUsuarioList();
      this.presentAlert('Éxito', 'Usuario añadido correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo añadir el usuario.');
    }
  }

  private async refreshUsuarioList(): Promise<void> {
    const sql = "SELECT * FROM usuario";
    try {
      const data = await this.database.executeSql(sql, []);
      this.usuarios = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.usuarios.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de usuarios', error);
    }
  }

  async deleteUsuario(id: number): Promise<void> {
    const sql = "DELETE FROM usuario WHERE id_user = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshUsuarioList();
      this.presentAlert('Éxito', 'Usuario eliminado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar el usuario.');
    }
  }

  async updateUsuario(usuario: Usuario): Promise<void> {
    const sql = `
      UPDATE usuario SET nombre = ?, apellido = ?, rut = ?, correo = ?, clave = ?, telefono = ?, id_roll = ?, foto = ? 
      WHERE id_user = ?`;
    try {
      await this.database.executeSql(sql, [
        usuario.nombre,
        usuario.apellido,
        usuario.rut,
        usuario.correo,
        usuario.clave,
        usuario.telefono,
        usuario.id_roll,
        usuario.foto,
        usuario.id_user
      ]);
      this.refreshUsuarioList();
      this.presentAlert('Éxito', 'Usuario actualizado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo actualizar el usuario.');
    }
  }

  updatePerfil(id_user: number, nombre: string, telefono: string): Observable<any> {
    const query = `UPDATE usuario SET nombre = ?, telefono = ? WHERE id_user = ?`;
    const params = [nombre, telefono, id_user];

    return from(this.database.executeSql(query, params));
  }

  updatePerfilU(
    id_user: number,
    nombre: string,
    apellido: string,
    telefono: string,
    rut: string
  ): Observable<any> {
    const query = `UPDATE usuario SET nombre = ?, apellido = ?, telefono = ?, rut = ? WHERE id_user = ?`;
    const params = [nombre, apellido, telefono, rut, id_user];

    return from(this.database.executeSql(query, params));
  }



  //para el admin-usuario

  addUsuario(user: Usuario): Observable<any> {
    return new Observable(observer => {
      const sql = `INSERT INTO usuario (nombre, apellido, rut, correo, clave) VALUES (?, ?, ?, ?, ?)`;
      const params = [user.nombre, user.apellido, user.rut, user.correo, user.clave];

      this.database.executeSql(sql, params)
        .then((res) => {
          observer.next(res);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }

  getUsuarioById(id_user: number): Observable<Usuario> {
    return new Observable((observer) => {
      this.database.executeSql(`SELECT * FROM usuario WHERE id_user = ?`, [id_user])
        .then((res) => {
          if (res.rows.length > 0) {
            const usuario: Usuario = res.rows.item(0);
            observer.next(usuario);
          } else {
            observer.error('Usuario no encontrado');
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

























  // Variables Observables para cada tabla

  // Roll
  private rollsSubject = new BehaviorSubject<Roll[]>([]);
  public rolls$: Observable<Roll[]> = this.rollsSubject.asObservable();

  // Usuario
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  public usuarios$: Observable<Usuario[]> = this.usuariosSubject.asObservable();

  // Comuna
  private comunasSubject = new BehaviorSubject<Comuna[]>([]);
  public comunas$: Observable<Comuna[]> = this.comunasSubject.asObservable();

  // Direccion
  private direccionesSubject = new BehaviorSubject<Direccion[]>([]);
  public direcciones$: Observable<Direccion[]> = this.direccionesSubject.asObservable();

  // Auto
  private autosSubject = new BehaviorSubject<Auto[]>([]);
  public autos$: Observable<Auto[]> = this.autosSubject.asObservable();

  // Categoria
  private categoriasSubject = new BehaviorSubject<Categoria[]>([]);
  public categorias$: Observable<Categoria[]> = this.categoriasSubject.asObservable();

  // Pedido
  private pedidosSubject = new BehaviorSubject<Pedido[]>([]);
  public pedidos$: Observable<Pedido[]> = this.pedidosSubject.asObservable();

  // Detalle
  private detallesSubject = new BehaviorSubject<Detalle[]>([]);
  public detalles$: Observable<Detalle[]> = this.detallesSubject.asObservable();


  /*
    
    // Método para obtener todos los rolls
    fetchRolls() {
      this.database.executeSql('SELECT * FROM roll', []).then(res => {
        const rolls: Roll[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          rolls.push({
            id_roll: res.rows.item(i).id_roll,
            nombre: res.rows.item(i).nombre,
          });
        }
        this.rollsSubject.next(rolls); // Emitir los rolls obtenidos
      }).catch(e => {
        this.presentAlert('fetchRolls()', 'Error al obtener los rolls: ' + JSON.stringify(e));
      });
    }
  
    // Método para obtener todos los usuarios
    
  
    // Método para obtener todas las comunas
    fetchComunas() {
      this.database.executeSql('SELECT * FROM comuna', []).then(res => {
        const comunas: Comuna[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          comunas.push({
            id_comuna: res.rows.item(i).id_comuna,
            nombre_comuna: res.rows.item(i).nombre_comuna
          });
        }
        this.comunasSubject.next(comunas); // Emitir las comunas obtenidas
      }).catch(e => {
        this.presentAlert('fetchComunas()', 'Error al obtener las comunas: ' + JSON.stringify(e));
      });
    }
  
    // Método para obtener todas las direcciones
    fetchDirecciones() {
      this.database.executeSql('SELECT * FROM direccion', []).then(res => {
        const direcciones: Direccion[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          direcciones.push({
            id_direccion: res.rows.item(i).id_direccion,
            id_comuna: res.rows.item(i).id_comuna,
            id_user: res.rows.item(i).id_user,
            descripcion: res.rows.item(i).descripcion
          });
        }
        this.direccionesSubject.next(direcciones); // Emitir las direcciones obtenidas
      }).catch(e => {
        this.presentAlert('fetchDirecciones()', 'Error al obtener las direcciones: ' + JSON.stringify(e));
      });
    }
  
    // Método para obtener todas las categorías
    fetchCategorias() {
      this.database.executeSql('SELECT * FROM categoria', []).then(res => {
        const categorias: Categoria[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          categorias.push({
            id_cat: res.rows.item(i).id_cat,
            nombre: res.rows.item(i).nombre
          });
        }
        this.categoriasSubject.next(categorias); // Emitir las categorías obtenidas
      }).catch(e => {
        this.presentAlert('fetchCategorias()', 'Error al obtener las categorías: ' + JSON.stringify(e));
      });
    }
  
    // Método para obtener todos los pedidos
    fetchPedidos() {
      this.database.executeSql('SELECT * FROM pedido', []).then(res => {
        const pedidos: Pedido[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          pedidos.push({
            id_pedido: res.rows.item(i).id_pedido,
            f_pedido: res.rows.item(i).f_pedido,
            id_user: res.rows.item(i).id_user,
            id_direccion: res.rows.item(i).id_direccion,
            total: res.rows.item(i).total,
            id_user_resp: res.rows.item(i).id_user_resp,
            estatus: res.rows.item(i).estatus
          });
        }
        this.pedidosSubject.next(pedidos); // Emitir los pedidos obtenidos
      }).catch(e => {
        this.presentAlert('fetchPedidos()', 'Error al obtener los pedidos: ' + JSON.stringify(e));
      });
    }
  
    // Método para obtener todos los detalles
    fetchDetalles() {
      this.database.executeSql('SELECT * FROM detalle', []).then(res => {
        const detalles: Detalle[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          detalles.push({
            id_detalle: res.rows.item(i).id_detalle,
            id_pedido: res.rows.item(i).id_pedido,
            id_prod: res.rows.item(i).id_prod,
            cantidad: res.rows.item(i).cantidad,
            subtotal: res.rows.item(i).subtotal
          });
        }
        this.detallesSubject.next(detalles); // Emitir los detalles obtenidos
      }).catch(e => {
        this.presentAlert('fetchDetalles()', 'Error al obtener los detalles: ' + JSON.stringify(e));
      });
    }
  
    // Método para obtener todos los autos
    fetchAutos() {
      this.database.executeSql('SELECT * FROM auto', []).then(res => {
        const autos: Auto[] = [];
        for (let i = 0; i < res.rows.length; i++) {
          autos.push({
            id_auto: res.rows.item(i).id_auto,
            placa: res.rows.item(i).placa,
            modelo: res.rows.item(i).modelo,
            color: res.rows.item(i).color,
            id_user: res.rows.item(i).id_user
          });
        }
        this.autosSubject.next(autos); // Emitir los autos obtenidos
      }).catch(e => {
        this.presentAlert('fetchAutos()', 'Error al obtener los autos: ' + JSON.stringify(e));
      });
    }  
  
    async insertRoll(roll: Roll): Promise<void> {
      const sql = "INSERT INTO roll (nombre) VALUES (?)";
      try {
        await this.database.executeSql(sql, [roll.nombre]);
        this.refreshRollList();
        this.presentAlert('Éxito', 'Roll añadido correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo añadir el roll.');
      }
    }
  
    
  
    async insertComuna(comuna: Comuna): Promise<void> {
      const sql = "INSERT INTO comuna (nombre_comuna) VALUES (?)";
      try {
        await this.database.executeSql(sql, [comuna.nombre_comuna]);
        this.refreshComunaList();
        this.presentAlert('Éxito', 'Comuna añadida correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo añadir la comuna.');
      }
    }
  
    async insertDireccion(direccion: Direccion): Promise<void> {
      const sql = `
        INSERT INTO direccion (id_comuna, id_user, descripcion) 
        VALUES (?, ?, ?)`;
      try {
        await this.database.executeSql(sql, [direccion.id_comuna, direccion.id_user, direccion.descripcion]);
        this.refreshDireccionList();
        this.presentAlert('Éxito', 'Dirección añadida correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo añadir la dirección.');
      }
    }
  
    async insertAuto(auto: Auto): Promise<void> {
      const sql = `
        INSERT INTO auto (placa, modelo, color, id_user) 
        VALUES (?, ?, ?)`;
      try {
        await this.database.executeSql(sql, [auto.placa, auto.modelo, auto.color, auto.id_user]);
        this.refreshAutoList();
        this.presentAlert('Éxito', 'Auto añadido correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo añadir el auto.');
      }
    }
  
    async insertCategoria(categoria: Categoria): Promise<void> {
      const sql = "INSERT INTO categoria (nombre) VALUES (?)";
      try {
        await this.database.executeSql(sql, [categoria.nombre]);
        this.refreshCategoriaList();
        this.presentAlert('Éxito', 'Categoría añadida correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo añadir la categoría.');
      }
    }
  
    
    
  
    insertPedido(total: number, id_user: number, id_direccion: number): Observable<number> {
      const sql = `INSERT INTO pedido (f_pedido, id_user, id_direccion, total, estatus) VALUES (?, ?, ?, ?, ?)`;
      const fecha = new Date().toISOString(); // Formato de fecha
    
      return new Observable((observer) => {
        this.database.executeSql(sql, [fecha, id_user, id_direccion, total, 'Pendiente'])
          .then((result) => {
            const id_pedido = result.insertId; // ID del nuevo pedido
            observer.next(id_pedido);
            observer.complete();
          })
          .catch((error) => {
            observer.error(error);
          });
      });
    }
  
    
  
    async insertDetalle(detalle: Detalle): Promise<void> {
      const sql = `
        INSERT INTO detalle (id_pedido, id_prod, cantidad, subtotal) 
        VALUES (?, ?, ?, ?)`;
      try {
        await this.database.executeSql(sql, [
          detalle.id_pedido,
          detalle.id_prod,
          detalle.cantidad,
          detalle.subtotal
        ]);
        this.refreshDetalleList();
        this.presentAlert('Éxito', 'Detalle añadido correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo añadir el detalle.');
      }
    }
  
    async updateRoll(roll: Roll): Promise<void> {
      const sql = "UPDATE roll SET nombre = ? WHERE id_roll = ?";
      try {
        await this.database.executeSql(sql, [roll.nombre, roll.id_roll]);
        this.refreshRollList();
        this.presentAlert('Éxito', 'Roll actualizado correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo actualizar el roll.');
      }
    }
  
   
  
    async updateComuna(comuna: Comuna): Promise<void> {
      const sql = "UPDATE comuna SET nombre_comuna = ? WHERE id_comuna = ?";
      try {
        await this.database.executeSql(sql, [comuna.nombre_comuna, comuna.id_comuna]);
        this.refreshComunaList();
        this.presentAlert('Éxito', 'Comuna actualizada correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo actualizar la comuna.');
      }
    }
  
    async updateDireccion(direccion: Direccion): Promise<void> {
      const sql = `
        UPDATE direccion SET id_comuna = ?, id_user = ?, descripcion = ? WHERE id_direccion = ?`;
      try {
        await this.database.executeSql(sql, [direccion.id_comuna, direccion.id_user, direccion.descripcion, direccion.id_direccion]);
        this.refreshDireccionList();
        this.presentAlert('Éxito', 'Dirección actualizada correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo actualizar la dirección.');
      }
    }
  
    async updateAuto(auto: Auto): Promise<void> {
      const sql = `
        UPDATE auto SET placa = ?, modelo = ?, color = ? WHERE id_auto = ?`;
      try {
        await this.database.executeSql(sql, [auto.placa, auto.modelo, auto.color, auto.id_auto]);
        this.refreshAutoList();
        this.presentAlert('Éxito', 'Auto actualizado correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo actualizar el auto.');
      }
    }
  
    async updateCategoria(categoria: Categoria): Promise<void> {
      const sql = "UPDATE categoria SET nombre = ? WHERE id_cat = ?";
      try {
        await this.database.executeSql(sql, [categoria.nombre, categoria.id_cat]);
        this.refreshCategoriaList();
        this.presentAlert('Éxito', 'Categoría actualizada correctamente.');
      } catch (error) {
        this.presentAlert('Error', 'No se pudo actualizar la categoría.');
      }
    } */


  /*

  async updatePedido(pedido: Pedido): Promise<void> {
    const sql = `
      UPDATE pedido SET f_pedido = ?, id_user = ?, id_direccion = ?, total = ?, id_user_resp = ?, estatus = ? WHERE id_pedido = ?`;
    try {
      await this.database.executeSql(sql, [
        pedido.f_pedido,
        pedido.id_user,
        pedido.id_direccion,
        pedido.total,
        pedido.id_user_resp,
        pedido.estatus,
        pedido.id_pedido
      ]);
      this.refreshPedidoList();
      this.presentAlert('Éxito', 'Pedido actualizado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo actualizar el pedido.');
    }
  }

  async updateDetalle(detalle: Detalle): Promise<void> {
    const sql = `
      UPDATE detalle SET id_pedido = ?, id_prod = ?, cantidad = ?, subtotal = ? WHERE id_detalle = ?`;
    try {
      await this.database.executeSql(sql, [
        detalle.id_pedido,
        detalle.id_prod,
        detalle.cantidad,
        detalle.subtotal,
        detalle.id_detalle
      ]);
      this.refreshDetalleList();
      this.presentAlert('Éxito', 'Detalle actualizado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo actualizar el detalle.');
    }
  }

  async deleteRoll(id: number): Promise<void> {
    const sql = "DELETE FROM roll WHERE id_roll = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshRollList();
      this.presentAlert('Éxito', 'Roll eliminado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar el roll.');
    }
  }

  

  async deleteComuna(id: number): Promise<void> {
    const sql = "DELETE FROM comuna WHERE id_comuna = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshComunaList();
      this.presentAlert('Éxito', 'Comuna eliminada correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar la comuna.');
    }
  }

  async deleteDireccion(id: number): Promise<void> {
    const sql = "DELETE FROM direccion WHERE id_direccion = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshDireccionList();
      this.presentAlert('Éxito', 'Dirección eliminada correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar la dirección.');
    }
  }

  async deleteAuto(id: number): Promise<void> {
    const sql = "DELETE FROM auto WHERE id_auto = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshAutoList();
      this.presentAlert('Éxito', 'Auto eliminado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar el auto.');
    }
  }

  async deleteCategoria(id: number): Promise<void> {
    const sql = "DELETE FROM categoria WHERE id_cat = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshCategoriaList();
      this.presentAlert('Éxito', 'Categoría eliminada correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar la categoría.');
    }
  }

  

  async deletePedido(id: number): Promise<void> {
    const sql = "DELETE FROM pedido WHERE id_pedido = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshPedidoList();
      this.presentAlert('Éxito', 'Pedido eliminado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar el pedido.');
    }
  }

  async deleteDetalle(id: number): Promise<void> {
    const sql = "DELETE FROM detalle WHERE id_detalle = ?";
    try {
      await this.database.executeSql(sql, [id]);
      this.refreshDetalleList();
      this.presentAlert('Éxito', 'Detalle eliminado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo eliminar el detalle.');
    }
  }

  // Métodos de refresco de listas
  private async refreshRollList(): Promise<void> {
    const sql = "SELECT * FROM roll";
    try {
      const data = await this.database.executeSql(sql, []);
      this.rolls = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.rolls.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de rolls', error);
    }
  }

  

  private async refreshComunaList(): Promise<void> {
    const sql = "SELECT * FROM comuna";
    try {
      const data = await this.database.executeSql(sql, []);
      this.comunas = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.comunas.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de comunas', error);
    }
  } 

  private async refreshDireccionList(): Promise<void> {
    const sql = "SELECT * FROM direccion";
    try {
      const data = await this.database.executeSql(sql, []);
      this.direcciones = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.direcciones.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de direcciones', error);
    }
  }

  private async refreshAutoList(): Promise<void> {
    const sql = "SELECT * FROM auto";
    try {
      const data = await this.database.executeSql(sql, []);
      this.autos = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.autos.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de autos', error);
    }
  }

  private async refreshCategoriaList(): Promise<void> {
    const sql = "SELECT * FROM categoria";
    try {
      const data = await this.database.executeSql(sql, []);
      this.categorias = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.categorias.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de categorías', error);
    }
  }

  

  private async refreshPedidoList(): Promise<void> {
    const sql = "SELECT * FROM pedido";
    try {
      const data = await this.database.executeSql(sql, []);
      this.pedidos = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.pedidos.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de pedidos', error);
    }
  }

  private async refreshDetalleList(): Promise<void> {
    const sql = "SELECT * FROM detalle";
    try {
      const data = await this.database.executeSql(sql, []);
      this.detalles = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.detalles.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de detalles', error);
    }
  }
}*/
}
