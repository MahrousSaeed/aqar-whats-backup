import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule, routes } from './app-routing.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ExportAsModule } from 'ngx-export-as';
import { AppComponent } from './app.component'
import { NgxSpinnerModule } from 'ngx-spinner'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { Interceptor } from './services/interceptor'
import { NavbarComponent } from './components/navbar/navbar.component'
import { PopoverModule } from 'ngx-bootstrap/popover';

import { SidebarComponent } from './components/sidebar/sidebar.component'
import { FooterComponent } from './components/footer/footer.component'
import { ToastrModule } from 'ngx-toastr'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule, TooltipModule, BsDatepickerModule,BsLocaleService, defineLocale, arLocale, BsDropdownModule, TabsModule, AccordionModule } from 'ngx-bootstrap';
import { SelectComponent } from './components/select/select.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotUserGuard } from './services/guards/not-user/not-user-guard.service';
import { UserGuard } from './services/guards/user/user-guard.service';
import { InputDebounceComponent } from './components/input-debounce/input-debounce.component';
import { InlineSpinnerComponent } from './components/inline-spinner/inline-spinner.component';
import { NgxPaginateModule } from 'ngx-paginate';
import { MomentModule } from 'ngx-moment';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FileSaverModule } from 'ngx-filesaver';
import { CalendarModule, DateAdapter, CalendarDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalenderComponent } from './components/calender/calender.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common'
import {CustomDateFormatter} from '../app/components/calender/custom_calendar'
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { RegisterComponent } from './pages/register/register.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { AqaratComponent } from './pages/aqarat/aqarat.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import {
	AngularFireStorageModule,
	AngularFireStorageReference,
	AngularFireUploadTask,
	StorageBucket
  } from "@angular/fire/storage";
  import { AgmCoreModule } from '@agm/core';
import { AdminsComponent } from './pages/admins/admins.component';
import { ReportsComponent } from './pages/reports/reports.component';

defineLocale('ar', arLocale)

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		SidebarComponent,
		FooterComponent,
		SelectComponent,
		LoginComponent,
		MainLayoutComponent,
		BlankLayoutComponent,
		InputDebounceComponent,
		InlineSpinnerComponent,
		NewPasswordComponent,
		CalenderComponent,
		RegisterComponent,
		DashboardComponent,
		UsersComponent,
		OrdersComponent,
		ChatsComponent,
		AqaratComponent,
		AdminsComponent,
		ReportsComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		RouterModule.forRoot(routes, { useHash: true }),
		AppRoutingModule,
		FormsModule,
		ExportAsModule,
		HttpClientModule,
		AngularFireStorageModule,
		NgbModule,
		NgxSpinnerModule,
		ToastrModule.forRoot(),
		PopoverModule.forRoot(),
		NgxDatatableModule,
		AngularMultiSelectModule,
		FileSaverModule,
		ReactiveFormsModule,
		NgMultiSelectDropDownModule.forRoot(),
		ModalModule.forRoot(),
		TooltipModule.forRoot(),
		AngularFireAuthModule,
		BsDatepickerModule.forRoot(),
		BsDropdownModule.forRoot(),
		MomentModule,
		CommonModule,
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),

		NgxPaginateModule,
		TabsModule.forRoot(),
		FlatpickrModule.forRoot(),
		MatSelectModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyCiWanvaVrSCLYaZ-HTGDiyQjguZzSRtzA',
			libraries: ['places']
		  }),
		NgxMaterialTimepickerModule,
		TimepickerModule.forRoot(),
		// SocketIoModule.forRoot(config),
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		AccordionModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAnalyticsModule,
		AngularFirestoreModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
		UserGuard,
		NotUserGuard,
		BsLocaleService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }