import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ModulesComponent } from './home/modules/modules.component';
import { EmployeesComponent } from './employee/employees/employees.component';
import { NavigationComponent } from './utils/navigation/navigation.component';
import { EmployeesEditComponent } from './employee/employees/employees-edit/employees-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesAddComponent } from './employee/employees/employees-add/employees-add.component';
import { DepartmentsComponent } from './employee/departments/departments.component';
import { JobsComponent } from './employee/jobs/jobs.component';
import { JobAddComponent } from './employee/jobs/job-add/job-add.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from '@circlon/angular-tree-component';
import { DepartmentEditComponent } from './employee/departments/department-edit/department-edit.component';
import { ListFieldComponent } from './recruiter/step/list-field/list-field.component';
import { AddVacancyComponent } from './recruiter/list-vacancy/add-vacancy/add-vacancy.component';
import { AddStageComponent } from './recruiter/step/add-stage/add-stage.component';
import { HistoricalPostulatesComponent } from './recruiter/historical/historical-postulates/historical-postulates.component';
import { HistoricalVacanciesComponent } from './recruiter/historical/historical-vacancies/historical-vacancies.component';
import { AddFieldComponent } from './recruiter/step/list-field/add-field/add-field.component';
import { ListVacancyComponent } from './recruiter/list-vacancy/list-vacancy.component';
import { ListPostulatesComponent } from './recruiter/postulates/list-postulates/list-postulates.component';
import { DetalPostulantesComponent } from './recruiter/postulates/detal-postulantes/detal-postulantes.component';
import { AddPstComponent } from './recruiter/postulates/add-pst/add-pst.component';
import { CreateSurveyComponent } from './survey/list-survey/create-survey/create-survey.component';
import { ResultsComponent } from './survey/results/results.component';
import { ResultsPeopleComponent } from './survey/results/results-people/results-people.component';
import { PeopleComponent } from './survey/people/people.component';
import { ListStepComponent } from './recruiter/step/list-step/list-step.component';
import { ListSurveyComponent } from './survey/list-survey/list-survey.component';
import { AssignPostulatesComponent } from './recruiter/list-vacancy/assign-postulates/assign-postulates.component';
import { FieldSurveyComponent } from './survey/field-survey/field-survey.component';
import { FieldSurveyAddComponent } from './survey/field-survey/field-survey-add/field-survey-add.component';
import { MySurveyComponent } from './survey/my-survey/my-survey.component';
import { MySurveyResponseComponent } from './survey/my-survey/my-survey-response/my-survey-response.component';
import { ConfigSurveyComponent } from './survey/list-survey/config-survey/config-survey.component';
import { RolesComponent } from './pages/roles/roles.component';
import { CargosComponent } from './pages/cargos/cargos.component';
import { PaginadorPipe } from './pipes/paginador.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { PermisosComponent } from './pages/permisos/permisos.component';
import { EditarPermisosComponent } from './pages/editar-permisos/editar-permisos.component';
import { RutasPermisosComponent } from './pages/rutas-permisos/rutas-permisos.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModulesComponent,
    EmployeesComponent,
    NavigationComponent,
    EmployeesEditComponent,
    EmployeesAddComponent,
    DepartmentsComponent,
    JobsComponent,
    JobAddComponent,
    DepartmentEditComponent,
    ListFieldComponent,
    AddVacancyComponent,
    AddStageComponent,
    HistoricalPostulatesComponent,
    HistoricalVacanciesComponent,
    AddFieldComponent,
    ListVacancyComponent,
    ListPostulatesComponent,
    DetalPostulantesComponent,
    AddPstComponent,
    CreateSurveyComponent,
    ResultsComponent,
    ResultsPeopleComponent,
    PeopleComponent,
    ListStepComponent,
    ListSurveyComponent,
    AssignPostulatesComponent,
    FieldSurveyComponent,
    FieldSurveyAddComponent,
    MySurveyComponent,
    MySurveyResponseComponent,
    ConfigSurveyComponent,
    RolesComponent,
    CargosComponent,
    PaginadorPipe,
    EmpresasComponent,
    UsuariosComponent,
    PermisosComponent,
    EditarPermisosComponent,
    RutasPermisosComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatPaginatorModule,
    MatSelectModule, 
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    NgbModule,
    TreeModule,
    
  ],
  providers: [
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
