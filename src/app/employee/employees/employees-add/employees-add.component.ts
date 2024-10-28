import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeAcademicDTO, EmployeeBasicDTO, EmployeeDTO, EmployeeFileDTO, EmployeeFileTypeDTO, EmployeeGeneralDTO, EmployeeKnowledgeDTO, EmployeeSkillDTO, EmployeeSonsDTO } from '../../../dto/employee/employee.dto';
import { JobBasicDTO } from '../../../dto/employee/job.dto';
import { ParamsDTO } from '../../../dto/params.dto';
import { AdminMsgErrors, FileRel } from '../../../dto/utils.dto';
import { EmployeeService } from '../../../_services/employee/employee.service';
import { JobService } from '../../../_services/employee/job.service';
import { ParamsService } from '../../../_services/params.service';
import { loginTiinduxService } from 'src/app/_services/UserLogin/loginTiidux.service';
import { ApiResponse } from 'src/app/dto/loginTiindux/genericResponse';
import { ReqUsuarios } from 'src/app/Interfaces/UserLogin';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-employees-add',
  templateUrl: './employees-add.component.html',
  styleUrls: ['./employees-add.component.scss']
})
export class EmployeesAddComponent implements OnInit {
  canva: boolean = true;
  modalReference!: any;
  employeeId: any;
  section: any;

  sonsForm: boolean = false;
  sonsFormDel: boolean = false;
  sonDelId?: number = 0;
  cancelDocument: boolean = false;

  employee: EmployeeDTO = { id: 0, department: '', jobId: 0, statusId: 0, maritalStatusId: 0, docTypeId: 0, docIssueCityId: 0, contractTypeId: 0, jobCityId: 0, bankingEntityId: 0, doc: '', docIssueDate: new Date(), name: '', sex: '', birthDate: new Date(), rh: '', corpCellPhone: '', cellPhone: '', phone: '', email: '', employmentDate: new Date(), bankAccount: '', bankAccountType: '', hasVaccine: false, vaccineMaker: '', vaccineDose: 0, hasVaccineBooster: false, colorHex: '#000' };
  employeeGeneral: EmployeeGeneralDTO = { id: 0, employeeId: 0, cityId: 0, cityName: '', housingTypeId: 0, transportationId: 0, emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '', dependents: 0, dependentsUnder9: 0, dependentBirthDate: new Date(), address: '', neighborhood: '', housingTime: 0, socioeconomicStatus: 0, licensePlate: '', vehicleMark: '', vehicleModel: '', licenseNumber: '', licenseCategory: '', licenseValidity: new Date(), soatExpirationDate: new Date(), rtmExpirationDate: new Date(), vehicleOwnerName: '', contributorType: '', eps: '', arl: '', afp: '', recommendedBy: '', description: '' };
  employeeAcademic: EmployeeAcademicDTO = { id: 0, employeeId: 0, educationalLevelId: 0, career: '' };
  employeeAcademics: EmployeeAcademicDTO[] = [];
  employeeFile: EmployeeFileDTO = { id: 0, employeeId: 0, department: '', name: '', city: '', level1: '', level2: '', level3: '', fileName: '', url: '' }

  employeeSkills: EmployeeSkillDTO[] = [];
  employeeKnowledges: EmployeeKnowledgeDTO[] = [];
  paramEmployees: EmployeeBasicDTO[] = [];
  paramDocType: ParamsDTO[] = [];
  paramCity: ParamsDTO[] = [];
  paramSex: ParamsDTO[] = [];
  paramMaritalStatus: ParamsDTO[] = [];
  paramHousingType: ParamsDTO[] = [];
  paramEducationalLevel: ParamsDTO[] = [];
  paramEmployeeStatus: ParamsDTO[] = [];
  paramContractType: ParamsDTO[] = [];
  paramBankingEntity: ParamsDTO[] = [];
  paramTransportation: ParamsDTO[] = [];
  paramJob1: JobBasicDTO[] = [];
  paramJob: ParamsDTO[] = [];
  paramFileTypes: EmployeeFileTypeDTO[] = [];
  paramFileTypesLevel1: EmployeeFileTypeDTO[] = [];
  paramFileTypesLevel2: EmployeeFileTypeDTO[] = [];
  paramFileTypesLevel3: EmployeeFileTypeDTO[] = [];
  filesRel: FileRel[] = [];
  employeeSonsAge: EmployeeSonsDTO[] = [];
  employeeSonData: EmployeeSonsDTO[] = [];
  usuarios: any[] = [];

  errors: AdminMsgErrors = new AdminMsgErrors();
  formBasic!: FormGroup;
  formGeneral!: FormGroup;
  formAcademic!: FormGroup;
  formDocument!: FormGroup;
  sonForm!: FormGroup;
  bornDate!: string | null;
  formGroup: FormGroup;
  constructor(private modalService: NgbModal, private route: ActivatedRoute, private router: Router,
    private employeeService: EmployeeService, private usuariosService: loginTiinduxService, private jobService: JobService, private paramsService: ParamsService, private fb: FormBuilder, public datepipe: DatePipe) {
    this.formGroup = this.fb.group({
      academics: this.fb.array([])
    });

  }

  ngOnInit(): void {
    this.initFormBasic();
    this.initFormGeneral();
    this.initFormAcademic();
    this.initFormDocument();
    this.initSonForm(this.fb);


    this.employeeId = this.route.snapshot.paramMap.get("id");
    this.section = this.route.snapshot.paramMap.get("section");
    if (this.employeeId == null)
      this.section = 'basica';
    this.openSection(this.section);

  }

