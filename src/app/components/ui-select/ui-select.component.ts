import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { LayoutService } from '../../services/layout.service';

@Component({
   selector: 'ui-select',
   templateUrl: './ui-select.component.html',
   styleUrl: './ui-select.component.scss',
})
export class UiSelectComponent {
   public _layout: LayoutService = inject(LayoutService);

   @Input({ required: true }) data: any[] | string[] = [];
   @Input({ required: true }) label: string = '';
   @Input({ required: true }) control!: FormControl | AbstractControl;

   _filtered_data: any[] | any[] = [];
   _data: any[] | string[] = [];
   _label: string = '';
   _control!: FormControl;

   ngOnChanges(changes: SimpleChanges): void {
      this._data = changes['data']?.currentValue ?? this.data;
      this._label = changes['label']?.currentValue ?? this.label;
      this._control = (changes['control']?.currentValue ?? this.control) as FormControl;
   }

   ngOnInit(): void {
      this._filtered_data = this._data;
   }

   find(query: string) {
      if (query)
         this._filtered_data = this.data.filter(
            (el: any | any) =>
               this.normalize(query).test(el?.name ?? el.toLowerCase()) ||
               this.normalize(query).test(el?.value ?? el.toLowerCase())
         );
      else this._filtered_data = this.data;
   }

   select(event: any) {
      this._control.patchValue(event);
      //console.log(this._control.parent?.value);

   }

   normalize(query: string) {
      return new RegExp(
         query
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .toLowerCase()
            .split('')
            .join('.*?'),
         'i'
      );
   }
}
