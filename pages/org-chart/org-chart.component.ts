import { AfterViewInit, Component, OnInit } from "@angular/core";

@Component({
  selector: "gdx-org-chart",
  templateUrl: "./org-chart.component.html",
  styleUrls: ["./org-chart.component.scss"]
})
export class OrgChartComponent implements OnInit, AfterViewInit {
  isMobile = true;
  activeChild: any = [];
  empId:any = 'DO120003';

  // #next: shrink mode (only avatar / name)



  linkData: any = {
    directReport: [
      {
        userId: '3202',
        fullName: 'Muhamad Muzakky Rabbani',
        empId: 'kakaye1',
        posNameEn: 'UI UX Engineer',
        spvParent: 'mightwin1'
      },
      {
        userId: '3222',
        fullName: 'Muhamad Imam Malik',
        empId: 'mimedev1',
        posNameEn: 'UI UX Engineer',
        spvParent: 'mightwin1'
      },
      {
        userId: '3422',
        fullName: 'Muhamad Fatah Malik',
        empId: 'fatah1',
        posNameEn: 'UI UX Engineer',
        spvParent: 'mightwin1'
      },
    ],
    center: {
      userId: '3262',
      fullName: 'Muhamad Rindra Malik',
      empId: 'mightwin1',
      posNameEn: 'UI UX Lead Engineer',
      spvParent: 'pakjul1'
    },
    superior:{
      userId: '3442',
      fullName: 'Muhamad Julian Malik',
      empId: 'pakjul1',
      posNameEn: 'GDX Lead Engineer',
      spvParent: 'gordon1'
    },
    directsup:[
      {
        userId: '4444',
        fullName: 'Muhamad Guruh Malik',
        empId: 'guruh1',
        posNameEn: 'UI UX Lead Engineer',
        spvParent: 'pakjul1'
      },
      {
          userId: '9999',
          fullName: 'Muhamad Babay Malik',
          empId: 'babay1',
          posNameEn: 'UI UX Lead Engineer',
          spvParent: 'pakjul1'
      }
    ]
  }

  constructor() {}

  ngOnInit() {}

  toggleMode() {
    this.isMobile = !this.isMobile;
  }

  ngAfterViewInit() {}

  checkRect() {
    const frame = document.getElementById("root-chart").getBoundingClientRect();
    console.log(frame, "mantab");
  }

  handleActiveChild(e) {
    console.log(e, "dewa");
  }
}
