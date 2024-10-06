import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Roll, Usuario, Comuna, Direccion, Auto, Categoria, Producto, Pedido, Detalle } from '';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public database!: SQLiteObject;

  /// Creación de las variables que contendrán las tablas 

  tablaRoll: string = `
    CREATE TABLE IF NOT EXISTS roll (
      id_roll INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL
    );
  `;

  tablaUsuario: string = `
    CREATE TABLE IF NOT EXISTS usuario (
      id_user INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      apellido VARCHAR(100) NOT NULL,
      rut VARCHAR(12) NOT NULL,
      correo VARCHAR(100) NOT NULL,
      clave VARCHAR(100) NOT NULL,
      telefono VARCHAR(15),
      id_roll INTEGER,
      foto TEXT,
      FOREIGN KEY (id_roll) REFERENCES roll(id_roll) ON DELETE SET NULL
    );
  `;

  tablaComuna: string = `
    CREATE TABLE IF NOT EXISTS comuna (
      id_comuna INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_comuna VARCHAR(100) NOT NULL
    );
  `;

  tablaDireccion: string = `
    CREATE TABLE IF NOT EXISTS direccion (
      id_direccion INTEGER PRIMARY KEY AUTOINCREMENT,
      id_comuna INTEGER NOT NULL,
      id_user INTEGER NOT NULL,
      descripcion TEXT NOT NULL,
      FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE,
      FOREIGN KEY (id_comuna) REFERENCES comuna(id_comuna) ON DELETE SET NULL
    );
  `;

  tablaAuto: string = `
    CREATE TABLE IF NOT EXISTS auto (
      id_auto INTEGER PRIMARY KEY AUTOINCREMENT,
      placa VARCHAR(20) NOT NULL,
      modelo VARCHAR(100) NOT NULL,
      color VARCHAR(50) NOT NULL,
      id_user INTEGER NOT NULL,
      FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE
    );
  `;

  tablaCategoria: string = `
    CREATE TABLE IF NOT EXISTS categoria (
      id_cat INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL
    );
  `;

  tablaProducto: string = `
    CREATE TABLE IF NOT EXISTS producto (
      id_prod INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      precio DECIMAL(10, 2) NOT NULL,
      stock INTEGER NOT NULL,
      foto VARCHAR(255),
      id_cat INTEGER,
      FOREIGN KEY (id_cat) REFERENCES categoria(id_cat) ON DELETE SET NULL
    );
  `;

  tablaPedido: string = `
    CREATE TABLE IF NOT EXISTS pedido (
      id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
      f_pedido DATE NOT NULL,
      id_user INTEGER NOT NULL,
      id_direccion INTEGER NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      id_user_resp INTEGER,
      estatus VARCHAR(20) NOT NULL,
      FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE,
      FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion) ON DELETE CASCADE,
      FOREIGN KEY (id_user_resp) REFERENCES usuario(id_user) ON DELETE SET NULL
    );
  `;

  tablaDetalle: string = `
    CREATE TABLE IF NOT EXISTS detalle (
      id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
      id_pedido INTEGER NOT NULL,
      id_prod INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      subtotal DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
      FOREIGN KEY (id_prod) REFERENCES producto(id_prod) ON DELETE CASCADE
    );
  `;
  // Variables de tipo observable para manipular los registros de los SELECT
  private listaRollSubject = new BehaviorSubject<any[]>([]);
  private listaUsuarioSubject = new BehaviorSubject<any[]>([]);
  private listaComunaSubject = new BehaviorSubject<any[]>([]);
  private listaDireccionSubject = new BehaviorSubject<any[]>([]);
  private listaAutoSubject = new BehaviorSubject<any[]>([]);
  private listaCategoriaSubject = new BehaviorSubject<any[]>([]);
  private listaProductoSubject = new BehaviorSubject<any[]>([]);
  private listaPedidoSubject = new BehaviorSubject<any[]>([]);
  private listaDetalleSubject = new BehaviorSubject<any[]>([]);

  // Variable para el estado de la base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // Observables públicos
  listaRoll$: Observable<any[]> = this.listaRollSubject.asObservable();
  listaUsuario$: Observable<any[]> = this.listaUsuarioSubject.asObservable();
  listaComuna$: Observable<any[]> = this.listaComunaSubject.asObservable();
  listaDireccion$: Observable<any[]> = this.listaDireccionSubject.asObservable();
  listaAuto$: Observable<any[]> = this.listaAutoSubject.asObservable();
  listaCategoria$: Observable<any[]> = this.listaCategoriaSubject.asObservable();
  listaProducto$: Observable<any[]> = this.listaProductoSubject.asObservable();
  listaPedido$: Observable<any[]> = this.listaPedidoSubject.asObservable();
  listaDetalle$: Observable<any[]> = this.listaDetalleSubject.asObservable();
  dbState$: Observable<boolean> = this.isDBReady.asObservable();

  // Variables de inserción para cada tabla
  registroRoll: string = "INSERT OR IGNORE INTO roll (nombre) VALUES ('Admin');";

  registroUsuario: string = `
    INSERT OR IGNORE INTO usuario (nombre, apellido, rut, correo, clave, telefono, id_roll, foto) 
    VALUES ('Juan', 'Pérez', '12345678-9', 'juan.perez@example.com', 'password123', '987654321', 1, 'ruta/a/foto.jpg');
  `;

  registroComuna: string = "INSERT OR IGNORE INTO comuna (nombre_comuna) VALUES ('Santiago');";

  registroDireccion: string = `
    INSERT OR IGNORE INTO direccion (id_comuna, id_user, descripcion) 
    VALUES (1, 1, 'Calle Falsa 123');
  `;

  registroAuto: string = `
    INSERT OR IGNORE INTO auto (placa, modelo, color, id_user) 
    VALUES ('ABC123', 'Toyota', 'Rojo', 1);
  `;

  registroCategoria: string = "INSERT OR IGNORE INTO categoria (nombre) VALUES ('Electrónica');";

  registroProducto: string = `
    INSERT OR IGNORE INTO producto (nombre, descripcion, precio, stock, foto, id_cat) 
    VALUES ('Teléfono', 'Teléfono inteligente', 299.99, 10, 'ruta/a/foto.jpg', 1);
  `;

  registroPedido: string = `
    INSERT OR IGNORE INTO pedido (f_pedido, id_user, id_direccion, total, id_user_resp, estatus) 
    VALUES ('2024-10-01', 1, 1, 299.99, NULL, 'pendiente');
  `;

  registroDetalle: string = `
    INSERT OR IGNORE INTO detalle (id_pedido, id_prod, cantidad, subtotal) 
    VALUES (1, 1, 1, 299.99);
  `;

  constructor(private sqlite: SQLite) { }


  async insertRoll(roll: Roll): Promise<void> {
    const sql = "INSERT INTO roll (nombre) VALUES (?)";
    await this.database.executeSql(sql, [roll.nombre]);
    this.refreshRollList();
  }

  async insertUsuario(usuario: Usuario): Promise<void> {
    const sql = `
      INSERT INTO usuario (nombre, apellido, rut, correo, clave, telefono, id_roll, foto) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
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
  }

  async insertComuna(comuna: Comuna): Promise<void> {
    const sql = "INSERT INTO comuna (nombre_comuna) VALUES (?)";
    await this.database.executeSql(sql, [comuna.nombre_comuna]);
    this.refreshComunaList();
  }

  async insertDireccion(direccion: Direccion): Promise<void> {
    const sql = `
      INSERT INTO direccion (id_comuna, id_user, descripcion) 
      VALUES (?, ?, ?)`;
    await this.database.executeSql(sql, [direccion.id_comuna, direccion.id_user, direccion.descripcion]);
    this.refreshDireccionList();
  }

  async insertAuto(auto: Auto): Promise<void> {
    const sql = `
      INSERT INTO auto (placa, modelo, color, id_user) 
      VALUES (?, ?, ?, ?)`;
    await this.database.executeSql(sql, [auto.placa, auto.modelo, auto.color, auto.id_user]);
    this.refreshAutoList();
  }

  async insertCategoria(categoria: Categoria): Promise<void> {
    const sql = "INSERT INTO categoria (nombre) VALUES (?)";
    await this.database.executeSql(sql, [categoria.nombre]);
    this.refreshCategoriaList();
  }

  async insertProducto(producto: Producto): Promise<void> {
    const sql = `
      INSERT INTO producto (nombre, descripcion, precio, stock, foto, id_cat) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    await this.database.executeSql(sql, [
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.stock,
      producto.foto,
      producto.id_cat
    ]);
    this.refreshProductoList();
  }

  async insertPedido(pedido: Pedido): Promise<void> {
    const sql = `
      INSERT INTO pedido (f_pedido, id_user, id_direccion, total, id_user_resp, estatus) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    await this.database.executeSql(sql, [
      pedido.f_pedido,
      pedido.id_user,
      pedido.id_direccion,
      pedido.total,
      pedido.id_user_resp,
      pedido.estatus
    ]);
    this.refreshPedidoList();
  }

  async insertDetalle(detalle: Detalle): Promise<void> {
    const sql = `
      INSERT INTO detalle (id_pedido, id_prod, cantidad, subtotal) 
      VALUES (?, ?, ?, ?)`;
    await this.database.executeSql(sql, [
      detalle.id_pedido,
      detalle.id_prod,
      detalle.cantidad,
      detalle.subtotal
    ]);
    this.refreshDetalleList();
  }

  async updateRoll(roll: Roll): Promise<void> {
    const sql = "UPDATE roll SET nombre = ? WHERE id = ?";
    await this.database.executeSql(sql, [roll.nombre, roll.id]);
    this.refreshRollList();
  }

  async updateUsuario(usuario: Usuario): Promise<void> {
    const sql = `
      UPDATE usuario SET nombre = ?, apellido = ?, rut = ?, correo = ?, clave = ?, telefono = ?, id_roll = ?, foto = ? 
      WHERE id = ?`;
    await this.database.executeSql(sql, [
      usuario.nombre,
      usuario.apellido,
      usuario.rut,
      usuario.correo,
      usuario.clave,
      usuario.telefono,
      usuario.id_roll,
      usuario.foto,
      usuario.id
    ]);
    this.refreshUsuarioList();
  }

  async updateComuna(comuna: Comuna): Promise<void> {
    const sql = "UPDATE comuna SET nombre_comuna = ? WHERE id = ?";
    await this.database.executeSql(sql, [comuna.nombre_comuna, comuna.id]);
    this.refreshComunaList();
  }

  async updateDireccion(direccion: Direccion): Promise<void> {
    const sql = `
      UPDATE direccion SET id_comuna = ?, id_user = ?, descripcion = ? WHERE id = ?`;
    await this.database.executeSql(sql, [direccion.id_comuna, direccion.id_user, direccion.descripcion, direccion.id]);
    this.refreshDireccionList();
  }

  async updateAuto(auto: Auto): Promise<void> {
    const sql = `
      UPDATE auto SET placa = ?, modelo = ?, color = ? WHERE id = ?`;
    await this.database.executeSql(sql, [auto.placa, auto.modelo, auto.color, auto.id]);
    this.refreshAutoList();
  }

  async updateCategoria(categoria: Categoria): Promise<void> {
    const sql = "UPDATE categoria SET nombre = ? WHERE id = ?";
    await this.database.executeSql(sql, [categoria.nombre, categoria.id]);
    this.refreshCategoriaList();
  }

  async updateProducto(producto: Producto): Promise<void> {
    const sql = `
      UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, stock = ?, foto = ?, id_cat = ? WHERE id = ?`;
    await this.database.executeSql(sql, [
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.stock,
      producto.foto,
      producto.id_cat,
      producto.id
    ]);
    this.refreshProductoList();
  }

  async updatePedido(pedido: Pedido): Promise<void> {
    const sql = `
      UPDATE pedido SET f_pedido = ?, id_user = ?, id_direccion = ?, total = ?, id_user_resp = ?, estatus = ? WHERE id = ?`;
    await this.database.executeSql(sql, [
      pedido.f_pedido,
      pedido.id_user,
      pedido.id_direccion,
      pedido.total,
      pedido.id_user_resp,
      pedido.estatus,
      pedido.id
    ]);
    this.refreshPedidoList();
  }

  async updateDetalle(detalle: Detalle): Promise<void> {
    const sql = `
      UPDATE detalle SET id_pedido = ?, id_prod = ?, cantidad = ?, subtotal = ? WHERE id = ?`;
    await this.database.executeSql(sql, [
      detalle.id_pedido,
      detalle.id_prod,
      detalle.cantidad,
      detalle.subtotal,
      detalle.id
    ]);
    this.refreshDetalleList();
  }

  async deleteRoll(id: number): Promise<void> {
    const sql = "DELETE FROM roll WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshRollList();
  }

  async deleteUsuario(id: number): Promise<void> {
    const sql = "DELETE FROM usuario WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshUsuarioList();
  }

  async deleteComuna(id: number): Promise<void> {
    const sql = "DELETE FROM comuna WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshComunaList();
  }

  async deleteDireccion(id: number): Promise<void> {
    const sql = "DELETE FROM direccion WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshDireccionList();
  }

  async deleteAuto(id: number): Promise<void> {
    const sql = "DELETE FROM auto WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshAutoList();
  }

  async deleteCategoria(id: number): Promise<void> {
    const sql = "DELETE FROM categoria WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshCategoriaList();
  }

  async deleteProducto(id: number): Promise<void> {
    const sql = "DELETE FROM producto WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshProductoList();
  }

  async deletePedido(id: number): Promise<void> {
    const sql = "DELETE FROM pedido WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshPedidoList();
  }

  async deleteDetalle(id: number): Promise<void> {
    const sql = "DELETE FROM detalle WHERE id = ?";
    await this.database.executeSql(sql, [id]);
    this.refreshDetalleList();
  }

  private async refreshRollList() {
    const data = await this.database.executeSql("SELECT * FROM roll", []);
    const rolls: Roll[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      rolls.push(data.rows.item(i));
    }
    this.listaRollSubject.next(rolls);
  }

  private async refreshUsuarioList() {
    const data = await this.database.executeSql("SELECT * FROM usuario", []);
    const usuarios: Usuario[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      usuarios.push(data.rows.item(i));
    }
    this.listaUsuarioSubject.next(usuarios);
  }

  private async refreshComunaList() {
    const data = await this.database.executeSql("SELECT * FROM comuna", []);
    const comunas: Comuna[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      comunas.push(data.rows.item(i));
    }
    this.listaComunaSubject.next(comunas);
  }

  private async refreshDireccionList() {
    const data = await this.database.executeSql("SELECT * FROM direccion", []);
    const direcciones: Direccion[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      direcciones.push(data.rows.item(i));
    }
    this.listaDireccionSubject.next(direcciones);
  }

  private async refreshAutoList() {
    const data = await this.database.executeSql("SELECT * FROM auto", []);
    const autos: Auto[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      autos.push(data.rows.item(i));
    }
    this.listaAutoSubject.next(autos);
  }

  private async refreshCategoriaList() {
    const data = await this.database.executeSql("SELECT * FROM categoria", []);
    const categorias: Categoria[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      categorias.push(data.rows.item(i));
    }
    this.listaCategoriaSubject.next(categorias);
  }

  private async refreshProductoList() {
    const data = await this.database.executeSql("SELECT * FROM producto", []);
    const productos: Producto[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      productos.push(data.rows.item(i));
    }
    this.listaProductoSubject.next(productos);
  }

  private async refreshPedidoList() {
    const data = await this.database.executeSql("SELECT * FROM pedido", []);
    const pedidos: Pedido[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      pedidos.push(data.rows.item(i));
    }
    this.listaPedidoSubject.next(pedidos);
  }

  private async refreshDetalleList() {
    const data = await this.database.executeSql("SELECT * FROM detalle", []);
    const detalles: Detalle[] = [];
    for (let i = 0; i < data.rows.length; i++) {
      detalles.push(data.rows.item(i));
    }
    this.listaDetalleSubject.next(detalles);
  }
