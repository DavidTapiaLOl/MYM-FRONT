import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiSelectComponent } from '../../ui-select/ui-select.component';
import { LayoutService } from '../../../services/layout.service';
import { FormService } from '../../../services/form.service';

@Component({
   selector: 'app-filter',
   templateUrl: './filter.component.html',
   styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
   // Inyección de servicios y definición de variables
   _form_builder: FormBuilder = inject(FormBuilder);
   _layout: LayoutService = inject(LayoutService)
   _form: FormService = inject(FormService)
   _dialogRef: MatDialogRef<FilterComponent> = inject(MatDialogRef<FilterComponent>);
   _data: { data: any[]; filters: string[]; applied_filters: any[] } = inject(MAT_DIALOG_DATA);

   form: FormGroup = this._form_builder.group({});

   async ngOnInit() {
      // Inicialización de opciones de filtro
      await this._data.filters.forEach(async (filter: string) =>
      await this.form.addControl(filter, new FormControl(this.form.value[filter])));
      if (this._data.applied_filters) this._form.patch(this._data.applied_filters, this.form)
   }

   apply_filters(): void {
      // Aplicación de filtros seleccionados
      this._dialogRef.close(Object.fromEntries(Object.entries(this.form.value).filter(([_, v]) => v != null)));
   }

   clear_filters(): void {
      // Limpieza de filtros
      this.form.reset();
      this.apply_filters();
   }

   options(column: string): string[] {
      // Obtención de opciones para el filtro
      return this._data.data
         .map((item: any) => item[column])
         .filter(
            (value: any, index: any, self: any) => self.indexOf(value) == index
         );
   }
}
