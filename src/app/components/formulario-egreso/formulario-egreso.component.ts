import { Component, HostListener, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProviderService } from '../../services/provider.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterService } from '../../services/master.service';
import { FormService } from '../../services/form.service';
import { DialogRef } from '@angular/cdk/dialog';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-formulario-egreso',
  templateUrl: './formulario-egreso.component.html',
  styleUrl: './formulario-egreso.component.css'
})

export class FormularioEgresoComponent {
  private FormBuilder: FormBuilder = inject (FormBuilder)
  private auth: AuthService = inject(AuthService);
  private provider: ProviderService = inject(ProviderService)
  private router: Router = inject(Router)
  public data: any = inject(MAT_DIALOG_DATA)
  private form: FormService = inject(FormService)
  private dialogref: DialogRef<FormularioEgresoComponent> = inject(DialogRef<FormularioEgresoComponent>)
  public layout: LayoutService = inject(LayoutService)

  listas: any = []

  acceso: number = this.data.ruta.includes('egreso') ? 0 : 1;
  accion: string = 'Insert'
  Formulario: FormGroup = this.FormBuilder.group({
  id:[null,[Validators.required]] ,
  descripcion:[null,[Validators.required]] ,
  monto:[null,[Validators.required]] ,
  fecha_limite:[null,[Validators.required]] ,
  fecha_registro:[null,[Validators.required]] ,
  fecha_pago:[null,[Validators.required]] ,
  tbl_concepto_id:[null,[Validators.required]] ,
  tbl_tipo_pago_id:[null,[Validators.required]] ,
  tbl_periodo_id:[null,[Validators.required]] ,
  tbl_registro_id:this.auth.get_user().id

})


   async ngOnInit() {
    // //console.log(this.data);

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.listas['concepto'] = await this.provider.request('POST','concepto','GetAll')
    this.listas['tipo_pago'] = await this.provider.request('POST','tipo_pago','GetAll')
    this.listas['periodo'] = await this.provider.request('POST','periodo','GetAll')


    // //console.log(this.data);

    // this.listas['concepto'] = [{
    //   nombre: 'Agua',
    //   accesso: 0,
    //   id:1
    // }]
    // this.listas['tipo_pago'] = [{
    //   nombre: 'Efectivo',
    //   accesso: 0,
    //   id:1
    // }]
    // this.listas['periodo'] = [{
    //   nombre: 'Mensual',
    //   accesso: 0,
    //   id:1
    // }]
  }

  async ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (this.data.id) {
      this.accion = "Update" ;
      let info = await this.provider.request('POST', this.data.ruta, 'GetId', {id:this.data.id})
      this.form.patch(info,this.Formulario)
      //console.log(this.Formulario.value);

    }
  }

  async agregar(archivo:string, nombre:string){
    if(nombre.length > 0){
      let elemento: any = {
        nombre,
        acceso:this.acceso,
        id: (await this.provider.request('POST',archivo,'Insert', {nombre, acceso:this.acceso}) as any).id,
        tbl_registro_id: this.auth.get_user().id
      }
      this.listas[archivo].push(elemento)
    }

  }


  async onSubmit(){
    let fecha_registro: string = this.Formulario.value.fecha_registro
    let fecha_pago: string = this.Formulario.value.fecha_pago
    let fecha_limite: string = this.Formulario.value.fecha_limite
    this.Formulario.value.fecha_registro = this.formatearFecha(fecha_registro)
    this.Formulario.value.fecha_pago = this.formatearFecha(fecha_pago)
    this.Formulario.value.fecha_limite = this.formatearFecha(fecha_limite)


    this.form.save('POST',this.data.ruta, this.accion,this.Formulario.value,'boton','formulario')
    this.dialogref.close()
  }

  filtrarListas(listas:string):any{
    //filtrar la lusrta de un arreglo
    return this.listas[listas]?.filter((elemento:any)=>elemento.acceso==this.acceso) || []

  }

  formatearFecha(fecha:any){
    return new Date(fecha).toISOString().split('T')[0];
  }

  async eliminar(){
    this.form.delete('POST',this.data.ruta, 'Delete',{id:this.data.id})
    this.dialogref.close()
  }


  @HostListener("window:resize") hola(){

  }

}
