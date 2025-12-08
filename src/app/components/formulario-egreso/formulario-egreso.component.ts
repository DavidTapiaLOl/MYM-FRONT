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
import { AgregarItemComponent } from '../agregar-item/agregar-item.component';
import { MatDialog } from '@angular/material/dialog';

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
  public dialog: MatDialog = inject(MatDialog);

  conceptosFiltrados: any[] = [];
tiposPagoFiltrados: any[] = [];
periodosFiltrados: any[] = [];

  listas: any = [];
  
  
  acceso: string = this.data.ruta.includes('egreso') ? '0' : '1'; 
  
  accion: string = 'Insert';

  Formulario: FormGroup = this.FormBuilder.group({
    id: [null],
    descripcion: [null, [Validators.required]],
    monto: [null, [Validators.required]],
    fecha_limite: [null], 
    fecha_registro: [{ value: new Date(), disabled: true }, [Validators.required]],
    fecha_pago: [null], //fecha de pago no es obligatoria
    tbl_concepto_id: [null, [Validators.required]],
    tbl_tipo_pago_id: [null, [Validators.required]],
    tbl_periodo_id: [null, [Validators.required]],
    tbl_registro_id: this.auth.get_user().id,
    es_fijo: [false]
  });

  async ngOnInit() {
  console.log("--> RUTA RECIBIDA:", this.data.ruta);

  this.acceso = this.data.ruta.includes('egreso') ? '0' : '1';
  console.log("--> ACCESO CALCULADO:", this.acceso);


  const rawConceptos = await this.provider.request('POST', 'concepto', 'GetAll') as any[];
  const rawTipos = await this.provider.request('POST', 'tipo_pago', 'GetAll') as any[];
  const rawPeriodos = await this.provider.request('POST', 'periodo', 'GetAll') as any[];


  this.conceptosFiltrados = rawConceptos.filter((x: any) => x.acceso == this.acceso);
  this.tiposPagoFiltrados = rawTipos.filter((x: any) => x.acceso == this.acceso);
  this.periodosFiltrados = rawPeriodos;


  console.log("--> Conceptos Filtrados:", this.conceptosFiltrados);
  console.log("--> Periodos Filtrados:", this.periodosFiltrados);


  this.listas['concepto'] = rawConceptos;
  this.listas['tipo_pago'] = rawTipos;
  this.listas['periodo'] = rawPeriodos;

  if (this.data.ruta && this.data.ruta.includes('egreso')) {
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

  abrirModalItem(archivo: string, titulo: string) {
    const dialogRef = this.dialog.open(AgregarItemComponent, {
      width: '600px',       
      maxWidth: '95vw',     
      maxHeight: '90vh',    
      disableClose: true,   
      data: { 
        archivo: archivo,
        titulo: titulo,
        acceso: this.acceso
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (!this.listas[archivo]) this.listas[archivo] = [];
        this.listas[archivo].push(result);

        if (archivo === 'concepto') {
            this.conceptosFiltrados.push(result);
            this.Formulario.patchValue({ tbl_concepto_id: result.id }); 
        }
        if (archivo === 'periodo') {
            this.periodosFiltrados.push(result);
            this.Formulario.patchValue({ tbl_periodo_id: result.id });
        }
        if (archivo === 'tipo_pago') {
            this.tiposPagoFiltrados.push(result);
            this.Formulario.patchValue({ tbl_tipo_pago_id: result.id });
        }
      }
    });
  }

  async onSubmit() {
    if (this.Formulario.invalid) {
        this.Formulario.markAllAsTouched();
        return;
    }

    const datos = this.Formulario.getRawValue();

    datos.fecha_registro = this.formatearFecha(datos.fecha_registro);
    datos.fecha_pago = this.formatearFecha(datos.fecha_pago);
    
    if (datos.fecha_limite) {
        datos.fecha_limite = this.formatearFecha(datos.fecha_limite);
    }

    this.form.save('POST', this.data.ruta, this.accion, datos, 'boton', 'formulario');
    this.dialogref.close();
  }

  
  filtrarListas(nombreLista: string): any {

    if (!this.listas[nombreLista]) return [];

    return this.listas[nombreLista].filter((elemento: any) => {

        return elemento.acceso.toString() === this.acceso.toString();
    });
  }

  formatearFecha(fecha: any) {
    if (!fecha) return null;
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