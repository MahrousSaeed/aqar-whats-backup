import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals, NotificationTypes, Events } from 'src/app/services/globals';
import { ApiService, RequestTypes } from 'src/app/services/api/api.service';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { log } from 'util';
import * as firebase from 'firebase/app';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
declare var moment: any
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	@ViewChild(NgForm, { static: true }) form: NgForm
	@ViewChild('packageModal', { static: true }) packageModal: ModalDirective

	currentDate = new Date()
	dashboard = null
	package_id = null
	properties = []
	threads = []
	orders = []
	users = []

	packages = []
	package_type

	constructor(private db: AngularFirestore, private _auth: AuthService, public firebaseAuth: AngularFireAuth, public globals: Globals) {
		// api.init(api.endPoints.reservations)
		this.db.collection('properties').valueChanges().subscribe(res => {
			this.properties = res
		})
		this.db.collection('orders').valueChanges().subscribe(res => {
			this.orders = res
		})
		this.db.collection('users').valueChanges().subscribe(res => {
			this.users = res
		})
		this.db.collection('threads').valueChanges().subscribe(res => {
			this.threads = res
		})
	}

	ngOnInit() {
		console.log('his.globals.currentUser', this.globals.currentUser);
	

	}


}
