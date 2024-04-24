import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PRIMARY_OUTLET, Router, UrlSegment, UrlSegmentGroup, UrlTree } from '@angular/router';
import { NavigateIndex, NavigateIndexKey } from '../../dto/utils.dto';
import { UserService } from '../../_services/user.service';
import { UserDTO } from '../../dto/user.dto';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  component: string = '';
  selected: string = '';
  secSelected: string = '';
  session: any[] = []; 

  user: UserDTO = { id: 0, userName: '', password: '' };
  userName: string = '';
  navigate: NavigateIndex = {};
  secNavigate: NavigateIndexKey[] = [];

  @Output() getUser = new EventEmitter<UserDTO>();

  constructor(private router: Router, private userService: UserService, private loginTiindux: loginTiinduxService) { }

  ngOnInit(): void {
    // this.sessionValidate();
    this.sesionActiva();
    this.initNavigate();
    this.initComponentRef();
  }

  initComponentRef() {
    const urlTree: UrlTree = this.router.parseUrl(this.router.url);
    const urlGroup: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    const urlSegments: UrlSegment[] = urlGroup.segments;

    if (urlSegments.length > 2 && urlSegments[0].path != '' && urlSegments[0].path == 'pages')
      this.component = urlSegments[1].path;

    if (urlSegments.length > 0 && urlSegments[0].path != '' && this.component.length == 0)
      this.component = urlSegments[0].path;

    this.secNavigate = [];
    if (urlSegments.length > 1 && urlSegments[1].path != '') {
      this.selected = urlSegments[1].path;
      if (this.navigate[this.component] != null && this.navigate[this.component].length > 0)
        for (var i = 0; i < this.navigate[this.component].length; i++)
          if (this.navigate[this.component][i].name == this.selected) {
            this.secNavigate = this.navigate[this.component][i].children ?? [];
            break;
          }
    }

    if (urlSegments.length > 2 && urlSegments[2].path != '')
      this.secSelected = urlSegments[2].path;
  }

  initNavigate() {
    this.navigate['employees'] = [];
    this.navigate['employees'].push({ name: 'employee', title: 'Funcionarios', faClass: 'fa-users', routing: 'employees/employee/list' });
    this.navigate['employees'].push({ name: 'department', title: 'Departamentos', faClass: 'fa-diagram-next', routing: 'employees/department/list' });
    this.navigate['employees'].push({ name: 'job', title: 'Cargos', faClass: 'fa-user-tie', routing: 'employees/job/list' });
    this.navigate['employees'].push({ name: 'settings', title: 'Ajustes', faClass: 'fa-gear' });

    this.navigate['recruiter'] = [];
    this.navigate['recruiter'].push({
      name: 'vacancy', title: 'Vacantes', faClass: 'fa-users-rectangle', routing: 'recruiter/vacancy/list', children: [
        { name: 'list', title: 'Lista de vacantes', routing: 'recruiter/vacancy/list' },
        { name: 'add', title: 'Agregar vacante', faClass: 'fa-plus', routing: 'recruiter/vacancy/add' }
      ]
    });
    this.navigate['recruiter'].push({ name: 'postulate', title: 'Postulados', faClass: 'fa-user-plus', routing: 'recruiter/postulate/list' });
    this.navigate['recruiter'].push({
      name: 'historical', title: 'Histórico', faClass: 'fa-timeline', routing: 'recruiter/historical/list-vacancy', children: [
        { name: 'list-vacancy', title: 'Vacantes históricas', routing: 'recruiter/historical/list-vacancy' },
        { name: 'list-postulate', title: 'Postulados históricos', routing: 'recruiter/historical/list-postulate' }
      ]
    });
    this.navigate['recruiter'].push({
      name: 'step', title: 'Etapas', faClass: 'fa-shoe-prints', routing: 'recruiter/step/list', children: [
        { name: 'list', title: 'Lista de etapas', routing: 'recruiter/step/list' },
        { name: 'add', title: 'Agregar etapa', faClass: 'fa-plus', routing: 'recruiter/step/add' },
        { name: 'fields', title: 'Lista de campos asociados', routing: 'recruiter/step/fields' },
        { name: 'add-field', title: 'Agregar campo', faClass: 'fa-plus', routing: 'recruiter/step/add-field' }
      ]
    });

    this.navigate['survey'] = [];
    this.navigate['survey'].push({ name: 'pending', title: 'Mis Encuestas', faClass: 'fa-magnifying-glass-chart', routing: 'survey/pending/list' });
    this.navigate['survey'].push({
      name: 'survey', title: 'Encuestas', faClass: 'fa-square-poll-vertical', routing: 'survey/survey/list', children: [
        { name: 'list', title: 'Lista de encuestas', routing: 'survey/survey/list' },
        { name: 'add', title: 'Agregar encuesta', faClass: 'fa-plus', routing: 'survey/survey/add' },
        { name: 'fields', title: 'Lista de campos asociados', routing: 'survey/survey/fields' },
        { name: 'add-field', title: 'Agregar campo', faClass: 'fa-plus', routing: 'survey/survey/add-field' }
      ]
    });

    this.navigate['performance'] = [];
    this.navigate['performance'].push({ name: 'objetiveUser', title: 'Objetivos', faClass: 'fas fa-trophy', routing: 'pages/performance/objetiveUser' });
    this.navigate['performance'].push({ name: 'compUser', title: 'Competencias', faClass: 'fas fa-check-double', routing: 'pages/performance/compUser' });
    this.navigate['performance'].push({ name: 'compUser', title: 'Resumen', faClass: 'fa-solid fa-square-poll-vertical', routing: 'pages/performance/reportes' });

  }

  sessionValidate() {
    if (localStorage.getItem('SESSL') != '1') {
      this.router.navigateByUrl('');
    } else {
      var token = localStorage.getItem('SESST');
      if (token != null && token != '') {
        this.userService.userByTokenEndpoint(token).subscribe(
          (userResponse: UserDTO) => {
            if (userResponse != null) {
              this.user = userResponse;
              this.userName = (this.user.name != null && this.user.name != '') ? this.user.name.trim().substring(0, this.user.name.indexOf(' ')) : this.user.userName;
              this.getUser.emit(this.user);
              //console.log(this.user); //PENDIENTE
            } else {
              this.destroySession();
            }
          }
        );
      } else {
        this.destroySession();
      }
    }
  }

  open(module?: string) {
    if (module != null && module != '')
      this.router.navigateByUrl(module);
  }

  logout() {
    var token = localStorage.getItem('SESST');
    if (token != null && token != '') {
      this.userService.destroySessionEndpoint(token).subscribe(
        (response: any) => {
          localStorage.removeItem('SESSL');
          localStorage.removeItem('SESST');
          this.router.navigateByUrl('');
        }
      );
    } else {
      this.destroySession();
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
        this.loginTiindux.eliminarDato('Sesion', Number(userId)).subscribe(
          (respuesta: ApiResponse<any>) => { 
            this.destroySession();
          }
        );
      } else {
        this.destroySession();
      }
    }

  }

  sesionActiva() {
    if (localStorage.getItem('SESSL') != '1') {
      this.router.navigateByUrl('');
    } else {
      var token = localStorage.getItem('SESST');
      if (token != null && token != '') {
        this.loginTiindux.tokenSesion('Sesion/token', token).subscribe(
          (respuesta: ApiResponse<any>) => { 
            if (respuesta.data == null) { 
              this.nuevoLogout();
              this.destroySession();
            } else {               
              this.asignaToken(respuesta.data)               
            }
          }
        );

      }
    }

  }

  asignaToken(session:any){
    localStorage.setItem('SESSL', '1');
    localStorage.setItem('SEUID', session.usuarioId);
    localStorage.setItem('SESST', session.token); 
  }
  
  destroySession() {
    localStorage.setItem('SESSL', '0');
    this.router.navigateByUrl('');
  }

}
