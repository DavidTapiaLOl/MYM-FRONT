import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProviderService } from '../../services/provider.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private provider: ProviderService = inject(ProviderService);
  private FormBuilder: FormBuilder = inject(FormBuilder);
  private auth: AuthService = inject(AuthService);
  private router: Router = inject(Router)

  hide = true;

  Formulario: FormGroup = this.FormBuilder.group({
    usuario: [null, [Validators.required]],
    password: [null, [Validators.required]]
  })

  async onSubmit(){
    let login: any =(await this.auth.sign_in(this.Formulario.value.usuario,this.Formulario.value.password) as any)
    //console.log(login, this.auth.logged_in());

    if(login.estatus == true)
      this.router.navigate(['/dashboard'])


  }



}
