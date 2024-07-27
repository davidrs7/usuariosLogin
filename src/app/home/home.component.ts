import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionDTO, UserDTO } from '../dto/user.dto';
import { AdminMsgErrors } from '../dto/utils.dto';
import { UserService } from '../_services/user.service';
import { loginTiinduxService } from '../_services/UserLogin/loginTiidux.service';
import { ApiResponse } from '../dto/loginTiindux/genericResponse';
import Swal from 'sweetalert2';
import { reqlogin } from 'src/app/Interfaces/UserLogin';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: UserDTO = { id: 0, userName: '', password: '' };
  sessionValid: boolean = true;
  loginValid: boolean = true;
  canva: boolean = true;
  rutaApi: string = 'Login';
  sesion: any = {};

  errors: AdminMsgErrors = new AdminMsgErrors();
  form!: FormGroup;

  constructor(private router: Router, private userService: UserService, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      userName: new FormControl(this.user.userName, Validators.required),
      password: new FormControl(this.user.password, Validators.required)
    });

    switch (localStorage.getItem('SESSL')) {
      case '0':
        this.sessionValid = false;
        localStorage.removeItem('SESSL');
        localStorage.removeItem('SESST');
        break;
      case '1':
        this.router.navigateByUrl('modules');
        break;
    }

    this.canva = false;
  }

  get userName() { return this.form.get('userName'); }
  get password() { return this.form.get('password'); }


  //Login SQL
  validateUser() {
    this.form.markAllAsTouched();
    if (this.form.status == 'VALID') {
      this.canva = true;
      this.user = this.errors.mapping(this.user, this.form);
      this.userService.loginEndpoint(this.user).subscribe(
        (response: any) => {
          if (response) {
            this.loginValid = true;
            this.userService.createSessionEndpoint(this.user).subscribe(
              (session: SessionDTO) => {
                if (session != null && session.token != '') {
                  localStorage.setItem('SESSL', '1');
                  localStorage.setItem('SESST', session.token);
                  this.router.navigateByUrl('modules');
                } else {
                  localStorage.setItem('SESSL', '0');
                  localStorage.removeItem('SESST');
                  this.sessionValid = false;
                  this.canva = false;
                }
              }
            );
          } else
            this.loginValid = false;
        }
      );
    }
  }

  nuevoLogin() {
    const body: reqlogin = {
      usuario: this.form.get('userName')?.value,
      pw: this.form.get('password')?.value
    };
    this.loginServices.Login(this.rutaApi, body)
      .subscribe((respuesta: ApiResponse<any>) => {
        this.sesion = respuesta.data;
        this.validarLogin(this.sesion);
      },
        (error) => {
        }
      );
  }

  // Login CRUD
  validarLogin(sesion: any) {
    if (sesion != null) {
      localStorage.setItem('SESSL', '1');
      localStorage.setItem('SEUID', this.sesion.usuarioId);
      localStorage.setItem('SESST', this.sesion.token);
      this.router.navigateByUrl('modules');
    } else {
      this.loginValid = false;
    }
  }

  nuevoLogout() {
    var token = localStorage.getItem('SESST');
    if (localStorage.getItem('SESSL') != '1') {
      this.router.navigateByUrl('');
    } else {
      var token = localStorage.getItem('SESST');
      if (token != null && token != '') {
        var userId = localStorage.getItem('SEUID');
        this.loginServices.eliminarDato('Sesion', Number(userId)).subscribe(
          (respuesta: ApiResponse<any>) => {
            this.destroySession();
          }
        );
      } else {
        this.destroySession();
      }
    }

  }


  destroySession() {
    localStorage.setItem('SESSL', '0');
    this.router.navigateByUrl('');
  }


}
