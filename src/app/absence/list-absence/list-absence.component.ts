import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbsenceService } from 'src/app/_services/absence/absence.service';
import { ConfigurationService } from 'src/app/_services/configuration.service';
import { AbsenceApprovalDTO, AbsenceDTO, AbsenceFileDTO, AbsenceUserDTO } from 'src/app/dto/absence/absence.dto';
import { ConfigurationItemDTO } from 'src/app/dto/configuration.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AdminMsgErrors } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-list-absence',
  templateUrl: './list-absence.component.html',
  styleUrls: ['./list-absence.component.scss']
})
export class ListAbsenceComponent implements OnInit {
  canva: boolean = true;
  errorOtherUser: boolean = false;
  modalReference: any = {};
  years: number[] = [];
  selectedYear: number = 0;
  approveRequired: number[] = [];
  approveHR: number[] = [];

  approveFormActive: boolean = false;
  errors: AdminMsgErrors = new AdminMsgErrors();
  absenceSelected: AbsenceDTO = { id: 0, absenceTypeId: 0, userId: 0, employeeId: 0, jobId: 0, reportJobId: 0, created: new Date(), updated: new Date(), started: new Date(), finished: new Date(), businessDays: 0, active: 0, status: 0, description: '', approvalQuantity: 0 };
  approvalSelected: AbsenceApprovalDTO = { id: 0, absenceId: 0, userId: 0, created: new Date(), updated: new Date(), approval: 0, description: '', isHRApproval: 0 };
  approvalsByAbsenceSelected: AbsenceApprovalDTO[] = [];
  filesByAbsenceSelected: AbsenceFileDTO[] = [];
  formApproval!: FormGroup;

  absences: AbsenceDTO[] = [];
  absencesMe: AbsenceDTO[] = [];
  absencesOthers: AbsenceDTO[] = [];
  absencesHR: AbsenceDTO[] = [];
  absenceUser: AbsenceUserDTO|null = null;
  absenceUserMe: AbsenceUserDTO = { id: 0, userName: '' };
  absenceUsers: AbsenceUserDTO[] = [];
  user!: UserDTO;

  constructor(private modalService: NgbModal, private router: Router, private configurationService: ConfigurationService, private absenceService: AbsenceService) { }

  ngOnInit(): void {
    var now: Date = new Date();
    this.years.push(now.getFullYear());
    this.selectedYear = now.getFullYear();
  }


  getUser(user: UserDTO) {
    this.user = user;
    this.absenceUsers = [];
    this.absenceService.userListEndpoint(user.id).subscribe(
      (users: AbsenceUserDTO[]) => {
        for(let userAbs of users)
          if(userAbs.id == user.id) {
            if(userAbs.employeeId != null)
              this.absenceUserMe = userAbs;
          } else {
            this.absenceUsers.push(userAbs);
          }

        console.log(this.absenceUserMe);
        this.configurationService.getAbsenceTypeEndpoint().subscribe(
          (items: ConfigurationItemDTO[]) => {
            if(items.length == 1) {
              this.approveHR = [];
              var splitValue: string[] = items[0].value1.split(',');
              var numberMax: number = 0;

              for(let value of splitValue) {
                var numberValue: number = Number(value);
                this.approveHR.push(numberValue);
                if(numberMax < numberValue)
                  numberMax = numberValue;
              }

              this.approveRequired = [];
              for(var i = 0; i <= numberMax; i++)
                this.approveRequired.push(0);
              this.approveRequired[numberMax] = 2;
            }
            this.initAbsenceList();
          }
        );
      }
    );
  }

  initAbsenceList() {
    if(this.user.employeeId != null)
      this.absenceService.absenceListEndpoint(this.user.employeeId).subscribe(
        (absences: AbsenceDTO[]) => {
          this.absences = absences;
          this.changeYear(this.selectedYear, true);
          this.canva = false;
        }
      );
  }

  openEdit(absenceId: number) {
    this.router.navigateByUrl('absence/request/edit/' + absenceId.toString());
    this.closeModal();
  }

  changeYear(year: number, prepareAbsence: boolean) {
    this.canva = true;
    this.selectedYear = year;
    this.years = [];
    var firstYear: number = year;
    var lastYear: number = year;

    this.absencesMe = [];
    this.absencesOthers = [];
    this.absencesHR = [];

    var compareYear: number = year;
    for(let absence of this.absences) {
      if(prepareAbsence) {
        if(absence.created != null) {
          absence.created = new Date(absence.created);
          compareYear = absence.created.getFullYear();
        }

        if(absence.updated != null)
          absence.updated = new Date(absence.updated);
        if(absence.started != null)
          absence.started = new Date(absence.started);
        if(absence.finished != null)
          absence.finished = new Date(absence.finished);

        absence.statusClass = this.getStatusByAbsence(absence);
        switch(absence.statusClass) {
          case 'approved': absence.statusName = 'Aprobado'; break;
          case 'pending': absence.statusName = 'Pendiente'; break;
          case 'failed': absence.statusName = 'Rechazado'; break;
          default: absence.statusName = 'Inactivo';
        }
      } else if(absence.created != null) {
        compareYear = absence.created.getFullYear();
      }

      if(firstYear > compareYear)
        firstYear = compareYear;
      if(lastYear < compareYear)
        lastYear = compareYear;

      if(compareYear == this.selectedYear) {
        if(absence.employeeId == this.user.employeeId)
          this.absencesMe.push(absence);
        else if(this.user.jobId == absence.reportJobId)
          this.absencesOthers.push(absence);
        else
          this.absencesHR.push(absence);
      }
    }

    for(var y = firstYear; y <= lastYear; y++)
      this.years.push(y);
    this.canva = false;
  }

