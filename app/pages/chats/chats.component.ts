import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Globals, NotificationTypes } from 'src/app/services/globals';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';
declare var moment: any
@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {
  @ViewChild('chatModal', { static: true }) chatModal: ModalDirective
  @ViewChild('deleteModal', { static: true }) deleteModal: ModalDirective
  @ViewChild('usersModal', { static: true }) usersModal: ModalDirective
  @ViewChild('blockModal', { static: true }) blockModal: ModalDirective
  @ViewChild('blockForm', { static: true }) blockForm: NgForm
  dataFiltered: any[]
  group_users: any[] = []
  data: any[]
  messages: any[]
  message_uId
  deleteId
  blocked_userId
  currentDate = new Date()

  appBlockModel = {
    blocked_user_id: null,
    end_at: null,
    from_user_id: this.globals.currentUser.id,
    start_at: null,
    thread_id: null,
    type: 'thread',
  }
  sort: number = 1
  filter: string = ''
  constructor(private db: AngularFirestore, private globals: Globals) { }

  ngOnInit() {
    this.globals.loading(loading => {
      this.db.collection('threads').valueChanges().subscribe(res => {
        this.data = res
        this.dataFiltered = res
        loading.hide()
      }, () => {
        loading.hide()
      })
    })

    // Firestore.instance
    //     .collection('messages')
    //     .document(threadId)
    //     .collection(threadId)
    //     .orderBy('createdAt', descending: true);
  }
  delete = () => {
    this.globals.loading(loading => {
      this.db.collection('threads').doc(this.deleteId).delete().then(res => {
        this.deleteModal.hide()
        this.globals.showToast('تم الحذف بنجاح', '', NotificationTypes.Success)
        loading.hide()
      }).catch(err => {
        this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
        loading.hide()
      })
    })

  }
  block = () => {
    // let selected_user = this.dataFiltered.filter(i => i.id === this.blocked_userId)

    this.appBlockModel.blocked_user_id = this.blocked_userId
    this.appBlockModel.start_at = moment(this.appBlockModel.start_at).format("x")
    this.appBlockModel.end_at = moment(this.appBlockModel.end_at).format("x")

    // blockedContacts
    let currenthread = this.dataFiltered.filter(i => i.id === this.appBlockModel.thread_id)
    let blockedContacts = currenthread[0].blockedContacts ? currenthread[0].blockedContacts : []
    blockedContacts.push(this.appBlockModel.blocked_user_id)

    this.globals.loading(loading => {
      this.db.collection('blocks').doc(this.blocked_userId).collection('thread').doc(currenthread[0].id).set(this.appBlockModel).then(res => {
        this.db.collection('threads').doc(this.appBlockModel.thread_id).update({ ...currenthread[0], blockedContacts: blockedContacts }).then(res => {

        })
        this.blockModal.hide()
        this.usersModal.hide()
        this.blockForm.reset()
        this.globals.showToast('تم حظر المستخدم بنجاح', '', NotificationTypes.Success)
        loading.hide()
      }).catch(err => {
        this.globals.showToast('حدث خطأ برجاء المحاولةمره اخري', '', NotificationTypes.Error)
        loading.hide()
      })
    })

  }
  cancelUserBlock = (user) => {

    let currenthread = this.dataFiltered.filter(i => i.id === this.appBlockModel.thread_id)
    let blockedContacts = currenthread[0].blockedContacts ? currenthread[0].blockedContacts : []

    blockedContacts.splice(blockedContacts.indexOf(user.id), 1)
    this.globals.loading(loading => {
      this.db.collection('blocks').doc(user.id).collection('thread').doc(currenthread[0].id).delete().then(res => {
        this.db.collection('threads').doc(currenthread[0].id).update({ ...currenthread[0], blockedContacts: blockedContacts }).then(res => {
          this.usersModal.hide()
          // this.form.reset()
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
  showUsers = (thread) => {
    this.appBlockModel.thread_id = thread.id
    this.group_users = []
    let usersIds: any[] = thread.usersIds
    let group_userdd: any[] = []
    let currenthread = this.dataFiltered.filter(i => i.id === this.appBlockModel.thread_id)

    let blockedContacts = currenthread[0].blockedContacts ? currenthread[0].blockedContacts : []

    this.globals.loading(loading => {
      this.db.collection('users').valueChanges().subscribe(res => {
        let allUsers: any[] = res

        allUsers.forEach(element => {
          usersIds.forEach(i => {
            if (element.id == i) {
              this.group_users.push(element)
            }
          });
        });
        this.group_users = this.group_users.map(i => {
          return { ...i, blocked: blockedContacts.includes(i.id) ? true : false }
        })
        this.usersModal.show()

        loading.hide()

      }, () => {
        loading.hide()
      })
    })
    // usersModal
    // group_users

  }
  showMessages = (item) => {
    console.log(item);

    this.message_uId = item.usersIds[0]
    this.globals.loading(loading => {
      this.db.collection('messages')
        .doc(item.id)
        .collection(item.id).valueChanges().subscribe(res => {
          this.messages = res.sort((a, b) => {
            let _a = new Date(a.createdAt).getTime(), _b = new Date(b.createdAt).getTime()
            return (_a - _b)
          })
          console.log(this.messages);

          this.chatModal.show()
          loading.hide()
        })
    })
  }
  filterData = (dates = null) => {
    console.log('this.data', this.data);

    this.dataFiltered = this.data
    if (this.filter != '')
      this.dataFiltered = this.dataFiltered.filter(d => {
        let dataString = this.objToString(d).toLowerCase()
        return dataString.indexOf(this.filter.toLowerCase()) > -1
      })

    this.dataFiltered = this.dataFiltered.sort((a, b) => {
      let _a = a.lastMessageTime, _b = b.lastMessageTime
      return this.sort == 1 ? (_b - _a) : (_a - _b)
    })


    this.dataFiltered = this.dataFiltered
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
}
