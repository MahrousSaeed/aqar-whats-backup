import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { NotUserGuard } from './services/guards/not-user/not-user-guard.service';
import { UserGuard } from './services/guards/user/user-guard.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IsAdminGuard } from './services/guards/is-admin/is-admin.guard';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { UsersComponent } from './pages/users/users.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { IsSystemAdminGuard } from './services/guards/is-system-admin/is-system-admin.guard';
import { AqaratComponent } from './pages/aqarat/aqarat.component';
import { AdminsComponent } from './pages/admins/admins.component';
import {ReportsComponent} from './pages/reports/reports.component'
export const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{
		path: '',
		component: BlankLayoutComponent,
		children: [
			{
				path: 'login',
				component: LoginComponent,
				canActivate: [NotUserGuard]
			},
			{
				path: 'newpassword',
				component: NewPasswordComponent,
				canActivate: [NotUserGuard]
			}
		]
	},
	{
		path: 'dash',
		component: MainLayoutComponent,
		children: [
			{
				path: 'dashboard',
				data: { inMenu: false, roles: [] },
				component: DashboardComponent,
				canActivate: [UserGuard]
			},
			{
				path: 'users',
				data: { title: 'المستخدمين', icon: 'icon ion-md-people',roles: [] },
				component: UsersComponent,
				canActivate: [UserGuard]
			},
			{
				path: 'aqarat',
				data: { title: 'الاعلانات', icon: 'icon ion-md-people',roles: [] },
				component: AqaratComponent,
				canActivate: [UserGuard]
			},
			{ 
				path: 'chat',
				data: { title: 'المحادثات', icon: 'icon ion-md-people',roles: [] },
				component: ChatsComponent,
				canActivate: [UserGuard]

			},
			{
				path: 'orders',
				data: { title: 'طلبات عقاريه', icon: 'icon ion-md-people',roles: [] },
				component: OrdersComponent,
				canActivate: [UserGuard]
			},
			{
				path: 'admins',
				data: { title: 'المديرين', icon: 'icon ion-md-people',roles: [] },
				component: AdminsComponent,
				canActivate: [UserGuard]
			},
			{
				path: 'reports',
				data: { title: 'التقارير', icon: 'icon ion-md-people',roles: [] },
				component: ReportsComponent,
				canActivate: [UserGuard]
			},
			
	
			
			// {
			// 	path: '',
			// 	data: { title: 'المصروفات',icon: 'icon ion-md-cash',roles: ['company_admin','employee'] },
			// 	children: [
					
			// 		{
			// 			path: 'expenses',
			// 			data: { title: 'مصروفات الشركة', roles: ['company_admin','employee'] },
			// 			component: ExpensesComponent,
			// 			canActivate: [IsAdminGuard]
			// 		},
			// 		{
			// 			path: 'property expenses',
			// 			data: { title: 'مصروفات العقارات',roles: ['company_admin','employee'] },
			// 			component: PropertyExpensesComponent,
			// 			canActivate: [IsAdminGuard]
			// 		},
			// 	]
			// },


		]
	},
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
