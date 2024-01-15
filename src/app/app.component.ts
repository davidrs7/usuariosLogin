import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fieldsType = [
    { fieldtype: 'text', name: "Texto" },
    { fieldtype: 'number', name: "Numero" }
    
  ];
}