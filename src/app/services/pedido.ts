export class Item {
    id_prod!: number;
    nombre!: string;
    cantidad!: number;
    subtotal!: number;
  }
  
  export class Pedido {
    id_pedido!: number;
    f_pedido!: Date;
    id_user!: number;
    id_direccion!: number;
    total!: number;
    id_user_resp?: number;
    estatus!: string;
    descripcion!: string;
    productos: Item[] = []; 
  }
  

