import { Injectable, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Method, ProviderService } from './provider.service';
import { firstValueFrom } from 'rxjs';
import { SnackTypes, SnackBarChart } from '../components/snackbar/snackbar.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { DomSanitizer } from '@angular/platform-browser';
/* import jsPDF from 'jspdf';
 *//* import html2canvas from 'html2canvas'; */

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
      /* const element = document.getElementById(id);
      const doc = new jsPDF('p', 'pt', 'a4');

      html2canvas(element!).then((canvas: any) => {
         const img = canvas.toDataURL('image/PNG');
         const bufferX = 15;
         const bufferY = 15;
         const imgProps = (doc as any).getImageProperties(img);
         const imgWidth = 520;
         const imgHeight = (canvas.height * imgWidth) / canvas.width
         const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

         doc.addImage(img, 'PNG', bufferX, bufferY, imgWidth, imgHeight, undefined, 'FAST');
         return doc;
      }).then((docResult) => {
         docResult.save(name + '.pdf');
      }); */
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
