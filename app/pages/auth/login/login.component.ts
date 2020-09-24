import { Component, OnInit } from '@angular/core';
import { Globals, NotificationTypes, Events } from 'src/app/services/globals';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
// import firebase from 'firebase'
// require('firebase/auth')
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	providers: []
})
export class LoginComponent implements OnInit {
	admins = []
	email = ''
	password:string = ''
	emailField: boolean = false
	username
	loginError = false
	registerFlag: boolean = false
	constructor(private db: AngularFirestore, private _auth: AuthService, public firebaseAuth: AngularFireAuth, private globals: Globals, private router: Router) {
	}

	ngOnInit() {
		this.globals.loading(loading => {
			this.db.collection('admins').valueChanges().subscribe(res => {
				console.log('res', res);
				this.admins = res
				loading.hide()
			}, () => {
				loading.hide()
			})

		})
	}
	signup() {
		console.log(this.email);
		console.log(this.password);
		let signupModel = {
			name:this.username,
			id:'',
			email:'',
			password:this.password,
			blockedContacts:[]
		}
		this.globals.loading(loading => {
		this.firebaseAuth
			.auth
			.createUserWithEmailAndPassword(this.email,this.password)
			.then(value => {
				console.log('value',value);
				
					signupModel.id = value.user.uid
					signupModel.email = value.user.email
					this.db.collection('admins').doc(value.user.uid).set(signupModel).then(res => {
						this.registerFlag = false
						this.email = null
						this.password = null
					})
				this.globals.showToast('تم التسجيل بنجاح', '', NotificationTypes.Success)
			})
			.catch(err => {
				console.log(err);
				
				this.globals.showToast('حدث خطا برجاله اعادة المحاولة', '', NotificationTypes.Error)
			});
		})
	}

	login() {
		this.globals.loading(loading => {
			this.firebaseAuth
			.auth
			.signInWithEmailAndPassword(this.email, this.password)
			.then(value => {
				console.log('logggg',value);
				let user = this.admins.filter(res => res.id == value.user.uid )[0]
				console.log('Nice, it worked!',user);
				this._auth.loginUser({
					id:value.user.uid,
					email:value.user.email,
					name:user.name,
					password:user.password
				})
				this.registerFlag = false
				console.log(value);
				this.router.navigate(['/dash/dashboard'])
				loading.hide()
			})
			.catch(err => {
				loading.hide()
				this.globals.showToast('حدث خطا برجاله اعادة المحاولة', '', NotificationTypes.Error)
			});
		})
	}
}
