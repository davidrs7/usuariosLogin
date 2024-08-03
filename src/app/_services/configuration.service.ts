import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConfigurationDTO, ConfigurationItemDTO, ConfigurationUserDTO } from '../dto/configuration.dto';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private baseUrl: string = environment.apiUrl + 'Configuration/';

  constructor(private http: HttpClient) { }

  getWorkdaysEndpoint() {
    return this.configurationItemsEndpoint('workdays');
  }

  getHolidaysEndpoint(year: number) {
    return this.configurationItemsEndpoint('holidays.' + year.toString());
  }

  getAbsenceFileLevelEndpoint() {
    return this.configurationItemsEndpoint('absence.file.level');
  }

  getAbsenceTypeEndpoint() {
    return this.configurationItemsEndpoint('absence.types.allowed');
  }

  usersByAbsenceTypesAllowedEndpoint() {
    return this.http.get<ConfigurationUserDTO[]>(this.baseUrl + 'Users/AbsenceTypesAllowed');
  }

  mergeWorkdaysEndpoint(workdays: number[], configSelected: string, userId: number) {
    var configuration: ConfigurationDTO = {
      configKey: 'workdays', userId: userId, updated: new Date(),
      value1: workdays.join(','), value2: configSelected, listType: 'none'
    };
    return this.mergeConfiguration(configuration);
  }

  mergeHolidaysEndpoint(year: number, userId: number) {
    var configuration: ConfigurationDTO = {
      configKey: 'holidays.' + year, userId: userId, updated: new Date(),
      value1: year.toString(), value2: year.toString(), listType: 'dates'
    };
    return this.mergeConfiguration(configuration);
  }

  mergeAbsenceFileLevelEndpoint(levels: number[], userId: number) {
    var configuration: ConfigurationDTO = {
      configKey: 'absence.file.level', userId: userId, updated: new Date(),
      value1: (levels.length > 0 ? levels.join(',') : '0'),
      value2: levels.length.toString(), listType: 'items'
    };
    return this.mergeConfiguration(configuration);
  }

  mergeAbsenceTypeEndpoint(absenceIds: number[], departmentIds: number[], userId: number) {
    var configuration: ConfigurationDTO = {
      configKey: 'absence.types.allowed', userId: userId, updated: new Date(),
      value1: (absenceIds.length > 0 ? absenceIds.join(',') : '0'),
      value2: (departmentIds.length > 0 ? departmentIds.join(',') : '0'), listType: 'none'
    };
    return this.mergeConfiguration(configuration);
  }

  mergeAbsenceUserEndpoint(departmentIds: number[], userId: number) {
    var configuration: ConfigurationDTO = {
      configKey: 'absence.users.allowed', userId: userId, updated: new Date(),
      value1: (departmentIds.length > 0 ? departmentIds.join(',') : '0'),
      value2: userId.toString(), listType: 'userIds'
    };
    return this.mergeConfiguration(configuration);
  }

  addHolidaysEndpoint(year: number, dateIndex: string, dateString: string, userId: number) {
    var item: ConfigurationItemDTO = {
      configKey: 'holidays.' + year, userId: userId, updated: new Date(),
      value1: year.toString(), value2: year.toString(), listType: 'dates',
      listItem: dateIndex, listValue: dateString
    };
    return this.addConfigurationItem(item);
  }

  deleteHolidaysEndpoint(year: number, dateIndex: string, dateString: string, userId: number) {
    var item: ConfigurationItemDTO = {
      configKey: 'holidays.' + year, userId: userId, updated: new Date(),
      value1: year.toString(), value2: year.toString(), listType: 'dates',
      listItem: dateIndex, listValue: dateString
    };
    return this.deleteConfigurationItem(item);
  }

  addAbsenceUserEndpoint(userSelectedId: number, employeeId: number, userId: number) {
    var item: ConfigurationItemDTO = {
      configKey: 'absence.users.allowed', userId: userId, updated: new Date(),
      value1: userSelectedId.toString(), value2: userSelectedId.toString(), listType: 'userIds',
      listItem: userSelectedId.toString(), listValue: employeeId.toString()
    };
    return this.addConfigurationItem(item);
  }

  deleteAbsenceUserEndpoint(userSelectedId: number, employeeId: number, userId: number) {
    var item: ConfigurationItemDTO = {
      configKey: 'absence.users.allowed', userId: userId, updated: new Date(),
      value1: userSelectedId.toString(), value2: userSelectedId.toString(), listType: 'userIds',
      listItem: userSelectedId.toString(), listValue: employeeId.toString()
    };
    return this.deleteConfigurationItem(item);
  }

  addAbsenceFileLevelEndpoint(id: number, levels: number[], mainLevels: number[], userId: number) {
    var item: ConfigurationItemDTO = {
      configKey: 'absence.file.level', userId: userId, updated: new Date(),
      value1: (mainLevels.length > 0 ? mainLevels.join(',') : '0'), value2: mainLevels.length.toString(),
      listType: 'items', listItem: id.toString(), listValue: (levels.length > 0 ? levels.join(',') : '0')
    };
    return this.addConfigurationItem(item);
  }

  deleteAbsenceFileLevelEndpoint(id: number, levels: number[], mainLevels: number[], userId: number) {
    var item: ConfigurationItemDTO = {
      configKey: 'absence.file.level', userId: userId, updated: new Date(),
      value1: (mainLevels.length > 0 ? mainLevels.join(',') : '0'), value2: mainLevels.length.toString(),
      listType: 'items', listItem: id.toString(), listValue: (levels.length > 0 ? levels.join(',') : '0')
    };
    return this.deleteConfigurationItem(item);
  }

  private configurationItemsEndpoint(configKey: string) {
    return this.http.get<ConfigurationItemDTO[]>(this.baseUrl + 'Items/' + configKey);
  }

  private mergeConfiguration(configuration: ConfigurationDTO) {
    var formData = new FormData();
    formData.append("configKey", this.stringValue(configuration.configKey));
    formData.append("userId", this.stringValue(configuration.userId));
    formData.append("value1", this.stringValue(configuration.value1));
    formData.append("value2", this.stringValue(configuration.value2));
    formData.append("listType", this.stringValue(configuration.listType));
    return this.http.put(this.baseUrl + 'Merge', formData);
  }

  private addConfigurationItem(item: ConfigurationItemDTO) {
    return this.http.post(this.baseUrl + 'Item/Add', this.getGenericFormData(item));
  }

  private deleteConfigurationItem(item: ConfigurationItemDTO) {
    return this.http.put(this.baseUrl + 'Item/Delete', this.getGenericFormData(item));
  }

  private getGenericFormData(item: ConfigurationItemDTO) {
    var formData = new FormData();
    formData.append("configKey", this.stringValue(item.configKey));
    formData.append("userId", this.stringValue(item.userId));
    formData.append("value1", this.stringValue(item.value1));
    formData.append("value2", this.stringValue(item.value2));
    formData.append("listType", this.stringValue(item.listType));
    formData.append("listItem", this.stringValue(item.listItem));
    formData.append("listValue", this.stringValue(item.listValue));
    return formData;
  }

  private stringValue(value: any): string {
    return (value != null && value != undefined) ? value.toString() : null;
  }

}
