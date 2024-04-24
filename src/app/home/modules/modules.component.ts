import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {
  modalReference: any = {};
  userName: string = '';
  user!: UserDTO;
  canva: boolean = false;
  Permisos: any[] = [];
  Permiso: any;
  rolesPermisos: any[] = [];
  rolPermiso: any;
  usario: any;
  Acceso: boolean = false;
  rutaFoto: string = ''
  

  constructor(private modalService: NgbModal, private router: Router, private userService: UserService, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargalistas();
    if (localStorage.getItem('SESSL') != '1') {
      this.router.navigateByUrl('');
    } else {
      var token = localStorage.getItem('SESST');
      if (token != null && token != '') {
        // this.validartoken(token); //david
      } else {
        localStorage.setItem('SESSL', '0');
        this.router.navigateByUrl('');
      }
    }
 
  }


  validartoken(token: string) {
    this.userService.userByTokenEndpoint(token).subscribe(
      (user: UserDTO) => {
        if (user != null) {
          this.user = user;
          if (this.user.name != null && this.user.name != '') {
            var nameSplit: string[] = this.user.name.trim().split(' ');
            this.userName = (nameSplit.length < 4) ? nameSplit[0] : (nameSplit[0] + ' ' + nameSplit[1]);
          } else {
            this.userName = this.user.userName;
          }
          this.canva = false;
        } else {
          localStorage.setItem('SESSL', '0');
          this.router.navigateByUrl('');
        }
      }
    );
  }



  openModule(module: string) {
    let permiso = this.Permisos.filter(x => x.rutaAngular == module);
    let idRol = this.usario.rolId || 0;
    let idpermiso = permiso.length > 0 ? permiso[0].permisoId : 0;
    let existepermiso = this.rolesPermisos.filter(x => x.permisoID == idpermiso && x.rolID == idRol);

    if (existepermiso.length > 0) {
      this.Acceso = false
      this.router.navigateByUrl(module);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Error',
        text: 'No tienes acceso a este modulo, por favor comunicate con el administrador.'
      });
    }


    this.closeModal();
  }

  openModal(content: any) {
    this.modalReference = this.modalService.open(content, { size: 'lg' });
  }

  closeModal() {
    if (this.modalReference != null)
      this.modalReference.close();
  }

  rutaImagen(ruta: string) {

    let rutaImg = ''

    if (ruta == 'rrhh'      ) { rutaImg = '../../assets/Icono_RRHH_2.png' } 
    if (ruta == 'BIENESTAR' ) { rutaImg = '../../assets/Icono_Bienestar.png' } 
    if (ruta == 'SST'       ) { rutaImg = '../../assets/Icono_SST.png' } 
    if (ruta == 'GESCON'    ) { rutaImg = '../../assets/Icono_Gestion_de_conocimiento.png' } 
    if (ruta == 'ADMON'     ) { rutaImg = '../../assets/Icono_Administracion.png' } 

    return rutaImg;
  }

  cambiarImagen(elemento: any, ruta: string) {
    const divElement = event.target as HTMLDivElement;
    const imgElement = divElement.querySelector('img') as HTMLImageElement; 
    if (ruta == 'rrhh') { imgElement.src = '../../assets/Icono_RRHH.png' }
    if (ruta == 'BIENESTAR') { imgElement.src = '../../assets/Icono_Bienestar_2.png' }
    if (ruta == 'SST') { imgElement.src = '../../assets/Icono_SST_2.png' }
    if (ruta == 'GESCON') { imgElement.src = '../../assets/Icono_Gestion_de conocimiento_2.png' }
    if (ruta == 'ADMON') { imgElement.src = '../../assets/Icono_Administracion_2.png' }
  }

  restaurarImagen(elemento:any,ruta: string) {
    const divElement = event.target as HTMLDivElement;
    const imgElement = divElement.querySelector('img') as HTMLImageElement;
    if (ruta == 'rrhh'      ) { imgElement.src = '../../assets/Icono_RRHH_2.png' } 
    if (ruta == 'BIENESTAR' ) { imgElement.src = '../../assets/Icono_Bienestar.png' } 
    if (ruta == 'SST'       ) { imgElement.src = '../../assets/Icono_SST.png' } 
    if (ruta == 'GESCON'    ) { imgElement.src = '../../assets/Icono_Gestion_de_conocimiento.png' } 
    if (ruta == 'ADMON'     ) { imgElement.src = '../../assets/Icono_Administracion.png' } 
  }

  cargalistas() {
    this.loginServices.GetAllData<any>('rolesPermisos').subscribe((respuesta: ApiResponse<any>) => {
      this.rolesPermisos = respuesta.data;
    });

    this.loginServices.GetAllData<any>('Permisos').subscribe((respuesta: ApiResponse<any>) => {
      this.Permisos = respuesta.data;

    });

    var iduser = localStorage.getItem('SEUID');

    this.loginServices.getDatabyId<any>('User', Number(iduser)).subscribe((respuesta: ApiResponse<any>) => {
      this.usario = respuesta.data

    })



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
            //console.log(respuesta.data)
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
