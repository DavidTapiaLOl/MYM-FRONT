import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-detalle',
  templateUrl: './ver-detalle.component.html',
  styleUrls: ['./ver-detalle.component.scss']
})
export class VerDetalleComponent {

  constructor(
    public dialogRef: MatDialogRef<VerDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar() {
    this.dialogRef.close();
  }

  cleanLabel(key: string): string {
    let label = key.replace(/^[0-9]{2}_/, '').replace(/_/g, ' ');
    
 
    if (key.toLowerCase() === 'es_fijo') return 'Recurrente';
    
    return label;
  }

 
  get dataKeys() {
    if (!this.data) return [];
    
    return Object.keys(this.data).filter(key => {
      const k = key.toLowerCase();
 
      if (k === 'id') return false;
      if (k.includes('tbl_')) return false; 
      if (k.includes('_id')) return false;
      if (k.includes('password')) return false;
      if (k.includes('fecha_elim')) return false;
      if (k.includes('ruta')) return false; 
      return true;
    }).sort();
  }


  isMoney(key: string): boolean {
    const k = key.toLowerCase();
    return k.includes('monto') || k.includes('total') || k.includes('precio');
  }

  isDate(key: string): boolean {
    return key.toLowerCase().includes('fecha');
  }

  isBoolean(key: string): boolean {
    const k = key.toLowerCase();
    return k.startsWith('es_') || k === 'activo';
  }

  isLongText(key: string): boolean {
    const k = key.toLowerCase();
    return k.includes('descripcion') || k.includes('nota') || k.includes('detalle');
  }
}