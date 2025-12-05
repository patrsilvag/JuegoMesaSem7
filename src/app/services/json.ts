import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Json {
  constructor(private http: HttpClient) {}
  getCambioDolar(): Observable<any> {
    return this.http.get<any>('https://api.exchangerate-api.com/v4/latest/USD');
  }
  getVentas(): Observable<any[]> {
    return this.http.get<any[]>('https://patrsilvag.github.io/api-ventas/ventas.json');
  }
}



