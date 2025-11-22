import { Injectable, inject } from '@angular/core';
import {
   AbstractControl,
   FormArray,
   FormControl,
   FormGroup,
} from '@angular/forms';
import { Method, ProviderService } from './provider.service';
import { Subject, firstValueFrom } from 'rxjs';
import { MasterService } from './master.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { DialogRef } from '@angular/cdk/dialog';
/**
 * Servicio que proporciona funciones utilitarias para trabajar con formularios en Angular.
 *
 * @remarks
 * Este servicio forma parte de la plantilla realizada con Angular 17.
 *
 * @beta
 */
@Injectable({
   providedIn: 'root',
})
export class FormService {
   private _master: MasterService = inject(MasterService);
   private _provider: ProviderService = inject(ProviderService);
   private _dialog: MatDialog = inject(MatDialog)

   ejecutar = new Subject<void>();
   ejecutar$ = this.ejecutar.asObservable();
  //  private dialogref:DialogRef <ConfirmationComponent> =

   /**
    * Aplica valores a un formulario o control de formulario en función de los datos proporcionados.
    *
    * @param data - Los datos que se aplicarán al formulario o control de formulario.
    * @param form_group - El formulario o control de formulario al que se aplicarán los datos.
    * @returns Una promesa que se resuelve en `true` si la operación fue exitosa; de lo contrario, `false`.
    */
   async patch<T extends AbstractControl>(
      data: any,
      form_group: T
   ): Promise<boolean> {
      for (const key in data) {
         const control = form_group.get(key);

         if (control instanceof FormControl) {
            control.patchValue(data[key]);
         } else if (control instanceof FormGroup) {
            while (typeof data?.[key] == 'string')
               data[key] = JSON.parse(data?.[key]);

            this.patch(data[key], control);
         } else if (control instanceof FormArray && Array.isArray(data[key])) {
            const form_array = this.control(control);
            const data_array = data[key];
            let i = form_array.length;

            this.control(control).clear();

            while (i < data_array.length) {
               const sub_group = new FormGroup({});
               data_array[i] &&
                  Object.keys(data_array[i]).forEach((sub_key) =>
                     sub_group.addControl(sub_key, data_array[i][sub_key])
                  );
               form_array.push(sub_group);
               i++;
            }

            data_array.forEach((value: any, index: number) => {
               const sub_group = this.control(form_array.at(index));
               this.patch(value, sub_group);
            });

            while (form_array.length > data_array.length)
               form_array.removeAt(form_array.length - 1);
         }
         ;
      }
      return true;
   }

   /**
    * Devuelve el control de formulario proporcionado como FormGroup, FormControl o FormArray, según sea el caso.
    *
    * @param control - El control de formulario que se devolverá.
    * @returns El mismo control de formulario proporcionado.
    */
   control<T extends AbstractControl>(control: T): T {
      return control;
   }

   /**
    * Verifica si todos los valores en el formulario son nulos, 'null' o cadenas vacías.
    *
    * @param form - El formulario o conjunto de controles de formulario a verificar.
    * @returns `true` si todos los valores son nulos, 'null' o cadenas vacías; de lo contrario, `false`.
    */
   empty(form: any): boolean {
      return Object.values(form).every(
         (key: any) =>
            key == null ||
            key == 'null' ||
            (typeof key == 'string' && key.length == 0)
      );
   }

   /**
    * Obtiene el nombre del control de formulario dentro de su grupo padre.
    *
    * @param control - El control de formulario del cual se obtendrá el nombre.
    * @returns El nombre del control de formulario.
    */
   control_name(control: AbstractControl): string {
      let group = <FormGroup>control.parent;

      if (!group) {
         return '';
      }

      let name: string = '';

      Object.keys(group.controls).forEach((key) => {
         let child = group.get(key);

         if (child !== control) return;

         name = key;
      });

      return name;
   }

   async save(method: Method, archivo: string, opcion: string, params: any, button: string, form_id: string): Promise<boolean> {
      const _button = this._master.id(button);
      if (!_button) return false;

      let content = await _button.innerHTML
      this._master.spin_button(_button)
      try {

         let confirm = await firstValueFrom(this._dialog.open(ConfirmationComponent).afterClosed())

         if (!confirm) return this._master.snack('info', 'No se han realizado cambios.');

         let firstInvalidControl = this._master.id(form_id)?.getElementsByClassName('ng-invalid')[0];

         if (firstInvalidControl) {
            firstInvalidControl?.scrollIntoView({ behavior: 'smooth' });
            (firstInvalidControl as HTMLElement).focus();
            return this._master.snack('info', 'Revisa tu información e inténtalo de nuevo.')
         }

         const response:any = await this._provider.request(method, archivo,opcion, params);
         const success = response.estatus == true;
        //  location.reload()
         this.ejecutar.next();

         return this._master.snack(success ? 'success' : 'error');
      } catch (error) {
         return this._master.snack('error');
      } finally {
         this._master.spin_button(_button, content)
      }
   }

   async delete(method: Method, archivo: string, opcion: string,params: any) {
      let confirm = await firstValueFrom(this._dialog.open(ConfirmationComponent).afterClosed())

      if (!confirm) return this._master.snack('info', 'No se han realizado cambios.');

      const response:any = await this._provider.request(method, archivo,opcion, params);
      const success = response.estatus == true;
      this.ejecutar.next();
      // location.reload()
      // const success=true

      return this._master.snack(success ? 'success' : 'error');
   }
}
