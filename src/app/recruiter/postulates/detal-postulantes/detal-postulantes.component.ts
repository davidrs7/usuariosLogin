import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from 'src/app/_services/employee/employee.service';
import { PostulateService } from 'src/app/_services/recruiter/postulate.service';
import { StepService } from 'src/app/_services/recruiter/step.service';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import { EmployeeAcademicDTO, EmployeeDTO, EmployeeGeneralDTO } from 'src/app/dto/employee/employee.dto';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { PostulateDTO } from 'src/app/dto/recruiter/postulate.dto';
import { StepDTO, StepFieldDTO } from 'src/app/dto/recruiter/step.dto';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';
import { AdminExtraForms, AdminMsgErrors, FormFieldConfigIndex, StepFormIndex, StepFormIndexKey } from 'src/app/dto/utils.dto';
import { ReqUsuarios } from 'src/app/Interfaces/UserLogin';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detal-postulantes',
  templateUrl: './detal-postulantes.component.html',
  styleUrls: ['./detal-postulantes.component.scss']
})
export class DetalPostulantesComponent implements OnInit {
  @ViewChild("modalChangeFunc", {static: false}) modalChangeFunc!: TemplateRef<any>;

  canva: boolean = true;
  canvaMsg: boolean = false;
  modalReference: any = {};
  postulateId: any;
  errorModalAssign: boolean = false;
  changeEmployee: boolean = false;
  usuarios: any[] = [];
    paramSex: ParamsDTO[] = [];


  forms: AdminExtraForms = new AdminExtraForms();
  errors: AdminMsgErrors = new AdminMsgErrors();
  stepIndex: StepFormIndex = {};
  stepIndexInt: number[] = [];
  postulate: PostulateDTO = { id: 0, recruiterUserId: 0, findOutId: 0, docTypeId: 0, educationalLevelId: 0, expectedSalary: 0, offeredSalary: 0, doc: '', firstName: '', lastName: '', sex: '', rh: '', phone: '', cellPhone: '', email: '', career: '', description: '' };
  vacantList: VacantDTO[] = [];
  vacantSelectedList: VacantDTO[] = [];
  vacantSelected!: VacantDTO;

  constructor(private modalService: NgbModal, private route: ActivatedRoute,private usuariosService: loginTiinduxService, private router: Router, private postulateService: PostulateService, private vacantService: VacantService, private stepService: StepService, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.postulateId = this.route.snapshot.paramMap.get("id");
    if(this.postulateId != null)
      this.initPostulate();

    this.usuariosService.GetAllData<any>('Sexo').subscribe((respuesta: ApiResponse<any>) => {
      this.paramSex = this.addParamsforSex(respuesta.data);
      this.canva = false;
    });
  }

  initPostulate() {
    this.postulateService.postulateByIdEndpoint(this.postulateId).subscribe(
      (postulateResult: PostulateDTO) => {
        this.postulate = postulateResult;
        this.initVacantlist();
      }
    );
  }

