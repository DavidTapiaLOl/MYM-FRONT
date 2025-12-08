import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ProviderService } from '../../services/provider.service';
import { Component, inject } from '@angular/core';
import { FormularioEgresoComponent } from '../../components/formulario-egreso/formulario-egreso.component';
import { FormService } from '../../services/form.service';
import { VerDetalleComponent } from '../../components/ver-detalle/ver-detalle.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public provider: ProviderService = inject(ProviderService);
  public auth: AuthService = inject(AuthService);
  public dialog: MatDialog = inject(MatDialog);
  public form: FormService = inject(FormService);

  constructor() {
    this.form.ejecutar$.subscribe(() => this.ngOnInit());
  }

  data: any = [];
  sumas: any = [];

  tablaMensual: any = []; 
  datosGrafica: any = []; 

  async ngOnInit() {
    const idUsuario = this.auth.get_user().id;

    this.data = await this.provider.request('POST', 'ingreso', 'Getinfo', {
      id: idUsuario,
    });

    this.sumas = await this.provider.request('POST', 'ingreso', 'Getsuma', {
      id: idUsuario,
    });
    console.log('Totales recibidos:', this.sumas);
    this.tablaMensual = await this.provider.request(
      'POST',
      'ingreso',
      'graficaMes',
      { id: idUsuario }
    );

    this.datosGrafica = await this.provider.request(
      'POST',
      'egreso',
      'graficaConceptos',
      { id: idUsuario }
    );
  }

  click(row?: any) {
    const ruta = row ? row['03_tipo'].toLowerCase() : 'ingreso';
    this.dialog.open(FormularioEgresoComponent, {
      data: { ...row, ruta: ruta },
    });
  }

  async verDetalleDialog(item: any) {
    let endpoint = 'egreso';

    try {
      const dataFresca = await this.provider.request('POST', endpoint, 'GetId', { id: item.id });
      if (dataFresca) {
        this.dialog.open(VerDetalleComponent, {
          width: '500px',
          maxWidth: '95vw',
          panelClass: 'custom-dialog-container',
          data: dataFresca
        });
      }

    } catch (error) {
      console.error("Error obteniendo detalles:", error);
    }
  }
}
