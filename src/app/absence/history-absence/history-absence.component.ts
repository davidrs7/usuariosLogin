import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbsenceService } from 'src/app/_services/absence/absence.service';
import { ConfigurationService } from 'src/app/_services/configuration.service';
import { ParamsService } from 'src/app/_services/params.service';
import { AbsenceDTO } from 'src/app/dto/absence/absence.dto';
import { ConfigurationItemDTO } from 'src/app/dto/configuration.dto';
import { ParamsDTO } from 'src/app/dto/params.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AdminExtraCalendar, CalendarAdminDay } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-history-absence',
  templateUrl: './history-absence.component.html',
  styleUrls: ['./history-absence.component.scss']
})
export class HistoryAbsenceComponent implements OnInit {
  canva: boolean = true;
  modalReference: any = {};
  yearHolidays: number[] = [];
  approveRequired: number[] = [];
  approveHR: number[] = [];
  
  absences: AbsenceDTO[] = [];
  absenceTypes: ParamsDTO[] = [];
  selectedDay: CalendarAdminDay = { day: 0, month: 0, year: 0, week: 0, dayOfWeek: 0, dateIndex: '', selected: false, isToday: false, content: [] };
  calendar: AdminExtraCalendar = new AdminExtraCalendar();
  user!: UserDTO;

  constructor(private modalService: NgbModal, private configurationService: ConfigurationService, private absenceService: AbsenceService, private paramsService: ParamsService) { }

  ngOnInit(): void {
    this.calendar.setYearMode();
    this.paramsService.absenceTypeEndpoint().subscribe(
      (paramResponse: ParamsDTO[]) => {
        this.absenceTypes = paramResponse;
      }
    );
  }

  initAbsenceList() {
    if(this.user.employeeId != null) {
      this.absenceService.absenceListEndpoint(this.user.employeeId).subscribe(
        (absences: AbsenceDTO[]) => {
          this.absences = absences;
          this.initConfig();
          
          for(let absence of this.absences) {
            absence.started = new Date(absence.started);
            absence.finished = new Date(absence.finished);

            absence.statusClass = this.getStatusByAbsence(absence);
            switch(absence.statusClass) {
              case 'approved': absence.statusName = 'Aprobado'; break;
              case 'pending': absence.statusName = 'Pendiente'; break;
              case 'failed': absence.statusName = 'Rechazado'; break;
              default: absence.statusName = 'Inactivo';
            }

            var started: Date = new Date(absence.started);
            while(started <= absence.finished) {
              this.calendar.addSelectedDay(started.getFullYear(), started.getMonth(), started.getDate(), false, [ absence ]);
              started.setDate(started.getDate() + 1);
            }
          }
        }
      );
    } else {
      this.initConfig();
    }
  }

  initConfig() {
    this.configurationService.getWorkdaysEndpoint().subscribe(
      (items: ConfigurationItemDTO[]) => {
        if(items.length == 1) {
          var workdays: number[] = [];
          var splitValue: string[] = items[0].value1.split(',');
          for(let value of splitValue)
            workdays.push(Number(value));
          this.calendar.setWorkdays(workdays);
        }
        this.holidaysPerYear(this.calendar.getSelectedYear());

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
          }
        );
      }
    );
  }

  getUser(user: UserDTO) {
    this.user = user;
    this.initAbsenceList();
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

  holidaysPerYear(year: number) {
    var searchHolidays: boolean = true;
    for(let yearHoliday of this.yearHolidays)
      if(year == yearHoliday) {
        searchHolidays = false;
        break;
      }

    if(searchHolidays) {
      this.canva = true;
      this.configurationService.getHolidaysEndpoint(year).subscribe(
        (items: ConfigurationItemDTO[]) => {
          if(items.length > 0) {
            this.yearHolidays.push(year);
            for(let item of items)
              this.calendar.addHoliday(item.listItem);
          }
          this.canva = false;
        }
      );
    } else {
      this.canva = false;
    }
  }

  openDetail(content: any, day: CalendarAdminDay|null) {
    if(day != null && day.content.length > 0) {
      this.selectedDay = day;
      this.modalReference = this.modalService.open(content, { size: (day.content.length > 1 ? 'xl' : 'l') });
    }
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

}
