import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-results-people',
  templateUrl: './results-people.component.html',
  styleUrls: ['./results-people.component.scss']
})
export class ResultsPeopleComponent implements OnInit {
  resultadoPeople: string[][]=[
    ['Ivan Rubio', 'Área de Contabilidad', 'Jefe Inmediato', '#'], 
    ['Daniel Bernal', 'Área de Tecnología', 'Jefe Inmediato', '#'], 
    ['Jose Reyes', 'Área de GTH', 'Jefe Inmediato', '#'], 
    ['Ivan Rubio', 'Área de Contabilidad', 'Jefe Inmediato', '#'],
    ['Daniel Bernal', 'Área de Tecnología', 'Jefe Inmediato', '#'],
    ['Jose Reyes', 'Área de GTH', 'Jefe Inmediato', '#'],
    ['Ivan Rubio', 'Área de GTH', 'Jefe Inmediato', '#'],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
