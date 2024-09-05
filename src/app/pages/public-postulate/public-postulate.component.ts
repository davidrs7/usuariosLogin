import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-public-postulate',
  templateUrl: './public-postulate.component.html',
  styleUrls: ['./public-postulate.component.scss']
})
export class PublicPostulateComponent implements OnInit {

  captchaResponse: string | null = null;
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
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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
