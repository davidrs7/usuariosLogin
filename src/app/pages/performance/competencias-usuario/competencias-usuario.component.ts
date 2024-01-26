import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { reqPreguntas, reqrolespermisos } from 'src/app/Interfaces/UserLogin';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-competencias-usuario',
  templateUrl: './competencias-usuario.component.html',
  styleUrls: ['./competencias-usuario.component.scss']
})
export class CompetenciasUsuarioComponent implements OnInit {

  preguntas: any[] = [];
  pregunta: any = {};
  respuestas: any[] = [];
  respuesta: any = {};

  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {


  }

  cargalistas(){
    this.loginServices.GetAllData<any>('Preguntas').subscribe((respuesta: ApiResponse<any>) => {
      this.preguntas = respuesta.data;
      console.log(respuesta.data)
    });

    this.loginServices.GetAllData<any>('opciones_respuesta').subscribe((respuesta: ApiResponse<any>) => {
      this.respuestas = respuesta.data;
      console.log(respuesta.data)
    });

 
  }


}
