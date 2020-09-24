import { Component } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BsLocaleService } from 'ngx-bootstrap';
import { Globals, Events, NotificationTypes } from './services/globals';
import { ApiService, RequestTypes } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';
import io from 'socket.io-client';
import { environment } from '../environments/environment';
import { SwUpdate } from '@angular/service-worker';
import Swal from 'sweetalert2'

declare var moment: any
import PouchDB from 'pouchdb';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'عقار واتس'
	titles = {  
		'login': 'تسجيل الدخول',
		'dashboard': 'الرئيسية',
		'orders':'طلبات عقارية',
		'chat':'محادثات',
		'aqarat':'اعلانات',
		'users':'المستخدمين',
		'admins':'المديرين',

	}

	constructor(private router: Router,
		title: Title,
		_bsLocaleService: BsLocaleService,
		private globals: Globals,
		private api: ApiService,
		auth: AuthService, 
		private swUpdate: SwUpdate) {

		

		router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				window.scrollTo(0, 0)
				let pageTitle = this.titles[router.url.replace('/dash/', '').replace('/', '')]
				title.setTitle(`${this.title} | ${pageTitle}`)
			}
		})

	}

	ngOnInit() {
		console.log('login user',this.globals.currentUser);
		
		
	}

	
}
