import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentEditComponent } from './employee/departments/department-edit/department-edit.component';
import { DepartmentsComponent } from './employee/departments/departments.component';
import { EmployeesAddComponent } from './employee/employees/employees-add/employees-add.component';
import { EmployeesEditComponent } from './employee/employees/employees-edit/employees-edit.component';
import { EmployeesComponent } from './employee/employees/employees.component';
import { HomeComponent } from './home/home.component';
import { JobAddComponent } from './employee/jobs/job-add/job-add.component';
import { JobsComponent } from './employee/jobs/jobs.component';
import { ListStepComponent } from './recruiter/step/list-step/list-step.component';
import { ModulesComponent } from './home/modules/modules.component';
import { ListFieldComponent } from './recruiter/step/list-field/list-field.component';
import { AddStageComponent } from './recruiter/step/add-stage/add-stage.component';
import { AddFieldComponent } from './../app/recruiter/step/list-field/add-field/add-field.component';
import { ListVacancyComponent } from './recruiter/list-vacancy/list-vacancy.component';
import { AddVacancyComponent } from './recruiter/list-vacancy/add-vacancy/add-vacancy.component';
import { HistoricalVacanciesComponent } from './recruiter/historical/historical-vacancies/historical-vacancies.component';
import { HistoricalPostulatesComponent } from './recruiter/historical/historical-postulates/historical-postulates.component';
import { DetalPostulantesComponent } from './recruiter/postulates/detal-postulantes/detal-postulantes.component';
import { AddPstComponent } from './recruiter/postulates/add-pst/add-pst.component';
import { ListSurveyComponent } from './survey/list-survey/list-survey.component';
import { CreateSurveyComponent } from './survey/list-survey/create-survey/create-survey.component';
import { ResultsComponent } from './survey/results/results.component';
import { ResultsPeopleComponent } from './survey/results/results-people/results-people.component';
import { PeopleComponent } from './survey/people/people.component';
import { ListPostulatesComponent } from './recruiter/postulates/list-postulates/list-postulates.component';
import { AssignPostulatesComponent } from './recruiter/list-vacancy/assign-postulates/assign-postulates.component';
import { FieldSurveyComponent } from './survey/field-survey/field-survey.component';
import { FieldSurveyAddComponent } from './survey/field-survey/field-survey-add/field-survey-add.component';
import { MySurveyComponent } from './survey/my-survey/my-survey.component';
import { MySurveyResponseComponent } from './survey/my-survey/my-survey-response/my-survey-response.component';
import { ConfigSurveyComponent } from './survey/list-survey/config-survey/config-survey.component';
import { RolesComponent } from './pages/roles/roles.component';
import { CargosComponent } from './pages/cargos/cargos.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { PermisosComponent } from './pages/permisos/permisos.component';
import { EditarPermisosComponent } from './pages/editar-permisos/editar-permisos.component';
import { RutasPermisosComponent } from './pages/rutas-permisos/rutas-permisos.component';
import { AdminObjetivosComponent } from './pages/admin-objetivos/admin-objetivos.component';
import { ObejtivosUsuarioComponent } from './pages/performance/obejtivos-usuario/obejtivos-usuario.component';
import { CompetenciasUsuarioComponent } from './pages/performance/competencias-usuario/competencias-usuario.component';
import { AdminPreguntasComponent } from './pages/admin-preguntas/admin-preguntas.component';
import { AdminRepuestasComponent } from './pages/admin-repuestas/admin-repuestas.component';
import { ReportesComponent } from './pages/performance/reportes/reportes.component';
import { AdminCompetenciasComponent } from './pages/admin-competencias/admin-competencias.component';
import { ReportesUsuariosComponent } from './pages/reportes-usuarios/reportes-usuarios.component';
import { ListAbsenceComponent } from './absence/list-absence/list-absence.component';
import { HistoryAbsenceComponent } from './absence/history-absence/history-absence.component';
import { ConfigAbsenceComponent } from './absence/config-absence/config-absence.component';
import { AddAbsenceComponent } from './absence/list-absence/add-absence/add-absence.component';
import { ConfigAbsenceWdComponent } from './absence/config-absence/config-absence-wd/config-absence-wd.component';
import { ConfigAbsenceHdComponent } from './absence/config-absence/config-absence-hd/config-absence-hd.component';
import { PublicPostulateComponent } from './pages/public-postulate/public-postulate.component';

