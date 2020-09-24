import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals, NotificationTypes } from '../../services/globals';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
// import firebase from 'firebase'
// require('firebase/auth')
import * as firebase from 'firebase/app';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
// import { AngularFireDatabase } from '@angular/fire/database';

import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  @ViewChild('form', { static: true }) form: NgForm;
  @ViewChild('deleteModal', { static: true }) deleteModal: ModalDirective
  data: any = [];
  dataFiltered: any = [];
  filter: string = '';
  sort: number = 1
  addModel = {
    blockedContacts: [],
    name: null,
    email: null,
    password: null,
    id: null
  }
  editId = null;
  deleteId = null;

  constructor(private db: AngularFirestore, private _auth: AuthService, public firebaseAuth: AngularFireAuth, public global: Globals) {
  }

  ngOnInit() {
    this.global.loading(loading => {
      this.db.collection('admins').valueChanges().subscribe(res => {
        console.log('res', res);
        this.data = res
        this.dataFiltered = res
        loading.hide()
      }, () => {
        loading.hide()
      })

    })
  }

  edit = (id) => {
    this.global.loading(loading => {
      this.editId = id
      this.db.collection('admins').doc(this.editId).valueChanges().subscribe((res: any) => {
        console.log(res);
        this.addModel = {
          blockedContacts: res.blockedContacts,
          name: res.name,
          email: res.email,
          password: res.password,
          id: res.id
        }
        document.body.scrollTop = 0

        loading.hide()
      }, () => {
        loading.hide()
        this.global.showToast('حدث خطأ ما, يرجى المحاولة مرة أخرى!', '', NotificationTypes.Error)
      })
    })
  }

  delete = () => {

    //  this.firebaseAuth.
    console.log(this.deleteId);
    let selectedAdmin = this.dataFiltered.filter(i => i.id == this.deleteId)[0]

    this.global.loading(loading => {
      this.db.collection('admins').doc(this.deleteId).delete().then(() => {

        // must delete it in auth users
        firebase.auth().signInWithEmailAndPassword(selectedAdmin.email, selectedAdmin.password)
          .then(function (info) {
            var user = firebase.auth().currentUser;
            user.delete();
          });

        this.deleteId = null
        this.deleteModal.hide()
        this.ngOnInit()

        this.global.showToast('تم الحذف بنجاح!', '', NotificationTypes.Success)
        loading.hide()
      }, () => {
        loading.hide()
        this.global.showToast('حدث خطأ ما, يرجى المحاولة مرة أخرى!', '', NotificationTypes.Error)
      })
    })
  }

  submitForm = () => {
    if (this.editId) {
      this.db.collection('admins').doc(this.editId).valueChanges().subscribe((res: any) => {
        console.log(res);
        let data = this.addModel
        let that = this
        firebase.auth().signInWithEmailAndPassword(res.email, res.password)
          .then(function (info) {
            firebase.auth().currentUser.updatePassword(data.password).then(() => {
              that.global.loading(loading => {
                that.db.collection('admins').doc(that.editId).update(that.addModel).then(() => {
                  that.form.reset()
                  // that.addModel = {

                  // }
                  // that.ngOnInit()
                  loading.hide()
                  that.global.showToast('تم التعديل بنجاح!', '', NotificationTypes.Success)
                }, () => {
                  loading.hide()
                  that.global.showToast('حدث خطأ ما, يرجى المحاولة مرة أخرى!', '', NotificationTypes.Error)
                })
              })
            })

          })

      })
    }
    else {


      this.global.loading(loading => {
        this.firebaseAuth
          .auth
          .createUserWithEmailAndPassword(this.addModel.email, this.addModel.password).then(s => {
            console.log('register');
            this.addModel.id = s.user.uid

            this.db.collection('admins').doc(s.user.uid).set(this.addModel).then(res => {
              loading.hide()

              this.global.showToast('تم الإضافة بنجاح!', '', NotificationTypes.Success)
            })

          }).catch(er => {
            console.log(er);
            loading.hide()
            this.global.showToast('حدث خطأ ما, يرجى المحاولة مرة أخرى!', '', NotificationTypes.Error)
          })
      })
    }
  }

  cancel = () => {
    this.form.reset()
  }

  filterData = () => {
    this.dataFiltered = JSON.parse(JSON.stringify(this.data))

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
