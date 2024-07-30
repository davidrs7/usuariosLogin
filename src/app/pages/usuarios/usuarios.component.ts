import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReqUsuarios } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { EmployeeService } from 'src/app/_services/employee/employee.service';
import { EmployeeDTO } from 'src/app/dto/employee/employee.dto';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  TipDocs: any[] = [];
  Sexo: any[] = [];
  Jefe: any[] = [];
  Roles: any[] = [];
  Empresa: any[] = [];
  estado: any;
  usuario: any[] = [];
  Cargos: any[] = [];
  canva: boolean = false;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  usuarioToEdit = false;
  rutaApi = 'User';
  usuarioSeleccionado: any;
  archivoUsers: File | null = null ;

  miControl = new FormControl();
  opciones: string[] = ['Opción 1', 'Opción 2', 'Opción 3'];
  opcionesFiltradas: Observable<string[]> | undefined;
  filtroUsuarios: any = {};
  tipoCargue: boolean = false;
  cargueArchivo: boolean = false;

  usuariosForm: FormGroup = this.fb.group({
    usuarioId: [0, []],
    nombre: ['', Validators.required],
    tipodocumento: [0, []],
    numdocumento: ['', Validators.required],
    correoelectronico: [''],
    contraseña: ['', Validators.required],
    telefono: [''],
    direccion: [''],
    fechanacimiento: [''],
    fechacreacion: [this.obtenerFechaActual(), []],
    sexoid: [0, Validators.required],
    jefeid: [0],
    rolid: [0, Validators.required],
    cargoid: [0, Validators.required],
    empresaid: [0],
    ususarioopcionalId: [1,[]],
    estado: [true, Validators.required],
    buscarDoc: ['', []],
  });

  constructor(private fb: FormBuilder, private employeeService: EmployeeService,private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService)
  {
  }



  filtrarUsuarios(event: any) {
    const filtro = event.target.value.toLowerCase();
    this.filtroUsuarios = this.usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(filtro)
    );
  }

  seleccionarUsuario(usuario: any) {
    this.usuariosForm.get('jefeid')?.setValue(usuario.usuarioId);
    this.miControl.setValue(usuario.nombre);
    this.filtroUsuarios = []

  }

  ngOnInit(): void {
    this.cargarLista();
  }

  tipocargue(tipCargue: number){

    if (tipCargue == 1){
      this.cargueArchivo = true
      this.tipoCargue = false
    }

    if (tipCargue == 2){
      this.tipoCargue = true
      this.cargueArchivo = false
    }

  }

    buscarUsuarios(){
      let documento = this.usuariosForm.get('buscarDoc')?.value
      this.usuario =  this.usuarios.filter(x => x.numDocumento == documento);
      if (this.usuario.length > 0 )
       this.editarUsuarios(this.usuario[0].usuarioId);
      else
      Swal.fire({
        icon: 'info',
        title: 'El usuario no existe',
        text: 'Por favor verifique el numero de documento'
      }).then((res:any) => {
        this.LimpiarFormulario();
      });
    }

  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }

  cargarLista(): void {

    //usuarios
    this.loginServices.GetAllData<any>(this.rutaApi).subscribe((respuesta: ApiResponse<any>) => {
      this.usuarios = respuesta.data;
    });

    this.loginServices.GetAllData<any>('TipoDocumento').subscribe((respuesta: ApiResponse<any>) => {
      this.TipDocs = respuesta.data;
    });

    this.loginServices.GetAllData<any>('Sexo').subscribe((respuesta: ApiResponse<any>) => {
      this.Sexo = respuesta.data;
    });

    this.loginServices.GetAllData<any>('Cargos').subscribe((respuesta: ApiResponse<any>) => {
      this.Cargos = respuesta.data;
    });

    this.loginServices.GetAllData<any>('Roles').subscribe((respuesta: ApiResponse<any>) => {
      this.Roles = respuesta.data;

    });

    this.loginServices.GetAllData<any>('Empresas').subscribe((respuesta: ApiResponse<any>) => {
      this.Empresa = respuesta.data;

    });
  }

  LimpiarFormulario() {
    this.usuariosForm.get('usuarioId')?.setValue(0);
    this.usuariosForm.get('nombre')?.setValue('');
    this.usuariosForm.get('tipodocumento')?.setValue(0);
    this.usuariosForm.get('numdocumento')?.setValue('');
    this.usuariosForm.get('correoelectronico')?.setValue('');
    this.usuariosForm.get('contraseña')?.setValue('');
    this.usuariosForm.get('direccion')?.setValue('');
    this.usuariosForm.get('fechanacimiento')?.setValue('');
    this.usuariosForm.get('fechacreacion')?.setValue( this.obtenerFechaActual());
    this.usuariosForm.get('telefono')?.setValue('');
    this.usuariosForm.get('sexoid')?.setValue(0);
    this.usuariosForm.get('jefeid')?.setValue(0);
    this.usuariosForm.get('rolid')?.setValue(0);
    this.usuariosForm.get('cargoid')?.setValue(0);
    this.usuariosForm.get('empresaid')?.setValue(0);
    this.usuariosForm.get('tipodocumento')?.setValue(0);
    this.usuariosForm.get('ususarioopcionalId')?.setValue(0);
    this.usuariosForm.get('estado')?.setValue(true);
    this.usuariosForm.get('buscarDoc')?.setValue('');
    this.miControl.setValue('');
    this.cargarLista();
    this.canva = false
    this.usuarioToEdit = false;
    this.cargueArchivo = false;
    this.tipoCargue = false;

  }

  eliminarUsuarios(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error: Usuarios asociados a este rol" : respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res:any) => {
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

  guardaUsuarios() {
    const body: ReqUsuarios = {
      usuarioId: this.usuariosForm.get('usuarioId')?.value||0,
      nombre: this.usuariosForm.get('nombre')?.value,
      tipoDocumento: Number(this.usuariosForm.get('tipodocumento')?.value),
      numDocumento: this.usuariosForm.get('numdocumento')?.value,
      correoElectronico: this.usuariosForm.get('correoelectronico')?.value,
      contraseña: this.usuariosForm.get('contraseña')?.value,
      telefono: this.usuariosForm.get('telefono')?.value,
      direccion: this.usuariosForm.get('direccion')?.value,
      fechaNacimiento: this.usuariosForm.get('fechanacimiento')?.value,
      fechaCreacion: this.usuariosForm.get('fechacreacion')?.value,
      sexoId: Number(this.usuariosForm.get('sexoid')?.value),
      jefeId: Number(this.usuariosForm.get('jefeid')?.value) || 0,
      rolId: Number(this.usuariosForm.get('rolid')?.value),
      cargoId: Number(this.usuariosForm.get('cargoid')?.value) || 0,
      empresaId: Number(this.usuariosForm.get('empresaid')?.value),
      usuarioIdOpcional: this.usuariosForm.get('ususarioopcionalId')?.value,
      estado: this.usuariosForm.get('estado')?.value == "true" ? true : false,
    };
    if (this.validarcampos()) {
      let resp = this.usuarioToEdit == true ? this.ActualizarUsuarios(body) : this.CrearUsuarios(body)
    }
  }


  validarcampos(): boolean {
    const formControls = this.usuariosForm.controls;
    for (const controlName in formControls) {
      if (formControls.hasOwnProperty(controlName)) {
        const control = formControls[controlName];
        if (control.validator && control.validator({} as any) && control.validator({} as any).required) {
          if (control.value === null || control.value === undefined || control.value === '') {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Por favor valida los campos obligatorios'
            });
            return false;
          }
        }
      }
    }
    return true;
  }

  actualizarEmployee(body: any){
    const bodyEmployee: any = {
      id: body.usuarioIdOpcional,
      department: "",
      jobId: body.cargoId,
      jobName: "",
      jobProfile: "",
      statusId: 1,
      statusName: "",
      maritalStatusName: "",
      docTypeId: body.tipoDocumento,
      docTypeName: "",
      docIssueCityName: "",
      contractTypeId: "",
      contractTypeName: "",
      jobCityName: "",
      bankingEntityName: "",
      doc: body.numDocumento,
      docIssueDate: body.fechaNacimiento,
      name: body.nombre,
      sex: this.Sexo.filter(x => x.sexoId == body.sexoId)[0].descripcion,
      birthDate: body.fechaNacimiento,
      rh: "",
      corpCellPhone: "",
      cellPhone: body.telefono,
      phone: body.telefono,
      email: body.correoElectronico,
      employmentDate: body.fechaCreacion,
      bankAccount: "",
      bankAccountType: "",
      hasVaccine: false,
      vaccineMaker: "",
      vaccineDose: "",
      hasVaccineBooster: false,
      photoUrl: "",
      colorHex: "",
      photo: undefined
    };

    this.employeeService.editEndpoint(bodyEmployee).subscribe(
      (rsp: any) => {
        console.log('Employee actualizado....');
      });
  }


  ActualizarUsuarios(body: ReqUsuarios) {

    this.actualizarEmployee(body);
    this.loginServices.UpdateData(this.rutaApi, this.usuario[0].usuarioId, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {

          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res:any) => {
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

  crearDataEmployee(body: any): Promise<number> {

    return new Promise<number>((resolve, reject) => {
      const bodyEmployee: any = {
        id: body.usuarioId,
        department: "",
        jobId: body.cargoId,
        jobName: "",
        jobProfile: "",
        statusId: 1,
        statusName: "",
        maritalStatusName: "",
        docTypeId: body.tipoDocumento,
        docTypeName: "",
        docIssueCityName: "",
        contractTypeId: "",
        contractTypeName: "",
        jobCityName: "",
        bankingEntityName: "",
        doc: body.numDocumento,
        docIssueDate: body.fechaNacimiento,
        name: body.nombre,
        sex: this.Sexo.filter(x => x.sexoId == body.sexoId)[0].descripcion,
        birthDate: body.fechaNacimiento,
        rh: "",
        corpCellPhone: "",
        cellPhone: body.telefono,
        phone: body.telefono,
        email: body.correoElectronico,
        employmentDate: body.fechaCreacion,
        bankAccount: "",
        bankAccountType: "",
        hasVaccine: false,
        vaccineMaker: "",
        vaccineDose: "",
        hasVaccineBooster: false,
        photoUrl: "",
        colorHex: "",
        photo: undefined
      };

      this.employeeService.addEndpoint(bodyEmployee).subscribe(
        (employeeId: number ) => {
          console.log(employeeId);
          resolve(employeeId);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  async CrearUsuarios(body: ReqUsuarios) {
    //this.canva = true
    let idEmployee= await  this.crearDataEmployee(body);
    console.log(idEmployee);
    body.usuarioIdOpcional  = idEmployee;
    this.loginServices.createData(this.rutaApi, body)
      .subscribe(
        (respuesta: ApiResponse<any>) => {

          Swal.fire({
            icon: 'success',
            title: 'Mensaje: ' + respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res:any) => {
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



  editarUsuarios(id: number) {
    this.usuarioToEdit = true;
    this.usuario = this.usuarios.filter(x => x.usuarioId == id);
    this.usuariosForm.get('usuarioId')?.setValue(this.usuario[0].usuarioId);
    this.usuariosForm.get('nombre')?.setValue(this.usuario[0].nombre);
    this.usuariosForm.get('tipodocumento')?.setValue(this.usuario[0].tipoDocumento);
    this.usuariosForm.get('numdocumento')?.setValue(this.usuario[0].numDocumento);
    this.usuariosForm.get('contraseña')?.setValue(this.usuario[0].contraseña);
    this.usuariosForm.get('correoelectronico')?.setValue(this.usuario[0].correoElectronico);
    this.usuariosForm.get('telefono')?.setValue(this.usuario[0].telefono);
    this.usuariosForm.get('direccion')?.setValue(this.usuario[0].direccion);
    this.usuariosForm.get('fechanacimiento')?.setValue(this.convertirFormatoFecha(this.usuario[0].fechaNacimiento));
    this.usuariosForm.get('fechacreacion')?.setValue( this.obtenerFechaActual());
    this.usuariosForm.get('sexoid')?.setValue(this.usuario[0].sexoId);
    this.usuariosForm.get('jefeid')?.setValue(this.usuario[0].jefeId || 0);
    this.usuariosForm.get('rolid')?.setValue(this.usuario[0].rolId);
    this.usuariosForm.get('cargoid')?.setValue(this.usuario[0].cargoId);
    this.usuariosForm.get('empresaid')?.setValue(this.usuario[0].empresaId);
    this.usuariosForm.get('ususarioopcionalId')?.setValue(this.usuario[0].usuarioIdOpcional || 1);
    this.usuariosForm.get('estado')?.setValue(this.usuario[0].estado);
    this.seleccionarUsuario(this.usuarios.filter(x=> x.usuarioId == this.usuario[0].jefeId)[0]);
  }

  obtenerFechaActual(): string {
    const fechaActual: Date = new Date();
    const fechaFormateada: string = `${fechaActual.getFullYear()}-${this.dosDigitos(fechaActual.getMonth() + 1)}-${this.dosDigitos(fechaActual.getDate())}`;
    return fechaFormateada;
  }

   convertirFormatoFecha(fechaISO: string): string {
    const fechaObj = new Date(fechaISO);

    const año = fechaObj.getFullYear();
    const mes = ('0' + (fechaObj.getMonth() + 1)).slice(-2);
    const dia = ('0' + fechaObj.getDate()).slice(-2);

    return `${año}-${mes}-${dia}`;
  }


  dosDigitos(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  seleccionArchivo(event: any): void {
    this.archivoUsers = <File>event.target.files[0];
  }

  cargaUsers(): void {
    const inputElement = <HTMLInputElement>document.getElementById('archivoUser');
    if (inputElement.files && inputElement.files.length > 0) {
      this.archivoUsers = inputElement.files[0];
    }
    if (this.archivoUsers !== null && this.validarArchivo(this.archivoUsers)) {
      const fd = new FormData();
      fd.append('file', this.archivoUsers, this.archivoUsers.name);
      this.canva = true;
      this.loginServices.cargaMasivaUsers('User/cargar-usuarios',fd).subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: 'success',
            title:  respuesta.estado.descripcion,
            text: 'Codigo: ' + respuesta.estado.codigo
          }).then((res:any) => {
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'error: ' ,
        text: 'Por favor selecciona un archivo valido (.csv) '
      }).then((res:any) => {
        return;
      });
    }


  }


  validarArchivo(archivo: File): boolean{
    let archivoValido = true;

    if (archivo.type != "text/csv"){
        archivoValido = false
    }

    return archivoValido;


  }


}
