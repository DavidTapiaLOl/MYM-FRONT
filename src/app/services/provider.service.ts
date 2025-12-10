import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Injectable, inject } from '@angular/core';
import { utils } from '../../config';
import { SnackTypes, SnackBarChart } from '../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Tipo de datos que representa los métodos HTTP comunes utilizados en las solicitudes.
 *
 * @remarks
 * Este tipo forma parte de la plantilla realizada con Angular 17.
 *
 * @beta
 */
export declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Servicio que gestiona la manipulación de tokens JWT y la autenticación de usuarios.
 *
 * @remarks
 * Este servicio forma parte de la plantilla realizada con Angular 17.
 *
 * @beta
 */
@Injectable({
   providedIn: 'root',
})
export class ProviderService {
   _ls: LocalStorageService = inject(LocalStorageService);
   _snack: MatSnackBar = inject(MatSnackBar);
   _http: HttpClient = inject(HttpClient);

   excep: any = {
      "001": "Método de petición incorrecto",
      "002": "Clase incorrecta",
      "003": "Método inexistente",
      "006": "Token no enviado",
      "007": "Parámetros vacíos",
      // Login
      "004": "El usuario no existe",
      "005": "Credenciales inválidas",
   }

   /**
    * Realiza una solicitud a los servicios web de forma asíncrona.
    *
    * @remarks
    * Este método forma parte de la plantilla realizada con Angular 17.
    *
    * @template T - Tipo genérico que representa el tipo de datos esperado en la respuesta.
    *
    * @param method - El método HTTP utilizado para la solicitud ('GET' o 'POST' o 'PUT' o 'PATCH').
    * @param archivo - La ruta relativa a la URL base para la solicitud.
    * @param params - Parámetros opcionales que se incluirán en la solicitud (pueden ser datos de formulario o cuerpo de la solicitud).
    * @returns Los datos de la respuesta o se rechaza con un error.
    */
   async request<T>(method: Method, archivo: string, opcion: string, params?: any): Promise<T> {
      // Construye la URL completa utilizando la URL base y la ruta proporcionadas
      let url = utils.URL + "controller/" + archivo + ".php?opcion=" + opcion;
      //console.log(url, params);

      return new Promise<T>((resolve, reject) =>
         this._http
            .request<any>(method, url, {
               body: params,
               headers: this.headers(),
               params: method !== 'POST' ? this.params(params) : {},
            })
            .subscribe((response: any) => {

              resolve(response);
            })
      );
   }

   /**
    * Realiza una solicitud a los servicios de producción de forma asíncrona.
    *
    * @remarks
    * Este método forma parte de la plantilla realizada con Angular 17.
    *
    * @template T - Tipo genérico que representa el tipo de datos esperado en la respuesta.
    *
    * @param method - El método HTTP utilizado para la solicitud ('GET' o 'POST' o 'PUT' o 'PATCH').
    * @param url - La URL completa para la solicitud.
    * @param params - Parámetros opcionales que se incluirán en la solicitud (pueden ser datos de formulario o cuerpo de la solicitud).
    * @returns Los datos de la respuesta.
    */
   async production<T>(method: Method, url: string, params?: any): Promise<T> {
      //console.log(method, url, {...params});

      return new Promise<T>((resolve) =>
         this._http
            .request<any>(method, url, {...params})
            .subscribe((response: any) => {
               resolve(response);
            })
      );
   }

   /**
    * Obtiene las cabeceras para las solicitudes HTTP, incluyendo la autorización y otras cabeceras personalizadas.
    *
    * @remarks
    * Este método forma parte de la plantilla realizada con Angular 17.
    *
    * @returns Las cabeceras HTTP configuradas con la autorización y otras cabeceras necesarias.
    */
   headers(): HttpHeaders {
      return new HttpHeaders()
         .set('Authorization', this.get_token() || '')
         .set('Simpleauthb2b', '4170ae818f2e146c48cf824667947b25');
   }

   /**
    * Convierte los parámetros en una instancia de HttpParams, listos para ser incluidos en una solicitud HTTP.
    *
    * @remarks
    * Este método forma parte de la plantilla realizada con Angular 17.
    *
    * @param params - Los parámetros que se convertirán en una cadena codificada para su inclusión en la solicitud.
    * @returns Una instancia de HttpParams configurada con los parámetros proporcionados.
    */
   params(params: any): HttpParams {
      return new HttpParams().set(
         'params',
         encodeURIComponent(JSON.stringify(params))
      );
   }

   /**
    * Obtiene el token de autenticación almacenado en el sistema.
    *
    * @remarks
    * Este método forma parte de la plantilla realizada con Angular 17.
    *
    * @returns El token de autenticación almacenado en el sistema o una cadena vacía si no está disponible.
    */
   get_token(): string {
      return this._ls._get(utils.USER)?.token ?? '';
   }

   async snack(type: SnackTypes, message?: string): Promise<boolean> {
      this._snack.openFromComponent(SnackBarChart, {
         duration: 5000,
         data: { type, message }
      })
      return type == 'success';
   }

   async upload(file: File): Promise<string> {
      const formData = new FormData();
      formData.append('file', file);
      // Usamos la configuración de Cloudinary de tu archivo config.ts
      formData.append('upload_preset', utils.UPLOAD_CONFIG.upload_preset);

      return new Promise((resolve, reject) => {
         this._http.post(utils.UPLOAD_CONFIG.api_url, formData).subscribe({
            next: (res: any) => {
               // Retornamos la URL segura de la imagen
               resolve(res.secure_url);
            },
            error: (err) => {
               console.error('Error subiendo imagen', err);
               reject(err);
            }
         });
      });
   }
}