  get name() { return this.formBasic.get('name'); }
  get jobId() { return this.formBasic.get('jobId'); }
  get docTypeId() { return this.formBasic.get('docTypeId'); }
  get doc() { return this.formBasic.get('doc'); }
  get docIssueCityId() { return this.formBasic.get('docIssueCityId'); }
  get docIssueDate() { return this.formBasic.get('docIssueDate'); }
  get phone() { return this.formBasic.get('phone'); }
  get cellPhone() { return this.formBasic.get('cellPhone'); }
  get corpCellPhone() { return this.formBasic.get('corpCellPhone'); }
  get email() { return this.formBasic.get('email'); }
  get sex() { return this.formBasic.get('sex'); }
  get birthDate() { return this.formBasic.get('birthDate'); }
  get rh() { return this.formBasic.get('rh'); }
  get maritalStatusId() { return this.formBasic.get('maritalStatusId'); }
  get statusId() { return this.formBasic.get('statusId'); }
  get photo() { return this.formBasic.get('photo'); }
  get emergencyContactName() { return this.formGeneral.get('emergencyContactName'); }
  get emergencyContactPhone() { return this.formGeneral.get('emergencyContactPhone'); }
  get emergencyContactRelationship() { return this.formGeneral.get('emergencyContactRelationship'); }
  get dependents() { return this.formGeneral.get('dependents'); }
  get dependentsUnder9() { return this.formGeneral.get('dependentsUnder9'); }
  get address() { return this.formGeneral.get('address'); }
  get neighborhood() { return this.formGeneral.get('neighborhood'); }
  get cityId() { return this.formGeneral.get('cityId'); }
  get housingTypeId() { return this.formGeneral.get('housingTypeId'); }
  get housingTime() { return this.formGeneral.get('housingTime'); }
  get socioeconomicStatus() { return this.formGeneral.get('socioeconomicStatus'); }
  get eps() { return this.formGeneral.get('eps'); }
  get arl() { return this.formGeneral.get('arl'); }
  get afp() { return this.formGeneral.get('afp'); }
  get recommendedBy() { return this.formGeneral.get('recommendedBy'); }
  get description() { return this.formGeneral.get('description'); }
  get educationalLevelId() { return this.formAcademic.get('educationalLevelId'); }
  get career() { return this.formAcademic.get('career'); }
  get academicEndDate() { return this.formAcademic.get('academicEndDate'); }
  get level1() { return this.formDocument.get('level1'); }
  get level2() { return this.formDocument.get('level2'); }

  get contractTypeId() { return this.formBasic.get('contractTypeId'); }
  get employmentDate() { return this.formBasic.get('employmentDate'); }
  get jobCityId() { return this.formBasic.get('jobCityId'); }
  get bankingEntityId() { return this.formBasic.get('bankingEntityId'); }
  get bankAccount() { return this.formBasic.get('bankAccount'); }
  get bankAccountType() { return this.formBasic.get('bankAccountType'); }
  get hasVaccine() { return this.formBasic.get('hasVaccine'); }
  get vaccineMaker() { return this.formBasic.get('vaccineMaker'); }
  get vaccineDose() { return this.formBasic.get('vaccineDose'); }
  get hasVaccineBooster() { return this.formBasic.get('hasVaccineBooster'); }
  get dependentBirthDate() { return this.formGeneral.get('dependentBirthDate'); }
  get transportationId() { return this.formGeneral.get('transportationId'); }
  get licensePlate() { return this.formGeneral.get('licensePlate'); }
  get vehicleMark() { return this.formGeneral.get('vehicleMark'); }
  get vehicleModel() { return this.formGeneral.get('vehicleModel'); }
  get licenseNumber() { return this.formGeneral.get('licenseNumber'); }
  get licenseCategory() { return this.formGeneral.get('licenseCategory'); }
  get licenseValidity() { return this.formGeneral.get('licenseValidity'); }
  get soatExpirationDate() { return this.formGeneral.get('soatExpirationDate'); }
  get rtmExpirationDate() { return this.formGeneral.get('rtmExpirationDate'); }
  get vehicleOwnerName() { return this.formGeneral.get('vehicleOwnerName'); }
  get contributorType() { return this.formGeneral.get('contributorType'); }
  get academicsControls() {
    return (this.formGroup.get('academics') as FormArray).controls;
  }

