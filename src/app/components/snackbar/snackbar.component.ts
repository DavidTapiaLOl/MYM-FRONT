import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { IconCircleCheck } from 'angular-tabler-icons/icons';
import { IconsModule } from '../../icons.module';

export declare type SnackTypes = 'success' | 'error' | 'info' | 'forbidden';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [IconsModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackBarChart {
   data: { type: SnackTypes; message: string[] } = inject(MAT_SNACK_BAR_DATA);

/*    ES: 'Ha ocurrido un error.',
   ES: 'Proceso ejecutado con éxito.',
   ES: 'No tienes permiso para realizar esta acción.', */
   info = {
      success: {
         icon: 'circle-check',
         class: '!text-success !stroke-success',
         message: this.data.message ?? 'Proceso ejecutado con éxito.',
      },
      error: {
         icon: 'exclamation-circle',
         class: '!text-advertence !stroke-advertence',
         message: this.data.message ?? 'Ha ocurrido un error.',
      },
      info: {
         icon: 'info-circle',
         class: '!text-info !stroke-info',
         message: this.data.message ?? 'Información.',
      },
      forbidden: {
         icon: 'circle-key',
         class: '!text-warn !stroke-warn',
         message: this.data.message ?? 'No tienes permiso para realizar esta acción.',
      },

   }
   ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
   }
}
