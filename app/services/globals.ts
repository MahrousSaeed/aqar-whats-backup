import { Injectable, EventEmitter } from "@angular/core"
import * as CryptoJS from 'crypto-js'
import * as SecureStorage from 'secure-web-storage'
import { NgxSpinnerService } from "ngx-spinner"
import { ToastrService } from "ngx-toastr"
import { PaginateOptions } from "ngx-paginate";
import { Subject } from "rxjs";

export interface LoginUser {
    id: string
    email:string
    name:string
    password:string
}

@Injectable({
    providedIn: 'root'
})
export class Globals {
    public currentUser: LoginUser = null
    length: any
    userMail = ''
    public today = new Date()
    public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    isOnline = navigator.onLine
    uploadingOfflineData = false
    doctor_events = new Subject()
    global_rate_status
    editBranch = new Subject()
    socket = null
    public cities = [
        "عفيف",
        "عرعر",
        "أبها",
        "أبقيق",
        "العبوة",
        "الأرطاوية",
        "مدينة بدر",
        "بلجرشي",
        "بيشة",
        "بريدة",
        "الباحة",
        "بقعة",
        "الدمام",
        "الظهران",
        "ضرما",
        "دهبان",
        "الدرعية",
        "ضبا",
        "دومة الجندل",
        "درة العروس",
        "الدوادمي",
        "مدينة فرسان",
        "جرحاء",
        "القريات",
        "القويعية",
        "الحبلة",
        "الحجرة",
        "حقل",
        "الحريق",
        "حرمة",
        "حائل",
        "حوطة بني تميم",
        "الهفوف",
        "حفر الباطن",
        "جبل أم الرؤوس",
        "جلاجل",
        "الجوف",
        "جدة",
        "جيزان",
        "مدينة جيزان الاقتصادية",
        "الجبيل",
        "الجفر",
        "الخفجي",
        "الخبر",
        "مدينة الملك عبد الله الاقتصادية",
        "خميس مشيط",
        "الخرج",
        "مدينة المعلومات الأقتصادية بالمدينة",
        "الخبر",
        "الخط",
        "ليلى",
        "لحيان",
        "الليث",
        "المجمعة",
        "مستورة",
        "المبرز",
        "مكة",
        "المدينة",
        "المزاحمية",
        "نجران",
        "النماص",
        "أملج",
        "العمران",
        "العيون",
        "القضيمة",
        "القطيف",
        "القيصومة",
        "القنفذة",
        "الرياض",
        "رفحة",
        "الرأس",
        "رأس التنورة",
        "الرياض",
        "الرميلة",
        "سبت العلايا",
        "سيهات",
        "صفوى",
        "سكاكا",
        "شرورة",
        "شقرا",
        "شيبة",
        "السليل",
        "الطائف",
        "تبوك",
        "تنومة",
        "تاروت",
        "تيماء",
        "ثادق",
        "ثول",
        "الثقبة",
        "طريف",
        "العضيلية",
        "العلا",
        "أم الساحق",
        "عنيزة",
        "العقير",
        "عيينة",
        "وادي الدواسر",
        "الوجه",
        "ينبع",
        "الزيمة",
        "زلفي"
    ]
    constructor(private toastr: ToastrService, public spinnerService: NgxSpinnerService) {
        this.currentUser = this.secureStorage.getItem('loged_user')
    }

    loading = (callback: Function) => {
        this.spinnerService.show()
        callback(this.spinnerService)
    }

    showToast = (msg: string, title: string, type: NotificationTypes) => {
        if (type == NotificationTypes.Error)
            this.toastr.error(msg, title, { positionClass: 'toast-bottom-right', titleClass: 'toastr-custom' })
        else if (type == NotificationTypes.Info)
            this.toastr.info(msg, title, { positionClass: 'toast-bottom-right', titleClass: 'toastr-custom' })
        else if (type == NotificationTypes.Success)
            this.toastr.success(msg, title, { positionClass: 'toast-bottom-right', titleClass: 'toastr-custom' })
        else if (type == NotificationTypes.Warning)
            this.toastr.warning(msg, title, { positionClass: 'toast-bottom-right', titleClass: 'toastr-custom' })
    }

    public omit = (obj, omitKey) =>
        Object.keys(obj).reduce((result, key) => {
            if (key !== omitKey)
                result[key] = obj[key]
            return result
        }, {})

    public isArabic = (text) => /[\u0600-\u06FF]/.test(text)

    groupBy = (xs, key) => {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x)
            return rv
        }, {})
    }

    preventNegative = (e) => {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8
            || e.keyCode == 110)) {
            return false;
        }
    }

    formatNumber = (number) => Intl.NumberFormat().format(number)

    secureStorage = new SecureStorage(localStorage, {
        hash: function hash(key) {
            key = CryptoJS.SHA256(key, 'ubtXFG468b');

            return key.toString();
        },
        encrypt: function encrypt(data) {
            data = CryptoJS.AES.encrypt(data, 'ubtXFG468b');

            data = data.toString();

            return data;
        },
        decrypt: function decrypt(data) {
            data = CryptoJS.AES.decrypt(data, 'ubtXFG468b');

            data = data.toString(CryptoJS.enc.Utf8);

            return data;
        }
    })

    options: PaginateOptions = {
        spanPages: 2,
        titles: {
            firstPage: "الأولى",
            lastPage: "الأخيرة",
            previousPage: "السابقة",
            nextPage: "التالية",
        },
        pageSizes: []
    }

    getRowClass = (row) => {
        if (isNaN(row.offlineID) && isNaN(row.offlinePatientID))
            return {}
        else {
            return {
                'offline-data': true
            }
        }
    }
}

export module Events {
    export let events$ = {}

    export function subscribe(eventName: string, onSuccess: Function, onError: Function = null): string {
        if (!events$[eventName])
            events$[eventName] = new EventEmitter<any>();
        (<EventEmitter<any>>events$[eventName]).subscribe(onSuccess, onError)

        return eventName
    }

    export function publish(eventName: string, data: any = {}): string {
        if (!events$[eventName])
            events$[eventName] = new EventEmitter<any>();
        (<EventEmitter<any>>events$[eventName]).emit(data)

        return eventName
    }
}

export enum NotificationTypes {
    Success, Error, Warning, Info
}