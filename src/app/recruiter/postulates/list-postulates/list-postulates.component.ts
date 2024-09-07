import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostulateBasicDTO, PostulateCriteriaDTO } from 'src/app/dto/recruiter/postulate.dto';
import { PostulateService } from 'src/app/_services/recruiter/postulate.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VacantService } from 'src/app/_services/recruiter/vacant.service';
import { VacantDTO } from 'src/app/dto/recruiter/vacant.dto';

@Component({
  selector: 'app-list-postulates',
  templateUrl: './list-postulates.component.html',
  styleUrls: ['./list-postulates.component.scss'],
})

export class ListPostulatesComponent implements OnInit {
  canva: boolean = true;
  modalReference: any = {};
  initPage: number = 0;
  lastPage: number = 0;
  totalVacants: number = 0;
  pagesArray: number[] = [];

  postulateDoc: string = "";
  postulateSelect: string = "cedula";

  postulatesList: PostulateBasicDTO[] = [];
  postulateCriteria: PostulateCriteriaDTO = { vacantId: 0, page: 1, activePaginator: true };
  vacants: VacantDTO[] = [];

  constructor(private modalService: NgbModal, private vacantService: VacantService, private postulateService: PostulateService, private router: Router) {}

  ngOnInit(): void {
    this.initPostList();
  }

  initPostList() {
    this.vacantService.vacantListEndpoint().subscribe(
      (vacantListResult: VacantDTO[]) => {
        this.vacants = vacantListResult;
        this.postulateMethod(1);
      }
    );
  }

  postulateMethod(page: number) {
    this.canva = true;
    this.postulateCriteria.page = page;
    this.postulatesList = [];
    this.pagesArray = [];

    this.postulateService.postulateListEndpoint(this.postulateCriteria).subscribe(
      (postulatesResponse: PostulateBasicDTO[]) => {
        this.postulatesList = postulatesResponse;
        console.log(this.postulatesList);
        var loadVacants:boolean = true;

        if(this.postulatesList != null && this.postulatesList.length > 0) {
          this.lastPage = this.postulatesList[0].pages;
          if(this.postulatesList.length == 1 && this.postulateCriteria.doc != null && this.postulateCriteria.doc != '') {
            this.router.navigateByUrl('recruiter/postulate/view/' + this.postulatesList[0].id.toString());
            loadVacants = false;
          }
        }

        this.pagination();
        if(loadVacants)
          this.vacantsMethod();
      }
    );
  }

  vacantsMethod() {
    this.vacants = [];
    this.vacantService.vacantListEndpoint().subscribe(
      (vacantsResponse: VacantDTO[]) => {
        this.vacants = vacantsResponse;
        this.totalVacants = 0;
        for(var i = 0; i < this.vacants.length; i++)
          this.totalVacants += this.vacants[i].vacantsCount ?? 0;
        this.canva = false;
      }
    );
  }

  searchPostulate() {}

  classPerVacant(vacantId: number) {
    var addClass = '';
    if(vacantId == this.postulateCriteria.vacantId)
      addClass += ' postulates__people--person--selected';
    return 'postulates__people--person' + addClass;
  }

  perVacant(vacantId: number, page: number) {
    this.postulateCriteria.vacantId = vacantId;
    this.postulateMethod(page);
  }

  clearFilters() {}

  pagination() {
    if((this.postulateCriteria.page - 2) > 0) {
      this.pagesArray.push(this.postulateCriteria.page - 2);
      this.pagesArray.push(this.postulateCriteria.page - 1);
      this.pagesArray.push(this.postulateCriteria.page);
    }else {
      if((this.postulateCriteria.page - 1) > 0) {
        this.pagesArray.push(this.postulateCriteria.page - 1);
        this.pagesArray.push(this.postulateCriteria.page);
      }else {
        this.pagesArray.push(this.postulateCriteria.page);
      }
    }
    if((this.postulateCriteria.page + 1) <= this.lastPage) {
      this.pagesArray.push(this.postulateCriteria.page + 1);
    }
    if((this.postulateCriteria.page + 2) <= this.lastPage) {
      this.pagesArray.push(this.postulateCriteria.page + 2);
    }
  }

  openModal(content:any) {
    this.modalReference = this.modalService.open(content, { size: 'lg' });
  }

  closeModal() {
    if(this.modalReference != null)
      this.modalReference.close();
  }

  openAdd() {
    this.router.navigateByUrl('recruiter/postulate/add');
  }

  openEdit(postulateId: number) {
    this.router.navigateByUrl('recruiter/postulate/view/' + postulateId.toString());
  }
}

