import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/configuration.service';
import { EmployeeService } from 'src/app/_services/employee/employee.service';
import { ParamsService } from 'src/app/_services/params.service';
import { ConfigurationItemDTO, ConfigurationUserDTO } from 'src/app/dto/configuration.dto';
import { EmployeeFileTypeDTO } from 'src/app/dto/employee/employee.dto';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AbsenceFileConfig } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-config-absence',
  templateUrl: './config-absence.component.html',
  styleUrls: ['./config-absence.component.scss']
})
export class ConfigAbsenceComponent implements OnInit {
  canva: boolean = true;
  paramAbsenceActive: boolean = false;
  paramDepartmentError: boolean = false;
  fileConfig: AbsenceFileConfig = {};
  fileConfigItems: number[] = [];

  users: ConfigurationUserDTO[] = [];
  paramAbsenceStatus: ParamsDTO[] = [];
  paramDepartment: ParamsDTO[] = [];
  paramFileTypes: EmployeeFileTypeDTO[] = [];
  user!: UserDTO;

  constructor(private paramsService: ParamsService, private employeeService: EmployeeService, private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.initParamsAbsence();
  }

  initParamsAbsence() {
    this.paramsService.absenceTypeEndpoint().subscribe(
      (paramAbsenceResponse: ParamsDTO[]) => {
        this.paramAbsenceStatus = paramAbsenceResponse;

        this.employeeService.fileTypesEndpoint().subscribe(
          (paramResponse: EmployeeFileTypeDTO[]) => {
            this.paramFileTypes = paramResponse;
            var fileTypesLevel1: EmployeeFileTypeDTO[] = this.getParamLevel(0);
            this.fileConfigItems.push(0);
            this.fileConfig[0] = {
              id: 0, name: '', selectedLevel1: 0, selectedLevel2: 0, selectedLevel3: 0,
              paramFileTypesLevel1: fileTypesLevel1, paramFileTypesLevel2: [], paramFileTypesLevel3: [],
              active: true
            };

            for(let param of this.paramAbsenceStatus) {
              this.fileConfigItems.push(param.id);
              this.fileConfig[param.id] = {
                id: param.id, name: param.name, selectedLevel1: 0, selectedLevel2: 0, selectedLevel3: 0,
                paramFileTypesLevel1: fileTypesLevel1, paramFileTypesLevel2: [], paramFileTypesLevel3: [],
                active: false
              };
            }

            this.configurationService.getAbsenceFileLevelEndpoint().subscribe(
              (items: ConfigurationItemDTO[]) => {
                var first: boolean = true;
                for(let item of items) {
                  if(first)
                    this.initFileTypeItem(0, item.value1);

                  if(item.listItem != undefined && item.listItem != '') {
                    var id: number = Number(item.listItem);
                    this.initFileTypeItem(id, item.listValue);
                    this.fileConfig[id].active = true;
                  }

                  first = false;
                }
              }
            );
          }
        );

        this.paramsService.departmentEndpoint().subscribe(
          (paramDepartmentResponse: ParamsDTO[]) => {
            this.paramDepartment = paramDepartmentResponse;

            this.configurationService.getAbsenceTypeEndpoint().subscribe(
              (items: ConfigurationItemDTO[]) => {
                var filterAnsenceParams: boolean = true;
                var filterDepartmentParams: boolean = true;
                var countSplit: number = 0;

                if(items.length == 1) {
                  var splitValue: string[] = items[0].value1.split(',');
                  if(splitValue.length > 1 || splitValue[0] != '0') {
                    filterAnsenceParams = false;
                    for(let param of this.paramAbsenceStatus) {
                      param.available = false;
                      for(let value of splitValue)
                        if(param.id == Number(value)) {
                          param.available = true;
                          countSplit++;
                          break;
                        }

                      if(countSplit == splitValue.length)
                        splitValue = [];
                    }
                  }

                  countSplit = 0;
                  var splitValue: string[] = items[0].value2.split(',');
                  if(splitValue.length > 1 || splitValue[0] != '0') {
                    filterDepartmentParams = false;
                    var paramDepartmentIds: number[] = [];

                    for(let param of this.paramDepartment) {
                      param.available = false;
                      for(let value of splitValue)
                        if(param.id == Number(value)) {
                          param.available = true;
                          countSplit++;
                          this.paramAbsenceActive = true;
                          paramDepartmentIds.push(param.id);
                          break;
                        }

                      if(countSplit == splitValue.length)
                        splitValue = [];
                    }
                  }
                }

                if(filterAnsenceParams)
                  for(let param of this.paramAbsenceStatus)
                    param.available = false;

                if(filterDepartmentParams) {
                  this.restartParamDepartment();
                  this.canva = false;
                } else {
                  this.initUsersByDepartment();
                }
              }
            );
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
          this.setSelectedParamLevel1(id);
          break;
        case 1:
          this.fileConfig[id].selectedLevel2 = Number(splitValue[i]);
          this.setSelectedParamLevel2(id);
          break;
        case 2:
          this.fileConfig[id].selectedLevel3 = Number(splitValue[i]);
          break;
      }
  }

  initUsersByDepartment() {
    this.configurationService.usersByAbsenceTypesAllowedEndpoint().subscribe(
      (users: ConfigurationUserDTO[]) => {
        this.users = users;
        for(let user of this.users)
          user.insert = (user.isSelected == 1);
        this.canva = false;
      }
    );
  }

  restartParamDepartment() {
    for(let param of this.paramDepartment)
      param.available = false;
  }

  getUser(user: UserDTO) {
    this.user = user;
  }

  toggleUser(userId: number) {
    for(let user of this.users)
      if(user.id == userId) {
        user.isSelected = (user.isSelected == 1) ? 0 : 1;
        break;
      }
  }

  changeSelectedAbsence(paramId: number) {
    for(let param of this.paramAbsenceStatus)
      if(param.id == paramId) {
        param.available = !param.available;
        break;
      }
  }

  changeSelectedDepartment(paramId: number) {
    for(let param of this.paramDepartment)
      if(param.id == paramId) {
        param.available = !param.available;
        break;
      }
  }

  getDepartmentIds(): number[] {
    var paramDepartmentIds: number[] = [];
    for(let param of this.paramDepartment)
        if(param.available)
          paramDepartmentIds.push(param.id);
    return paramDepartmentIds;
  }

  getParamLevel(levelId: number): EmployeeFileTypeDTO[] {
    var params: EmployeeFileTypeDTO[] = [];
    for(var i = 0; i < this.paramFileTypes.length; i++)
      if(this.paramFileTypes[i].levelId == levelId)
        params.push(this.paramFileTypes[i]);
    return params;
  }

  setActiveLevel(id: number) {
    this.fileConfig[id].active = !this.fileConfig[id].active;
  }

  setParamLevel1(event: any, id: number) {
    this.fileConfig[id].selectedLevel1 = event.target.value;
    this.setSelectedParamLevel1(id);
  }

  setSelectedParamLevel1(id: number) {
    this.fileConfig[id].selectedLevel2 = 0;
    this.fileConfig[id].selectedLevel3 = 0;
    this.fileConfig[id].paramFileTypesLevel2 = this.getParamLevel(this.fileConfig[id].selectedLevel1);
    this.fileConfig[id].paramFileTypesLevel3 = [];
  }

  setParamLevel2(event: any, id: number) {
    this.fileConfig[id].selectedLevel2 = event.target.value;
    this.setSelectedParamLevel2(id);
  }

  setSelectedParamLevel2(id: number) {
    this.fileConfig[id].selectedLevel3 = 0;
    this.fileConfig[id].paramFileTypesLevel3 = this.getParamLevel(this.fileConfig[id].selectedLevel2);
  }

  setParamLevel3(event: any, id: number) {
    this.fileConfig[id].selectedLevel3 = event.target.value;
  }

  getLevels(id: number): number[] {
    var levels: number[] = [];
    if(this.fileConfig[id].selectedLevel1 != 0) {
      levels.push(this.fileConfig[id].selectedLevel1);
      if(this.fileConfig[id].selectedLevel2 != 0) {
        levels.push(this.fileConfig[id].selectedLevel2);
        if(this.fileConfig[id].selectedLevel3 != 0)
          levels.push(this.fileConfig[id].selectedLevel3);
      }
    }
    return levels;
  }

  saveAbsenceType() {
    this.canva = true;
    this.paramDepartmentError = false;
    var paramAbsenceIds: number[] = [];
    var paramDepartmentIds: number[] = [];

    for(let param of this.paramAbsenceStatus)
      if(param.available)
        paramAbsenceIds.push(param.id);

    if(paramAbsenceIds.length > 0) {
      paramDepartmentIds = this.getDepartmentIds();
      this.paramDepartmentError = (paramDepartmentIds.length == 0);
    } else {
      this.restartParamDepartment();
    }

    if(this.paramDepartmentError) {
      this.canva = false;
    } else {
      this.configurationService.mergeAbsenceTypeEndpoint(paramAbsenceIds, paramDepartmentIds, this.user.id).subscribe(
        (rsp: any) => {
          this.paramAbsenceActive = (paramAbsenceIds.length > 0 && paramDepartmentIds.length > 0);
          if(this.paramAbsenceActive)
            this.initUsersByDepartment();
          else
            this.canva = false;
        }
      );
    }
  }

  saveAbsenceLevel() {
    this.canva = true;
    var mainLevels: number[] = this.getLevels(0);

    this.configurationService.mergeAbsenceFileLevelEndpoint(mainLevels, this.user.id).subscribe(
      (rsp: any) => {
        var count: number = 0;
        for(let id of this.fileConfigItems)
          if(id > 0) {
            if(this.fileConfig[id].active) {
              this.configurationService.addAbsenceFileLevelEndpoint(id, this.getLevels(id), mainLevels, this.user.id).subscribe(
                (rsp: any) => {
                  count++;
                  if(this.fileConfigItems.length == count)
                    this.canva = false;
                }
              );
            } else {
              this.configurationService.deleteAbsenceFileLevelEndpoint(id, this.getLevels(id), mainLevels, this.user.id).subscribe(
                (rsp: any) => {
                  count++;
                  if(this.fileConfigItems.length == count)
                    this.canva = false;
                }
              );
            }
          } else {
            count++;
          }
      }
    );
  }

  saveUsers() {
    this.canva = true;
    this.configurationService.mergeAbsenceUserEndpoint(this.getDepartmentIds(), this.user.id).subscribe(
      (rsp: any) => {
        var countExe: number = 0;
        var countIter: number = 0;

        for(let user of this.users) {
          if(user.isSelected == 1 && !user.insert) {
            countIter++;
            this.configurationService.addAbsenceUserEndpoint(user.id, user.employeeId, this.user.id).subscribe(
              (rsp: any) => {
                countExe++;
                if(countExe == countIter)
                  this.initUsersByDepartment();
              }
            );
          } else if(user.isSelected == 0 && user.insert) {
            countIter++;
            this.configurationService.deleteAbsenceUserEndpoint(user.id, user.employeeId, this.user.id).subscribe(
              (rsp: any) => {
                countExe++;
                if(countExe == countIter)
                  this.initUsersByDepartment();
              }
            );
          }
        }
      }
    );
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
