import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { Globals, NotificationTypes } from 'src/app/services/globals';
import { ModalDirective } from 'ngx-bootstrap';
import { MapsAPILoader } from '@agm/core';
import { MouseEvent } from '@agm/core';
import {CitiesService} from '../../services/cities.service'

// import { MouseEvent as AGMMouseEvent } from '@agm/core';

import { NgForm } from '@angular/forms';
import * as firebase from 'firebase'

@Component({
  selector: 'app-aqarat',
  templateUrl: './aqarat.component.html',
  styleUrls: ['./aqarat.component.scss']
})
export class AqaratComponent implements OnInit {
  @ViewChild('detailsModel', { static: true }) detailsModel: ModalDirective
  @ViewChild('updateModal', { static: true }) updateModal: ModalDirective
  @ViewChild('form', { static: true }) form: NgForm
  @ViewChild('search', { static: false }) searchElementRef: ElementRef;
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  lat = 25.9551582;
  lng = 46.7139685
  towns = []
  address: string;
  private geoCoder;
  // 25.9551582,46.7139685

  deleteId = null
  loadingUpload = false
  images = []
  uploads = []
  dataFiltered: any[]
  data: any[]
  sort: number = 1
  filter: string = ''
  property: any[]
  types: any[]
  payments: any[]
  filelist: any[] = []
  cities: any[]
  edit_id: null
  edit_item: any
  city_name
  status_type
  paymentType
  interface_type
  addModel = {
    cityLoc:[],
    title: null,
    address: null,
    description: null,
    streats: null,
    age: null,
    propertyTypeId: null,
    levelsCount: null,
    apartmentsCount: null,
    bathroomsCount: null,
    limitsTypeId: null,
    limitsTitle: null,
    interfaceTypeId: null,
    interface2TypeId: null,
    interface3TypeId: null,
    bedroomsCount: null,
    commercialCount: null,
    images: [],
    area: null,
    price: null,
    city: null,
    cityId: null,
    floor: null,
    paymentTitleAr: null,
    paymentTitleEn: null,
    statusTitleEn: null,
    statusTitleAr: null,
    statusTypeId: null,
    paymentTypeId: null,
    isActive: true,
    isFurnished: true,
    isRent: null,
    propertyTypeTitleAr: null,
    propertyTypeTitleEn: null,
    interfaceTitle: null,
    interface2Title: null,
    interface3Title: null,
    interface4Title: null,
    interface4TypeId: null,
    townAr:null,
    townId:null,
    townEn:null,
  }
  typet: any
  operations = [
    { title: 'إيجار', value: 0 },
    { title: 'بيع', value: 1 },
    { title: 'مقايضه', value: 2 },
  ]
  limits = [
    { title: 'شامل الضريبة والعموله', value: '1' },
    { title: 'شامل الضريبة وغير شامل العموله', value: '2' },
    { title: 'غير شامل الضريبة وشامل العموله ', value: '3' },
    { title: 'غير شامل الضريبة والعموله ', value: '4' },

  ]
  streats = [
    { title: '1', value: 1 },
    { title: '2', value: 2 },
    { title: '3', value: 3 },
    { title: '4', value: 4 },
  ]
  _status = [
    { title: 'جديد', value: 'new', statusTitleAr: 'جديد', statusTitleEn: 'New', statusTypeId: 'new' },
    { title: 'قديم', value: 'old', statusTitleAr: 'قديم', statusTitleEn: 'Old', statusTypeId: 'old' }
  ]
  interfaces = [
    { title: 'الشمال', value: '1', title_en: 'North' },
    { title: 'الجنوب', value: '2', title_en: 'South' },
    { title: 'الشرق', value: '3', title_en: 'East' },
    { title: 'الغرب', value: '4', title_en: 'West' },
  ]
  operation_type

  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  constructor(private db: AngularFirestore, private globals: Globals, private city_api:CitiesService,private storage: AngularFireStorage,
    private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) { }

