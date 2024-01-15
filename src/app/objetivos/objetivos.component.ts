import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.scss']
})
export class ObjetivosComponent implements OnInit {

  listaObjetivo: string[][]=[
    ['titulo de objetivo - Recursos Humanos', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/luz-amarilla.png', 'Progreso'], 
    ['titulo de objetivo - Recursos Humanos', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/luz-roja.png', 'Suspendido'], 
    ['titulo de objetivo - productor orgánicos', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/luz-verde.png', 'Terminado'], 
    ['titulo de objetivo - Recursos Humanos', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/luz-verde.png', 'Terminado'],
    ['titulo de objetivo - contabilidad', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/luz-amarilla.png', 'Progreso'],
    ['titulo de objetivo - productor orgánicos', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/luz-verde.png', 'Terminado'],
    ['titulo de objetivo - Recursos Humanos', 'https://hianthot.sirv.com/EVENTOS/Image%20Editor%20Backup%20202306130026/luz-roja.png', 'Suspendido'],
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
