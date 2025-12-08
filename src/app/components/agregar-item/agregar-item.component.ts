import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ProviderService } from '../../services/provider.service'; 


@Component({
  selector: 'app-agregar-item',
  templateUrl: './agregar-item.component.html',
  styleUrls: ['./agregar-item.component.css'] 
})
export class AgregarItemComponent {
  private provider = inject(ProviderService);
  
  nombreControl = new FormControl('', [Validators.required]);
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<AgregarItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { archivo: string, titulo: string, acceso: any }
  ) {}

  async guardar() {
    if (this.nombreControl.invalid) return;
    
    this.loading = true;
    try {
     
      const response: any = await this.provider.request('POST', this.data.archivo, 'Insert', {
        nombre: this.nombreControl.value,
        acceso: this.data.acceso
      });

      if (response && response.id) {
       
        this.dialogRef.close({
          id: response.id,
          nombre: this.nombreControl.value,
          acceso: this.data.acceso
        });
      }
    } catch (error) {
      console.error("Error guardando:", error);
    } finally {
      this.loading = false;
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}