const routes: Routes =
[
  { path: '', component: HomeComponent },
  { path: 'modules', component: ModulesComponent },

  { path: 'employees/employee/list', component: EmployeesComponent },
  { path: 'employees/employee/view/:id', component: EmployeesEditComponent },
  { path: 'employees/employee/view/:section/:id', component: EmployeesEditComponent },
  { path: 'employees/employee/add', component: EmployeesAddComponent },
  { path: 'employees/employee/edit/:section/:id', component: EmployeesAddComponent },
  { path: 'employees/department/list', component: DepartmentsComponent },
  { path: 'employees/department/edit/:id', component: DepartmentEditComponent },
  { path: 'employees/job/list', component: JobsComponent },
  { path: 'employees/job/add', component: JobAddComponent },
  { path: 'employees/job/edit/:id', component: JobAddComponent },

  { path: 'recruiter/vacancy/list' , component:ListVacancyComponent },
  { path: 'recruiter/vacancy/add', component: AddVacancyComponent },
  { path: 'recruiter/vacancy/edit/:id', component: AddVacancyComponent },
  { path: 'recruiter/vacancy/assign/:id', component: AssignPostulatesComponent },
  { path: 'recruiter/step/list', component: ListStepComponent },
  { path: 'recruiter/step/add', component: AddStageComponent },
  { path: 'recruiter/step/edit/:id', component: AddStageComponent },
  { path: 'recruiter/step/fields', component: ListFieldComponent },
  { path: 'recruiter/step/add-field', component: AddFieldComponent },
  { path: 'recruiter/step/edit-field/:id', component: AddFieldComponent },
  { path: 'recruiter/postulate/list', component: ListPostulatesComponent },
  { path: 'recruiter/postulate/view/:id', component: DetalPostulantesComponent },
  { path: 'recruiter/postulate/add', component: AddPstComponent },
  { path: 'recruiter/postulate/edit/:id', component: AddPstComponent },
  { path: 'recruiter/historical/list-vacancy', component: HistoricalVacanciesComponent },
  { path: 'recruiter/historical/list-postulate', component: HistoricalPostulatesComponent },

  { path: 'survey/pending/list', component: MySurveyComponent },
  { path: 'survey/pending/response/:id', component: MySurveyResponseComponent },
  { path: 'survey/survey/list', component: ListSurveyComponent },
  { path: 'survey/survey/add', component: CreateSurveyComponent},
  { path: 'survey/survey/edit/:id', component: CreateSurveyComponent},
  { path: 'survey/survey/config/:id', component: ConfigSurveyComponent},
  { path: 'survey/survey/fields', component: FieldSurveyComponent },
  { path: 'survey/survey/add-field', component: FieldSurveyAddComponent },
  { path: 'survey/survey/edit-field/:id', component: FieldSurveyAddComponent },

  { path: 'survey/results', component: ResultsComponent},
  { path: 'survey/results/people', component: ResultsPeopleComponent},
  { path: 'survey/people', component: PeopleComponent},
  { path: 'pages/roles', component: RolesComponent},
  { path: 'pages/cargos', component: CargosComponent},
  { path: 'pages/empresas', component: EmpresasComponent},
  { path: 'pages/usuarios', component: UsuariosComponent},
  { path: 'pages/permisos', component: PermisosComponent},
  { path: 'pages/editarpermisos', component: EditarPermisosComponent},
  { path: 'pages/rutaspermisos', component: RutasPermisosComponent},
  { path: 'pages/adminobjetivos', component: AdminObjetivosComponent},
  { path: 'pages/performance/objetiveUser', component: ObejtivosUsuarioComponent},
  { path: 'pages/performance/compUser', component: CompetenciasUsuarioComponent},
  { path: 'pages/adminPreguntas', component: AdminPreguntasComponent},
  { path: 'pages/adminRespuestas', component: AdminRepuestasComponent},
  { path: 'pages/performance/reportes', component: ReportesComponent},
  { path: 'pages/adminCompetencias', component: AdminCompetenciasComponent},
  { path: 'pages/reportes-usuarios', component: ReportesUsuariosComponent},
  { path: 'public/postulate', component: PublicPostulateComponent},


  { path: 'absence/request/list', component: ListAbsenceComponent },
  { path: 'absence/request/add', component: AddAbsenceComponent },
  { path: 'absence/request/add/:id', component: AddAbsenceComponent },
  { path: 'absence/request/edit/:id', component: AddAbsenceComponent },
  { path: 'absence/history/calendar', component: HistoryAbsenceComponent },
  { path: 'absence/config/approval', component: ConfigAbsenceComponent },
  { path: 'absence/config/workdays', component: ConfigAbsenceWdComponent },
  { path: 'absence/config/holidays', component: ConfigAbsenceHdComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