  getStatusByAbsence(absence: AbsenceDTO): string {
    if(absence.active == 0)
      return 'inactive';
    if(absence.approvalQuantity == 0)
      return 'pending';
    if(absence.status == 0)
      return 'failed';
    return (absence.approvalQuantity < this.getTotalApprovalByAbsence(absence.absenceTypeId)) ? 'pending' : 'approved';
  }

  getTotalApprovalByAbsence(absenceTypeId: number): number {
    if(this.approveRequired.length > absenceTypeId && this.approveRequired[absenceTypeId] > 0)
      return this.approveRequired[absenceTypeId];

    if(this.approveRequired.length <= absenceTypeId)
      for(var i = this.approveRequired.length; i <= absenceTypeId; i++)
        this.approveRequired.push(0);

    if(this.approveRequired[absenceTypeId] == 0) {
      for(let configAbsenceTypeId of this.approveHR) {
        if(configAbsenceTypeId == absenceTypeId) {
          this.approveRequired[absenceTypeId] = 2;
          return 2;
        }
      }
      this.approveRequired[absenceTypeId] = 1;
      return 1;
    }

    return 0;
  }

  setSelectedYear(event: any) {
    this.changeYear(event.target.value, false);
  }

  setSelectedOtherUser(event: any) {
    this.errorOtherUser = false;
    var employeeId = event.target.value;
    this.absenceUser = null;
    if(employeeId !== '')
      for(let user of this.absenceUsers)
        if(user.employeeId == employeeId)
          this.absenceUser = user;
  }

  validateOtherUser() {
    if(this.absenceUser != null) {
      this.newAbsence(true);
      this.closeModal();
    } else {
      this.errorOtherUser = true;
    }
  }

  newAbsence(isOtherUser: boolean) {
    this.canva = true;
    var url = 'absence/request/add';
    if(isOtherUser && this.absenceUser != null)
      url += '/' + this.absenceUser.employeeId;
    this.router.navigateByUrl(url);
  }

  getSelectedAbsenceFiles() {
    this.absenceService.fileListEndpoint(this.absenceSelected.id).subscribe(
      (files: AbsenceFileDTO[]) => {
        this.filesByAbsenceSelected = files;
        this.canva = false;
      }
    );
  }

  openAbsenceModal(content: any, absence: AbsenceDTO) {
    this.absenceSelected = absence;
    this.approvalsByAbsenceSelected = [];
    this.filesByAbsenceSelected = [];
    this.openModal(content);

    if(this.absenceSelected.approvalQuantity > 0) {
      this.canva = true;
      this.absenceService.approvalListEndpoint(this.absenceSelected.id).subscribe(
        (approvals: AbsenceApprovalDTO[]) => {
          this.approvalsByAbsenceSelected = approvals;
          this.getSelectedAbsenceFiles();
        }
      );
    } else {
      this.getSelectedAbsenceFiles();
    }
  }

  openModal(content: any) {
    this.modalReference = this.modalService.open(content, { size: 'xl' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  toggleApprovalForm() {
    this.approveFormActive = !this.approveFormActive;
    if(this.approveFormActive) {
      this.initFormApproval();
      this.approvalSelected = { id: 0, absenceId: 0, userId: 0, created: new Date(), updated: new Date(), approval: 0, description: '', isHRApproval: 0 };
      for(let approval of this.approvalsByAbsenceSelected)
        if(approval.userId == this.user.id) {
          this.approvalSelected = approval;
          this.formApproval.get('approval')?.setValue(approval.approval);
          this.formApproval.get('description')?.setValue(approval.description);
          break;
        }
    }
  }

  initFormApproval() {
    var newDate = this.errors.formatDate(new Date());
    this.formApproval = new FormGroup({
      approval: new FormControl(1, Validators.required),
      created: new FormControl(newDate),
      updated: new FormControl(newDate),
      description: new FormControl(null, Validators.required)
    });
  }

  validateFormApproval() {
    this.formApproval.markAllAsTouched();
    if(this.formApproval.status == 'VALID') {
      this.canva = true;
      this.closeModal();

      this.approvalSelected = this.errors.mapping(this.approvalSelected, this.formApproval);
      this.approvalSelected.absenceId = this.absenceSelected.id;
      this.approvalSelected.userId = this.user.id;
      this.approvalSelected.isHRApproval = (this.absenceSelected.employeeId != this.user.employeeId && this.absenceSelected.reportJobId != this.user.jobId) ? 1 : 0;
      this.saveApproval();
    }
  }

  saveApproval() {
    this.toggleApprovalForm();
    if(this.approvalSelected.id == 0) {
      this.absenceService.addApprovalEndpoint(this.approvalSelected).subscribe(
        (approvalId: any) => {
          this.initAbsenceList();
        }
      );
    } else {
      this.absenceService.editApprovalEndpoint(this.approvalSelected).subscribe(
        (rsp: any) => {
          this.initAbsenceList();
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
