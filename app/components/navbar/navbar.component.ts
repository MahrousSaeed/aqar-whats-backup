import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { Globals, Events, NotificationTypes } from 'src/app/services/globals';
import { AuthService } from 'src/app/services/auth/auth.service';
import { routes } from 'src/app/app-routing.module';
import { ApiService, RequestTypes } from 'src/app/services/api/api.service';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {
	@ViewChild('vacationRequestModel', { static: true }) vacationRequestModel: any
	@ViewChild('vacationRequestForm', { static: true }) vacationRequestForm: NgForm

	currentDate = new Date()
	acceptedVacations: any
	bills: any
	public sidebarOpened = false;
	currentUrl = ''
	vacations_length: any = 0
	notifications: any
	notificationCount: any = 0
	addModel = {
		start_date: null,
		end_date: null,
		note: null
	}
	vacations: any = []

	menuItems = JSON.parse(JSON.stringify(routes[2].children))

	appVer = "1.0"

	toggleOffcanvas() {
		this.sidebarOpened = !this.sidebarOpened;
		if (this.sidebarOpened) {
			document.querySelector('.sidebar-offcanvas').classList.add('active');
		}
		else {
			document.querySelector('.sidebar-offcanvas').classList.remove('active');
		}
	}

	constructor(config: NgbDropdownConfig, private router: Router, public globals: Globals, private auth: AuthService, private api: ApiService) {
		// this.appVer = environment.appVersion
		config.placement = 'bottom-right';
		this.api.init();
	}



	ngOnInit() {
		this.loadMenuItems()
		// console.log('menuItems', this.menuItems);
		// console.log(this.globals.currentUser);

		// this.api.read(null, null, this.api.endPoints.notifications + this.globals.currentUser.branch).then(res => {
		// 	this.notifications = res
		// 	this.notificationCount = 0
		// 	Object.keys(this.notifications).forEach(element => {
		// 		if (element.length > 0)
		// 			this.notificationCount++
		// 	})
		// })
		// this.api.request(this.api.endPoints.unpaid_bills, null, RequestTypes.GET).then(res => {
		// 	this.bills = res.data
		// })
		// Events.subscribe('vacations length', (data) => {
		// 	this.vacations_length = data
		// })

		Events.publish('reservationCount', true)

		this.currentUrl = this.router.url

		this.router.events.subscribe((val) => {
			if (val instanceof NavigationEnd)
				this.currentUrl = val.url
		})

		// this.api.request(this.api.endPoints.vacationRequest, null, RequestTypes.GET).then(res => {
		// 	this.vacations = res.vacations
		// 	this.acceptedVacations = this.vacations.filter(item => {
		// 		return item.status === "accept"
		// 	})
		// })

		Events.subscribe('vacation-request-status', (respones) => {
			this.ngOnInit()

			this.vacations.forEach(item => {
				if (respones.data._id === item._id) {
					item.status_note = respones.data.status_note

					if (respones.data.status === "accept") {
						item.status = "accept"
					}
					if (respones.data.status === "reject") {
						item.status = "reject"
					}
				}
			})
		})

		Events.subscribe('user-updated', () => this.loadMenuItems())
	}
	checkDoctor = () => {
		this.router.navigate(['/dash/dashboard'])
	}
	loadMenuItems = () => {
		this.menuItems = this.menuItems.filter(m => m.data.hide === undefined || m.data.hide == false)
		// this.menuItems = this.menuItems.filter(i => i.data.roles.includes(this.globals.currentUser.role))		 
	}
	// if(i.children){
	// 	i.children.filter(m => m.data.roles.includes(this.globals.currentUser.role))
	// }
	logout = () => {
		// this.globals.loading(loading => {
		// 	this.auth.logout().then(() => {
		// 		this.auth.logoutUser()
		// 		this.router.navigate(['\login'])
		// 		loading.hide()
		// 	}, () => loading.hide())
		// })
		this.auth.logoutUser()
		this.router.navigate(['\login'])
	}

	openUpdateProfile = () => Events.publish('update:profile')
	vacationRequest = () => {
		this.addModel.start_date = this.addModel.start_date
		this.addModel.end_date = this.addModel.end_date


	}
}
