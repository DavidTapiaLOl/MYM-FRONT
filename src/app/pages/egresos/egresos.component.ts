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
  
  // Variables separadas para las listas
  egresosGenerales: any[] = [];
  egresosFijos: any[] = [];

  constructor(){
    this.form.ejecutar$.subscribe(()=> this.ngOnInit())
  }

  async ngOnInit(){
    this.router.events.subscribe((event:any)=> {
      if (event instanceof NavigationEnd ) {
        this.ruta = this.router.url.replace('/','')
      }
    })

    const todosLosEgresos = await this.provider.request('POST',this.ruta,'GetAll', {
      id: this.auth.get_user().id
    });

    if (Array.isArray(todosLosEgresos)) {
        // Filtramos: si es_fijo es 1 (true) va a fijos, si es 0 va a generales
        this.egresosFijos = todosLosEgresos.filter((e: any) => e.es_fijo == 1);
        this.egresosGenerales = todosLosEgresos.filter((e: any) => e.es_fijo == 0 || !e.es_fijo);
    }
  }

  Editardialog(row?:any){
    this.dialog.open(FormularioEgresoComponent,{
      data:{...row, ruta: this.ruta}
    })
  }

  async eliminar(elemento:any){
    this.form.delete('POST',this.ruta, 'Delete',{id:elemento.id})
  }
}