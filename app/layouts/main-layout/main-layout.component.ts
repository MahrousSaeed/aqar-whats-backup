import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals, Events, NotificationTypes } from 'src/app/services/globals';
import { ModalDirective } from 'ngx-bootstrap';
import { ApiService, RequestTypes } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { Router, NavigationStart } from '@angular/router';
import { th } from 'date-fns/locale';
declare var moment: any
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-main-layout',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
	@ViewChild('updateProfileform', { static: true }) form: NgForm;

	@ViewChild('updateModal', { static: true }) updateModal: ModalDirective
	currentDate = new Date()
	user = {
		blockedContacts: [],
		id: null,
		name: null,
		email: null,
		password: null,
		password2:null
	}

	profileImageFile: File = null
	profileImageInput: HTMLInputElement = null

	userImage: string = null
	states = []
	admins = []
	countries = []
	showUpdate = true
	currentAppVersion
	latestAppVersion

	uploadingOfflineFailed = false

	constructor(private db: AngularFirestore, private _auth: AuthService, public firebaseAuth: AngularFireAuth, public globals: Globals, private api: ApiService, private auth: AuthService, private router: Router) {

		api.init()
		// this.updateModal.config = { backdrop: 'static', keyboard: false }

		this.getAppVersion()

		router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				this.showUpdate = true
				this.getAppVersion()
			}
		})

		Events.subscribe('new-ver', () => {
			this.showUpdate = true
			this.getAppVersion()
		})
	}

	getAppVersion = () => {
		// if (this.globals.isOnline)
		// 	this.api.request('/assets/config.json', null, RequestTypes.GET, false).then(data => {
		// 		this.latestAppVersion = data.appVersion
		// 	})
	}

	hideBackdrop = () => {
		let backdrop = Array.from(document.querySelectorAll('.modal-backdrop'))

		backdrop.forEach(element => {
			element.classList.add('hideModel')
		})
	}

	ngOnInit() {
		// console.log(this.globals.currentUser);
		this.globals.loading(loading => {
			this.db.collection('admins').valueChanges().subscribe(res => {
				console.log('res', res);
				this.admins = res
	
				let currentAdmin = this.admins.filter(i => i.id == this.globals.currentUser.id)[0]
				if (this.globals.currentUser != null) {
					this.updateModal.config = { backdrop: 'static', keyboard: false }
					this.user = {
						name: this.globals.currentUser.name,
						email: this.globals.currentUser.email,
						password: null,
						id: this.globals.currentUser.id,
						blockedContacts: currentAdmin.blockedContacts,
						password2:null
					}
				}
				loading.hide()
			}, () => {
				loading.hide()
			})

		})

		Events.publish('update:profile')
		Events.subscribe('update:profile', () => {
			console.log('success');
			this.updateModal.show()

		})
	}




	updateProfile = () => {
		let data = this.user
		let that = this
		delete this.user.password2
		if(this.user.password == '' || this.user.password  == null){
			this.user.password = this.globals.currentUser.password
		} else {
			this.user.password = this.user.password 
		}
		firebase.auth().signInWithEmailAndPassword(this.globals.currentUser.email, this.globals.currentUser.password)
			.then(function (info) {
				firebase.auth().currentUser.updatePassword(data.password).then(() => {
					that.globals.loading(loading => {
						that.db.collection('admins').doc(that.globals.currentUser.id).update(that.user).then(() => {

							// that.addModel = {
							that.auth.loginUser({
								email:data.email,
								id:data.id,
								name:data.name,
								password:data.password,
							})
							// this.globals.currentUser.name = 
							that.updateModal.hide()
							// }
							// that.ngOnInit()
							loading.hide()
							that.globals.showToast('تم التعديل بنجاح!', '', NotificationTypes.Success)
						}, () => {
							loading.hide()
							that.globals.showToast('حدث خطأ ما, يرجى المحاولة مرة أخرى!', '', NotificationTypes.Error)
						})
					})
				})

			})


	}

	selectProfileImage = () => {
		this.profileImageInput.click()
	}



	updateApp = () => location.reload(true)

	retryOffline = () => {
		this.uploadingOfflineFailed = false
		Events.publish('retry-offline')
	}

	retryLater = () => {
		this.uploadingOfflineFailed = false
		this.globals.uploadingOfflineData = false
	}

}
