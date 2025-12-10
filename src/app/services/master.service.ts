import { Injectable, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackTypes, SnackBarChart } from '../components/snackbar/snackbar.component';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable({
   providedIn: 'root'
})
export class MasterService {
   private _sanitizer: DomSanitizer = inject(DomSanitizer)
   private _snack: MatSnackBar = inject(MatSnackBar)

   async snack(type: SnackTypes, message?: string): Promise<boolean> {
      this._snack.openFromComponent(SnackBarChart, {
         duration: 5000,
         data: { type, message }
      })
      return type == 'success';
   }


   save_pdf(id: string, name: string) {
     
   }



   id(id: string) {
      return document.getElementById(id)
   }

   sanitize(text: string) {
      return this._sanitizer.bypassSecurityTrustHtml(text);
   }

   async spin_button(button: HTMLElement, content?: string) {
      if (content) {
         button.removeAttribute('disabled');
         button.innerHTML = await content;
      } else {
         await button.setAttribute('disabled', 'disabled')
         button.innerHTML = await `<svg xmlns="http://www.w3.org/2000/svg" class="animate-spin !text-inherit i-tabler icon icon-tabler icon-tabler-loader-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#CF2524" fill="none" stroke-linecap="round" stroke-linejoin="round">
         <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
         <path d="M12 3a9 9 0 1 0 9 9" />
         </svg>`
      }
   }
}
