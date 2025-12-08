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
  private FormBuilder: FormBuilder = inject(FormBuilder);
  private auth: AuthService = inject(AuthService);
  private provider: ProviderService = inject(ProviderService);
  private router: Router = inject(Router);
  public layout: LayoutService = inject(LayoutService);

  previewUrl: string | null = null;
  loadingFoto: boolean = false;

  listas: any = [];
  hide = true;

  Formulario: FormGroup = this.FormBuilder.group({
    nombre: [null, [Validators.required]],
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
    foto_perfil: [null] // <--- NUEVO CAMPO
  });

  async ngOnInit() {
    this.listas['pais'] = await this.provider.request('POST', 'pais', 'GetAll');
    
    this.Formulario.controls['tbl_pais_id'].valueChanges.subscribe(async (id: any) =>
      this.listas['estado'] = await this.provider.request('POST', 'estado', 'GetIdxPais', { id })
    );

    this.Formulario.controls['tbl_estado_id'].valueChanges.subscribe(async (id: any) =>
      this.listas['municipio'] = await this.provider.request('POST', 'municipio', 'GetIdxEstado', { id })
    );
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.loadingFoto = true;
      try {
        const url = await this.provider.upload(file);
        this.previewUrl = url;
        this.Formulario.patchValue({ foto_perfil: url });
      } catch (error) {
        alert('Error al subir la imagen');
      } finally {
        this.loadingFoto = false;
      }
    }
  }

  async submit() {
    if (this.Formulario.invalid) {
       this.Formulario.markAllAsTouched();
       return;
    }


    const datos = { ...this.Formulario.value };

    if (datos.fecha_nacimiento) {
        try {
         
            datos.fecha_nacimiento = new Date(datos.fecha_nacimiento).toISOString().split('T')[0];
        } catch (e) {
            console.error('Error al formatear fecha', e);
        }
    }

    try {
        let registro: any = await this.auth.sign_up(datos);
        
        if (registro && registro.estatus) {
            
            this.router.navigate(['/login']);
        } else {
            
            console.error('Error en registro:', registro);
            alert(registro?.mensaje || 'Error al registrar el usuario');
        }
    } catch (error) {
        console.error('Error de servidor:', error);
    }
  }
}