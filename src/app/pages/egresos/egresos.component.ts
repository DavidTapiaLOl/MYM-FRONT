import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormularioEgresoComponent } from '../../components/formulario-egreso/formulario-egreso.component';
import { NavigationEnd, Router } from '@angular/router';
import { ProviderService } from '../../services/provider.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrl: './egresos.component.css'
})
export class EgresosComponent {
  public dialog: MatDialog = inject(MatDialog)
  public router: Router = inject(Router)
  public provider: ProviderService = inject(ProviderService)
  public form: FormService = inject(FormService)
  public auth: AuthService = inject(AuthService)

  ruta: string = this.router.url.replace('/','')
  data: any

  constructor(){
    this.form.ejecutar$.subscribe(()=> this.ngOnInit())
  }

  async ngOnInit(){
    this.router.events.subscribe((event:any)=> {
      if (event instanceof NavigationEnd ) {
        this.ruta = this.router.url.replace('/','')
      }
    })

    this.data = await this.provider.request('POST',this.ruta,'GetAll', {
      id: this.auth.get_user().id
    })






  }
/*   async Abrirdialogo(){
    this.dialog.open(FormularioEgresoComponent, {
      data:{ ruta: this.ruta}
    });

  } */

 Editardialog(row?:any){
    this.dialog.open(FormularioEgresoComponent,{
      data:{...row, ruta: this.ruta}
    })
}

async eliminar(elemento:any){
  this.form.delete('POST',this.ruta, 'Delete',{id:elemento.id})

}

}
