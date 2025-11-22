import { Injectable, inject } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { utils } from '../../config';
import { ProviderService } from './provider.service';
import { Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
import { MasterService } from './master.service';

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
export class AuthService {
   private _ls: LocalStorageService = inject(LocalStorageService);
   private _provider: ProviderService = inject(ProviderService);
   private _master: MasterService = inject(MasterService);
   private _router: Router = inject(Router);

   /**
    * Inicia sesión de usuario utilizando credenciales proporcionadas y almacena el token de usuario en el almacenamiento local.
    *
    * @param email - Correo electrónico del usuario.
    * @param password - Contraseña del usuario.
    * @returns Una promesa que se resuelve con los datos del usuario o se rechaza con un error.
    */
   async sign_in(usuario: string, password: string) {
     let login: any = await this._provider.request('POST', 'login', 'Login',{ usuario, password })
     if (login.estatus == true ) {


      await this._ls._set(utils.USER, await this._provider.request('POST', 'login', 'Login',{ usuario, password }));
      return this._ls._get(utils.USER)
    }
    this._master.snack("error", "Usuario o contraseña incorrectos");
    return false
   }

   /**
    * Registra un nuevo usuario utilizando las credenciales proporcionadas.
    *
    * @param email - Correo electrónico del nuevo usuario.
    * @param password - Contraseña del nuevo usuario.
    * @returns Una promesa que se resuelve con los datos del usuario registrado o se rechaza con un error.
    */
   async sign_up(Form: any) {
      return await this._provider.request('POST', 'registro','Insert', Form);
   }

   /**
    * Cierra la sesión del usuario actual, eliminando el token almacenado y redirigiendo a la página de inicio de sesión.
    *
    * @returns Una promesa que se resuelve después de cerrar la sesión del usuario.
    */
   async sign_out() {
      await this._ls.clear();
      await this._router.navigate(['/login']);
   }

   async change_password(data: any): Promise<boolean> {
      if (await this._provider.request('POST', 'change_password', data)) {
         await this._router.navigate(['signin']);
         return this._master.snack('success');
      } else return this._master.snack('error')
   }

   /**
    * Obtiene el token de autenticación actualmente almacenado.
    *
    * @returns El token de autenticación almacenado o una cadena vacía si no está disponible.
    */
   get_token(): string {
      return this._ls._get(utils.USER)?.token ?? '';
   }

   /**
    * Obtiene los datos del usuario almacenados en el token de autenticación.
    *
    * @returns Los datos del usuario almacenados en el token decodificado o `null` si el token no está disponible.
    */
   get_user(): any {
      return this._ls._get(utils.USER) ?? null;
   }

   /**
    * Verifica si el usuario está actualmente autenticado.
    *
    * @returns `true` si el usuario está autenticado; de lo contrario, `false`.
    */
   logged_in(): boolean {
      return !!this.get_user();
   }

   /**
    * Encripta un token JWT utilizando el método Base64.
    *
    * @param token - El token JWT que se va a encriptar.
    * @returns El token encriptado en formato Base64.
    */
   /* encrypt(token: string): string {
      return btoa(JSON.stringify(jwtDecode(token)));
   } */

   /**
    * Desencripta el token JWT actualmente almacenado y devuelve los datos del usuario.
    *
    * @returns Los datos del usuario almacenados en el token desencriptado.
    */
   /* decrypt(): any {
      return JSON.parse(atob(this.encrypt(this.get_token())));
   } */
}
