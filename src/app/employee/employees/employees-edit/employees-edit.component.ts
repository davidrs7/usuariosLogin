import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeComponent, TreeNode } from '@circlon/angular-tree-component';
import { EmployeeDTO, EmployeeSkillDTO, EmployeeKnowledgeDTO, EmployeeGeneralDTO, EmployeeAcademicDTO, EmployeeFileTypeDTO, EmployeeFileDTO, EmployeeSonsDTO } from '../../../dto/employee/employee.dto';
import { NodeIndex, NodeTree } from '../../../dto/utils.dto';
import { EmployeeService } from '../../../_services/employee/employee.service';


@Component({
  selector: 'app-employees-edit',
  templateUrl: './employees-edit.component.html',
  styleUrls: ['./employees-edit.component.scss']
})
export class EmployeesEditComponent implements OnInit {
  canva: boolean = true;
  section: any = '';
  employeeId: any;

  employee: EmployeeDTO = { id: 0, department: '', jobId: 0, statusId: 0, maritalStatusId: 0, docTypeId: 0, docIssueCityId: 0, contractTypeId: 0, jobCityId: 0, bankingEntityId: 0, doc: '', docIssueDate: new Date(), name: '', sex: '', birthDate: new Date(), rh: '', corpCellPhone: '', cellPhone: '', phone: '', email: '', employmentDate: new Date(), bankAccount: '', bankAccountType: '', hasVaccine: false, vaccineMaker: '', vaccineDose: 0, hasVaccineBooster: false, colorHex: '#000' };
  employeeGeneral: EmployeeGeneralDTO = { id: 0, employeeId: 0, cityId: 0, cityName: '', housingTypeId: 0, transportationId: 0, emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '', dependents: 0, dependentsUnder9: 0, dependentBirthDate: new Date(), address: '', neighborhood: '', housingTime: 0, socioeconomicStatus: 0, licensePlate: '', vehicleMark: '', vehicleModel: '', licenseNumber: '', licenseCategory: '', licenseValidity: new Date(), soatExpirationDate: new Date(), rtmExpirationDate: new Date(), vehicleOwnerName: '', contributorType: '', eps: '', arl: '', afp: '', recommendedBy: '', description: '' };
  employeeAcademic: EmployeeAcademicDTO = { id: 0, employeeId: 0, educationalLevelId: 0, career: '' };

  employeeSkills: EmployeeSkillDTO[] = [];
  employeeKnowledges: EmployeeKnowledgeDTO[] = [];
  /* Hijos y edad de los empleados */
  employeeSonsAge: EmployeeSonsDTO[]=[];


  employeeFiles: EmployeeFileDTO[] = [];
  treeIndex: NodeIndex = {};
  treeLoad: boolean = false;
  treeData: NodeTree[] = [];
  treeOptions = {};

