import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    
  },
  {
    path: 'otc',
    loadChildren: () => import('./pages/otc/otc.module').then( m => m.OtcPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    
  },
  
 
  {
    path: 'detalle-producto',
    loadChildren: () => import('./pages/detalle-producto/detalle-producto.module').then( m => m.DetalleProductoPageModule)

  },

  { 
    path: 'homerepa',
    loadChildren: () => import('./pages/homerepa/homerepa.module').then( m => m.HomerepaPageModule)
  },
  {
    path: 'maparapi',
    loadChildren: () => import('./pages/maparapi/maparapi.module').then( m => m.MaparapiPageModule)
  },
  
  {
    path: 'mapacli',
    loadChildren: () => import('./pages/mapacli/mapacli.module').then( m => m.MapacliPageModule)
  },

  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  
 
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },

  {
    path: 'perfil-r',
    loadChildren: () => import('./pages/perfil-r/perfil-r.module').then( m => m.PerfilRPageModule)
  },
  {
    path: 'ayuda',
    loadChildren: () => import('./pages/ayuda/ayuda.module').then( m => m.AyudaPageModule)
  },
  {
    path: 'detalle-pedido',
    loadChildren: () => import('./pages/detalle-pedido/detalle-pedido.module').then( m => m.DetallePedidoPageModule)
  },
  {
    path: 'homeadmin',
    loadChildren: () => import('./pages/homeadmin/homeadmin.module').then( m => m.HomeadminPageModule)
  },


  {
    path: 'detalle-combo',
    loadChildren: () => import('./pages/detalle-combo/detalle-combo.module').then( m => m.DetalleComboPageModule)
  },

  {
    path: 'administrador-usuario',
    loadChildren: () => import('./pages/administrador-usuario/administrador-usuario.module').then( m => m.AdministradorUsuarioPageModule)
  },

  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then( m => m.AdminPageModule)
  },

  {
    path: 'rescontrasena',
    loadChildren: () => import('./pages/rescontrasena/rescontrasena.module').then( m => m.RescontrasenaPageModule)
  },
  {
    path: 'cambiar-contrasena',
    loadChildren: () => import('./pages/cambiar-contrasena/cambiar-contrasena.module').then( m => m.CambiarContrasenaPageModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error/error.module').then( m => m.ErrorPageModule)
  },

  

  

 



  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
