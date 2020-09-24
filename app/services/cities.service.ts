import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Globals } from 'globals';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
	private authHeader: HttpHeaders = null
  token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZjQ3OGE5NGM2ZDljMjQ5Mjg5ZTMyZDMiLCJpYXQiOjE1OTg1MzAxNTAsImV4cCI6MzMxMjM4OTkxNzB9.21NFmqox9x0-jRKVlDDiKT8prF2JWpfqeJQA5AVQJ3o'
  constructor(private http: HttpClient) {
    this.authHeader = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })

   }
  getCities = () => {
    return this.http.patch('https://api.aqarwhats.com:20202/v1/city/all',null,{headers:this.authHeader})
  }
  getCityTowns = (city_id) => {
    return this.http.get(`https://api.aqarwhats.com:20202/v1/city/${city_id}`,{headers:this.authHeader})
  }
}