  ngOnInit() {

    this.setCurrentLocation();
    this.globals.loading(loading => {
      this.db.collection('properties').valueChanges().subscribe(res => {
        this.data = res
        this.dataFiltered = res
        this.filterData()
        loading.hide()
      }, () => {
        loading.hide()
      })
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

    this.city_api.getCities().subscribe((res:any) => {
      console.log('cities from api',res);
      this.cities = res.cities.map(i => {
        return { ...i, title: i.name_ar, value: i.cityId }
      })
    })
  }
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 7;
      });
    }
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    console.log(' this.latitude', this.latitude);
    this.addModel['location'] = `${this.latitude + ',' + this.longitude}`
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  onFileSelected(event) {
    var n = Date.now();
    this.filelist = event.target.files;
  }
  importImages(event) {
    // reset the array
    this.uploads = [];
    const filelist = event.target.files;
    const allPercentage: Observable<number>[] = [];

    for (const file of filelist) {

      const path = `files/${file.name}`;
      const ref = this.storage.ref(path);
      const task = this.storage.upload(path, file);
      const _percentage$ = task.percentageChanges();
      allPercentage.push(_percentage$);
      // create composed objects with different information. ADAPT THIS ACCORDING to YOUR NEED
      const uploadTrack = {
        fileName: file.name,
        percentage: _percentage$
      }

      // push each upload into the array
      this.uploads.push(uploadTrack);

    }
  }

  delete = () => {
    console.log(this.deleteId);
    
    this.globals.loading(loading => {
      this.db.collection('properties').doc(this.deleteId).delete().then(res => {
        this.detailsModel.hide()
        this.globals.showToast('تم الحذف بنجاح', '', NotificationTypes.Success)
        loading.hide()
      }).catch(err => {
        this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
        loading.hide()
      })
    })

  }
  show_details = (id) => {
    this.property = this.dataFiltered.filter(i => i.id === id)
    let location = this.property[0].cityLoc
    // let locations = location.split(',')
    // console.log('locations', locations);
    this.latitude = this.lat =  location[0]
    this.longitude =   this.lng =location[1]
    this.detailsModel.show()
    console.log('this.property', this.property);

  }
  onSelectStreat = (item) => {
    // console.log('item', item);
    if (item == 4) {
      this.addModel.interface4Title = 'جميع الجهات'
      this.addModel.interface4TypeId = '1'
      this.addModel.interfaceTitle = null
      this.addModel.interfaceTypeId = null
      this.addModel.interface2Title = null
      this.addModel.interface2TypeId = null
      this.addModel.interface3Title = null
      this.addModel.interface3TypeId = null
    } else if (item == 3) {
      this.addModel.interface4Title = null
      this.addModel.interface4TypeId = null
    } else if (item == 2) {
      this.addModel.interface4Title = null
      this.addModel.interface4TypeId = null
      this.addModel.interface3Title = null
      this.addModel.interface3TypeId = null
    } else {
      this.addModel.interface4Title = null
      this.addModel.interface4TypeId = null
      this.addModel.interface3Title = null
      this.addModel.interface3TypeId = null
      this.addModel.interface2Title = null
      this.addModel.interface2TypeId = null
    }

  }
  onSelectInterface = (item) => {
    let selectedInterface = this.interfaces.filter(i => i.value === item)
    this.addModel.interfaceTitle = selectedInterface[0].title_en
    this.addModel.interfaceTypeId = selectedInterface[0].value
  }
  onSelectInterface2 = (item) => {
    let selectedInterface = this.interfaces.filter(i => i.value === item)
    this.addModel.interface2Title = selectedInterface[0].title_en
    this.addModel.interface2TypeId = selectedInterface[0].value
  }
  onSelectInterface3 = (item) => {
    let selectedInterface = this.interfaces.filter(i => i.value === item)
    this.addModel.interface3Title = selectedInterface[0].title_en
    this.addModel.interface3TypeId = selectedInterface[0].value
  }
  onSelectpayment = (item) => {
    let selectedPayment = this.payments.filter(i => i.id === item)
    this.addModel.paymentTitleAr = selectedPayment[0].title_ar
    this.addModel.paymentTitleEn = selectedPayment[0].title_en
  }

  onSelectLimit = (item) => {
    let selectedCity = this.limits.filter(i => i.value === item)
    this.addModel.limitsTitle = selectedCity[0].title
  }
  onSelectCity = (item) => {
    console.log('city item', item);

    this.city_api.getCityTowns(item).subscribe((res:any) => {
      console.log('towns',res);
      this.towns = res.towns.map(i => {
        return { ...i, title: i.ar, value: i.id }
      })
      
    })
    let selectedCity = this.cities.filter(i => i.cityId === item)
    console.log(selectedCity);
    this.latitude =  this.lat = selectedCity[0].center.coordinates[1]
    this.longitude =  this.lng = selectedCity[0].center.coordinates[0]
    this.addModel.cityLoc = selectedCity[0].center.coordinates.reverse()
    
    this.addModel.city = selectedCity[0].name_ar
  }
  onSelectTown = (item) => {
    console.log(item);
    let selectedTown = this.towns.filter(i => i.id === item)[0]
    console.log('selectedTown',selectedTown);
    
    this.addModel.townAr = selectedTown.ar
    this.addModel.townEn = selectedTown.en

  }
  onSelectStatus = (item) => {
    let selectedstatus = this._status.filter(i => i.value === item)
    this.addModel.statusTitleAr = selectedstatus[0].statusTitleAr
    this.addModel.statusTitleEn = selectedstatus[0].statusTitleEn
    this.addModel.statusTypeId = selectedstatus[0].statusTypeId
    if (item = 'new') {
      this.addModel.age = null
    }
  }
  onSelecttype = (item) => {
    let selectedType = this.types.filter(i => i.id === item)
    // console.log(selectedType);
    this.addModel.propertyTypeTitleAr = selectedType[0].title_ar
    this.addModel.propertyTypeTitleEn = selectedType[0].title_en
    if (selectedType[0].title_en == 'Building' || selectedType[0].title_en == 'Commercial' || selectedType[0].title_en == 'Land') {
      this.addModel.bedroomsCount = null
      this.addModel.bathroomsCount = null
    }
    if (selectedType[0].title_en == 'Apartment' || selectedType[0].title_en == 'Villa' || selectedType[0].title_en == 'Land') {
      this.addModel.levelsCount = null
    }
    if (selectedType[0].title_en != 'Building') {
      this.addModel.apartmentsCount = null
      this.addModel.commercialCount = null
    }

  }
  onSelectOperation = (item) => {

  }
  edit = (row) => {
    console.log(row);
    if(row.cityLoc) {
      let location = row.cityLoc
      console.log(location);
      this.latitude = location[0]
      this.longitude = location[1]
      this.lat = location[0]
      this.lng = location[1]
    }
    this.edit_item = row
    this.images = row.images
    if (this.edit_item) {
      this.addModel = {
        apartmentsCount: this.edit_item.apartmentsCount,
        bathroomsCount: this.edit_item.bathroomsCount,
        bedroomsCount: this.edit_item.bedroomsCount,
        images: this.edit_item.images,
        city: this.edit_item.city,
        age: this.edit_item.age,
        cityId: this.edit_item.cityId,
        commercialCount: this.edit_item.commercialCount,
        description: this.edit_item.description,
        floor: this.edit_item.floor,
        interface2TypeId: this.edit_item.interface2TypeId,
        interface3TypeId: this.edit_item.interface3TypeId,
        interfaceTypeId: this.edit_item.interfaceTypeId,
        isActive: this.edit_item.isActive,
        isFurnished: this.edit_item.isFurnished,
        isRent: this.edit_item.isRent,
        levelsCount: this.edit_item.levelsCount,
        limitsTypeId: this.edit_item.limitsTypeId,
        paymentTitleAr: this.edit_item.paymentTitleAr,
        paymentTitleEn: this.edit_item.paymentTitleEn,
        paymentTypeId: this.edit_item.paymentTypeId,
        price: this.edit_item.price,
        propertyTypeId: this.edit_item.propertyTypeId,
        propertyTypeTitleAr: this.edit_item.propertyTypeTitleAr,
        propertyTypeTitleEn: this.edit_item.propertyTypeTitleEn,
        streats: this.edit_item.streats,
        title: this.edit_item.title,
        address: this.edit_item.address,
        statusTitleEn: this.edit_item.statusTitleEn,
        statusTitleAr: this.edit_item.statusTitleAr,
        statusTypeId: this.edit_item.statusTypeId,
        limitsTitle: this.edit_item.limitsTitle,
        interfaceTitle: this.edit_item.statusTypeId,
        interface2Title: this.edit_item.interfaceTitle,
        interface3Title: this.edit_item.interface3Title,
        interface4Title: this.edit_item.interface4Title,
        interface4TypeId: this.edit_item.interface4Title,
        area: this.edit_item.area,
        cityLoc:this.edit_item.cityLoc,
        townAr:this.edit_item.townAr,
        townId:this.edit_item.townId,
        townEn:this.edit_item.townEn,

      }
      if (this.edit_item.streats == 4) {
        this.addModel.interface4Title = 'جميع الجهات'
        this.addModel.interface4TypeId = '1'
        this.addModel.interfaceTitle = null
        this.addModel.interfaceTypeId = null
        this.addModel.interface2Title = null
        this.addModel.interface2TypeId = null
        this.addModel.interface3Title = null
        this.addModel.interface3TypeId = null
      } else if (this.edit_item.streats == 3) {
        this.addModel.interface4Title = null
        this.addModel.interface4TypeId = null
      } else if (this.edit_item.streats == 2) {
        this.addModel.interface4Title = null
        this.addModel.interface4TypeId = null
        this.addModel.interface3Title = null
        this.addModel.interface3TypeId = null
      } else {
        this.addModel.interface4Title = null
        this.addModel.interface4TypeId = null
        this.addModel.interface3Title = null
        this.addModel.interface3TypeId = null
        this.addModel.interface2Title = null
        this.addModel.interface2TypeId = null
      }
      if (this.addModel.propertyTypeTitleEn == "Apartment") {
        this.addModel.apartmentsCount = null
      }

    }
    this.edit_id = row.id
    this.updateModal.show()
  }
  delete_image = (img) => {
    this.images.splice(this.images.indexOf(img), 1)

  }
  update = () => {
    if (this.filelist.length > 0) {
      for (const file of this.filelist) {
        const filePath = `RoomsImages/${file.name}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(`RoomsImages/${file.name}`, file);
        task
          .snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe(url => {
                if (url) {
                  this.fb = url;
                }
                this.loadingUpload = false
                this.images.push(this.fb)
                // console.log('fb', this.fb);
                this.addModel.images = this.images
                this.addModel.age = Number(this.addModel.age)
                this.globals.loading(loading => {
                  this.db.collection('properties').doc(this.edit_id).update({ ...this.edit_item, ...this.addModel }).then(res => {
                    this.updateModal.hide()
                    this.form.reset()
                    this.globals.showToast('تم التعديل بنجاح', '', NotificationTypes.Success)
                    loading.hide()
                  }).catch(err => {
                    this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
                    loading.hide()
                  })
                })
              });
            })
          )
          .subscribe(url => {
            if (url) {
              this.loadingUpload = true
              // this.images.push(url)
              // console.log('url', url);
            }
          });
      }
    } else {
      this.addModel.images = this.images
      this.addModel.age = Number(this.addModel.age)
      console.log(this.addModel);

      this.globals.loading(loading => {
        this.db.collection('properties').doc(this.edit_id).update({ ...this.edit_item, ...this.addModel }).then(res => {
          // console.log(res);
          this.updateModal.hide()
          this.form.reset()
          this.globals.showToast('تم التعديل بنجاح', '', NotificationTypes.Success)
          loading.hide()
        }).catch(err => {
          // console.log(err);
          this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
          loading.hide()
        })
      })
    }

  }
  objToString(obj) {
    var str = '';
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        str += p + '::' + obj[p] + '\n';
      }
    }
    return str;
  }
  filterData = () => {
    this.dataFiltered = this.data

    if (this.filter != '')
      this.dataFiltered = this.dataFiltered.filter(d => {
        let dataString = this.objToString(d).toLowerCase()
        return dataString.indexOf(this.filter.toLowerCase()) > -1
      })

    this.dataFiltered = this.dataFiltered.filter(d => {
      let dataString = this.objToString(d)
      return dataString
    })
    this.dataFiltered = this.dataFiltered.sort((a, b) => {
      let _a = a.createdAt, _b = b.createdAt
      return this.sort == 1 ? (_b - _a) : (_a - _b)
    })


    this.dataFiltered = this.dataFiltered
  }
}
