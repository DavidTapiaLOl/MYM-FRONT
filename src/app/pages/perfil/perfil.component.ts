import { Component, HostListener, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProviderService } from '../../services/provider.service';
import { Router } from '@angular/router';
import { FormService } from '../../services/form.service';
import { LayoutService } from '../../services/layout.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  private FormBuilder: FormBuilder = inject(FormBuilder)
  private auth: AuthService = inject(AuthService);
  private provider: ProviderService = inject(ProviderService)
  private router: Router = inject(Router)
  private form: FormService = inject(FormService)
  public layout: LayoutService = inject(LayoutService)
  private snackbar: MatSnackBar = inject(MatSnackBar)


  listas: any = []

  Formulario: FormGroup = this.FormBuilder.group({
    nombre: [null, [Validators.required]],
    id: [null, [Validators.required]],
    apellido_paterno: [null, [Validators.required]],
    apellido_materno: [null, [Validators.required]],
    fecha_nacimiento: [null, [Validators.required]],
    correo: [null, [Validators.required]],
    telefono: [null, [Validators.required]],
    usuario: [null, [Validators.required]],
    password: [null, [Validators.required]],
    tbl_municipio_id: [null, [Validators.required]],
    tbl_pais_id: [null, [Validators.required]],
    tbl_estado_id: [null, [Validators.required]],
  })

  async ngOnInit() {
    let info: any = await this.provider.request('POST', 'registro', 'GetId', { id: this.auth.get_user().id })
    //console.log(info);

    this.listas['pais'] = await this.provider.request('POST', 'pais', 'GetAll')
    this.listas['estado'] = await this.provider.request('POST', 'estado', 'GetIdxPais',{id: info.tbl_pais_id})
    this.listas['municipio'] = await this.provider.request('POST', 'municipio', 'GetIdxEstado', { id: info.tbl_estado_id })

    await this.form.patch(info, this.Formulario)

  }
  async submit() {
    this.provider.request('POST', 'registro', 'Update', this.Formulario.value)

    if((await this.provider.request('POST', 'registro', 'Update', this.Formulario.value)as any).estatus){
      this.snackbar.open("Cambios realizdos con exitio")
      this.router.navigate(['/dashboard'])
    }
  }




  // Funcion para responsividad
  @HostListener("window:resize") hola(){

  }

}
