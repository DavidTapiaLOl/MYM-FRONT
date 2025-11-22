import { Injectable } from '@angular/core';
/**
 * Servicio que proporciona métodos para interactuar con el almacenamiento local del navegador.
 *
 * @remarks
 * Este servicio forma parte de la plantilla realizada con Angular 17..
 *
 * @beta
 */
@Injectable({
   providedIn: 'root',
})
export class LocalStorageService {
   /**
    * Objeto que representa el almacenamiento local del navegador.
    */
   private ls = typeof window !== 'undefined' ? window.localStorage : undefined;

   /**
    * Almacena un valor en el almacenamiento local bajo una clave específica.
    *
    * @param key - La clave bajo la cual se almacenará el valor.
    * @param value - El valor que se almacenará.
    * @returns `true` si la operación fue exitosa; de lo contrario, `false`.
    */
   public _set(key: string, value: any): boolean {
      this.ls?.setItem(key, JSON.stringify(value));
      return true;
   }

   /**
    * Obtiene un valor del almacenamiento local utilizando una clave específica.
    *
    * @param key - La clave bajo la cual se buscará el valor.
    * @returns El valor almacenado bajo la clave dada, o `null` si no se encuentra.
    */
   public _get(key: string): any {
      return JSON.parse(this.ls?.getItem(key) || 'null');
   }

   /**
    * Actualiza un valor en el almacenamiento local bajo una clave específica.
    *
    * @param key - La clave bajo la cual se actualizará el valor.
    * @param value - El nuevo valor que se almacenará.
    * @returns `true` si la operación fue exitosa; de lo contrario, `false`.
    */
   public update(key: string, value: any[]): boolean {
      this.remove(key);
      return this._set(key, value);
   }

   /**
    * Elimina un valor del almacenamiento local utilizando una clave específica.
    *
    * @param key - La clave bajo la cual se eliminará el valor.
    * @returns `true` si la operación fue exitosa; de lo contrario, `false`.
    */
   public remove(key: string): boolean {
      this.ls?.removeItem(key);
      return true;
   }

   /**
    * Elimina todos los valores del almacenamiento local.
    *
    * @returns `true` si la operación fue exitosa; de lo contrario, `false`.
    */
   public clear(): boolean {
      this.ls?.clear();
      return true;
   }
}
