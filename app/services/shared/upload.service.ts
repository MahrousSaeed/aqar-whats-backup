import { Injectable } from '@angular/core';
import * as firebase from 'firebase'

import {Upload} from './upload'
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath: string = '/uploads'
  private uploadTask: firebase.storage.UploadTask
  constructor() { }
}
