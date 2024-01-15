import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  resultadoPeople: string[][]=[
    ['Encuesta 1', 'Ivan Rubio', 'pendiente', 'https://hianthot.sirv.com/EVENTOS/rec.png'], 
    ['Encuesta 2', 'Daniel Bernal', 'Completado', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/rec.png'], 
    ['Encuesta 1', 'Jose Reyes', 'Pendiente', 'https://hianthot.sirv.com/EVENTOS/rec.png'], 
    ['Encuesta 2', 'Ivan Rubio ', 'Completado', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/rec.png'],
    ['Encuesta 1', 'Daniel Bernal', 'Completado', 'https://hianthot.sirv.com/EVENTOS/rec.png'],
    ['Encuesta 2', 'Jose Reyes', 'Pendiente', 'https://hianthot.sirv.com/EVENTOS/rec.png'],
    ['Encuesta 1', 'Ivan Rubio', 'Pendiente', 'https://hianthot.sirv.com/EVENTOS/rec.png'],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
