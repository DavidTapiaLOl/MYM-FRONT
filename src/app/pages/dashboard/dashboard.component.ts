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
  data: any = [

  ]
  sumas: any=[

  ]

  infoGrafica: any=[

  ]


  async ngOnInit() {
    this.data = await this.provider.request('POST', 'ingreso','Getinfo',{

      id: this.auth.get_user().id
    })
    this.sumas = await this.provider.request('POST', 'ingreso','Getsuma',{

      id: this.auth.get_user().id
    })
    console.log(this.sumas);

    this.infoGrafica = await this.provider.request('POST', 'ingreso','graficaMes',{
      id: this.auth.get_user().id
    })
    // console.log(this.infoGrafica);



  }
  // Midata = [
  //   {
  //     value: 200, category: "Enero"
  //   },
  //   {
  //     value: 370, category: "Febrero"
  //   },
  //   {
  //     value: 500, category: "Marzo"
  //   },
  //   {
  //     value: 100, category: "Abril"
  //   },
  //   {
  //     value: 250, category: "Mayo"
  //   },
  //   {
  //     value: 130, category: " junio"
  //   },
  //   {
  //      value: 1203, category: "Julio"
  //   },
  //   {
  //     value: 410, category: "Agosto"
  //   },
  //   {
  //     value: 6, category: "Septiembre"
  //   },
  //   {
  //     value: 98, category: "Octubre"
  //   },
  //   {
  //     value: 632, category: "Noviembre"
  //   },
  //   {
  //     value: 400, category: "Diciembre"
  //   },
  // ]


  click(row?:any){

    //console.log(row);

    this.dialog.open(FormularioEgresoComponent,{
      data:{...row, ruta: row['03_tipo'].toLowerCase()}

    })



}




}
