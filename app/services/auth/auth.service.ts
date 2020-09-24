import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Globals, LoginUser } from '../globals';

@Injectable({
	providedIn: 'root'
})
export class AuthService {



	get windowRef(){
		return window
	}
	private apiURL: string = environment.apiURL

	constructor(private http: HttpClient, private globals: Globals) { }

	public login = (email: string, password: string) =>
		this.http.post(`${this.apiURL}auth/login`, { email, password }, { observe: 'response' }).toPromise()




	public loginUser = (userData: LoginUser) => {
		this.globals.currentUser = userData
		this.globals.secureStorage.setItem('loged_user', userData)
	}
	public logoutUser = () => {
		this.globals.currentUser = null
		this.globals.secureStorage.removeItem('loged_user')
	}
}
