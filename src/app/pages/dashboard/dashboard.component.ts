import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ProviderService } from '../../services/provider.service';
import { Usuario } from './../../interface/usuarios.interface';
import { Component, inject } from '@angular/core';
import { FormularioEgresoComponent } from '../../components/formulario-egreso/formulario-egreso.component';
import { FormService } from '../../services/form.service';
import { ChartsService } from '../../services/charts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public provider : ProviderService = inject(ProviderService)
  public auth: AuthService = inject(AuthService)
  public dialog: MatDialog = inject(MatDialog)
  public form: FormService = inject(FormService)

  constructor(){
    this.form.ejecutar$.subscribe(()=> this.ngOnInit())
  }
  
  data: any = []
  sumas: any = []
  
  // VARIABLES SEPARADAS
  tablaMensual: any = []   // Para la tabla de ingresos/egresos/balance
  datosGrafica: any = []   // Para la gráfica de conceptos

  async ngOnInit() {
    const idUsuario = this.auth.get_user().id;

    // 1. Movimientos recientes (Tabla de abajo)
    this.data = await this.provider.request('POST', 'ingreso','Getinfo',{ id: idUsuario })
    
    // 2. Sumas totales (Cajas de arriba)
    this.sumas = await this.provider.request('POST', 'ingreso','Getsuma',{ id: idUsuario })

    // 3. DATOS PARA LA TABLA MENSUAL (Ingresos vs Egresos)
    this.tablaMensual = await this.provider.request('POST', 'ingreso', 'graficaMes', { id: idUsuario });

    // 4. DATOS PARA LA GRÁFICA (Egresos por Concepto)
    this.datosGrafica = await this.provider.request('POST', 'egreso', 'graficaConceptos', { id: idUsuario });
  }

  click(row?:any){
    const ruta = row ? row['03_tipo'].toLowerCase() : 'ingreso';
    this.dialog.open(FormularioEgresoComponent,{
      data:{...row, ruta: ruta}
    })
  }
}