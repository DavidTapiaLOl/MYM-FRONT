import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsComponent } from './components/components.component';
import { PagesComponent } from './pages/pages.component';
import { ServicesComponent } from './services/services.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IngresosComponent } from './pages/ingresos/ingresos.component';
import { EgresosComponent } from './pages/egresos/egresos.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material.module';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { FormularioEgresoComponent } from './components/formulario-egreso/formulario-egreso.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TableComponent } from './components/table/table.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FilterComponent } from './components/table/filter/filter.component';
import { UiSelectComponent } from './components/ui-select/ui-select.component';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { BarChart } from './components/charts/bar/bar.component';
import { FormularioIngresoComponent } from './components/formulario-ingreso/formulario-ingreso.component';
import { AgregarItemComponent } from './components/agregar-item/agregar-item.component';
import { VerDetalleComponent } from './components/ver-detalle/ver-detalle.component';




@NgModule({
  declarations: [
    AppComponent,
    ComponentsComponent,
    PagesComponent,
    ServicesComponent,
    LoginComponent,
    DashboardComponent,
    IngresosComponent,
    EgresosComponent,
    RegistroComponent,
    NavbarComponent,
    PerfilComponent,
    FormularioEgresoComponent,
    FormularioIngresoComponent,
    TableComponent,
    FilterComponent,
    UiSelectComponent,
    BarChart,
    AgregarItemComponent,
    VerDetalleComponent




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule.pick(TablerIcons),






  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
