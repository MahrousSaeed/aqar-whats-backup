import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { Globals, NotificationTypes, Events } from '../../services/globals';
import { Router } from '@angular/router';

@Component({
	selector: 'app-new-password',
	templateUrl: './new-password.component.html',
	styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
	addModel = {
		email: this.globals.userMail,
		password: null

	}
	
	test = null
	confirmPassword: null
	constructor(private api: ApiService, private globals: Globals, private router: Router) { }

	ngOnInit() {}

	submitForm = () => {
		let data = {
			password:this.addModel.password,
			_method:"PUT"
		}

	}

	preventSpace = (e) => {
		if (e.keyCode == 32) {
			return false;
		}
	}
}
