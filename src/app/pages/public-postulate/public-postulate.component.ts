import { PostulateDTO } from './../../dto/recruiter/postulate.dto';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParamsService } from 'src/app/_services/params.service';
import { PostulateService } from 'src/app/_services/recruiter/postulate.service';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-public-postulate',
  templateUrl: './public-postulate.component.html',
  styleUrls: ['./public-postulate.component.scss']
})
export class PublicPostulateComponent implements OnInit {

  fileName: string | null = null;
  captchaResponse: string | null = null;
  TipDocs: any[] = [];
  postulate: PostulateDTO = { id: 0, recruiterUserId: 0, findOutId: 0, docTypeId: 0, educationalLevelId: 0, expectedSalary: 0, offeredSalary: 0, doc: '', firstName: '', lastName: '', sex: '', rh: '', phone: '', cellPhone: '', email: '', career: '', description: '' };
  vacantList: VacantDTO[] = [];
  paramEducationalLevel: ParamsDTO[] = [];

  siteKey = '6LdszjcqAAAAADpUhY-JGzyTcEZjK89BpCOhTA2R';
  enviaInfo: string = "";
  postulateId: any;

  usuariosForm: FormGroup = this.fb.group({
    usuarioId: [0, []],
    nombrePostulante: ['', Validators.required],
    apellidosPostulante: ['', Validators.required],
    correoPostulante: ['', Validators.required],
    tipoDocumentoPostulante: [0, []],
    numdocumento: ['', Validators.required],
    correoelectronico: [''],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    fechanacimiento: [''],
    fechacreacion: [this.obtenerFechaActual(), []],
    estado: [true, Validators.required],
    educationalLevelId:[0,Validators.required],
    hvPostulante: ['', []],
    vacantesDisponibles: [0, []],

  });
  constructor(private fb: FormBuilder, private loginServices: loginTiinduxService, private vacantService: VacantService,private paramsService: ParamsService,private postulateService: PostulateService) { }

  ngOnInit(): void {

    this.cargarListas();

  }

  cargarListas() {

    this.loginServices.GetAllData<any>('TipoDocumento').subscribe((respuesta: ApiResponse<any>) => {

      this.TipDocs = respuesta.data;
    });

    this.vacantService.vacantListEndpoint().subscribe(
      (vacantListResult: VacantDTO[]) => {
        this.vacantList = vacantListResult;
      }
    );

    this.paramsService.educationalLevelEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramEducationalLevel = paramResponse;
      }
    );
  }

  LimpiarFormulario(){
    this.usuariosForm.get('nombrePostulante')?.setValue('');
    this.usuariosForm.get('apellidosPostulante')?.setValue('');
    this.usuariosForm.get('correoPostulante')?.setValue('');
    this.usuariosForm.get('tipoDocumentoPostulante')?.setValue(0);
    this.usuariosForm.get('numdocumento')?.setValue('');
    this.usuariosForm.get('telefono')?.setValue('');
    this.usuariosForm.get('direccion')?.setValue('');
    this.usuariosForm.get('fechanacimiento')?.setValue('');
    this.usuariosForm.get('vacantesDisponibles')?.setValue(0);
    this.usuariosForm.get('educationalLevelId')?.setValue(0);
    this.usuariosForm.get('hvPostulante')?.setValue('');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    } else {
      this.fileName = 'Ningún archivo seleccionado';
    }
  }

  enviarFormulario() {
    // if (this.enviaInfo.length > 0 && this.fileName != null) { // con captcha
    if (this.fileName != null) {
        this.postulate.firstName = this.usuariosForm.get('nombrePostulante')?.value;
        this.postulate.lastName  = this.usuariosForm.get('apellidosPostulante')?.value;
        this.postulate.email     = this.usuariosForm.get('correoPostulante')?.value;
        this.postulate.docTypeId = Number(this.usuariosForm.get('tipoDocumentoPostulante')?.value) || 0;
        this.postulate.doc       = this.usuariosForm.get('numdocumento')?.value;
        this.postulate.phone     = this.usuariosForm.get('telefono')?.value;
        this.postulate.birthDate = this.usuariosForm.get('fechanacimiento')?.value;
        this.postulate.educationalLevelId = Number(this.usuariosForm.get('educationalLevelId')?.value) || 0;
        this.postulate.recruiterUserId = Number(1); //setear usuario admin (usualmente es el 1)
        this.postulate.findOutId = 2; //páginas ofertas laborales
      this.postulateService.addPostulateEndpoint(this.postulate).subscribe(
        (postulateId: any) => {
          this.crearVacanteRelacion(postulateId);
        });

    } else if (this.fileName == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor adjunta la hoja de vida',
        text: ''
      })
    }
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Por favor resuelve el captcha',
        text: ''
      })
    }
  }

  crearVacanteRelacion(idPostulado: number){

    const bodyPostulateVacantRel = {
      VacantId : this.usuariosForm.get('vacantesDisponibles')?.value,
      PostulateId: idPostulado,
      Active : 1,
      IsEmployee : 0
    }

    this.loginServices.createData('PostulateVacantRel',bodyPostulateVacantRel).subscribe((respuesta:ApiResponse<any>) => {
        Swal.fire({
          icon: 'success',
          title: 'Tu información se registro con exito!',
          text: 'Pronto estaremos en contacto contigo'
        }).then((res:any) => {
          window.location.reload();
        });
    });
  }

  onCaptchaResolved(response: any): void {
    this.captchaResponse = response;
    this.enviaInfo = response;
  }

  obtenerFechaActual(): string {
    const fechaActual: Date = new Date();
    const fechaFormateada: string = `${fechaActual.getFullYear()}-${this.dosDigitos(fechaActual.getMonth() + 1)}-${this.dosDigitos(fechaActual.getDate())}`;
    return fechaFormateada;
  }
  dosDigitos(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

}
