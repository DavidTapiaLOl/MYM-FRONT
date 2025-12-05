import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormularioEgresoComponent } from '../../components/formulario-egreso/formulario-egreso.component';
import { NavigationEnd, Router } from '@angular/router';
import { ProviderService } from '../../services/provider.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css'
})
export class IngresosComponent {
  public dialog: MatDialog = inject(MatDialog)
  public router: Router = inject(Router)
  public provider: ProviderService = inject(ProviderService)
  public form: FormService = inject(FormService)
  public auth: AuthService = inject(AuthService)

  ruta: string = 'ingreso'; // Forzamos la ruta a ingreso
  data: any[] = [];

  constructor(){
    this.form.ejecutar$.subscribe(()=> this.ngOnInit())
  }

  async ngOnInit(){
    // Cargamos todos los ingresos sin filtrar por fijo/no fijo
    this.data = await this.provider.request('POST', this.ruta, 'GetAll', {
      id: this.auth.get_user().id
    });
  }

  Editardialog(row?:any){
    // Al abrir el modal, le decimos que la ruta es 'ingreso'
    this.dialog.open(FormularioEgresoComponent,{
      data:{...row, ruta: this.ruta} 
    })
  }

  async eliminar(elemento:any){
    this.form.delete('POST', this.ruta, 'Delete', {id:elemento.id})
  }
}