  initSonForm(fb: FormBuilder) {
    this.sonForm = this.fb.group(
      {
        id: new FormControl(null, Validators.pattern('^[0-9]*$')),
        sonName: new FormControl(null, [Validators.required, Validators.minLength(4),]),
        sonBornDate: new FormControl(null, [Validators.required,]),
        employeeGeneralId: new FormControl(this.employeeId, Validators.pattern('^[0-9]*$')),
      }
    );

  }
  initFormBasic() {
    this.formBasic = new FormGroup({
      name: new FormControl(null),
      jobId: new FormControl(null),
      docTypeId: new FormControl(null),
      doc: new FormControl(null, Validators.pattern('^[0-9]*$')),
      docIssueCityId: new FormControl(null),
      docIssueDate: new FormControl(null),
      phone: new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.min(3000000000), Validators.max(9999999999)]),
      cellPhone: new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.min(3000000000), Validators.max(9999999999)]),
      corpCellPhone: new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.min(3000000000), Validators.max(9999999999)]),
      email: new FormControl(null, [Validators.email]),
      sex: new FormControl(null),
      birthDate: new FormControl(null),
      rh: new FormControl(null),
      maritalStatusId: new FormControl(null),
      contractTypeId: new FormControl(null),
      employmentDate: new FormControl(null),
      jobCityId: new FormControl(null),
      bankingEntityId: new FormControl(null),
      bankAccount: new FormControl(null),
      bankAccountType: new FormControl(null),
      hasVaccine: new FormControl(null),
      vaccineMaker: new FormControl(null),
      vaccineDose: new FormControl(null),
      hasVaccineBooster: new FormControl(null),
      statusId: new FormControl(null,),
      photo: new FormControl(null)
    });
  }

  initFormGeneral() {
    this.formGeneral = new FormGroup({
      emergencyContactName: new FormControl(null),
      emergencyContactPhone: new FormControl(null, [Validators.pattern('^[0-9]*$'), Validators.min(3000000000), Validators.max(9999999999)]),
      emergencyContactRelationship: new FormControl(null),
      dependents: new FormControl(null, Validators.min(0)),
      dependentsUnder9: new FormControl(null, Validators.min(0)),
      dependentBirthDate: new FormControl(null),
      address: new FormControl(null),
      neighborhood: new FormControl(null),
      cityId: new FormControl(null),
      housingTypeId: new FormControl(null),
      housingTime: new FormControl(null, Validators.min(1)),
      socioeconomicStatus: new FormControl(null),
      transportationId: new FormControl(null),
      licensePlate: new FormControl(null),
      vehicleMark: new FormControl(null),
      vehicleModel: new FormControl(null),
      licenseNumber: new FormControl(null),
      licenseCategory: new FormControl(null),
      licenseValidity: new FormControl(null),
      soatExpirationDate: new FormControl(null),
      rtmExpirationDate: new FormControl(null),
      vehicleOwnerName: new FormControl(null),
      contributorType: new FormControl(null),
      eps: new FormControl(null),
      arl: new FormControl(null),
      afp: new FormControl(null),
      recommendedBy: new FormControl(null),
      description: new FormControl(null)
    });
  }

  initFormAcademic() {
    this.formAcademic = new FormGroup({
      educationalLevelId: new FormControl(null),
      career: new FormControl(null),
      EndDate: new FormControl('')
    });
  }

  initFormDocument() {
    this.formDocument = new FormGroup({
      level1: new FormControl(null, Validators.required),
      level2: new FormControl(null)
    });
  }

  setValuesFormBasic() {
    this.name?.setValue(this.employee.name);
    this.jobId?.setValue(this.employee.jobId == 0 ? '' : this.employee.jobId);
    this.docTypeId?.setValue(this.employee.docTypeId == 0 ? '' : this.employee.docTypeId);
    this.docIssueCityId?.setValue(this.employee.docIssueCityId == 0 ? '' : this.employee.docIssueCityId);
    this.doc?.setValue(this.employee.doc);
    this.docIssueDate?.setValue(this.errors.formatDate(this.employee.docIssueDate));
    this.phone?.setValue(this.employee.phone);
    this.cellPhone?.setValue(this.employee.cellPhone);
    this.corpCellPhone?.setValue(this.employee.corpCellPhone);
    this.email?.setValue(this.employee.email);
    this.sex?.setValue(this.employee.sex);
    this.birthDate?.setValue(this.errors.formatDate(this.employee.birthDate));
    this.rh?.setValue(this.employee.rh);
    this.maritalStatusId?.setValue(this.employee.maritalStatusId == 0 ? '' : this.employee.maritalStatusId);
    this.statusId?.setValue(this.employee.statusId == 0 ? '' : this.employee.statusId);

    this.contractTypeId?.setValue(this.employee.contractTypeId == 0 ? '' : this.employee.contractTypeId);
    this.employmentDate?.setValue(this.errors.formatDate(this.employee.employmentDate));
    this.jobCityId?.setValue(this.employee.jobCityId == 0 ? '' : this.employee.jobCityId);
    this.bankingEntityId?.setValue(this.employee.bankingEntityId == 0 ? '' : this.employee.bankingEntityId);
    this.bankAccount?.setValue(this.employee.bankAccount);
    this.bankAccountType?.setValue(this.employee.bankAccountType);
    this.hasVaccine?.setValue(this.employee.hasVaccine ? 'Si' : 'No');
    this.vaccineMaker?.setValue(this.employee.vaccineMaker);
    this.vaccineDose?.setValue(this.employee.vaccineDose);
    this.hasVaccineBooster?.setValue(this.employee.hasVaccineBooster ? 'Si' : 'No');
  }

  setValuesFormGeneral() {
    this.emergencyContactName?.setValue(this.employeeGeneral.emergencyContactName);
    this.emergencyContactPhone?.setValue(this.employeeGeneral.emergencyContactPhone);
    this.emergencyContactRelationship?.setValue(this.employeeGeneral.emergencyContactRelationship);
    this.dependents?.setValue(this.employeeGeneral.dependents);
    this.dependentsUnder9?.setValue(this.employeeGeneral.dependentsUnder9);
    this.address?.setValue(this.employeeGeneral.address);
    this.neighborhood?.setValue(this.employeeGeneral.neighborhood);
    this.cityId?.setValue(this.employeeGeneral.cityId == 0 ? '' : this.employeeGeneral.cityId);
    this.housingTypeId?.setValue(this.employeeGeneral.housingTypeId == 0 ? '' : this.employeeGeneral.housingTypeId);
    this.housingTime?.setValue(this.employeeGeneral.housingTime);
    this.socioeconomicStatus?.setValue(this.employeeGeneral.socioeconomicStatus);
    this.eps?.setValue(this.employeeGeneral.eps);
    this.arl?.setValue(this.employeeGeneral.arl);
    this.afp?.setValue(this.employeeGeneral.afp);
    this.recommendedBy?.setValue(this.employeeGeneral.recommendedBy);
    this.description?.setValue(this.employeeGeneral.description);

    this.dependentBirthDate?.setValue(this.errors.formatDate(this.employeeGeneral.dependentBirthDate));
    this.transportationId?.setValue(this.employeeGeneral.transportationId == 0 ? '' : this.employeeGeneral.transportationId);
    this.licensePlate?.setValue(this.employeeGeneral.licensePlate);
    this.vehicleMark?.setValue(this.employeeGeneral.vehicleMark);
    this.vehicleModel?.setValue(this.employeeGeneral.vehicleModel);
    this.licenseNumber?.setValue(this.employeeGeneral.licenseNumber);
    this.licenseCategory?.setValue(this.employeeGeneral.licenseCategory);
    this.licenseValidity?.setValue(this.errors.formatDate(this.employeeGeneral.licenseValidity));
    this.soatExpirationDate?.setValue(this.errors.formatDate(this.employeeGeneral.soatExpirationDate));
    this.rtmExpirationDate?.setValue(this.errors.formatDate(this.employeeGeneral.rtmExpirationDate));
    this.vehicleOwnerName?.setValue(this.employeeGeneral.vehicleOwnerName);
    this.contributorType?.setValue(this.employeeGeneral.contributorType);
  }

  setValuesFormAcademic(employeeAcademics: EmployeeAcademicDTO[]) {
    console.log('hola', employeeAcademics)
    for (let i: number = 0; i < employeeAcademics.length; i++) {
      const selectEducationalLevel = document.getElementById('academicEmployeeEducationalLevelId-' + employeeAcademics[i].id) as HTMLSelectElement;
      const selectacademicEndDate = document.getElementById('academicEndDate-' + employeeAcademics[i].id) as HTMLSelectElement;
      const selectacacademicEmployeeCareer = document.getElementById('academicEmployeeCareer-' + employeeAcademics[i].id) as HTMLSelectElement;

      console.log('academicEndDateId-' + employeeAcademics[i].id);
      if (selectEducationalLevel) {
        selectEducationalLevel.value = employeeAcademics[i].educationalLevelId.toString()
      }
      if (selectacademicEndDate) {
        const academicEndDate = new Date(employeeAcademics[i].academicEndDate);
        const formattedDate = academicEndDate.toISOString().split('T')[0];
        selectacademicEndDate.value = formattedDate;
      }
      if (selectacacademicEmployeeCareer) {
        selectacacademicEmployeeCareer.value = employeeAcademics[i].career;
      }
    }

  }

  setValuesFormDocument() {
    this.level1?.setValue(null);
    this.level2?.setValue(null);
    this.filesRel = [{ level: '' }];
  }

  openSection(section: String) {
    var suscribeLoad = false;
    //this.canva = true;
    this.section = section;
    this.closeModal();

    switch (section) {
      case 'basica':
        if (this.employeeId != null) {
          this.employeeService.employeeEndpoint(this.employeeId).subscribe(
            (employeeResponse: EmployeeDTO) => {
              this.employee = this.errors.transformObjectToValidSetter(employeeResponse);
              this.getListSkills();
              this.setValuesFormBasic();
              this.canva = false;
            }
          );
        } else {
          this.employee = this.errors.transformObjectToValidSetter(this.employee);
          this.getListSkillsNew();
        }

        this.getBasicParams();
        /*
        this.jobService.jobsEndpoint().subscribe(
          (jobResponse: JobBasicDTO[]) => {
            this.paramJob = jobResponse;
            this.canva = false;
          }
        );*/


        if (this.employeeId != null) {
          this.getEmployeeSons();
        }
        suscribeLoad = true;
        break;
      case 'general':
        if (this.employeeId != null) {
          this.employeeService.employeeGeneralEndpoint(this.employeeId).subscribe(
            (employeeResponse: EmployeeGeneralDTO) => {
              this.employeeGeneral = this.errors.transformObjectToValidSetter(employeeResponse);
              this.setValuesFormGeneral();
              this.canva = false;
            }
          );
        } else {
          this.employeeGeneral = this.errors.transformObjectToValidSetter(this.employeeGeneral);
        }

        this.getGeneralParams();
        suscribeLoad = true;
        break;
      case 'academica':
        this.employeeAcademics = [];
        if (this.employeeId != null) {
          this.employeeService.employeeAcademicEndpoint(this.employeeId).subscribe(
            (employeeResponse: EmployeeAcademicDTO[]) => {
              console.log(employeeResponse);
              this.employeeAcademics = this.errors.transformObjectToValidSetter(employeeResponse);
              this.canva = false;
              setTimeout(() => {
                this.setValuesFormAcademic(this.employeeAcademics);
              }, 1 * 1000);
            }
          );

        } else {
          this.employeeAcademics = this.errors.transformObjectToValidSetter(this.employeeAcademics);
        }

        this.paramsService.educationalLevelEndpoint().subscribe(
          (paramResponse: ParamsDTO[]) => {
            this.paramEducationalLevel = paramResponse;
            this.canva = false;
          }
        );

        suscribeLoad = true;
        break;
      case 'documentacion':
        this.employeeService.fileTypesEndpoint().subscribe(
          (paramResponse: EmployeeFileTypeDTO[]) => {
            this.paramFileTypes = paramResponse;
            for (var i = 0; i < this.paramFileTypes.length; i++)
              if (this.paramFileTypes[i].levelId == 0)
                this.paramFileTypesLevel1.push(this.paramFileTypes[i]);
            this.canva = false;
          }
        );

        if (this.employee.id == 0)
          this.employeeService.employeeEndpoint(this.employeeId).subscribe(
            (employeeResponse: EmployeeDTO) => {
              this.employee = this.errors.transformObjectToValidSetter(employeeResponse);
              this.canva = false;
            }
          );

        if (this.employeeGeneral.id == 0)
          this.employeeService.employeeGeneralEndpoint(this.employeeId).subscribe(
            (employeeResponse: EmployeeGeneralDTO) => {
              this.employeeGeneral = this.errors.transformObjectToValidSetter(employeeResponse);
              this.canva = false;
            }
          );

        this.setValuesFormDocument();
        suscribeLoad = true;
        break;
    }

    if (!suscribeLoad)
      this.canva = false;
  }


  // metodo para poblar campos select desde el backend Crud usuarios. Integración DavRo
  addParamsforTipDocs(data: any[]) {
    let paramResponse: ParamsDTO[] = [];

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let param: ParamsDTO = {
          id: data[i].tipoDocumento,
          name: data[i].descripcion,
          available: data[i].estado
        };
        paramResponse.push(param);
      }
    }

    return paramResponse;
  }

  addParamsforCargos(data: any[]) {
    let paramResponse: ParamsDTO[] = [];

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let param: ParamsDTO = {
          id: data[i].cargoId,
          name: data[i].nombre,
          available: data[i].estado
        };
        paramResponse.push(param);
      }
    }

    return paramResponse;
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

  getBasicParams() {
    /*
    this.paramsService.docTypeEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramDocType = paramResponse;
        this.canva = false;
      }
    );*/

    // lista integracion
    this.usuariosService.GetAllData<any>('TipoDocumento').subscribe((respuesta: ApiResponse<any>) => {
      this.paramDocType = this.addParamsforTipDocs(respuesta.data);
      this.canva = false;
    });

    this.usuariosService.GetAllData<any>('Cargos').subscribe((respuesta: ApiResponse<any>) => {
      this.paramJob = this.addParamsforCargos(respuesta.data);
      this.canva = false;
    });

    this.usuariosService.GetAllData<any>('Sexo').subscribe((respuesta: ApiResponse<any>) => {
      this.paramSex = this.addParamsforSex(respuesta.data);
      this.canva = false;
    });

    this.usuariosService.GetAllData<any>('User').subscribe((respuesta: ApiResponse<any>) => {
      this.usuarios = respuesta.data;
      this.canva = false;
    });




    this.paramsService.maritalStatusEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramMaritalStatus = paramResponse;
        this.canva = false;
      }
    );

    this.paramsService.employeeStatusEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramEmployeeStatus = paramResponse;
        this.canva = false;
      }
    );

    this.paramsService.contractTypeEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramContractType = paramResponse;
        this.canva = false;
      }
    );

    this.paramsService.bankingEntityEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramBankingEntity = paramResponse;
        this.canva = false;
      }
    );

    this.getParamsCity();
  }

  getGeneralParams() {
    this.paramsService.housingTypeEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramHousingType = paramResponse;
        this.canva = false;
      }
    );
    this.paramsService.transportationEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramTransportation = paramResponse;
        this.canva = false;
      }
    );
    this.getParamsCity();

    this.employeeService.employeesWithoutPagesEndpoint(this.employeeId).subscribe(
      (paramResponse: EmployeeBasicDTO[]) => {
        this.paramEmployees = paramResponse;
        this.canva = false;
      }
    );
  }

  getParamsCity() {
    if (this.paramCity.length == 0) {
      this.paramsService.cityEndpoint().subscribe(
        (paramResponse: ParamsDTO[]) => {
          this.paramCity = paramResponse;
          this.canva = false;
        }
      );
    }
  }

  getListSkillsNew() {
    this.employeeService.skillsNewEndpoint().subscribe(
      (responseSkillsNew: EmployeeSkillDTO[]) => {
        this.employeeSkills = responseSkillsNew;
        this.canva = false;
      }
    );

    this.employeeService.knowledgesNewEndpoint().subscribe(
      (responseKnowledgesNew: EmployeeKnowledgeDTO[]) => {
        this.employeeKnowledges = responseKnowledgesNew;
        this.canva = false;
      }
    );
  }

  getListSkills() {
    this.employeeService.skillsNewEndpoint().subscribe(
      (responseSkillsNew: EmployeeSkillDTO[]) => {
        this.employeeService.skillsEndpoint(this.employeeId).subscribe(
          (responseSkills: EmployeeSkillDTO[]) => {
            var existe = false;
            for (var i = 0; i < responseSkillsNew.length; i++) {
              existe = false;
              for (var j = 0; j < responseSkills.length; j++)
                if (responseSkillsNew[i].skillId == responseSkills[j].skillId) {
                  this.employeeSkills[i] = responseSkills[j];
                  this.employeeSkills[i].employeeId = this.employeeId;
                  this.employeeSkills[i].exist = true;
                  existe = true;
                  break;
                }

              if (!existe) {
                this.employeeSkills[i] = responseSkillsNew[i];
                this.employeeSkills[i].employeeId = this.employeeId;
                this.employeeSkills[i].exist = false;
              }
            }
            this.canva = false;
          }
        );
      }
    );

    this.employeeService.knowledgesNewEndpoint().subscribe(
      (responseKnowledgesNew: EmployeeKnowledgeDTO[]) => {
        this.employeeService.knowledgesEndpoint(this.employeeId).subscribe(
          (responseKnowledges: EmployeeKnowledgeDTO[]) => {
            var existe = false;
            for (var i = 0; i < responseKnowledgesNew.length; i++) {
              existe = false;
              for (var j = 0; j < responseKnowledges.length; j++)
                if (responseKnowledgesNew[i].knowledgeId == responseKnowledges[j].knowledgeId) {
                  this.employeeKnowledges[i] = responseKnowledges[j];
                  this.employeeKnowledges[i].employeeId = this.employeeId;
                  this.employeeKnowledges[i].exist = true;
                  existe = true;
                  break;
                }

              if (!existe) {
                this.employeeKnowledges[i] = responseKnowledgesNew[i];
                this.employeeKnowledges[i].employeeId = this.employeeId;
                this.employeeKnowledges[i].exist = false;
              }
            }
          }
        );
      }
    );
  }

  getParamLevel(levelParent: string): EmployeeFileTypeDTO[] {
    var levelId: number = 0;
    var params: EmployeeFileTypeDTO[] = [];

    for (var i = 0; i < this.paramFileTypes.length; i++) {
      if (levelId == 0 && this.paramFileTypes[i].name === levelParent)
        levelId = this.paramFileTypes[i].id;

      if (levelId != 0 && this.paramFileTypes[i].levelId == levelId)
        params.push(this.paramFileTypes[i]);
    }

    return params;
  }

  getParamLevel2() {
    this.paramFileTypesLevel2 = this.getParamLevel(this.level1?.value);
    this.paramFileTypesLevel3 = [];
    this.level2?.setValue('');
  }

  getParamLevel3() {
    this.paramFileTypesLevel3 = this.getParamLevel(this.level2?.value);
  }

  updateFlagKnowledge(index: number) {
    var formControl = this.formBasic.get(this.getNameControlKnowledge(index));
    this.employeeKnowledges[index].rate = formControl?.value;

    if (this.employeeKnowledges[index].exist) {
      this.employeeKnowledges[index].inserted = false;
      this.employeeKnowledges[index].updated = true;
    } else {
      this.employeeKnowledges[index].inserted = true;
      this.employeeKnowledges[index].updated = false;
    }
  }

  setControlKnowledge(index: number): string {
    var name = this.getNameControlKnowledge(index);
    if (this.formBasic.get(this.getNameControlKnowledge(index)) == null)
      this.formBasic.setControl(name, new FormControl(this.employeeKnowledges[index].rate, [Validators.required, Validators.min(0), Validators.max(10)]));
    return name;
  }

  getNameControlKnowledge(index: number) {
    return 'kr' + this.employeeKnowledges[index].knowledgeName.replace(' ', '');
  }

  updateFlagSkill(index: number) {
    var formControl = this.formBasic.get(this.getNameControlSkill(index));
    this.employeeSkills[index].rate = formControl?.value;

    if (this.employeeSkills[index].exist) {
      this.employeeSkills[index].inserted = false;
      this.employeeSkills[index].updated = true;
    } else {
      this.employeeSkills[index].inserted = true;
      this.employeeSkills[index].updated = false;
    }
  }

  setControlSkill(index: number): string {
    var name = this.getNameControlSkill(index);
    if (this.formBasic.get(this.getNameControlSkill(index)) == null)
      this.formBasic.setControl(name, new FormControl(this.employeeSkills[index].rate, [Validators.required, Validators.min(0), Validators.max(10)]));
    return name;
  }

  getNameControlSkill(index: number) {
    return 'sr' + this.employeeSkills[index].skillName.replace(' ', '');
  }

  toggleFrmSons(index?: number) {
    if (index != null) {
      this.employeeSonData[0] = this.employeeSonsAge[index];
      /**this.datepipe.transform(bornDate,'yyyy-mm-dd') */

      if (this.employeeSonData.length)
        this.bornDate = this.datepipe.transform(this.employeeSonData![0].sonBornDate, 'yyyy-MM-dd');
      this.sonForm.setValue({ sonName: this.employeeSonData[0].sonName, id: this.employeeSonData[0].id, sonBornDate: this.bornDate, employeeGeneralId: this.employeeSonData[0].employeeGeneralId });

    } else {
      this.employeeSonData = [];
      this.sonForm.setValue({ sonName: null, id: 0, sonBornDate: null, employeeGeneralId: this.employeeId });
      /* this.employeeSonsAge=[]; */
    }
    this.sonsForm = !this.sonsForm;
  }

  openModal(content: any, isXL: boolean) {
    this.modalReference = this.modalService.open(content, { size: isXL ? 'xl' : 'lg' });
  }

  closeModal() {
    if (this.modalReference != null)
      this.modalReference.close();
  }

  keyNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  saveKnowledgesAndSkills(employeeId: number) {
    for (var i = 0; i < this.employeeSkills.length; i++)
      if (this.employeeSkills[i].updated || (this.employeeSkills[i].inserted && this.employeeSkills[i].active)) {
        this.employeeSkills[i].employeeId = employeeId;
        this.employeeService.addSkillEndpoint(this.employeeSkills[i]).subscribe();
      }

    for (var i = 0; i < this.employeeKnowledges.length; i++)
      if (this.employeeKnowledges[i].updated || (this.employeeKnowledges[i].inserted && this.employeeKnowledges[i].active)) {
        this.employeeKnowledges[i].employeeId = employeeId;
        this.employeeService.addKnowledgeEndpoint(this.employeeKnowledges[i]).subscribe();
      }
  }

  saveSons(employeeId: number) {
    for (var i = 0; i < this.employeeSonsAge.length; i++) {
      this.employeeSonsAge[i].employeeGeneralId = employeeId;
      this.employeeService.updateSonDataEndPoint(this.employeeSonsAge[i]).subscribe(

      );
    }
  }

  addFileField() {
    this.filesRel[this.filesRel.length] = { level: '' };
  }

  addLevel3(event: any, index: number) {
    if (event != undefined && event.target != undefined && event.target.value != undefined)
      this.filesRel[index].level = event.target.value;
  }

  addFile(event: any, index: number) {
    if (event != undefined && event.target != undefined && event.target.files != undefined && event.target.files.length > 0)
      this.filesRel[index].file = event.target.files[0];
  }

  saveUser(usuario: any, idEmployee: number) {
    //david
    let idusuario = this.usuarios.filter(x => x.usuarioIdOpcional == idEmployee)[0];
    idusuario = idusuario == undefined ? 0 : this.usuarios.filter(x => x.usuarioIdOpcional == idEmployee)[0].usuarioId;

    const body: ReqUsuarios = {
      usuarioId: idusuario,
      nombre: usuario.name.toString(),
      tipoDocumento: Number(usuario.docTypeId),
      numDocumento: usuario.doc.toString(),
      correoElectronico: usuario.email.toString(),
      contraseña: usuario.doc.toString(),
      telefono: usuario.cellPhone.toString(),
      direccion: "",
      fechaNacimiento: usuario.birthDate,
      fechaCreacion: usuario.docIssueDate,
      sexoId: Number(this.paramSex.filter(x => x.name == usuario.sex)[0].id),
      jefeId: Number(1),
      rolId: Number(1),
      cargoId: Number(usuario.jobId) || 0,
      empresaId: Number(1),
      usuarioIdOpcional: Number(idEmployee),
      estado: true,
    };

    if (idusuario == 0) {
      this.usuariosService.createData('User', body).subscribe((respuesta: ApiResponse<any>) => {
      });
    } else {
      this.usuariosService.UpdateData('User', idusuario, body).subscribe((respuesta: ApiResponse<any>) => {
      });
    }




  }

  saveAndNext() {
    if (this.employeeId == null) {
      switch (this.section) {
        case 'basica':
          this.employeeService.addEndpoint(this.employee).subscribe(
            (employeeId: any) => {
              this.employee.id = employeeId;
              this.employeeGeneral.employeeId = employeeId;
              this.employeeAcademic.employeeId = employeeId;
              this.saveUser(this.employee, this.employee.id);
              this.saveKnowledgesAndSkills(employeeId);
              this.saveSons(employeeId);
              this.openSection('general');
            }
          );

          break;
        case 'general':
          this.employeeService.addGeneralEndpoint(this.employeeGeneral).subscribe(
            (employeeGeneralId: any) => {
              this.employeeGeneral.id = employeeGeneralId;
              this.openSection('academica');
            }
          );
          break;
        case 'academica':
          this.employeeService.addAcademicEndpoint(this.employeeAcademic).subscribe(
            (employeeAcademicId: any) => {
              this.employeeAcademic.id = employeeAcademicId;
              this.openSection('documentacion');
            }
          );
          break;
        case 'documentacion':
          this.saveDocument();
          if (this.cancelDocument)
            this.router.navigateByUrl('employees/employee/list');
          break;
        default: this.router.navigateByUrl('employees/employee/list');
      }
    } else {
      switch (this.section) {
        case 'basica':
          this.employeeService.editEndpoint(this.employee).subscribe(
            (rsp: any) => {
              this.saveUser(this.employee, this.employee.id);
              this.saveKnowledgesAndSkills(this.employee.id);
              this.router.navigateByUrl('employees/employee/view/' + this.employeeId);
            }
          );
          break;
        case 'general':
          this.employeeGeneral.employeeId = this.employeeId
          this.employeeService.editGeneralEndpoint(this.employeeGeneral).subscribe(
            (rsp: any) => {
              this.cancel();
            }
          );
          break;
        case 'academica':
          this.employeeAcademic.employeeId = this.employeeId
          this.employeeService.editAcademicEndpoint(this.employeeAcademic).subscribe(
            (rsp: any) => {
              this.cancel();
            }
          );
          break;
        case 'documentacion':
          this.saveDocument();
          if (this.cancelDocument)
            this.cancel();
          break;
        default: this.router.navigateByUrl('employees/employee/list');
      }
    }
  }

  cancel() {
    if (this.employeeId == null) {
      this.router.navigateByUrl('employees/employee/list');
    } else {
      this.router.navigateByUrl('employees/employee/view/' + this.section + '/' + this.employeeId);
    }
  }


  addAcademic() {
    const selectEducationalLevel = document.getElementById('academicEmployeeEducationalLevelId-new') as HTMLSelectElement;
    const selectacademicEndDate = document.getElementById('academicEndDate-new') as HTMLSelectElement;
    const selectacacademicEmployeeCareer = document.getElementById('academicEmployeeCareer-new') as HTMLSelectElement;
    let campoVacio = "";

    if (!selectEducationalLevel.value) {
      campoVacio += " -Nivel estudios";
    }
    if (!selectacacademicEmployeeCareer.value) {
      campoVacio += " -Titulo";
    }
    if (!selectacademicEndDate.value) {
      campoVacio += " -Fecha finalización";
    }

    if (campoVacio.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: "Por favor diligencia los siguientes campos:",
        text: campoVacio
      })
    } else {

      const body: EmployeeAcademicDTO  = {
        id: 0,
        employeeId: this.employeeAcademics[0].employeeId,
        educationalLevelId: Number(selectEducationalLevel.value),
        career: selectacacademicEmployeeCareer.value,
        academicEndDate: this.convertirFormatoFecha(selectacademicEndDate.value)
      }
      console.log(body);
      this.addServiceAcademic(body);
    }
  }
  addServiceAcademic(body:EmployeeAcademicDTO){
      this.employeeService.addAcademicEndpoint(body).subscribe(
        (employeeAcademicId: any) => {
          this.employeeAcademic.id = employeeAcademicId;
          console.log(employeeAcademicId);
          this.openSection('academica');
        }
      );
  }

  convertirFormatoFecha(fechaISO: string): string {
    const fechaObj = new Date(fechaISO);

    const año = fechaObj.getFullYear();
    const mes = ('0' + (fechaObj.getMonth() + 1)).slice(-2);
    const dia = ('0' + fechaObj.getDate()).slice(-2);

    return `${año}-${mes}-${dia}`;
  }

  updateEmployee(id: number) {
    console.log(id);
    console.log(this.employeeAcademics)
  }
  toggleCancelDocument() {
    this.cancelDocument = true;
  }

  validateFormBasic() {
    this.formBasic.markAllAsTouched();
    if (this.formBasic.status == 'VALID') {
      this.canva = true;
      this.employee = this.errors.mapping(this.employee, this.formBasic);
      this.employee.hasVaccine = this.hasVaccine?.value === 'Si' ? true : false;
      this.employee.hasVaccineBooster = this.hasVaccineBooster?.value === 'Si' ? true : false;
      this.employee.photo = (this.filesRel.length > 0 && this.filesRel[0].file != undefined) ? this.filesRel[0].file : undefined;
      this.saveAndNext();
    }
  }

  validateFormGeneral() {
    this.formGeneral.markAllAsTouched();
    if (this.formGeneral.status == 'VALID') {
      this.canva = true;
      this.employeeGeneral = this.errors.mapping(this.employeeGeneral, this.formGeneral);
      this.saveAndNext();
    }
  }

  validateFormAcademic() {
    this.formAcademic.markAllAsTouched();
    if (this.formAcademic.status == 'VALID') {
      this.canva = true;
      this.employeeAcademic = this.errors.mapping(this.employeeAcademic, this.formAcademic);
      this.saveAndNext();
    }
  }

  validateFormDocument() {
    this.formDocument.markAllAsTouched();
    if (this.formDocument.status == 'VALID') {
      this.canva = true;
      this.employeeFile = this.errors.mapping(this.employeeFile, this.formDocument);
      this.employeeFile.department = this.employee.department;
      this.employeeFile.name = this.employee.name;
      this.employeeFile.city = this.employeeGeneral.cityName;
      this.employeeFile.employeeId = this.employee.id;
      this.saveAndNext();
    }
  }

  saveDocument() {
    if (this.filesRel.length > 0)
      for (var i = 0; i < this.filesRel.length; i++)
        if (this.filesRel[i].file != undefined) {
          var employeeFile: EmployeeFileDTO = this.employeeFile;
          employeeFile.level3 = this.filesRel[i].level;

          this.employeeService.addFileEndpoint(employeeFile, this.filesRel[i].file).subscribe(
            (employeeFileId: any) => {
              if (employeeFileId != null && employeeFileId.length != 0 && !this.cancelDocument) {
                this.formDocument.markAsUntouched();
                this.level1?.setValue(null);
                this.level2?.setValue(null);

                if (this.filesRel.length == i)
                  this.canva = false;
              }
            }
          );
        }
  }

  getEmployeeSons() {
    this.employeeService.sonsEndpoint(this.employeeId).subscribe(
      (responseSonsAge: EmployeeSonsDTO[]) => {
        this.employeeSonsAge = responseSonsAge;
        this.canva = false;
      }
    );
  }

  sonUpdate(index?: number) {
    //this.sonForm.setValue({sonName: 'xxxx',id: 33,sonBornDate:'24/11/2022'});
    //=this.sonForm
    let sonData: EmployeeSonsDTO = this.sonForm.value;
    if (this.employeeId != null) {
      this.employeeService.updateSonDataEndPoint(sonData).subscribe(
        (responseSonsAge: any) => {
          /* this.employeeSonsAge=responseSonsAge; */
          if (responseSonsAge > 0) {
            document.getElementById('sonsEmployee');
            this.employeeService.sonsEndpoint(this.employeeId).subscribe(
              (response: EmployeeSonsDTO[]) => {
                this.employeeSonsAge = response;
                this.canva = false;
              }
            );
            this.toggleFrmSons();
          }
          this.canva = false;
        }
      );
    } else {
      if (this.employeeSonsAge.indexOf(this.sonForm.value) === -1)
        this.employeeSonsAge.push(this.sonForm.value);
      this.sonForm.reset();
      this.toggleFrmSons();
    }

  }

  toggleFrmSonDel(index?: number) {
    if (index != null) {
      this.employeeSonData[0] = this.employeeSonsAge[index];
    }
    this.sonsFormDel = !this.sonsFormDel;
  }
  delSon() {
    if (this.employeeSonData[0].id) {
      this.employeeService.deleteSonEndPoint(this.employeeSonData[0].id).subscribe(
        (response: any) => {
          if (response > 0) {
            this.employeeService.sonsEndpoint(this.employeeId).subscribe(
              (responsexx: EmployeeSonsDTO[]) => {
                this.employeeSonsAge = responsexx;
                this.canva = false;
              }
            );
            this.toggleFrmSonDel();
          }
        }
      );
    } else {

      let iToDelete = this.employeeSonsAge.indexOf(this.employeeSonData[0]);
      let newArray: any = [];
      this.employeeSonsAge.forEach((element, index) => {
        if (index != iToDelete) newArray.push(element);
      });
      this.employeeSonsAge = newArray;
    }

  }

}
