import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Globals, NotificationTypes } from 'src/app/services/globals';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
import { loadavg } from 'os';
import { id } from '@swimlane/ngx-datatable';
declare var moment: any

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('updateModal', { static: true }) updateModal: ModalDirective
  @ViewChild('detailsModel', { static: true }) detailsModel: ModalDirective
  @ViewChild('blockModal', { static: true }) blockModal: ModalDirective
  @ViewChild('cancel_Modal', { static: true }) cancel_Modal: ModalDirective
  @ViewChild('form', { static: true }) form: NgForm
  @ViewChild('blockForm', { static: true }) blockForm: NgForm
  appBlockModel = {
    blocked_user_id: null,
    end_at: null,
    from_user_id: this.globals.currentUser.id,
    start_at: null,
    type: null,
  }
  appBlocked_id
  currentAdmin
  userBlocked_startDate
  userBlocked_endDate
  appBlocked_startDate
  appBlocked_endDate
  blocked_userId
  orders: any[]
  properties: any[]
  dataFiltered: any[]
  appBlocks: any[] = []
  blocks: any[] = []
  user_properties: any[] = []
  user_orders: any[]= []
  currentDate = new Date()
  end_at_minDate = new Date()
  admins: any[]
  data: any[]
  cancel_id
  sort: number = 1
  filter: string = ''
  edit_id: null
  blocked:boolean
  appBlocked:boolean
  edit_item: {}
  addModel = {
    nickname: null,
    aboutMe: null
  }
  constructor(private db: AngularFirestore, private globals: Globals) { }
  handler = () => {
    this.end_at_minDate = this.appBlockModel.start_at
  }
  ngOnInit() {
    this.globals.loading(loading => {
      this.db.collection('users').valueChanges().subscribe(res => {
        this.data = res
        this.dataFiltered = res
        
        this.db.collection('admins').valueChanges().subscribe(res => {
          this.admins = res
          this.currentAdmin = this.admins.filter(i => i.id == this.globals.currentUser.id)[0]
          // console.log('this.currentAdmin', this.currentAdmin);
          this.data = this.data.map(ele => {
            return { ...ele, blocked: this.currentAdmin.blockedContacts.includes(ele.id) ? true : false }
          })
          this.dataFiltered = this.dataFiltered.map(ele => {
            return { ...ele, blocked: this.currentAdmin.blockedContacts.includes(ele.id) ? true : false }
          })
        })

        this.db.collection('appBlocks').valueChanges().subscribe(res => {
          let appBlockedUsers: any[] = res
          appBlockedUsers = appBlockedUsers.map(i => {
            return i.blocked_user_id
          })
          this.data = this.data.map(ele => {
            return { ...ele, appBlocked: appBlockedUsers.includes(ele.id) ? true : false }
          })
          this.dataFiltered = this.dataFiltered.map(ele => {
            return { ...ele, appBlocked: appBlockedUsers.includes(ele.id) ? true : false }
          })
        })
        loading.hide()
      }, () => {
        loading.hide()
      })
    })
    this.db.collection('orders').valueChanges().subscribe((res:any) => {
      console.log(' this.orders', res);
      this.orders = res      
    })
    this.db.collection('appBlocks').valueChanges().subscribe((res:any) => {
      console.log(' this.appBlocks', res);
      this.appBlocks = res      
    })
    this.db.collection('blocks').valueChanges().subscribe((res:any) => {
      console.log(' this.appBlocks', res);
      this.blocks = res      
    })
    this.db.collection('properties').valueChanges().subscribe((res:any) => {
      console.log(' this.properties', res);
      this.properties = res
    })
  }
  details = (user) => {
    this.user_orders = this.orders.filter(i=>i.userId == user.id)
    this.user_properties = this.properties.filter(i=>i.userId == user.id)
    console.log('this.user_orders',this.user_orders);
    console.log('this.user_properties',this.user_properties);
    this.blocked = user.blocked
    this.appBlocked = user.appBlocked
    if(this.blocked == true){
      console.log(user.id);
      console.log(this.globals.currentUser.id);
      
      this.db.collection('blocks').doc(user.id).collection('user').doc(this.globals.currentUser.id).valueChanges().subscribe((res:any) => {
        console.log(res);
        this.userBlocked_startDate = moment(res.start_at, "x").format("DD-MM-YYYY ") //parse string
        this.userBlocked_endDate = moment(res.end_at, "x").format("DD-MM-YYYY ")
        
      })
    }
    if(this.appBlocked == true){
     let user_appBlocked_data = this.appBlocks.filter(res => res.blocked_user_id == user.id)[0]
     console.log('user_appBlocked_data',user_appBlocked_data);
     this.appBlocked_startDate = moment(user_appBlocked_data.start_at, "x").format("DD-MM-YYYY ") //parse string
      this.appBlocked_endDate = moment(user_appBlocked_data.end_at, "x").format("DD-MM-YYYY ")
        
    }
    this.detailsModel.show()

    console.log(user);
    

  }
  edit = (row) => {
    this.addModel = {
      nickname: row.nickname,
      aboutMe: row.aboutMe
    }
    this.edit_item = row
    this.edit_id = row.id
    this.updateModal.show()
  }
  cancelBlock = () => {
    this.globals.loading(loading => {
      this.db.collection('appBlocks').doc(this.cancel_id).delete().then(i => {
        loading.hide()
        this.globals.showToast('تم الغاء الحظر بنجاح', '', NotificationTypes.Success)
      }).catch(err => {
        this.globals.showToast('حدث خطا', '', NotificationTypes.Error)
        loading.hide()
      })
    })
  }
  cancelUserBlock = () => {
    let blockedContacts = this.currentAdmin.blockedContacts ? this.currentAdmin.blockedContacts : []
    blockedContacts.splice(blockedContacts.indexOf(this.cancel_id), 1)
    this.globals.loading(loading => {
      this.db.collection('blocks').doc(this.cancel_id).collection('user').doc(this.currentAdmin.id).delete().then(res => {
        this.db.collection('admins').doc(this.globals.currentUser.id).update({ ...this.currentAdmin, blockedContacts: blockedContacts }).then(res => {
          this.updateModal.hide()
          this.form.reset()
        })
        this.blockModal.hide()
        this.blockForm.reset()
        this.globals.showToast('تم  الغاءحظر المستخدم بنجاح', '', NotificationTypes.Success)
        loading.hide()
      }).catch(err => {
        this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
        loading.hide()
      })
    })

  }
  update = () => {
    this.globals.loading(loading => {
      this.db.collection('users').doc(this.edit_id).update({ ...this.edit_item, ...this.addModel }).then(res => {
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
  block = () => {
    let selected_user = this.dataFiltered.filter(i => i.id === this.blocked_userId)
    this.appBlockModel.blocked_user_id = this.blocked_userId
    this.appBlockModel.start_at = moment(this.appBlockModel.start_at).format("x")
    this.appBlockModel.end_at = moment(this.appBlockModel.end_at).format("x")
    if (this.appBlockModel.type === 'app') {
      this.globals.loading(loading => {
        this.db.collection('appBlocks').doc(this.appBlockModel.blocked_user_id).set(this.appBlockModel).then(res => {
          this.blockModal.hide()
          this.blockForm.reset()
          this.globals.showToast('تم حظر المستخدم بنجاح', '', NotificationTypes.Success)
          loading.hide()
        }).catch(err => {
          this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
          loading.hide()
        })
      })

    } else {
      let blockedContacts = this.currentAdmin.blockedContacts ? this.currentAdmin.blockedContacts : []
      blockedContacts.push(selected_user[0].id)
      this.globals.loading(loading => {
        this.db.collection('blocks').doc(selected_user[0].id).collection('user').doc(this.currentAdmin.id).set(this.appBlockModel).then(res => {

          this.db.collection('admins').doc(this.globals.currentUser.id).update({ ...this.currentAdmin, blockedContacts: blockedContacts }).then(res => {
            this.updateModal.hide()
            this.form.reset()
          })
          this.blockModal.hide()
          this.blockForm.reset()
          this.globals.showToast('تم حظر المستخدم بنجاح', '', NotificationTypes.Success)
          loading.hide()
        }).catch(err => {
          this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
          loading.hide()
        })
      })
    }
  }
  filterData = (dates = null) => {
    this.dataFiltered = JSON.parse(JSON.stringify(this.data))
    console.log(this.dataFiltered);

    if (this.filter != '')

      this.dataFiltered = this.dataFiltered.filter(d => {
        let dataString = JSON.stringify(d).toLowerCase()
        return dataString.indexOf(this.filter.toLowerCase()) > -1
      })

    this.dataFiltered = this.dataFiltered.sort((a, b) => {
      let _a = new Date(a.created_at).getTime(), _b = new Date(b.created_at).getTime()
      return this.sort == 1 ? (_b - _a) : (_a - _b)
    })
    this.dataFiltered = JSON.parse(JSON.stringify(this.dataFiltered))
  }
}
