import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { reqObjetivos } from 'src/app/Interfaces/UserLogin';

import { ApiResponse } from '../../dto/loginTiindux/genericResponse';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { UserDTO } from '../../dto/user.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import Swal from "sweetalert2" 


@Component({
  selector: 'app-admin-competencias',
  templateUrl: './admin-competencias.component.html',
  styleUrls: ['./admin-competencias.component.scss']
})
export class AdminCompetenciasComponent implements OnInit {

  Competencias: any[] = [];
  competencia: any = {};
  canva: boolean = false;
  p_Size = 5;
  page = 1;
  optionsPage = [5, 10, 30, 50];
  cargoToEdit = false;
  rutaApi = 'Competencias';
  CompetenciasForm: FormGroup = this.fb.group({
    id: [0, []],
    competencia: ['', Validators.required],
    estado: [true, []],
  });


  constructor(private fb: FormBuilder, private modalService: NgbModal, private router: Router, private loginServices: loginTiinduxService) { }

  ngOnInit(): void {
    this.cargaListas()
  }

  pageEvent(e: PageEvent) {
    this.p_Size = e.pageSize;
    this.page = e.pageIndex + 1;
  }


  cargaListas() {

    this.loginServices.GetAllData<any>(this.rutaApi).subscribe((respuesta: ApiResponse<any>) => {
      this.Competencias = respuesta.data;
    });

  }


  editarCompetencias(id: number) {
    this.cargoToEdit = true;
    this.competencia = this.Competencias.filter(x => x.id == id);
    this.CompetenciasForm.get('id')?.setValue(this.competencia[0].id);
    this.CompetenciasForm.get('competencia')?.setValue(this.competencia[0].competencia);
    this.CompetenciasForm.get('estado')?.setValue(this.competencia[0].estado);
  }

  eliminarCompetencias(rolesId: number) {
    this.loginServices.eliminarDato(this.rutaApi, rolesId)
      .subscribe(
        (respuesta: ApiResponse<any>) => {
          Swal.fire({
            icon: respuesta.estado.codigo == "500" ? 'warning' : 'success',
            title: respuesta.estado.codigo == "500" ? "Error: Objetivo asociado a usuarios." : respuesta.estado.descripcion,
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


  guardaCompetencias() {
   // debugger;
    const body: any = {
      id: this.CompetenciasForm.get('id')?.value,
      competencia: this.CompetenciasForm.get('competencia')?.value,
      estado: Boolean(JSON.parse(this.CompetenciasForm.get('estado')?.value)),
    };

    if (this.validarcampos()) {
      let resp = this.cargoToEdit == true ? this.ActualizarCompetencias(body) : this.CrearCompetencias(body)
    }
  }


  validarcampos() {

    if (!this.CompetenciasForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor valida los campos obligatorios'
      });
      return false;
    } else { return true }
  }

  ActualizarCompetencias(body: reqObjetivos) {
 
    this.loginServices.UpdateData(this.rutaApi, this.competencia[0].id, body)
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

  CrearCompetencias(body: reqObjetivos) {
    if (this.Competencias.length < 5) {
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
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Mensaje: No puedes crear mas de 5 competencias ',
        text: ''
      })
    }

  }

  LimpiarFormulario() {
    this.CompetenciasForm.get('id')?.setValue(0);
    this.CompetenciasForm.get('competencia')?.setValue(''); 
    this.CompetenciasForm.get('estado')?.setValue(true); 
    this.cargaListas();
    this.canva = false
    this.cargoToEdit = false;
  }


}
