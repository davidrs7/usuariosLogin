import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsService } from 'src/app/_services/params.service';
import { PostulateService } from 'src/app/_services/recruiter/postulate.service';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { PostulateDTO } from 'src/app/dto/recruiter/postulate.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AdminMsgErrors, FileRel } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-add-pst',
  templateUrl: './add-pst.component.html',
  styleUrls: ['./add-pst.component.scss']
})
export class AddPstComponent implements OnInit {
  canva: boolean = true;
  modalReference: any = {};
  filesRel: FileRel[] = [];
  postulateId: any;
  user!: UserDTO;
  
  paramDocType: ParamsDTO[] = [];
  paramEducationalLevel: ParamsDTO[] = [];
  paramFindOut: ParamsDTO[] = [];
  
  errors: AdminMsgErrors = new AdminMsgErrors();
  postulate: PostulateDTO = { id: 0, recruiterUserId: 0, findOutId: 0, docTypeId: 0, educationalLevelId: 0, expectedSalary: 0, offeredSalary: 0, doc: '', firstName: '', lastName: '', birthDate: new Date(), sex: '', rh: '', phone: '', cellPhone: '', email: '', career: '', description: '' };
  formPostulate!: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private paramsService: ParamsService, private postulateService: PostulateService) {}

  ngOnInit(): void {
    this.initFormPostulate();

    this.postulateId = this.route.snapshot.paramMap.get("id");
    if(this.postulateId != null)
      this.initPostulate();
    else
      this.getBasicParams();
  }

  getUser(user: UserDTO) {
    this.user = user;
  }

  get firstName() { return this.formPostulate.get('firstName'); }
  get lastName() { return this.formPostulate.get('lastName'); }
  get docTypeId() { return this.formPostulate.get('docTypeId'); }
  get doc() { return this.formPostulate.get('doc'); }
  get cellPhone() { return this.formPostulate.get('cellPhone'); }
  get phone() { return this.formPostulate.get('phone'); }
  get email() { return this.formPostulate.get('email'); }
  get sex() { return this.formPostulate.get('sex'); }
  get birthDate() { return this.formPostulate.get('birthDate'); }
  get rh() { return this.formPostulate.get('rh'); }
  get educationalLevelId() { return this.formPostulate.get('educationalLevelId'); }
  get career() { return this.formPostulate.get('career'); }
  get findOutId() { return this.formPostulate.get('findOutId'); }
  get expectedSalary() { return this.formPostulate.get('expectedSalary'); }
  get offeredSalary() { return this.formPostulate.get('offeredSalary'); }
  get description() { return this.formPostulate.get('description'); }
  get photo() { return this.formPostulate.get('photo'); }

  initFormPostulate() {
    this.formPostulate = new FormGroup({
      findOutId: new FormControl(null, Validators.required),
      docTypeId: new FormControl(null, Validators.required),
      educationalLevelId: new FormControl(null, Validators.required),
      offeredSalary: new FormControl(null, [ Validators.pattern('^[0-9]*$'), Validators.min(1) ]),
      expectedSalary: new FormControl(null, [ Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1) ]),
      doc: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      sex: new FormControl(null),
      birthDate: new FormControl(null),
      rh: new FormControl(null),
      cellPhone: new FormControl(null),
      phone: new FormControl(null),
      email: new FormControl(null, Validators.required),
      career: new FormControl(null),
      description: new FormControl(null),
      photo: new FormControl(null)
    });
  }

  setFormPostulate() {
    this.findOutId?.setValue(this.postulate.findOutId == 0 ? '' : this.postulate.findOutId);
    this.docTypeId?.setValue(this.postulate.docTypeId == 0 ? '' : this.postulate.docTypeId);
    this.educationalLevelId?.setValue(this.postulate.educationalLevelId == 0 ? '' : this.postulate.educationalLevelId);
    this.offeredSalary?.setValue(this.postulate.offeredSalary == 0 ? '' : this.postulate.offeredSalary);
    this.expectedSalary?.setValue(this.postulate.expectedSalary == 0 ? '' : this.postulate.expectedSalary);
    this.doc?.setValue(this.postulate.doc);
    this.firstName?.setValue(this.postulate.firstName);
    this.lastName?.setValue(this.postulate.lastName);
    this.sex?.setValue(this.postulate.sex);
    this.birthDate?.setValue(this.errors.formatDate(this.postulate.birthDate));
    this.rh?.setValue(this.postulate.rh);
    this.cellPhone?.setValue(this.postulate.cellPhone);
    this.phone?.setValue(this.postulate.phone);
    this.email?.setValue(this.postulate.email);
    this.career?.setValue(this.postulate.career);
    this.description?.setValue(this.postulate.description);
  }

  initPostulate() {
    this.postulateService.postulateByIdEndpoint(this.postulateId).subscribe(
      (postulateResult: PostulateDTO) => {
        if(postulateResult != null) {
          this.postulate = postulateResult;
          this.setFormPostulate();
        }
        this.getBasicParams();
      }
    );
  }

  getBasicParams() {
    this.paramsService.docTypeEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramDocType = paramResponse;
        this.canva = false;
      }
    );

    this.paramsService.educationalLevelEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramEducationalLevel = paramResponse;
        this.canva = false;
      }
    );

    this.paramsService.postulateFindOutEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramFindOut = paramResponse;
        this.canva = false;
      }
    );
  }

  addFile(event: any, index: number) {
    if(event != undefined && event.target != undefined && event.target.files != undefined && event.target.files.length > 0)
      this.filesRel[index].file = event.target.files[0];
  }

  validateFormPostulate() {
    this.formPostulate.markAllAsTouched();
    if(this.formPostulate.status == 'VALID') {
      this.canva = true;
      this.postulate = this.errors.mapping(this.postulate, this.formPostulate);
      this.postulate.photo = (this.filesRel.length > 0 && this.filesRel[0].file != undefined) ? this.filesRel[0].file : undefined;
      this.postulate.recruiterUserId = this.user.id;
      this.savePostulate();
    }
  }

  savePostulate() { 
    if(this.postulateId > 0) {
      this.postulateService.editPostulateEndpoint(this.postulate).subscribe(
        (rsp: any) => {
          this.cancel();
        }
      );
    } else {
      this.postulateService.addPostulateEndpoint(this.postulate).subscribe(
        (postulateId: any) => {
          this.postulateId = postulateId;
          this.cancel();
        }
      );
    }
  }

  cancel() {
    this.router.navigateByUrl('recruiter/postulate/list');
  }

}
