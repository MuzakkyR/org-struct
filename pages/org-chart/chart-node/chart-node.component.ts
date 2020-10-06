import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
  AfterContentInit
} from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { trigger, style, animate, transition } from "@angular/animations";

@Component({
  selector: "gdx-chart-node",
  templateUrl: "./chart-node.component.html",
  styleUrls: ["./chart-node.component.scss"],
  animations: [
    trigger("fading", [
      transition("void => *", [
        style({
          opacity: 0
        }),
        animate("250ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ]),
      transition("* => void", [
        animate(
          "200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          style({
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class ChartNodeComponent implements OnInit, AfterContentInit {
  @Input() isMobile;
  @Input() employee: any = [];
  @Input() level: any = "super";
  @Input() indexEmp: any;
  @Input() empId: any;
  @Input() superior: any;
  @Input() skeleton: boolean = false;
  @Output() changeSuperior: EventEmitter<any> = new EventEmitter<any>();
  @Output() changeEmployee: EventEmitter<any> = new EventEmitter<any>();

  timeoutTest: number;
  nodeWidth: any;
  tempArray: any = [];
  tempChild: any = [];
  newEmployee: any = [];
  mouseRelease: boolean = false;
  toggleLoader: boolean = false;
  apiRoot: string;
  picRoot: string =
    "https://doffice.dataon.com/sf6/index.cfm?sfid=sys.sec.getimage&img=52EEAD80B7FDB3B31AFC8737ABFF9A94E1638C7EDB7F3EC97795AEB8198A84908072541E10D90ADEBA6FAEB333BDBC62ADB097CAA1AA60ADAB19C8BACD48178891AC7D05D90DCFA7ADAF72B5A5B47B26B39109826A8CCCBBD75D3EDF51A2436DBF8D43C75AACCD5FFBDF882E86B2959CBE6AB2A0A94970AA6A6B6D&fname=";
  picCompany: any =
    "https://doffice.dataon.com/sf6lib/getimage.cfm?&nosquare=true&img=52EEAD80B7FDB3B31AFC8737ABFF9A94E1638C7EDB7F3EC97795AEB8198A84908072541E10D90ADEBA6FAEB333BDBC62ADB097CAA1AA60ADAB19C8BACD48178891AC7D05D90DCFA7ADAF72B5A5B47B26B39109826A8CCCBBD75D3EDF57A05E42AE8B55DF5AB8805DFDD9E93F86AE9096BC7FAFA6A82911B66A686928&fname=company_logo_cid133.png";

  tempEmployee: any;

  constructor(public http: HttpClient) {}

  handleSuperior() {
    if (!this.superior && this.employee.superior) {
      let photo = this.handlePhoto(this.employee.superior.photo);
      this.superior = {
        fullName: this.employee.superior.fullName,
        photo: photo,
        empId: this.employee.superior.empId,
        active: false,
        showChild: true,
        superior: true,
        child: []
      };
    } else {
      this.superior = {
        fullName: "Company",
        photo: this.picCompany,
        active: false,
        showChild: true,
        superior: true,
        child: []
      };
    }
  }

  handlePhoto(url) {
    if (url) {
      let res = this.picRoot + url.replace("\\", "%5C");
      return res;
    } else {
      return this.picCompany; 
    }
  }

  handleSupervisor() {
    this.tempArray = [];
    if (this.employee.directsup) {
      if (this.employee.directReport.length > 0) {
        this.handleDirectReport();
      }
      if (this.employee.directsup.length > 0) {
        for (let i = 0; i < this.employee.directsup.length; i++) {
          let photo = this.handlePhoto(this.employee.directsup[i].photo);
          if (i === 1) {
            // biar yang center jadi array urutan 2 di array yg baru
            this.tempArray.push({
              fullName: this.employee.center.fullName,
              photo: this.handlePhoto(this.employee.center.photo),
              empId: this.employee.center.empId,
              active: true,
              showChild: true,
              superior: false,
              child: this.tempChild
            });
          }
          this.tempArray.push({
            fullName: this.employee.directsup[i].fullName,
            empId: this.employee.directsup[i].empId,
            photo: photo,
            active: false,
            showChild: true,
            superior: false,
            child: []
          });
        }
      } else {
        this.tempArray.push({
          fullName: this.employee.center.fullName,
          photo: this.handlePhoto(this.employee.center.photo),
          empId: this.employee.center.empId,
          active: true,
          showChild: true,
          superior: false,
          child: this.tempChild
        });
      }
    }
  }

  handleDirectReport() {
    this.tempChild = [];
    for (let i = 0; i < this.employee.directReport.length; i++) {
      let photo = this.handlePhoto(this.employee.directReport[i].photo);
      this.tempChild.push({
        fullName: this.employee.directReport[i].fullName,
        photo: photo,
        empId: this.employee.directReport[i].empId,
        active: false,
        showChild: true,
        superior: false,
        child: []
      });
    }
  }

  handleLinked() {
    if (this.level === "super") {
      this.handleSuperior();
    }
    this.handleSupervisor();
  }

  ngOnInit() {
    this.empId ? this.initCallAPI(null) : this.handleLinked();
  }

  async initCallAPI(employeeId) {
    if (this.empId) {
      employeeId = this.empId;
    }
    let headers = new HttpHeaders().set(
      "Authorization",
      "SFGO160186965541305457997611935559"
    );
    let root = "https://apidoffice.dataon.com/v2/sunfish/getOrgStruct?empId=";
    let url = root + employeeId;

    await this.http.get<any>(url, { headers }).subscribe(result => {
      this.employee = result.data;
      this.handleLinked();
    });
  }

  ngAfterContentInit() {
    let checkActive = false;
    for (let i = 0; i < this.employee.length; i++) {
      if (this.employee[i].active === true) {
        checkActive = true;
      }
    }
    if (!checkActive && this.employee.length > 1) {
      let child = document.getElementById("node" + this.employee[1].empId);
      if (child) {
        child.parentElement.parentElement.scrollLeft = child.clientWidth;
      }
    }
  }

  async selectNode(emp, param = null) {
    // this.toggleLoader = true;

    if (param === "scroll") {
      let child = document.getElementById("node" + emp.empId).parentElement
        .parentElement;
      for (let i = 0; i < this.tempEmployee.length; i++) {
        if (emp.empId === this.tempEmployee[i].empId) {
          this.tempEmployee[i].active = true;
          this.tempEmployee[i].showChild = true;
          if (this.tempEmployee[i].child.length < 1) {
            await this.callAPI(emp.empId, "scroll");
            console.log("mamang1");
          }
        } else {
          this.tempEmployee[i].active = false;
          this.tempEmployee[i].showChild = false;
          for (let j = 0; j < this.tempEmployee[i].child.length; j++) {
            this.tempEmployee[i].child[j].active = false;
          }
          // console.log(this.tempEmployee, 'lavigne1')
          // console.log(this.employee, 'lavigne2')
        }
      }
    } else {
      let child = document.getElementById("node" + emp.empId).parentElement
        .parentElement;
      for (let i = 0; i < this.employee.length; i++) {
        if (emp.empId === this.employee[i].empId) {
          this.employee[i].active = true;
          this.employee[i].showChild = true;

          let elSelected = document
            .getElementById("node" + emp.empId)
            .getBoundingClientRect();
          console.log(elSelected, "mamang2");

          child.scrollLeft = this.indexEmp * elSelected.width;
          if (this.employee[i].child.length < 1) {
            await this.callAPI(emp.empId, "select");
          } else {
            setTimeout(() => {
              this.toggleLoader = false;
            }, 300);
          }
        } else {
          this.employee[i].active = false;
          this.employee[i].showChild = false;
          for (let j = 0; j < this.employee[i].child.length; j++) {
            this.employee[i].child[j].active = false;
          }
        }
      }
      this.changeEmployee.emit(this.employee);
    }
  }

  async callAPI(employeeId, param, activeEmp = null) {
    let headers = new HttpHeaders().set(
      "Authorization",
      "SFGO160186965541305457997611935559"
    );
    let root = "https://apidoffice.dataon.com/v2/sunfish/getOrgStruct?empId=";
    let url = root + employeeId;

    await this.http.get<any>(url, { headers }).subscribe(result => {
      this.newEmployee = result.data;
      let currentEmp;
      if (param === "scroll") {
        currentEmp = this.tempEmployee.find(elem => elem.empId === employeeId);
        for (let i = 0; i < this.newEmployee.directReport.length; i++) {
          let photo = this.handlePhoto(this.newEmployee.directReport[i].photo);
          currentEmp.child.push({
            fullName: this.newEmployee.directReport[i].fullName,
            photo: photo,
            empId: this.newEmployee.directReport[i].empId,
            active: false,
            showChild: true,
            superior: false,
            child: []
          });
        }
        this.changeEmployee.emit(this.employee);
        console.log(this.employee, "slave1");
      } else {
        currentEmp = this.employee.find(elem => elem.empId === employeeId);

        for (let i = 0; i < this.newEmployee.directReport.length; i++) {
          let photo = this.handlePhoto(this.newEmployee.directReport[i].photo);
          currentEmp.child.push({
            fullName: this.newEmployee.directReport[i].fullName,
            photo: photo,
            empId: this.newEmployee.directReport[i].empId,
            active: false,
            showChild: true,
            superior: false,
            child: []
          });
          console.log(currentEmp, "slave2");
        }
        this.changeEmployee.emit(this.employee);
        setTimeout(() => {
          this.toggleLoader = false;
        }, 300);
      }
    });
  }

  toggleTouch() {
    this.mouseRelease = true;
  }

  onTouchRelease(e, name = null) {
    clearTimeout(this.timeoutTest);
    this.timeoutTest = setTimeout(() => {
      if (this.mouseRelease) {
        this.checkObser();
      }
      this.mouseRelease = false;
    }, 300);
  }

  checkObser() {
    let leftItem;
    let leftIntersect;
    let rightItem;
    let rightIntersect;
    let intersect = document
      .getElementById("intersectHorizontal")
      .getBoundingClientRect();
    let itemNode;

    leftIntersect = Math.floor(intersect.left);
    rightIntersect = Math.floor(intersect.right);

    for (let i = 0; i < this.employee.length; i++) {
      if (this.employee[i].active) {
        for (let j = 0; j < this.employee[i].child.length; j++) {
          let empId = this.employee[i].child[j].empId;
          itemNode = document
            .getElementById("node" + empId)
            .getBoundingClientRect();
          leftItem = Math.floor(itemNode.left);
          rightItem = Math.floor(itemNode.right);
          let centerNode = document
            .getElementById("node" + empId)
            .querySelector(".node-content");
          if (leftItem >= leftIntersect && rightItem <= rightIntersect) {
            this.tempEmployee = this.employee[i].child;
            this.selectNode(this.employee[i].child[j], "scroll");
            // centerNode.classList.add("active-node");
            // this.toggleLoader = true;
            // console.log('nowhere')
            // this.employee[i].child[j].showChild = true;
            // this.employee[i].child[j].active = true;
            // if (this.employee[i].child[j].child.length === 0) {
            //   this.callAPI(empId, "scroll", this.employee[i].child[j]);
            // } else {
            //   setTimeout(() => {
            //     this.toggleLoader = false;
            //     console.log("sotin star2");
            //   }, 300);
            // }
          }
          //  else {
          //   this.employee[i].child[j].showChild = false;
          //   this.employee[i].child[j].active = false;
          //   for (let k = 0; k < this.employee[i].child[j].child.length; k++) {
          //     this.employee[i].child[j].child[k].active = false;
          //   }
          //   centerNode.classList.remove("active-node");
          // }
        }
        break;
      }
    }
  }
}
