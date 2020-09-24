import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalDirective } from 'ngx-bootstrap';
import { Globals, NotificationTypes } from 'src/app/services/globals';
import { NgForm } from '@angular/forms';
import { CitiesService } from 'src/app/services/cities.service';
declare const google: any;
declare var moment: any

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('detailsModel', { static: true }) detailsModel: ModalDirective
  @ViewChild('updateModal', { static: true }) updateModal: ModalDirective
  @ViewChild('form', { static: true }) form: NgForm
  dataFiltered: any[]
  data: any[]
  deleteId = null
  noPrice: boolean = false
  sort: number = 1
  filter: string = ''
  order
  payments: any[]
  cities: any[]
  towns: any[]
  types: any[]
  edit_id: null

  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  lat = 22.9551582;
  lng = 41.7139685
  // paths:google.maps.LatLngLiteral[] = []
  city_lat:number = 0;
  city_lng:number = 0;
  city_zoom: number = 10;
  
  rent = [{ title: 'شراء', value: false }, { title: 'ايجار', value: true }]
  addModel = {
    purpose: null,
    status: null,
    priceFrom: null,
    priceTo: null,
    cityId: null,
    cityAr: null,
    cityEn: null,
    towns: [],
    hasFinance: false,
    isRent: null,
    area: null,
    details: null,
    propertyTypeId: null,
    propertyTypeTitleAr: null,
    propertyTypeTitleEn: null,
    cityLoc: []
  }
  selectedItems = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'ar',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  edit_item: any
  _status = [
    { title: 'عائلي', value: 'families', statusTitleAr: 'عائلي', statusTitleEn: 'families' },
    { title: 'عزاب', value: 'singles', statusTitleAr: 'عزاب', statusTitleEn: 'singles' }
  ]
  purposes_building = [
    { title: 'تجاري', value: 'commercial' },
    { title: 'سكني', value: 'residential' }
  ]
  purposes_Land = [
    { title: 'زراعي', value: 'agricultural' },
    { title: 'تجاري', value: 'commercial' },
    { title: 'سكني', value: 'residential' }
  ]
  constructor(private db: AngularFirestore, private city_api: CitiesService, private globals: Globals) { }

  ngOnInit() {
    this.globals.loading(loading => {
      this.db.collection('orders').valueChanges().subscribe(res => {
        this.data = res
        this.dataFiltered = res
        this.filterData();

        loading.hide()
      }, () => {
        loading.hide()
      })
    })
    this.db.collection('settings').valueChanges().subscribe((res: any[]) => {

    })
    this.db.collection('property_types').valueChanges().subscribe((res: any[]) => {
      this.types = res.map(i => {
        return { ...i, title: i.title_ar, value: i.id }
      })
    })
    this.db.collection('Payment').valueChanges().subscribe((res: any[]) => {
      this.payments = res.map(i => {
        return { ...i, title: i.title_ar, value: i.id }
      })
    })
    // this.db.collection('cities').valueChanges().subscribe((res: any[]) => {
    //   this.cities = res.map(i => {
    //     return { ...i, title: i.title_ar, value: i.id }
    //   })
    // })
    this.city_api.getCities().subscribe((res: any) => {
      console.log('cities from api', res);
      this.cities = res.cities.map(i => {
        return { ...i, title: i.name_ar, value: i.cityId }
      })
    })
  }

  onSelectCity = (item) => {
    console.log('city item', item);
    this.selectedItems = []
    this.city_api.getCityTowns(item).subscribe((res: any) => {
      console.log('towns', res);
      this.towns = res.towns.map(i => ( { ...i, titleAr: i.ar, titleEn: i.en }))
    })
    let selectedCity = this.cities.filter(i => i.cityId === item)
    console.log(selectedCity);
    this.latitude = selectedCity[0].center.coordinates[1]
    this.longitude = selectedCity[0].center.coordinates[0]
    this.lat = selectedCity[0].center.coordinates[1]
    this.lng = selectedCity[0].center.coordinates[0]
    this.addModel.cityAr = selectedCity[0].name_ar
    this.addModel.cityEn = selectedCity[0].name_en
    this.addModel.cityLoc = selectedCity[0].center.coordinates.reverse();
  }
  delete = () => {
    this.globals.loading(loading => {
      this.db.collection('orders').doc(this.deleteId).delete().then(res => {
        this.globals.showToast('تم الحذف بنجاح', '', NotificationTypes.Success)
        loading.hide()
      }).catch(err => {
        this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
        loading.hide()
      })
    })

  }
  onItemSelect = (item) => {
    let city_towns = []
    this.selectedItems.forEach(i => { city_towns.push(this.towns.filter(res => res.id == i.id)[0]) })
    city_towns = city_towns.map(i => ({ id: i.id, titleAr: i.titleAr, titleEn: i.titleEn }))
    this.addModel.towns = city_towns
  }
  onSelectStatus = (item) => {
    let selectedstatus = this._status.filter(i => i.value === item)
  }
  onSelecttype = (item) => {
    let selectedType = this.types.filter(i => i.id === item)
    this.addModel.propertyTypeTitleAr = selectedType[0].title_ar
    this.addModel.propertyTypeTitleEn = selectedType[0].title_en
  }
  edit = (row) => {
    this.edit_item = row
    this.addModel = {
      area: this.edit_item.area,
      details: this.edit_item.details,
      hasFinance: this.edit_item.hasFinance,
      isRent: this.edit_item.isRent,
      priceFrom: this.edit_item.priceFrom,
      priceTo: this.edit_item.priceTo,
      propertyTypeId: this.edit_item.propertyTypeId,
      propertyTypeTitleAr: this.edit_item.propertyTypeTitleAr,
      propertyTypeTitleEn: this.edit_item.propertyTypeTitleEn,
      purpose: this.edit_item.purpose,
      status: this.edit_item.status,
      cityAr: this.edit_item.cityAr,
      cityEn: this.edit_item.cityEn,
      cityId: this.edit_item.cityId,
      towns: this.edit_item.towns,
      cityLoc: this.edit_item.cityLoc
    }
    if (row.cityLoc) {
      let location = row.cityLoc
      console.log(location);
      
      this.latitude = this.lat = location[0]
      this.longitude = this.lng=  location[1]

    }
    if (this.addModel.cityId) {
      this.city_api.getCityTowns(this.addModel.cityId).subscribe((res: any) => {
        this.towns = res.towns.map(i => ({ ...i, titleAr: i.ar, titleEn: i.en }))
      })
      this.selectedItems = this.addModel.towns.map(i => ({ id: i.id, ar: i.titleAr }))
    }
    if (this.edit_item.priceFrom == null) {
      this.noPrice = true
    } else {
      this.noPrice = false
    }

    this.edit_id = row.createdAt
    this.updateModal.show()
  }
  update = () => {
    this.globals.loading(loading => {
      this.db.collection('orders').doc(this.edit_id).update({ ...this.edit_item, ...this.addModel }).then(res => {
        this.updateModal.hide()
        this.form.reset()
        this.globals.showToast('تم التعديل بنجاح', '', NotificationTypes.Success)
        loading.hide()
      }).catch(err => {
        this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
        loading.hide()
      })
    })
  }
  show_details = (id) => {
    this.order = this.data.filter(i => i.id === id)
    let location = this.order[0].cityLoc
    this.latitude = location[0]
    this.longitude = location[1]
    this.lat = location[0]
    this.lng = location[1]
    this.detailsModel.show()
  }
  filterData = () => {
    this.dataFiltered = JSON.parse(JSON.stringify(this.data))
    if (this.filter != '')
      this.dataFiltered = this.dataFiltered.filter(d => {
        let dataString = JSON.stringify(d).toLowerCase()
        return dataString.indexOf(this.filter.toLowerCase()) > -1
      })
    this.dataFiltered = this.dataFiltered.sort((a, b) => {

      let _a = a.createdAt, _b = b.createdAt
      console.log(_a);

      return this.sort == 1 ? (_b - _a) : (_a - _b)
    })
    this.dataFiltered = JSON.parse(JSON.stringify(this.dataFiltered))
  }
}
