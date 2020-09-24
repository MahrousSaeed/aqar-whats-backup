import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  report_types = [
    {
      title:'تقرير الاعلانات',
      value:'1'
    },
    {
      title:'تقرير الطلبات العقارية',
      value:'2'
    },
  ]
  data = [
    {
      name:'ahmed',
      price:'120',
      area:200,
      type:'اعلانات'
    },
    {
      name:'ahmed',
      price:'120',
      area:200,
      type:'اعلانات'
    },
    {
      name:'ahmed',
      price:'120',
      area:200,
      type:'اعلانات'
    },
  ]
  report_type:any
  dataFiltered:any[] = []
  constructor() { }

  ngOnInit() {
  }
  onSelectType = (report_type) => {
    console.log(report_type);
    
  }
}