  @ViewChild(TreeComponent)
  private treeComponent!: TreeComponent;

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get("id");
    this.section = this.route.snapshot.paramMap.get("section");
    this.employee.id = this.employeeId;
    this.employeeMethod();
  }

  employeeMethod() {
    this.employeeService.employeeEndpoint(this.employeeId).subscribe(
      (employeeResponse: EmployeeDTO) => {
        this.employee = employeeResponse;
        if(this.section == null)
          this.openSection('basica');
        else
          this.openSection(this.section);
      }
    );
  }

  openSection(section: String) {
    var suscribeLoad = false;
    this.section = section;
    this.treeLoad = false;

    switch(section) {
      case 'basica':
        if(this.employeeSkills.length == 0) {
          suscribeLoad = true;
          this.employeeService.skillsEndpoint(this.employeeId).subscribe(
            (responseSkills: EmployeeSkillDTO[]) => {
              this.employeeSkills = responseSkills;
              this.canva = false;
            }
          );
        }

        if(this.employeeKnowledges.length == 0) {
          suscribeLoad = true;
          this.employeeService.knowledgesEndpoint(this.employeeId).subscribe(
            (responseKnowledges: EmployeeKnowledgeDTO[]) => {
              this.employeeKnowledges = responseKnowledges;
              this.canva = false;
            }
          );
        }
        /** retrive la información de los hijos y su edad */
        if(this.employeeSonsAge.length==0){
          suscribeLoad=true;
          this.employeeService.sonsEndpoint(this.employeeId).subscribe(
            (responseSonsAge: EmployeeSonsDTO[])=>{
              this.employeeSonsAge=responseSonsAge;
              this.canva=false;
            }
          );
        }
        break;
      case 'general':
        suscribeLoad = true;
        this.getGeneral();
        break;
      case 'academica':
        if(this.employeeAcademic.id == 0) {
          suscribeLoad = true;
          this.employeeService.employeeAcademicEndpoint(this.employeeId).subscribe(
            (employeeResponse: EmployeeAcademicDTO) => {
              this.employeeAcademic = employeeResponse;
              this.canva = false;
            }
          );
        }
        break;
      case 'documentacion':
        suscribeLoad = true;
        this.treeLoad = true;
        this.getGeneral();
        break;
    }

    if(!suscribeLoad)
      this.canva = false;
  }

  getGeneral() {
    if(this.employeeGeneral.id == 0) {
      this.employeeService.employeeGeneralEndpoint(this.employeeId).subscribe(
        (employeeResponse: EmployeeGeneralDTO) => {
          this.employeeGeneral = employeeResponse;
          this.treeConstructor();
          this.canva = false;
        }
      );
    } else {
      this.treeConstructor();
      this.canva = false;
    }
  }

  treeConstructor() {
    if(this.treeLoad) {
      this.treeData = [];

      this.employeeService.filesEndpoint(this.employeeId).subscribe(
        (filesResponse: EmployeeFileDTO[]) => {
          this.employeeFiles = filesResponse;
          this.treeIndex = {};

          for(var i = 0; i < this.employeeFiles.length; i++) {
            var key = this.employeeFiles[i].department + '-' + this.employeeFiles[i].city + '-' + this.employeeFiles[i].name + '-' + this.employeeFiles[i].level1;
            if(this.employeeFiles[i].level2 != '' && this.employeeFiles[i].level2 != 'null')
              key += '-' + this.employeeFiles[i].level2;
            if(this.employeeFiles[i].level3 != '' && this.employeeFiles[i].level3 != 'null')
              key += '-' + this.employeeFiles[i].level3;
            var newNode: NodeTree = { name: this.employeeFiles[i].fileName }

            newNode.fileName = this.employeeFiles[i].fileName;
            newNode.url = this.employeeFiles[i].url;
            newNode.id = this.employeeFiles[i].id;
            newNode.isFolder = false;
            newNode.isUnknown = false;
            newNode.key = key;
            newNode.children = [];

            if(this.treeIndex[key] != undefined && this.treeIndex[key].children != null)
              this.treeIndex[key].children.push(newNode);
            else
              this.treeIndex[key] = { name: this.employeeFiles[i].fileName, found: false, children: [ newNode ] };
          }

          this.employeeService.fileTypesEndpoint().subscribe(
            (paramResponse: EmployeeFileTypeDTO[]) => {
              var departmentName = (this.employee.department != undefined ? this.employee.department : '');
              var nodeThr: NodeTree = { name: this.employee.name };
              nodeThr.isFolder = true;
              nodeThr.isUnknown = false;
              nodeThr.key = departmentName + '-' + this.employeeGeneral.cityName + '-' + this.employee.name;
              nodeThr.children = this.treeGenerator(paramResponse, 0, nodeThr.key);

              var nodeSec: NodeTree = { name: this.employeeGeneral.cityName };
              nodeSec.isFolder = true;
              nodeSec.isUnknown = false;
              nodeSec.key = departmentName + '-' + this.employeeGeneral.cityName;
              nodeSec.children = [];
              nodeSec.children.push(nodeThr);

              var nodeFir: NodeTree = { name: departmentName };
              nodeFir.isFolder = true;
              nodeFir.isUnknown = false;
              nodeFir.key = departmentName;
              nodeFir.children = [];
              nodeFir.children.push(nodeSec);

              this.treeData.push(nodeFir);
              this.treeLoad = false;
              this.treeFilesNotFound();
              this.treeComponent.treeModel.update();
            }
          );
        }
      );
    }
  }

  treeGenerator(paramResponse: EmployeeFileTypeDTO[], paramId: number, prefixKey: string): NodeTree[] {
    var tree: NodeTree[] = [];
    for(var i = 0; i < paramResponse.length; i++) {
      if(paramResponse[i].levelId == paramId) {
        var node: NodeTree = { name: paramResponse[i].name };
        node.isFolder = true;
        node.isUnknown = false;
        node.key = prefixKey + '-' + paramResponse[i].name;
        node.children = this.treeGenerator(paramResponse, paramResponse[i].id, node.key);

        if(this.treeIndex[node.key] != undefined && !this.treeIndex[node.key].found) {
          this.treeIndex[node.key].found = true;
          for(var j = 0; j < this.treeIndex[node.key].children.length; j++)
            node.children.push(this.treeIndex[node.key].children[j]);
        }
        tree.push(node);
      }
    }
    return tree;
  }

  treeFilesNotFound() {
    var addTree: NodeTree[] = [];
    for(const index in this.treeIndex)
      if(!this.treeIndex[index].found && this.treeIndex[index].children != undefined && this.treeIndex[index].children.length > 0) {
        var node: NodeTree = { name: index.split('-').join('/') };
        node.isFolder = true;
        node.isUnknown = true;
        node.key = index;
        node.children = this.treeIndex[index].children;
        addTree.push(node);
      }

    if(addTree.length > 0) {
      var node: NodeTree = { name: 'Otras Ubicaciones' };
      node.isFolder = true;
      node.isUnknown = true;
      node.key = node.name;
      node.children = addTree;
      this.treeData.push(node);
    }
  }

  treeClasses(node: TreeNode): string {
    var classes: string = '';
    if(node.data.isFolder) {
      if(node.data.isUnknown)
        classes += 'tree-node-folder-warn';
      else
        classes += 'tree-node-folder';
    } else {
      classes += 'tree-node-file';
    }
    return classes;
  }

  treeClick(node: TreeNode) {
    if(node.data.isFolder) {
      if(node.isExpanded)
        node.collapse();
      else
        node.expand();
    } else {
      window.open(node.data.url + node.data.fileName, '_blank');
    }
  }

  ratePercent(rate: number): string {
    return (rate * 10) + "%";
  }

  rateColor(rate: number): string {
    var rColor: number = 31 - Math.round(rate * 3.1);
    var gColor: number = 232 - Math.round(rate * 15.3);
    var bColor: number = 248 - Math.round(rate * 7.5);
    return "rgb(" + rColor + "," + gColor + "," + bColor + ")";
  }

  editMethod() {
    this.router.navigateByUrl('employees/employee/edit/' + this.section + '/' + this.employeeId);
  }
}
