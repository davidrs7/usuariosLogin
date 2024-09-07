import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostulateService } from 'src/app/_services/recruiter/postulate.service';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';
import { PostulateBasicDTO } from 'src/app/dto/recruiter/postulate.dto';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';

@Component({
  selector: 'app-assign-postulates',
  templateUrl: './assign-postulates.component.html',
  styleUrls: ['./assign-postulates.component.scss']
})
export class AssignPostulatesComponent implements OnInit {
  canva: boolean = true;
  vacantId: any;

  vacant: VacantDTO = { id: 0, vacantStatusId: 0, contractTypeId: 0, jobId: 0, userId: 1, vacantNum: 0, description: '' };
  postulates: PostulateBasicDTO[] = [];
  postulatesSelected: PostulateBasicDTO[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private vacantService: VacantService, private postulateService: PostulateService) { }

  ngOnInit(): void {
    this.vacantId = this.route.snapshot.paramMap.get("id");
    if(this.vacantId != null)
      this.initVacant();
  }

  initVacant() {
    this.vacantService.vacantByIdEndpoint(this.vacantId).subscribe(
      (vacantResult: VacantDTO) => {
        if(vacantResult != null) {
          this.vacant = vacantResult;
          console.log(this.vacant);
          if(this.vacant.employeesCount ?? 0 >= this.vacant.vacantNum)
            this.cancel();
          else
            this.initPostulates();
        }
      }
    );
  }

  initPostulates() {
    this.postulateService.postulateAllEndpoint().subscribe(
      (postulatesResult: PostulateBasicDTO[]) => {
        this.vacantService.vacantsByPostulateRelEndpoint(this.vacantId).subscribe(
          (vacantRelResult: VacantDTO[]) => {
            this.postulates = [];
            var findRel: boolean;

            for(let postulate of postulatesResult) {
              findRel = false;
              for(let vacantRel of vacantRelResult)
                if(postulate.id == vacantRel.postulateId) {
                  this.postulatesSelected.push(postulate);
                  findRel = true;
                  break;
                }

              if(!findRel) {
                postulate.active = 0;
                this.postulates.push(postulate);
              }
            }
            this.canva = false;
          }
        );
      }
    );
  }

  openPostulate(postulateId: number) {
    this.router.navigateByUrl('recruiter/postulate/view/' + postulateId);
  }

  togglePostulate(postulateId: number) {
    for(var i = 0; i < this.postulates.length; i++)
      if(this.postulates[i].id == postulateId) {
        this.postulates[i].active = this.postulates[i].active == 1 ? 0 : 1;
        break;
      }
  }

  savePostulates() {
    for(var i = 0; i < this.postulates.length; i++) {
      if(this.postulates[i].active == 1) {
        var vacantPostulate: VacantDTO = this.vacant;
        vacantPostulate.postulateId = this.postulates[i].id;
        vacantPostulate.active = 1;
        this.canva = true;
        this.vacantService.addVacantPostulateRelEndpoint(vacantPostulate).subscribe(
          (vacantId: any) => {
            this.cancel();
          }
        );
      }
    }
  }

  cancel() {
    this.router.navigateByUrl('recruiter/vacancy/list');
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
