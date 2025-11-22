import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProviderService } from '../../services/provider.service';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',

})
export class RegistroComponent {
  private FormBuilder: FormBuilder = inject (FormBuilder)
  private auth: AuthService = inject(AuthService);
  private provider: ProviderService = inject(ProviderService)
  private router: Router = inject(Router)
  public layout: LayoutService = inject(LayoutService)

  listas: any = []
  hide = true;

  Formulario: FormGroup = this.FormBuilder.group({
  nombre:[null,[Validators.required]] ,
  apellido_paterno:[null,[Validators.required]] ,
  apellido_materno:[null,[Validators.required]] ,
  fecha_nacimiento:[null,[Validators.required]] ,
  correo:[null,[Validators.required]] ,
  telefono:[null,[Validators.required]] ,
  usuario:[null,[Validators.required]] ,
  password:[null,[Validators.required]] ,
  tbl_municipio_id:[null,[Validators.required]] ,
  tbl_pais_id:[null,[Validators.required]] ,
  tbl_estado_id:[null,[Validators.required]] ,
})

  async ngOnInit() {
   this.listas['pais'] = await this.provider.request('POST','pais','GetAll')
   this.Formulario.controls[ "tbl_pais_id" ] . valueChanges.subscribe(async (id: any) =>
   this.listas['estado'] = await this.provider.request('POST', 'estado', 'GetIdxPais',{id}))


   this.Formulario.controls[ "tbl_estado_id" ] . valueChanges.subscribe(async (id: any) =>
   this.listas['municipio'] = await this.provider.request('POST', 'municipio', 'GetIdxEstado',{id}))
  }
  async submit(){
    let registro: any = (await this.auth.sign_up(this.Formulario.value) as any)
    //console.log(registro, registro?.estatus, registro?.['estatus']);

    if(registro.estatus)
      this.router.navigate(['/login'])

  }



}
