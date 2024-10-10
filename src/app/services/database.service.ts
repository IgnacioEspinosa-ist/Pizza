
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
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

  // Creación de las variables que contendrán las tablas 


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
  
      // Realizar inserciones iniciales si corresponde
      // await this.database.executeSql(this.registroNoticia, []); // Aquí puedes agregar los insert correspondientes
  
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

  async insertProducto(producto: Producto): Promise<void> {
    const sql = `
      INSERT INTO producto (nombre, descripcion, precio, stock, foto, id_cat) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    try {
      await this.database.executeSql(sql, [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.foto,
        producto.id_cat
      ]);
      this.refreshProductoList();
      this.presentAlert('Éxito', 'Producto añadido correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo añadir el producto.');
    }
  }

  async insertPedido(pedido: Pedido): Promise<void> {
    const sql = `
      INSERT INTO pedido (f_pedido, id_user, id_direccion, total, id_user_resp, estatus) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    try {
      await this.database.executeSql(sql, [
        pedido.f_pedido,
        pedido.id_user,
        pedido.id_direccion,
        pedido.total,
        pedido.id_user_resp,
        pedido.estatus
      ]);
      this.refreshPedidoList();
      this.presentAlert('Éxito', 'Pedido añadido correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo añadir el pedido.');
    }
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
  }

  async updateProducto(producto: Producto): Promise<void> {
    const sql = `
      UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, foto = ?, id_cat = ? WHERE id_prod = ?`;
    try {
      await this.database.executeSql(sql, [
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.stock,
        producto.foto,
        producto.id_cat,
        producto.id_prod
      ]);
      this.refreshProductoList();
      this.presentAlert('Éxito', 'Producto actualizado correctamente.');
    } catch (error) {
      this.presentAlert('Error', 'No se pudo actualizar el producto.');
    }
  }

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

  private async refreshProductoList(): Promise<void> {
    const sql = "SELECT * FROM producto";
    try {
      const data = await this.database.executeSql(sql, []);
      this.productos = [];
      for (let i = 0; i < data.rows.length; i++) {
        this.productos.push(data.rows.item(i));
      }
    } catch (error) {
      console.error('Error al refrescar la lista de productos', error);
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
}
