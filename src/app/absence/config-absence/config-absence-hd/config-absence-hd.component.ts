import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/configuration.service';
import { ConfigurationItemDTO } from 'src/app/dto/configuration.dto';
import { UserDTO } from 'src/app/dto/user.dto';
import { AdminExtraCalendar, AdminMsgErrors, CalendarAdminDay, CalendarAdminDayAssoc } from 'src/app/dto/utils.dto';

@Component({
  selector: 'app-config-absence-hd',
  templateUrl: './config-absence-hd.component.html',
  styleUrls: ['./config-absence-hd.component.scss']
})
export class ConfigAbsenceHdComponent implements OnInit {
  canva: boolean = true;
  selectedDate: Date|null = null;
  selectedYear: number = 0;
  errorDateNull: boolean = false;
  errorDateExist: boolean = false;

  errors: AdminMsgErrors = new AdminMsgErrors();
  dates: CalendarAdminDayAssoc = {};
  datesTable: CalendarAdminDay[] = [];
  datesTableRowspan: number[] = [];
  datesTableFirst: number[] = [];
  yearsSaved: number[] = [];
  calendar: AdminExtraCalendar = new AdminExtraCalendar();
  user!: UserDTO;

  constructor(private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.calendar.setSelectedEvent(true);
    this.calendar.setFirstYear(this.calendar.getSelectedYear() - 3);
    this.selectedYear = this.calendar.getSelectedYear();
    this.calendar.setYearMode();
    
    this.configurationService.getWorkdaysEndpoint().subscribe(
      (items: ConfigurationItemDTO[]) => {
        if(items.length == 1) {
          var workdays: number[] = [];
          var splitValue: string[] = items[0].value1.split(',');
          for(let value of splitValue)
            workdays.push(Number(value));
          this.calendar.setWorkdays(workdays);
        }
        this.getHolidays(this.calendar.getSelectedYear());
      }
    );
  }

  getUser(user: UserDTO) {
    this.user = user;
  }

  yearExists(year: number) {
    var exists: boolean = false;
    for(let yearSaved of this.yearsSaved)
      if(yearSaved == year) {
        exists = true;
        break;
      }
    return exists;
  }

  getHolidays(year: number) {
    if(!this.yearExists(year)) {
      this.canva = true;
      this.configurationService.getHolidaysEndpoint(year).subscribe(
        (items: ConfigurationItemDTO[]) => {
          if(items.length > 0) {
            for(let item of items)
              this.calendar.addSelectedDayByIndex(item.listItem, true);
            this.dates = this.calendar.getSelectedDays();
            this.yearsSaved.push(year);
          }
          this.setTable();
          this.canva = false;
        }
      );
    } else {
      this.setTable();
      this.canva = false;
    }
  }

  setSelectedDate(event: any) {
    if(event.target.value != '') {
      var date: Date = new Date(event.target.value + ' 00:00:00');
      this.selectedDate = date;
      this.getHolidays(date.getFullYear());
    } else {
      this.selectedDate = null;
    }
  }

  setSelectedYearInternal(event: any) {
    this.canva = true;
    this.selectedYear = event.target.value;
    this.calendar.setSelectedYear(this.selectedYear);
    this.getHolidays(this.selectedYear);
  }

  setTable() {
    this.datesTable = [];
    this.datesTableRowspan = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
    this.datesTableFirst = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

    for(let dateString in this.dates)
      if(this.dates[dateString].year == this.selectedYear) {
        this.datesTable.push(this.dates[dateString]);
        this.datesTableRowspan[this.dates[dateString].month]++;
        this.datesTableFirst[this.dates[dateString].month] = this.dates[dateString].day;
      }
  }

  saveSelectedDate() {
    this.canva = true;
    this.errorDateNull = (this.selectedDate == null);
    if(!this.errorDateNull) {
      if(this.selectedDate != null && this.selectedDate.getFullYear() != undefined) {
        if(this.dates[this.calendar.getSelectedDayIndex(this.selectedDate)] != undefined) {
          this.errorDateExist = true;
          this.canva = false;
        } else {
          var year = this.selectedDate.getFullYear();
          var month = this.selectedDate.getMonth();
          this.mergeHoliday(year, month, this.selectedDate.getDate(), true);
        }
      }
    } else {
      this.canva = false;
    }
  }

  deleteSelectedDate(day: CalendarAdminDay) {
    this.canva = true;
    if(day.date != undefined) {
      this.mergeHoliday(day.date.getFullYear(), day.date.getMonth(), day.date.getDate(), false);
    } else {
      this.canva = false;
    }
  }

  selectedFromCalendar(day: CalendarAdminDay|null) {
    if(day != null) {
      this.canva = true;
      this.mergeHoliday(day.year, day.month, day.day, day.selected);
    }
  }

  mergeHoliday(year: number, month: number, day: number, isCreate: boolean) {
    if(isCreate) {
      if(!this.yearExists(year)) {
        this.configurationService.mergeHolidaysEndpoint(year, this.user.id).subscribe(
          (rsp: any) => {
            this.yearsSaved.push(year);
            this.mergeHolidayItem(year, month, day, isCreate);
          }
        );
      } else {
        this.mergeHolidayItem(year, month, day, isCreate);
      }
    } else {
      this.mergeHolidayItem(year, month, day, isCreate);
    }
  }

  mergeHolidayItem(year: number, month: number, day: number, isCreate: boolean) {
    var date: Date = new Date(year, month, day, 0, 0, 0, 0);
    var dateIndex: string = this.calendar.getSelectedDayIndex(date);
    var dateString: string = this.errors.formatDate(date);

    if(isCreate) {
      this.configurationService.addHolidaysEndpoint(year, dateIndex, dateString, this.user.id).subscribe(
        (rsp: any) => {
          this.calendar.addSelectedDay(year, month, day, isCreate);
          this.selectedYear = year;
          this.calendar.setSelectedYear(year);
          this.calendar.setSelectedMonth(month);
          this.dates = this.calendar.getSelectedDays();
          this.setTable();
          this.canva = false;
        }
      );
    } else {
      this.configurationService.deleteHolidaysEndpoint(year, dateIndex, dateString, this.user.id).subscribe(
        (rsp: any) => {
          this.calendar.addSelectedDay(year, month, day, isCreate);
          this.selectedYear = year;
          this.calendar.setSelectedYear(year);
          this.calendar.setSelectedMonth(month);
          this.dates = this.calendar.getSelectedDays();
          this.setTable();
          this.canva = false;
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
