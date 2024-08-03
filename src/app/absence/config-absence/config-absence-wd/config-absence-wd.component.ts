import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/_services/configuration.service';
import { ConfigurationItemDTO } from 'src/app/dto/configuration.dto';
import { UserDTO } from 'src/app/dto/user.dto';

@Component({
  selector: 'app-config-absence-wd',
  templateUrl: './config-absence-wd.component.html',
  styleUrls: ['./config-absence-wd.component.scss']
})
export class ConfigAbsenceWdComponent implements OnInit {
  canva: boolean = true;
  weekdays: string[] = [ 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo' ];
  weekdaysSelected: number[] = [ -1, -1, -1, -1, -1, -1, -1 ];
  weekdaysPreconfig: string = '';
  user!: UserDTO;

  constructor(private configurationService: ConfigurationService) { }

  ngOnInit(): void {
    this.configurationService.getWorkdaysEndpoint().subscribe(
      (items: ConfigurationItemDTO[]) => {
        if(items.length == 1) {
          this.weekdaysPreconfig = items[0].value2;

          this.weekdaysSelected = [];
          var splitValue: string[] = items[0].value1.split(',');
          for(let value of splitValue)
            this.weekdaysSelected.push(Number(value));
        }
        this.canva = false;
      }
    );
  }

  changeDaySelected(i: number) {
    this.weekdaysSelected[i] = (this.weekdaysSelected[i] < 0) ? i : -1;
  }

  changePreconfig(event: any) {
    this.weekdaysPreconfig = event.target.value;
    if(this.weekdaysPreconfig !== '')
      this.weekdaysSelected = this.getPreconfig(this.weekdaysPreconfig);
  }

  getPreconfig(preconfig: string) {
    switch(preconfig) {
      case '0-4': return [ 0, 1, 2, 3, 4, -1, -1 ];
      case '0-5': return [ 0, 1, 2, 3, 4, 5, -1 ];
      case '0-6': return [ 0, 1, 2, 3, 4, 5, 6 ];
      default: return [ -1, -1, -1, -1, -1, -1, -1 ];
    }
  }

  getUser(user: UserDTO) {
    this.user = user;
  }

  saveConfiguration() {
    this.canva = true;
    this.configurationService.mergeWorkdaysEndpoint(this.weekdaysSelected, this.weekdaysPreconfig, this.user.id).subscribe(
      (rsp: any) => {
        this.canva = false;
      }
    );
  }

}