  addParamsforSex(data: any[]) {
    let paramResponse: ParamsDTO[] = [];

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let param: ParamsDTO = {
          id: data[i].sexoId,
          name: data[i].descripcion,
          available: data[i].estado
        };
        paramResponse.push(param);
      }
    }

    return paramResponse;
  }
  initVacantlist() {
    this.vacantService.vacantsByPostulateIdEndpoint(this.postulateId).subscribe(
      (vacantsPostulateResult: VacantDTO[]) => {
        this.vacantSelectedList = vacantsPostulateResult;
        if(this.vacantSelectedList.length == 1)
          this.selectVacantProcess(this.vacantSelectedList[0]);

        this.vacantService.vacantListEndpoint().subscribe(
          (vacantListResult: VacantDTO[]) => {
            if(this.vacantSelectedList.length > 0) {
              this.vacantList = [];
              var controlVacant: boolean;

              for(let vacantResult of vacantListResult) {
                controlVacant = true;
                for(let vacantSelectedResult of this.vacantSelectedList)
                  if(vacantSelectedResult.id == vacantResult.id) {
                    controlVacant = false;
                    break;
                  }

                if(controlVacant) {
                  vacantResult.active = 0;
                  this.vacantList.push(vacantResult);
                }
              }
            } else {
              this.vacantList = vacantListResult;
            }
            this.canva = false;
          }
        );
      }
    );
  }

  selectVacantProcess(vacant: VacantDTO) {
    this.canva = true;
    this.vacantService.vacantStepsWithValueEndpoint(vacant.id, this.postulateId).subscribe(
      (stepsResult: StepDTO[]) => {
        this.vacantSelected = vacant;
        this.stepIndex = {};
        this.stepIndexInt = [];
        var stepIndexIntTmp: number[] = [];

        var stepCountArray: number[] = [];
        var stepArray: StepFieldDTO[][] = [];
        for(let stepResult of stepsResult) {
          stepIndexIntTmp.push(stepResult.id);
          this.stepService.stepFieldByStepWithValueEndpoint(stepResult.id, this.vacantSelected.id, this.postulateId).subscribe(
            (stepFieldsResult: StepFieldDTO[]) => {
              stepCountArray.push(stepResult.id);
              stepArray.push(stepFieldsResult);
              if(stepsResult.length == stepCountArray.length) {
                this.setStepFieldsProcess(stepCountArray, stepArray, stepsResult, stepIndexIntTmp);
                this.stepIndexInt = stepIndexIntTmp;
              }
            }
          );
        }
      }
    );
  }

  setStepFieldsProcess(stepCountArray: number[], stepArray: StepFieldDTO[][], stepsResult: StepDTO[], stepIndexIntTmp: number[]) {
    var isRequired: boolean = false;
    var isRejected: boolean = false;
    var successCount: number = 0;
    var i: number = 0;

    for(let stepId of stepIndexIntTmp) {
      for(var j = 0; j < stepCountArray.length; j++)
        if(stepCountArray[j] == stepId) {
          i = j;
          break;
        }

      for(let stepResult of stepsResult)
        if(stepResult.id == stepId) {
          var approvedValue = (stepResult.approved == 0 && (stepResult.reason == null || stepResult.reason == '')) ? '' : stepResult.approved;
          stepResult.updated = (approvedValue != '');

          var stepIndexTmp: StepFormIndexKey = this.forms.createStepFormConfigBase(stepResult, stepArray[i], this.vacantSelected.id);
          stepIndexTmp.formGroup = this.addSpecialItemsToForm(stepIndexTmp.formGroup, approvedValue, stepResult.reason);
          this.stepIndex[stepResult.id] = stepIndexTmp;

          if(isRejected) {
            this.stepIndex[stepResult.id].status = 'muted';
          } else if(approvedValue != '') {
            this.stepIndex[stepResult.id].status = 'success';
            successCount++;
            if(approvedValue == '0')
              isRejected = true;
          } else {
            if(isRequired)
              this.stepIndex[stepResult.id].status = 'info';
            else
              isRequired = stepResult.isRequired == 1;
          }
          break;
        }
    }

    if(successCount == stepIndexIntTmp.length) {
      this.changeEmployee = true;
      this.openModal(this.modalChangeFunc, false);
    }
    this.canva = false;
  }

  addSpecialItemsToForm(formGroup: FormGroup, approved: any, reason?: string) {
    formGroup.addControl('approved', new FormControl(approved));
    formGroup.addControl('reason', new FormControl(reason));
    return formGroup;
  }

  getOptionList(config: FormFieldConfigIndex[] | undefined) {
    if(config != null && config.length > 0)
      for(let configField of config)
        if(configField.name == 'options') {
          if(configField.list != null && configField.list.length > 0)
            return configField.list;
          break;
        }
    return [];
  }

  changeApproved(stepId: number) {
    if(this.stepIndex[stepId].formGroup.get('approved')?.value == '0')
      this.stepIndex[stepId].formGroup.get('reason')?.addValidators(Validators.required);
    else
      this.stepIndex[stepId].formGroup.get('reason')?.clearValidators();
  }

  openModal(content:any, isLarge: boolean) {
    this.errorModalAssign = false;
    this.modalReference = this.modalService.open(content, { size: isLarge ? 'xl' : 'xs' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  changeVacant(value: any) {
    for(let vacantSel of this.vacantSelectedList)
      if(vacantSel.id == value.target.value) {
        this.selectVacantProcess(vacantSel);
        break;
      }
  }

  toggleVacant(vacantId: number) {
    for(var i = 0; i < this.vacantList.length; i++)
      if(this.vacantList[i].id == vacantId) {
        this.vacantList[i].postulateId = this.postulateId;
        this.vacantList[i].active = this.vacantList[i].active == 1 ? 0 : 1;
        break;
      }
  }

  assignVacants() {
    var lastVacantId: number = 0;
    for(var i = 0; i < this.vacantList.length; i++)
      if(this.vacantList[i].active == 1) {
        lastVacantId = this.vacantList[i].id;
        this.canva = true;
        this.vacantService.addVacantPostulateRelEndpoint(this.vacantList[i]).subscribe(
          (vacantId: any) => {
            if(vacantId == lastVacantId)
              this.initVacantlist();
            this.closeModal();
          }
        );
      }
    this.errorModalAssign = lastVacantId == 0;
  }

  openEdit() {
    this.router.navigateByUrl('recruiter/postulate/edit/' + this.postulateId);
  }

  cancel() {
    this.router.navigateByUrl('recruiter/postulate/list');
  }

  validateFormGroup(stepId: number) {
    this.stepIndex[stepId].formGroup.markAllAsTouched();
    if(this.stepIndex[stepId].formGroup.status == 'VALID') {
      this.canva = true;

      var fieldsMerge: StepFieldDTO[] = [];
      for(let field of this.stepIndex[stepId].fieldsForm) {
        var fieldvalue = this.stepIndex[stepId].formGroup.get(field.fieldName)?.value;
        if(field.index != null && fieldvalue != null && fieldvalue != '') {
          this.stepIndex[stepId].fields[field.index].fieldValue = fieldvalue;
          this.stepIndex[stepId].fields[field.index].postulateId = this.postulateId;
          this.stepIndex[stepId].fields[field.index].vacantId = this.stepIndex[stepId].step.vacantId;
          this.stepIndex[stepId].fields[field.index].inserted = true;
          fieldsMerge.push(this.stepIndex[stepId].fields[field.index]);
        }
      }

      var approved = this.stepIndex[stepId].formGroup.get('approved')?.value;
      if(approved != '') {
        this.stepIndex[stepId].step.approved = approved;
        var reason = this.stepIndex[stepId].formGroup.get('reason')?.value;
        this.stepIndex[stepId].step.reason = (approved == '0' && reason == '') ? '--NO REASON--' : reason;
        this.stepIndex[stepId].step.inserted = true;
        this.stepIndex[stepId].step.postulateId = this.postulateId;

        this.vacantService.mergeVacantStepPostulateRelEndpoint(this.stepIndex[stepId].step).subscribe(
          (rsp: any) => {
            if(fieldsMerge.length == 0)
              this.selectVacantProcess(this.vacantSelected);
          }
        );
      }

      var countFieldsMerge: number = 0;
      for(let fieldMerge of fieldsMerge) {
        this.stepService.mergeStepFieldPostulateRelEndpoint(fieldMerge).subscribe(
          (rsp: any) => {
            countFieldsMerge++;
            if(countFieldsMerge == fieldsMerge.length)
              this.selectVacantProcess(this.vacantSelected);
          }
        );
      }
    }
  }

    saveUser(usuario: EmployeeDTO, idEmployee: number) {
      //david
      let idusuario = this.usuarios.filter(x => x.usuarioIdOpcional == idEmployee)[0];
      idusuario = idusuario == undefined ? 0 : this.usuarios.filter(x => x.usuarioIdOpcional == idEmployee)[0].usuarioId;
      const sexDefault = usuario.sex.length > 0 ? usuario.sex : "Otro";

      const body: ReqUsuarios = {
        usuarioId: 0,
        nombre: usuario.name,
        tipoDocumento: usuario.docTypeId,
        numDocumento: usuario.doc,
        correoElectronico: usuario.email,
        contraseña: usuario.doc,
        telefono: usuario.cellPhone.toString(),
        direccion: "",
        fechaNacimiento:  usuario.birthDate ,
        fechaCreacion: usuario.docIssueDate ,
        sexoId: Number(this.paramSex.filter(x => x.name == sexDefault)[0].id),
        jefeId: Number(1),
        rolId: Number(1),
        cargoId: Number(usuario.jobId) || 0,
        empresaId: Number(1),
        usuarioIdOpcional: Number(idEmployee),
        estado: true,
      };

      if (idusuario == 0) {
        this.usuariosService.createData('User', body).subscribe((respuesta: ApiResponse<any>) => {
               Swal.fire({
                  icon: 'success',
                  title: respuesta.data,
                  text: respuesta.estado.descripcion
                });
          this.canva = false;
          this.canvaMsg = false;
        });
      } else {
        this.usuariosService.UpdateData('User', idusuario, body).subscribe((respuesta: ApiResponse<any>) => {
        });
      }

    }

      /* ------- Fechas --------- */
  obtenerFechaActual(): string {
    const fechaActual: Date = new Date();
    const fechaFormateada: string = `${fechaActual.getFullYear()}-${this.dosDigitos(fechaActual.getMonth() + 1)}-${this.dosDigitos(fechaActual.getDate())}`;
    return fechaFormateada;
  }

  dosDigitos(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }

  convertirFormatoFecha(fechaISO: string): string {
    const fechaObj = new Date(fechaISO);

    const año = fechaObj.getFullYear();
    const mes = ('0' + (fechaObj.getMonth() + 1)).slice(-2);
    const dia = ('0' + fechaObj.getDate()).slice(-2);

    return `${año}-${mes}-${dia}`;
  }

  /* ------ Fin fechas ------ */

  changeToEmployee() {
    this.closeModal();
    if(this.changeEmployee) {
      this.canva = true;

      var newEmployee: EmployeeDTO = {
        id: 0, department: '', jobId: this.vacantSelected.jobId, statusId: 1, docTypeId: this.postulate.docTypeId,
        contractTypeId: this.vacantSelected.contractTypeId, doc: this.postulate.doc,
        name: this.postulate.firstName + ' ' + this.postulate.lastName, sex: this.postulate.sex ?? '', rh: this.postulate.rh ?? '',
        corpCellPhone: '', cellPhone: this.postulate.cellPhone ?? '', phone: this.postulate.phone ?? '', email: this.postulate.email ?? '',
        bankAccount: '', bankAccountType: '', hasVaccine: false, vaccineMaker: '', vaccineDose: 0, hasVaccineBooster: false, colorHex: '',jobCityId: this.postulate.cityLevelId
      };
      if(newEmployee.birthDate != null && typeof newEmployee.birthDate == 'string') {
        var birthDateStr: string = newEmployee.birthDate;
        var birthDate: Date = new Date(birthDateStr);
        if(birthDate.getFullYear() > 1800)
          newEmployee.birthDate = birthDate;
      }

      this.employeeService.addEndpoint(newEmployee).subscribe(
        (employeeId: any) => {
          this.saveUser(newEmployee, employeeId);
         /* var newEmployeeGeneral: EmployeeGeneralDTO = {
            id: 0, employeeId: employeeId, cityId: 0, cityName: '', housingTypeId: 0, transportationId: 0, emergencyContactName: '',
            emergencyContactPhone: '', emergencyContactRelationship: '', dependents: 0, dependentsUnder9: 0, address: '', neighborhood: '',
            housingTime: 0, socioeconomicStatus: 0, licensePlate: '', vehicleMark: '', vehicleModel: '', licenseNumber: '', licenseCategory: '',
            vehicleOwnerName: '', contributorType: '', eps: '', arl: '', afp: '', recommendedBy: '', description: this.postulate.description ?? ''
          };

          this.employeeService.addGeneralEndpoint(newEmployeeGeneral).subscribe(
            (employeeGeneralId: any) => {
              var newEmployeeAcademic: EmployeeAcademicDTO = { id: 0, employeeId: employeeId, educationalLevelId: this.postulate.educationalLevelId, career: this.postulate.career ?? '' };
              this.employeeService.addAcademicEndpoint(newEmployeeAcademic).subscribe(
                (employeeAcademicId: any) => {
                  this.router.navigateByUrl('employees/employee/view/' + employeeId);
                }
              );
            }
          );
          this.postulateService.postulateToEmployeeEndpoint(this.postulateId, this.vacantSelected.id, employeeId).subscribe(
            (rsp: any) => {
              this.canvaMsg = true;
            }
          );*/// Se detecta que no se envian los parametros correspondientes para completar todo el perfil de empleado, se va crear el empleado y usuario asociado para posteriomente diligenciar los datos faltantes

        }
      );
    }
  }



  tabSelect(children: HTMLCollection, selection: number) {
    for(var i = 0; i < children.length; i++) {
      var className = children[i].getAttribute('class');
      if(i == selection)
        children[i].setAttribute('class', (className != undefined) ? className + ' active' : 'active');
      else
        children[i].setAttribute('class', (className != undefined) ? className.replace('active', '') : '');
    }
  }

}
