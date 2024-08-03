import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbsenceService } from 'src/app/_services/absence/absence.service';
import { ConfigurationService } from 'src/app/_services/configuration.service';
import { EmployeeService } from 'src/app/_services/employee/employee.service';
import { ParamsService } from 'src/app/_services/params.service';
import { AbsenceDTO, AbsenceFileDTO, AbsenceUserDTO } from 'src/app/dto/absence/absence.dto';
import { ConfigurationItemDTO } from 'src/app/dto/configuration.dto';
import { EmployeeFileTypeDTO } from 'src/app/dto/employee/employee.dto';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AbsenceFileConfig, AbsenceFileConfigKey, AdminMsgErrors, FileRel } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-add-absence',
  templateUrl: './add-absence.component.html',
  styleUrls: ['./add-absence.component.scss']
})
export class AddAbsenceComponent implements OnInit {
  canva: boolean = true;
  errorFinishedValid: boolean = false;
  warnStartedValid: boolean = false;
  warnFinishedValid: boolean = false;
  absenceId: any;
  employeeId: any;
  action: string = '';
  weekdays: number[] = [ 0, 1, 2, 3, 4, 5, 6 ];

  filesRel: FileRel[] = [];
  fileConfig: AbsenceFileConfig = {};
  files: AbsenceFileDTO[] = [];

  errors: AdminMsgErrors = new AdminMsgErrors();
  paramAbsenceStatus: ParamsDTO[] = [];
  absence: AbsenceDTO = { id: 0, absenceTypeId: 0, userId: 0, employeeId: 0, jobId: 0, reportJobId: 0, created: new Date(), updated: new Date(), started: new Date(), finished: new Date(), businessDays: 0, active: 0, status: 0, description: '', approvalQuantity: 0 };
  absenceUser: AbsenceUserDTO = { id: 0, userName: '' };
  formAbsence!: FormGroup;
  user!: UserDTO;

  constructor(private router: Router, private configurationService: ConfigurationService, private route: ActivatedRoute, private absenceService: AbsenceService, private paramsService: ParamsService, private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.initFormAbsence();
    this.initParams();
  }

  get absenceTypeId() { return this.formAbsence.get('absenceTypeId'); }
  get created() { return this.formAbsence.get('created'); }
  get updated() { return this.formAbsence.get('updated'); }
  get started() { return this.formAbsence.get('started'); }
  get finished() { return this.formAbsence.get('finished'); }
  get businessDays() { return this.formAbsence.get('businessDays'); }
  get active() { return this.formAbsence.get('active'); }
  get description() { return this.formAbsence.get('description'); }

