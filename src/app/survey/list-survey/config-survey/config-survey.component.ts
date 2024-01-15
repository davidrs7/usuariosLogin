import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParamsService } from 'src/app/_services/params.service';
import { SurveyService } from 'src/app/_services/survey/survey.service';
import { UserService } from 'src/app/_services/user.service';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { SurveyDTO, SurveyHeaderDTO, SurveyUserDTO, SurveyUserRelDTO } from 'src/app/dto/survey/survey.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AdminMsgErrors } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-config-survey',
  templateUrl: './config-survey.component.html',
  styleUrls: ['./config-survey.component.scss']
})
export class ConfigSurveyComponent implements OnInit {
  canva: boolean = true;
  errorSelected: boolean = false;
  modalReference!: any;
  surveyId: any;

  survey: SurveyDTO = { id: 0, available: 0, name: '', description: '', active: 0 };
  surveySelected!: SurveyHeaderDTO;
  surveyList: SurveyHeaderDTO[] = [];
  surveyHeaderNew: boolean = true;

  users: UserDTO[] = [];
  usersSelected: SurveyUserDTO[] = [];
  params: ParamsDTO[] = [];
  userMasive: string = '';

  errors: AdminMsgErrors = new AdminMsgErrors();
  formHeader!: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private surveyService: SurveyService, private userService: UserService, private paramsService: ParamsService) { }

  ngOnInit(): void {
    this.initFormHeader();

    this.surveyId = this.route.snapshot.paramMap.get("id");
    if(this.surveyId != null) {
      this.getSurvey();
    } else {
      this.goBack();
    }
  }

  get started() { return this.formHeader.get('started'); }
  get finished() { return this.formHeader.get('finished'); }
  get title() { return this.formHeader.get('title'); }

  initFormHeader() {
    this.formHeader = new FormGroup({
      started: new FormControl(null, Validators.required),
      finished: new FormControl(null, Validators.required),
      title: new FormControl(null, Validators.required)
    });
  }

  setValuesFormHeader() {
    this.started?.setValue(this.errors.formatDate(this.surveySelected?.started));
    this.finished?.setValue(this.errors.formatDate(this.surveySelected?.finished));
    this.title?.setValue(this.surveySelected?.title);
  }

  getSurvey() {
    this.surveyService.surveyEndpoint(this.surveyId).subscribe(
      (surveyResponse: SurveyDTO) => {
        if(surveyResponse != null) {
          this.survey = surveyResponse;
          if(this.survey.available == 0) {
            this.goBack();
          } else {
            this.getSurveyHeaderlist();
          }
        } else {
          this.goBack();
        }
      }
    );
  }

  getSurveyHeaderlist() {
    this.surveyService.surveyListBySurveyEndpoint(this.surveyId).subscribe(
      (surveyListResult: SurveyHeaderDTO[]) => {
        this.surveyList = surveyListResult;
        var first: boolean = true;
        for(let surveyHeader of this.surveyList) {
          surveyHeader.active = 0;
          if(first)
            this.selectSurveyHeader(surveyHeader);
          first = false;
        }

        if(first)
          this.canva = false;
      }
    );
  }

  selectSurveyHeader(surveyHeader: SurveyHeaderDTO) {
    for(let surveyTmp of this.surveyList)
      surveyTmp.active = 0;

    surveyHeader.active = 1;
    this.surveySelected = surveyHeader;
    this.getUsers();
  }

  getUsers() {
    this.userService.userListEndpoint().subscribe(
      (usersResult: UserDTO[]) => {
        this.surveyService.surveyUsersByHeaderEndpoint(this.surveySelected.id).subscribe(
          (surveyUsersResult: SurveyUserDTO[]) => {
            this.users = [];
            this.usersSelected = surveyUsersResult;

            if(surveyUsersResult.length > 0) {
              for(let user of usersResult) {
                user.available = false;
                var surveyUser = surveyUsersResult.find((sur) => {
                  if(sur.id == user.id)
                    return sur;
                  return null;
                });

                if(surveyUser == null)
                  this.users.push(user);
              }

              for(let user of this.usersSelected)
                user.available = false;
            } else {
              for(let user of usersResult) {
                user.available = false;
                this.users.push(user);
              }
            }
            this.canva = false;
          }
        );
      }
    );
  }

  toggleUser(userId: number) {
    for(let user of this.users)
      if(user.id == userId) {
        user.available = !user.available;
        break;
      }
  }

  toggleSurveyUser(userId: number) {
    for(let user of this.usersSelected)
      if(user.id == userId) {
        user.available = !user.available;
        break;
      }
  }

  toggleParam(paramId: number) {
    for(let param of this.params)
      if(param.id == paramId) {
        param.available = !param.available;
        break;
      }
  }

  toggleMasive(masive: string) {
    this.params = [];
    
    if(this.userMasive == masive) {
      this.userMasive = '';
    } else {
      this.canva = true;
      this.userMasive = masive;

      this.paramsService.paramsDefaultEndpoint(masive).subscribe(
        (paramsResult: ParamsDTO[]) => {
          this.params = paramsResult;
          this.params.sort((a, b) => (a.name > b.name) ? 1 : -1);
          for(let param of this.params)
            param.available = false;
          this.canva = false;
        }
      );
    }
  }

  openAddModal(content:any) {
    this.surveyHeaderNew = true;
    this.initFormHeader();
    this.openModal(content);
  }

  openEditModal(content:any) {
    this.surveyHeaderNew = false;
    this.setValuesFormHeader();
    this.openModal(content);
  }

  openModal(content:any) {
    this.modalReference = this.modalService.open(content, { size: 'xl' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  validateStartedDate() {
    if(!this.surveyHeaderNew) {
      var date: Date = new Date(this.surveySelected.started);
      return (date < new Date());
    }
    return false;
  }

  validateFinishedDate() {
    if(!this.surveyHeaderNew) {
      var date: Date = new Date(this.surveySelected.finished);
      return (date < new Date());
    }
    return false;
  }

  goBack() {
    this.router.navigateByUrl('survey/survey/list');
  }

  validateFormHeader() {
    this.formHeader.markAllAsTouched();
    if(this.formHeader.status == 'VALID') {
      this.canva = true;
      if(this.surveyHeaderNew) {
        var surveyMerge: SurveyHeaderDTO = { id: 0, available: 0, name: '', description: '', started: new Date(), finished: new Date(), title: '', isAnswered: 0, active: 0 };
        this.survey = this.errors.mapping(surveyMerge, this.formHeader);
        surveyMerge.surveyId = this.surveyId;
        this.saveHeader(surveyMerge);
      } else {
        this.survey = this.errors.mapping(this.surveySelected, this.formHeader);
        this.saveHeader(this.surveySelected);
      }
    }
  }

  saveHeader(surveyMerge: SurveyHeaderDTO) {
    if(this.surveyHeaderNew) {
      this.surveyService.addSurveyHeaderEndpoint(surveyMerge).subscribe(
        (rsp: any) => {
          this.getSurveyHeaderlist();
          this.closeModal();
        }
      );
    } else {
      this.surveyService.editSurveyHeaderEndpoint(surveyMerge).subscribe(
        (headerId: any) => {
          this.getSurveyHeaderlist();
          this.closeModal();
        }
      );
    }
  }

  saveUsers(isDelete: boolean) {
    this.canva = true;
    var usersSave: number[] = [];
    var lastUser: number = 0;

    var usersIterable: any = isDelete ? this.usersSelected : this.users;
    for(let user of usersIterable)
      if(user.available) {
        usersSave.push(user.id);
        lastUser = user.id;
      }

    if(usersSave.length > 0) {
      this.errorSelected = false;
      for(let userId of usersSave) {
        var surveyUserRel: SurveyUserRelDTO = { userId: userId, surveyId: this.survey.id, headerId: this.surveySelected.id };
        if(isDelete) {
          this.surveyService.deleteSurveyUserRelEndpoint(surveyUserRel).subscribe(
            (userIdResult: any) => {
              if(userIdResult == lastUser)
                this.getUsers();
            }
          );
        } else {
          this.surveyService.addSurveyUserRelEndpoint(surveyUserRel).subscribe(
            (userIdResult: any) => {
              if(userIdResult == lastUser)
                this.getUsers();
            }
          );
        }
      }
    } else {
      this.errorSelected = true;
      this.canva = false;
    }
  }

  saveUsersMasive() {
    if(this.userMasive == '' || this.params.length <= 0) {
      this.errorSelected = true;
    } else {
      this.canva = true;
      var paramsSave: number[] = [];
      var lastParam: number = 0;

      for(let param of this.params)
        if(param.available) {
          paramsSave.push(param.id);
          lastParam = param.id;
        }

      if(paramsSave.length > 0) {
        this.errorSelected = false;
        
        switch(this.userMasive) {
          case 'department':
            for(let paramId of paramsSave) {
              var surveyUserRel: SurveyUserRelDTO = { surveyId: this.survey.id, headerId: this.surveySelected.id, paramId: paramId };
              this.surveyService.addSurveyUserRelByDepartmentEndpoint(surveyUserRel).subscribe(
                (paramIdResult: any) => {
                  if(paramIdResult == lastParam)
                    this.getUsers();
                }
              );
            }
            break;
          case 'job':
            for(let paramId of paramsSave) {
              var surveyUserRel: SurveyUserRelDTO = { surveyId: this.survey.id, headerId: this.surveySelected.id, paramId: paramId };
              this.surveyService.addSurveyUserRelByJobEndpoint(surveyUserRel).subscribe(
                (paramIdResult: any) => {
                  if(paramIdResult == lastParam)
                    this.getUsers();
                }
              );
            }
            break;
          case 'city':
            for(let paramId of paramsSave) {
              var surveyUserRel: SurveyUserRelDTO = { surveyId: this.survey.id, headerId: this.surveySelected.id, paramId: paramId };
              this.surveyService.addSurveyUserRelByCityEndpoint(surveyUserRel).subscribe(
                (paramIdResult: any) => {
                  if(paramIdResult == lastParam)
                    this.getUsers();
                }
              );
            }
            break;
          default:
            this.errorSelected = true;
            this.canva = false;
        }

        this.userMasive = '';
        this.params = [];
      } else {
        this.errorSelected = true;
        this.canva = false;
      }
    }
  }

  tabSelect(children: HTMLCollection, selection: number) {
    this.errorSelected = false;
    for(var i = 0; i < children.length; i++) {
      var className = children[i].getAttribute('class');
      if(i == selection)
        children[i].setAttribute('class', (className != undefined) ? className + ' active' : 'active');
      else
        children[i].setAttribute('class', (className != undefined) ? className.replace('active', '') : '');
    }
  }

}
