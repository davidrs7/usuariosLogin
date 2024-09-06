import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
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
  vacantList: VacantDTO[] = [];
  siteKey = '6LdszjcqAAAAADpUhY-JGzyTcEZjK89BpCOhTA2R';
  enviaInfo:string  = "";
  usuariosForm: FormGroup = this.fb.group({
    usuarioId: [0, []],
    nombrePostulante: ['', Validators.required],
    apellidosPostulante: ['', Validators.required],
    correoPostulante: ['', Validators.required],
    tipoDocumentoPostulante: [0, []],
    numdocumento: ['', Validators.required],
    correoelectronico: [''],
    telefono: ['',Validators.required],
    direccion: ['',Validators.required],
    fechanacimiento: [''],
    fechacreacion: [this.obtenerFechaActual(), []],
    estado: [true, Validators.required],
    hvPostulante: ['', []],
    vacantesDisponibles: [0, []],

  });
  constructor(private fb: FormBuilder,private loginServices: loginTiinduxService,private vacantService: VacantService) { }

  ngOnInit(): void {
    this.cargarListas();
  }

  cargarListas(){
    this.loginServices.GetAllData<any>('TipoDocumento').subscribe((respuesta: ApiResponse<any>) => {
      this.TipDocs = respuesta.data;
    });

    this.vacantService.vacantListEndpoint().subscribe(
      (vacantListResult: VacantDTO[]) => {
        console.log(vacantListResult)
        this.vacantList = vacantListResult;
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    } else {
      this.fileName = 'Ningún archivo seleccionado';
    }
  }

  enviarFormulario(){
    if (this.enviaInfo.length > 0){
      Swal.fire({
        icon: 'success',
        title:  'Catpcha resuelto',
        text: ''
      });
    }else{
      Swal.fire({
        icon: 'warning',
        title:  'Por favor resuelve el captcha',
        text: ''
      });
    }
  }

  onCaptchaResolved(response: any): void {
    this.captchaResponse = response;
    this.enviaInfo = response;
    console.log(`Captcha resuelto con respuesta: ${response}`);
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
