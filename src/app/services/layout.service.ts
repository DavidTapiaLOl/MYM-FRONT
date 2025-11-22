import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatDrawer, MatDrawerContainer, MatDrawerMode } from '@angular/material/sidenav';
/**
 * Servicio que proporciona funciones utilitarias para la gestión del diseño y apariencia en interfaces de usuario.
 *
 * @remarks
 * Este servicio forma parte de la plantilla realizada con Angular 17.
 *
 * @beta
 */
@Injectable({
   providedIn: 'root',
})
export class LayoutService {
   private _media_matcher: MediaMatcher = inject(MediaMatcher)
   /**
    * Apariencia predeterminada para los campos de formulario.
    */
   appearance = 'outline' as MatFormFieldAppearance;

   /**
    * Modo de color predeterminado para la aplicación.
    */
   theme: boolean = this._media_matcher.matchMedia("(prefers-color-scheme: light)").matches;

   /**
    * Oculta la columna identificada (`ID` o `id`) mediante la aplicación de una clase CSS.
    *
    * @param column - Nombre de la columna que se evaluará para ocultar.
    * @returns Una cadena que representa la clase CSS para ocultar la columna o una cadena vacía si no es necesario ocultarla.
    */
   hide_id(column: string): string {
      return column.match(/ID|id/) ? 'hidden' : '';
   }

   /**
    * Determina el número de columnas en un diseño de cuadrícula y la separación entre ellas (gap) en función del ancho de un elemento HTML (`el`).
    * Aplica una clase CSS adecuada (`grid-cols-1`, `grid-cols-2` o `grid-cols-3`) según el ancho del elemento.
    *
    * @param el - Elemento HTML del cual se obtendrá el ancho.
    * @returns Una cadena que representa la clase CSS para el diseño de cuadrícula.
    */
   grid(el: HTMLFormElement | HTMLDivElement | HTMLElement): string {
      const w = this.width(el);
      return (
         'grid gap-x-6 w-full grid-cols-' +
         (w <= 640 ? '1' : w > 640 && w < 768 ? '2' : '3')
      );
   }

   /**
    * Similar a la función `grid`, esta función se encarga de la gestión de cuadrículas, pero se limita a dos columnas (`grid-cols-1` o `grid-cols-2`) en función del ancho de pantalla.
    *
    * @param el - Elemento HTML del cual se obtendrá el ancho.
    * @returns Una cadena que representa la clase CSS para el diseño de cuadrícula limitado a dos columnas.
    */
   half_grid(el: HTMLFormElement | HTMLDivElement | HTMLElement): string {
      return (
         'grid gap-x-6 ' + (this.width(el) <= 768 ? 'grid-cols-1' : 'grid-cols-2')
      );
   }

   /**
    * Gestiona la propiedad `col-span` en un diseño de cuadrícula.
    * Dependiendo del ancho del elemento HTML, aplica una clase CSS (`col-span-1`, `col-span-2` o `col-span-3`) que controla cuántas columnas del diseño de cuadrícula debe abarcar un elemento.
    *
    * @param el - Elemento HTML del cual se obtendrá el ancho.
    * @returns Una cadena que representa la clase CSS para la propiedad `col-span` en el diseño de cuadrícula.
    */
   full(el: HTMLFormElement | HTMLDivElement | HTMLElement): string {
      return this.width(el) <= 640
         ? 'col-span-1'
         : this.width(el) > 640 && this.width(el) < 768
            ? 'col-span-2'
            : 'col-span-3';
   }

   /**
    * Obtiene el ancho (`offsetWidth`) del elemento HTML pasado como argumento.
    *
    * @param el - Elemento HTML del cual se obtendrá el ancho.
    * @returns El ancho del elemento HTML.
    */
   width(el: HTMLFormElement | HTMLDivElement | HTMLElement): number {
      return el.offsetWidth;
   }

   /**
    * Obtiene el alto (`offsetHeight`) del elemento HTML pasado como argumento.
    *
    * @param el - Elemento HTML del cual se obtendrá el ancho.
    * @returns El ancho del elemento HTML.
    */
   height(el: HTMLFormElement | HTMLDivElement | HTMLElement): number {
      return el.offsetHeight;
   }

   /**
    * Aplica estilos CSS para resaltar visualmente un control de formulario como inválido si ha sido tocado y es inválido.
    *
    * @param control - Control de formulario a evaluar.
    * @returns Una cadena que representa las clases CSS para resaltar el control como inválido.
    */
   invalid(control: FormControl | AbstractControl): string {
      return control.invalid && control.touched
         ? 'border-2 !border-red-500 !text-red-500'
         : '';
   }

   /**
    * Aplica estilos CSS para ajustar la posición de la etiqueta de un control de formulario en función de su estado.
    *
    * @param control - Control de formulario a evaluar.
    * @returns Una cadena que representa las clases CSS para ajustar la posición de la etiqueta.
    */
   label(control: any): string {
      return control ? '-top-2 text-xs' : '';
   }

   /**
    * Determina la orientación del diseño flex (columna o fila) en función del ancho del elemento HTML.
    *
    * @param el - Elemento HTML del cual se obtendrá el ancho.
    * @returns Una cadena que representa la clase CSS para la orientación del diseño flex.
    */
   flex_col(el: HTMLFormElement | HTMLDivElement | HTMLElement): string {
      return this.width(el) <= 768 ? 'flex-col' : 'flex-row';
   }

   /**
    * Determina la orientación del diseño flex (fila o columna) en función del ancho del elemento HTML.
    *
    * @param el - Elemento HTML del cual se obtendrá el ancho.
    * @returns Una cadena que representa la clase CSS para la orientación del diseño flex.
    */
   flex_row(el: HTMLFormElement | HTMLDivElement | HTMLElement): string {
      return this.width(el) <= 768 ? 'flex-row' : 'flex-col';
   }

   drawer_mode(cc: HTMLFormElement | HTMLDivElement | HTMLElement): MatDrawerMode {
      return this.width(cc) >= 768 ? 'side' : 'over' as MatDrawerMode
   }

   change_theme() {
      this.theme = !this.theme;
      document.documentElement.classList.toggle('dark');
   }
}
