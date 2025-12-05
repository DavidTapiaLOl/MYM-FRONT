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
  private FormBuilder: FormBuilder = inject(FormBuilder);
  private auth: AuthService = inject(AuthService);
  private provider: ProviderService = inject(ProviderService);
  private router: Router = inject(Router);
  public data: any = inject(MAT_DIALOG_DATA);
  private form: FormService = inject(FormService);
  private dialogref: DialogRef<FormularioEgresoComponent> = inject(DialogRef<FormularioEgresoComponent>);
  public layout: LayoutService = inject(LayoutService);

  listas: any = [];
  acceso: number = this.data.ruta.includes('egreso') ? 0 : 1;
  accion: string = 'Insert';

  Formulario: FormGroup = this.FormBuilder.group({
    id: [null],
    descripcion: [null, [Validators.required]],
    monto: [null, [Validators.required]],
    fecha_limite: [null], // Quitamos required aquí, lo ponemos dinámicamente si es necesario
    // Inicializamos con fecha de hoy y deshabilitado
    fecha_registro: [{ value: new Date(), disabled: true }, [Validators.required]],
    fecha_pago: [null, [Validators.required]],
    tbl_concepto_id: [null, [Validators.required]],
    tbl_tipo_pago_id: [null, [Validators.required]],
    tbl_periodo_id: [null, [Validators.required]],
    tbl_registro_id: this.auth.get_user().id,
    es_fijo: [false]
  });

  async ngOnInit() {
    this.listas['concepto'] = await this.provider.request('POST', 'concepto', 'GetAll');
    this.listas['tipo_pago'] = await this.provider.request('POST', 'tipo_pago', 'GetAll');
    this.listas['periodo'] = await this.provider.request('POST', 'periodo', 'GetAll');

    // Validación condicional: Si es Egreso, la fecha límite es obligatoria
    if (this.data.ruta === 'egreso') {
        this.Formulario.get('fecha_limite')?.addValidators(Validators.required);
        this.Formulario.get('fecha_limite')?.updateValueAndValidity();
    }
  }

  async ngAfterViewInit() {
    if (this.data.id) {
      this.accion = "Update";
      let info = await this.provider.request('POST', this.data.ruta, 'GetId', { id: this.data.id });
      this.form.patch(info, this.Formulario);
    }
  }

  async agregar(archivo: string, nombre: string) {
    if (nombre.length > 0) {
      let elemento: any = {
        nombre,
        acceso: this.acceso,
        id: (await this.provider.request('POST', archivo, 'Insert', { nombre, acceso: this.acceso }) as any).id,
        tbl_registro_id: this.auth.get_user().id
      };
      this.listas[archivo].push(elemento);
    }
  }

  async onSubmit() {
    if (this.Formulario.invalid) {
        this.Formulario.markAllAsTouched();
        return;
    }

    // [FIX IMPORTANTE] Usamos getRawValue() para obtener el campo disabled (fecha_registro)
    const datos = this.Formulario.getRawValue();

    // Formateamos las fechas de forma segura
    datos.fecha_registro = this.formatearFecha(datos.fecha_registro);
    datos.fecha_pago = this.formatearFecha(datos.fecha_pago);
    
    // Solo formateamos fecha límite si existe (en ingresos puede ser null)
    if (datos.fecha_limite) {
        datos.fecha_limite = this.formatearFecha(datos.fecha_limite);
    }

    this.form.save('POST', this.data.ruta, this.accion, datos, 'boton', 'formulario');
    this.dialogref.close();
  }

  filtrarListas(listas: string): any {
    return this.listas[listas]?.filter((elemento: any) => elemento.acceso == this.acceso) || [];
  }

  formatearFecha(fecha: any) {
    if (!fecha) return null; // Protección contra nulos
    try {
        return new Date(fecha).toISOString().split('T')[0];
    } catch (error) {
        console.error("Error formateando fecha:", fecha);
        return null;
    }
  }

  async eliminar() {
    this.form.delete('POST', this.data.ruta, 'Delete', { id: this.data.id });
    this.dialogref.close();
  }

  @HostListener("window:resize") hola() { }
}