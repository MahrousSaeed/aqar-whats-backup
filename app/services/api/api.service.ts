import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { throwError, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private apiURL: string = environment.apiURL
	private endPoint: string
	private authHeader: HttpHeaders

	public readonly endPoints = {

		roles: 'admin/roles/',
		users:'company/users/',

		property_types: 'admin/property_types/',
		expenseTypes: 'admin/expense/',
		reports: 'admin/reports/',
		forgetPassword:'auth/forgot_password',
		resetPassword:'auth/reset_password',
		updateProfile:'profile',
		verifyToken:'admin/auth/verify-token',
		offlineData:'reception/offline',

		properties:'company/properties/',
		unit_types:'admin/unit_types/',
		requests:'company/property_request/',
		units:'company/property_units/',
		contacts:'company/contacts/',
		features:'admin/features/',
		expenses_types:'admin/expenses_types/',
		company_expenses:'company/company_expenses/',
		property_expenses: 'company/property_expenses/',
		announcements:"company/announcements/",
		financial_bonds:"company/financial_bonds/",
		financial_bonds_types:"admin/financial_bonds_types/",
		contracts:"company/contracts/",
		packages:'admin/packages/',
		companies:'admin/companies/',
		employees:'company_admin/employees/',
		countries:'countries/',
		select_package:'company_admin/company_packages/'

	}

	constructor(private http: HttpClient, private globals: Globals) { }

	public init = (endPoint: string = '') => {
		this.endPoint = endPoint
	}


	// private checkEndpoint = (endPoint, checkEndPoint, id = null) =>
		// (endPoint == checkEndPoint) || (endPoint == `${checkEndPoint}${id ? id : ''}`) || endPoint.startsWith(`${checkEndPoint}${this.globals.currentUser ? this.globals.currentUser.branch : ''}`)
}

export enum RequestTypes {
	POST, GET, PUT, DELETE, PATCH
}