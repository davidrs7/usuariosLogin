import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReqRoles } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  colorResp: any[] = [];
  estado: any;
  rol: any[] = [];
  canva: boolean = false;

  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  roleToEdit = false;
  rutaApi = 'Roles';
  roleForm: FormGroup = this.fb.group({
    rolId: [0, []],
    empresaId: [0, []],
    nombre: ['', Validators.required],
    descripcion: ['', [Validators.required]],
    color: ['#00ff00', [Validators.required]],
    estado: [true, []],
  });
  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargarLista();
  }

  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }

  cargarLista(): void {
    this.loginServices.GetAllData<any>(this.rutaApi).subscribe((respuesta: ApiResponse<any>) => {
      this.roles = respuesta.data;
    });
  }

  eliminarRoles(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error: Usuarios o permisos asociados a este rol" : respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
            this.LimpiarFormulario();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
          this.LimpiarFormulario();
        }
      );
  }

  async guardaRoles() {
    let idColor = await this.obtenerIdColor(this.roleForm.get('color')?.value);

    const body: ReqRoles = {
        rolId: this.roleForm.get('rolId')?.value,
        nombre: this.roleForm.get('nombre')?.value,
        descripcion: this.roleForm.get('descripcion')?.value,
        ColorId: idColor,
        empresaId: 1, // this.roleForm.get('empresaId')?.value,
        estado: this.roleForm.get('estado')?.value == "true" ? true : false,
    };

    if (this.validarcampos()) {
        let resp = this.roleToEdit ? await this.ActualizarRoles(body) : await this.CrearRoles(body);
    }
}

  async obtenerIdColor(colorHex: string): Promise<number> {
    let idColor: number;
    this.colorResp = [];

    return new Promise<number>((resolve, reject) => {
        this.loginServices.getColorId<any>('Colores/colorHex', colorHex).subscribe(
            async (respuesta: ApiResponse<any>) => {
                this.colorResp.push(respuesta.data);
                if (this.colorResp[0].id == 0) {
                    idColor = await this.crearColor();
                } else {
                    idColor = this.colorResp[0].id;
                }
                resolve(idColor);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

crearColor(): Promise<number> {
  return new Promise<number>((resolve, reject) => {
      const bodyColor: any = {
          id: 0,
          Hex: this.getRandomColor(),
          Avalaible: 1,
      };

      this.loginServices.createData<any>('Colores', bodyColor).subscribe(
          async (respuesta: ApiResponse<any>) => {
              const newIdColor = await this.obtenerIdColor(bodyColor.Hex);
              resolve(newIdColor);
          },
          (error) => {
              reject(error);
          }
      );
  });
}
  getRandomColor(): string {
    var r = Math.abs(Math.floor(Math.random() * 251)).toString(16);
    var g = Math.abs(Math.floor(Math.random() * 252)).toString(16);
    var b = Math.abs(Math.floor(Math.random() * 253)).toString(16);

    if(r.length == 1)
      r = '0' + r;
    if(g.length == 1)
      g = '0' + g;
    if(b.length == 1)
      b = '0' + b;

    var color = "#" + r + g + b;
    return color.toUpperCase();
  }

  async obtenerHexColor(idColor: number): Promise<string> {
    let colorHex:string;
    this.colorResp = [];

    return new Promise<string>((resolve, reject) => {
        this.loginServices.getDatabyId<any>('Colores', idColor).subscribe(
            async (respuesta: ApiResponse<any>) => {
                this.colorResp.push(respuesta.data);
                colorHex = this.colorResp[0].hex;
                resolve(colorHex);
            },
            (error) => {
                reject(colorHex);
            }
        );
    });
}


  validarcampos() {
    if (!this.roleForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    } else { return true }
  }
  ActualizarRoles(body: ReqRoles) {
    this.loginServices.UpdateData(this.rutaApi, this.rol[0].rolId, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
            this.LimpiarFormulario();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
          this.LimpiarFormulario();
        }
      );
  }

  CrearRoles(body: ReqRoles) {
    this.canva = true
    this.loginServices.createData(this.rutaApi, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res: any) => {
            this.LimpiarFormulario();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al realizar la solicitud. Por favor, inténtalo nuevamente.'
          });
          this.LimpiarFormulario();
        }
      );

  }

  async editarRoles(rolesId: number) {
    this.roleToEdit = true;
    this.rol = this.roles.filter(x => x.rolId == rolesId);
    let colorHex = await this.obtenerHexColor(this.rol[0].colorId);
    this.roleForm.get('rolId')?.setValue(this.rol[0].rolId);
    this.roleForm.get('empresaId')?.setValue(this.rol[0].empresaId);
    this.roleForm.get('nombre')?.setValue(this.rol[0].nombre);
    this.roleForm.get('color')?.setValue(colorHex);
    this.roleForm.get('descripcion')?.setValue(this.rol[0].descripcion);
    this.roleForm.get('estado')?.setValue(this.rol[0].estado == "true" ? true : false);
  }

  LimpiarFormulario() {
    this.roleForm.get('rolId')?.setValue(0);
    this.roleForm.get('empresaId')?.setValue(0);
    this.roleForm.get('nombre')?.setValue('');
    this.roleForm.get('descripcion')?.setValue('');
    this.roleForm.get('color')?.setValue('');
    this.roleForm.get('estado')?.setValue(true);
    this.cargarLista();
    this.canva = false
    this.roleToEdit = false;

  }



}

