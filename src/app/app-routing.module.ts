import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { EgresosComponent } from './pages/egresos/egresos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { authGuard } from './services/auth.guard';
import { noauthGuard } from './services/noAuth.guard';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'prefix'

  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate:[noauthGuard]
  },
  {
    path: 'registro',
    component: RegistroComponent,
    canActivate: [noauthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]

  },
  {
    path: 'ingreso',
    component: EgresosComponent,
    canActivate: [authGuard]
  },
  {
    path: 'egreso',
    component:EgresosComponent,
    canActivate: [authGuard]
  },
  {
    path:'perfil',
    component: PerfilComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login',

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],

})
export class AppRoutingModule { }