  initFormAbsence() {
    var date: Date = new Date();
    this.formAbsence = new FormGroup({
      absenceTypeId: new FormControl(null, Validators.required),
      created: new FormControl(this.errors.formatDate(date)),
      updated: new FormControl(this.errors.formatDate(date)),
      started: new FormControl(null, Validators.required),
      finished: new FormControl(null),
      businessDays: new FormControl(1, [ Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1) ]),
      active: new FormControl(1),
      description: new FormControl(null, Validators.required)
    });
    this.filesRel = [{ level: '' }];
  }

  initAbsence() {
    this.absenceService.absenceEndpoint(this.absenceId).subscribe(
      (absence: AbsenceDTO) => {
        this.absence = absence;
        this.employeeId = absence.employeeId;
        this.initAbsenceUser(absence.employeeId);
        this.setValuesFormAbsence();

        this.absenceService.fileListEndpoint(this.absenceId).subscribe(
          (files: AbsenceFileDTO[]) => {
            this.files = files;
          }
        );
      }
    );
  }

  initParams() {
    this.paramsService.absenceTypeEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.paramAbsenceStatus = paramResponse;
        this.configurationService.getWorkdaysEndpoint().subscribe(
          (items: ConfigurationItemDTO[]) => {
            if(items.length == 1) {
              this.weekdays = [];
              var splitValue: string[] = items[0].value1.split(',');
              for(let value of splitValue)
                this.weekdays.push(Number(value));
            }
          }
        );
      }
    );

    this.employeeService.fileTypesEndpoint().subscribe(
      (paramResponse: EmployeeFileTypeDTO[]) => {
        this.configurationService.getAbsenceFileLevelEndpoint().subscribe(
          (items: ConfigurationItemDTO[]) => {
            var first: boolean = true;
            for(let item of items) {
              if(first) {
                this.fileConfig[0] = {
                  id: 0, name: '', selectedLevel1: 0, selectedLevel2: 0, selectedLevel3: 0,
                  paramFileTypesLevel1: paramResponse, paramFileTypesLevel2: [], paramFileTypesLevel3: [],
                  active: true
                };
                this.initFileTypeItem(0, item.value1);
              }

              if(item.listItem != undefined && item.listItem != '') {
                var id: number = Number(item.listItem);
                this.fileConfig[id] = {
                  id: id, name: '', selectedLevel1: 0, selectedLevel2: 0, selectedLevel3: 0,
                  paramFileTypesLevel1: paramResponse, paramFileTypesLevel2: [], paramFileTypesLevel3: [],
                  active: true
                };
                this.initFileTypeItem(id, item.listValue);
              }

              first = false;
            }
          }
        );
      }
    );
  }

  initFileTypeItem(id: number, itemlist: string) {
    var splitValue: string[] = itemlist.split(',');
    for(var i = 0; i < splitValue.length; i++)
      switch(i) {
        case 0:
          this.fileConfig[id].selectedLevel1 = Number(splitValue[i]);
          break;
        case 1:
          this.fileConfig[id].selectedLevel2 = Number(splitValue[i]);
          break;
        case 2:
          this.fileConfig[id].selectedLevel3 = Number(splitValue[i]);
          break;
      }
  }

  getUrlSegments(segments: string[]) {
    if(segments.length >= 3)
      this.action = segments[2];

    this.absenceId = this.route.snapshot.paramMap.get("id");
    if(this.action == 'edit' && this.absenceId != null)
      this.initAbsence();
    else if(this.action == 'add' && this.absenceId != null) {
      this.employeeId = this.absenceId;
      this.absenceId = null;
    }
  }

  getUser(user: UserDTO) {
    this.user = user;
    if(user.employeeId != null && this.employeeId == null)
      this.employeeId = user.employeeId;
    if(this.action != 'edit' && this.user.employeeId != null)
      this.initAbsenceUser(this.user.employeeId);
  }

  initAbsenceUser(employeeId: number) {
    if(this.employeeId > 0) {
      this.absenceService.userEndpoint(this.employeeId).subscribe(
        (absenceUser: AbsenceUserDTO) => {
          this.absenceUser = absenceUser;
          if(this.absenceUser.employeeId != employeeId) {
            this.absenceService.userEndpoint(employeeId).subscribe(
              (absenceUserBoss: AbsenceUserDTO) => {
                if(absenceUserBoss.jobId != absenceUser.reportJobId)
                  this.cancel();
                this.canva = false;
              }
            );
          } else {
            this.canva = false;
          }
        }
      );
    } else {
      this.cancel();
    }
  }

  setValuesFormAbsence() {
    this.absenceTypeId?.setValue(this.absence.absenceTypeId == 0 ? '' : this.absence.absenceTypeId);
    this.created?.setValue(this.errors.formatDate(this.absence.created));
    this.updated?.setValue(this.errors.formatDate(this.absence.updated));
    this.started?.setValue(this.errors.formatDate(this.absence.started));
    this.finished?.setValue(this.errors.formatDate(this.absence.finished));
    this.businessDays?.setValue(this.absence.businessDays);
    this.active?.setValue(this.absence.active);
    this.description?.setValue(this.absence.description);
    this.changeStarted();
  }

  changeStarted() {
    this.warnStartedValid = false;
    if(this.started?.value != null) {
      var started: Date = new Date(this.started?.value + ' 00:00:00');
      if(!this.validateDate(started)) {
        this.warnStartedValid = true;
        started.setDate(started.getDate() - 1);
        this.started?.setValue(this.errors.formatDate(this.getValidDate(started)));
      }

      while(!this.validateDate(started)) {
        started.setDate(started.getDate() - 1);
        this.warnStartedValid = true;
      }

      if(this.warnStartedValid)
        this.started?.setValue(this.errors.formatDate(started));
    }

    if(this.businessDays?.value != null)
      this.changeBusinessDays();
    else if(this.finished?.value != null)
      this.changeFinished();
  }

  changeBusinessDays() {
    if(this.started?.value != null && this.businessDays?.value != null) {
      var started: Date = new Date(this.started?.value + ' 00:00:00');
      if(this.businessDays?.value > 1) {
        var count: number = 1;
        while(count < this.businessDays?.value) {
          started.setDate(started.getDate() + 1);
          if(this.validateDate(started))
            count++;
        }
      }
      this.finished?.setValue(this.errors.formatDate(started));
      this.errorFinishedValid = false;
    }
  }

  changeFinished() {
    this.warnFinishedValid = false;
    this.errorFinishedValid = false;
    if(this.started?.value != null && this.finished?.value != null) {
      var started: Date = new Date(this.started?.value + ' 00:00:00');
      var finished: Date = new Date(this.finished?.value + ' 00:00:00');
      if(!this.validateDate(finished)) {
        this.warnFinishedValid = true;
        finished.setDate(finished.getDate() - 1);
        finished = this.getValidDate(finished);
        this.finished?.setValue(this.errors.formatDate(finished));
      }

      if(started > finished) {
        this.errorFinishedValid = true;
        this.businessDays?.setValue(0);
      } else if(started == finished) {
        this.businessDays?.setValue(1);
      } else {
        var count: number = 1;
        while(started < finished) {
          started.setDate(started.getDate() + 1);
          if(this.validateDate(started))
            count++;
        }
        this.businessDays?.setValue(count);
      }
    }
  }

  getValidDate(date: Date): Date {
    while(!this.validateDate(date))
      date.setDate(date.getDate() - 1);
    return date;
  }

  validateDate(date: Date): boolean {
    var validate: boolean = (this.weekdays[((date.getDay() == 0) ? 6 : (date.getDay() - 1))] >= 0);
    return validate;
  }

  cancel() {
    this.router.navigateByUrl('absence/request/list');
  }

  addFileField() {
    this.filesRel[this.filesRel.length] = { level: '' };
  }

  addFile(event: any, index: number) {
    if(event != undefined && event.target != undefined && event.target.files != undefined && event.target.files.length > 0)
      this.filesRel[index].file = event.target.files[0];
  }

  setFileConfigLevelName(id: number) {
    if(this.fileConfig[id].labelSelectedLevel1 == undefined || this.fileConfig[id].labelSelectedLevel1 == null || this.fileConfig[id].labelSelectedLevel1 == '') {
      var validLevel1: boolean = (this.fileConfig[id].selectedLevel1 == 0);
      var validLevel2: boolean = (this.fileConfig[id].selectedLevel2 == 0);
      var validLevel3: boolean = (this.fileConfig[id].selectedLevel3 == 0);

      for(let param of this.fileConfig[id].paramFileTypesLevel1) {
        if(validLevel1 && validLevel2 && validLevel3)
          break;

        if(!validLevel1 && param.id == this.fileConfig[id].selectedLevel1) {
          this.fileConfig[id].labelSelectedLevel1 = param.name;
          validLevel1 = true;
        } else if(!validLevel2 && param.id == this.fileConfig[id].selectedLevel2) {
          this.fileConfig[id].labelSelectedLevel2 = param.name;
          validLevel2 = true;
        } else if(!validLevel3 && param.id == this.fileConfig[id].selectedLevel3) {
          this.fileConfig[id].labelSelectedLevel3 = param.name;
          validLevel3 = true;
        }
      }
    }
  }

  validateFormAbsence() {
    this.formAbsence.markAllAsTouched();
    this.warnStartedValid = false;
    this.warnFinishedValid = false;
    if(this.formAbsence.status == 'VALID' && !this.errorFinishedValid) {
      this.canva = true;
      this.changeStarted();
      this.absence = this.errors.mapping(this.absence, this.formAbsence);
      this.absence.userId = this.user.id;
      this.absence.employeeId = this.employeeId;
      this.saveAbsence();
    }
  }

  saveAbsence() {
    if(this.absence.id == 0) {
      this.absenceService.addEndpoint(this.absence).subscribe(
        (absenceId: any) => {
          this.absence.id = absenceId;
          this.saveDocument();
        }
      );
    } else {
      this.absenceService.editEndpoint(this.absence).subscribe(
        (rsp: any) => {
          this.saveDocument();
        }
      );
    }
  }

  saveDocument() {
    if(this.filesRel.length > 0 && this.absenceUser.employeeId != null) {
      for(var i = 0; i < this.filesRel.length; i++)
        if(this.filesRel[i].file != undefined) {
          var fileConfigKey: AbsenceFileConfigKey = {
            id: 0, name: '', selectedLevel1: 0, selectedLevel2: 0, selectedLevel3: 0,
            paramFileTypesLevel1: [], paramFileTypesLevel2: [], paramFileTypesLevel3: [],
            active: true
          };
          if(this.fileConfig[this.absence.absenceTypeId] != undefined) {
            this.setFileConfigLevelName(this.absence.absenceTypeId);
            fileConfigKey = this.fileConfig[this.absence.absenceTypeId];
          } else if(this.fileConfig[0] != undefined) {
            this.setFileConfigLevelName(0);
            fileConfigKey = this.fileConfig[0];
          } else {
            continue;
          }

          var absenceFile: AbsenceFileDTO = {
            id: 0, absenceId: this.absence.id, employeeId: this.absenceUser.employeeId,
            department: this.absenceUser.departmentName ?? '', name: this.absenceUser.name ?? '',
            city: this.absenceUser.cityName ?? '', level1: fileConfigKey.labelSelectedLevel1 ?? '',
            level2: fileConfigKey.labelSelectedLevel2 ?? '', level3: fileConfigKey.labelSelectedLevel3 ?? '',
            fileName: '', url: '', document: this.filesRel[i].file
          };

          this.absenceService.addFileEndpoint(absenceFile).subscribe(
            (fileId: any) => {
              this.cancel();
            }
          );
        }
    } else {
      this.cancel();
    }
  }

}
