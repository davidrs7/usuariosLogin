import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historical-postulates',
  templateUrl: './historical-postulates.component.html',
  styleUrls: ['./historical-postulates.component.scss']
})
export class HistoricalPostulatesComponent implements OnInit {
  PostulanteHistorico: string[][]=[
    ['Daniel Bernal', 'Ingeniero de sistemas', 'Soporte Tecnologia', 'Detalles'], 
    ['Ivan Rubio', 'Tecnologo en sistemas', 'Soporte tecnologia', 'Detalles'], 
    ['Alvaro Rubio', 'Comediante' , 'GTH', 'Detalles'], 
    ['Jose Reyes ', 'Infrastructura', 'Soporte', 'Detalles'],
    ['Armando Perez', 'Infrastructura', 'Soporte', 'Detalles'],
    ['Alvaro Rubio', 'Comediante' , 'GTH', 'Detalles']
  ];

  vacantesHistorico: string[]=['trabajo1', 'trabajo2', 'trabajo3', 'trabajo4'];
  
  
  constructor() { }

  ngOnInit(): void {
  }

}

