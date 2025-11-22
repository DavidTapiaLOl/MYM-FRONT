import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const noauthGuard: CanActivateFn = (route, state) => {
  return  !inject(AuthService).logged_in();
};
