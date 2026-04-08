import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'https://importstyle-production.up.railway.app/zapatos';

  constructor(private http: HttpClient) {}

  private headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  login(email: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    return this.http.post(`${this.base}/login`, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).pipe(
      catchError(err => throwError(() => err))
    );
  }

  registro(data: any): Observable<any> {
    return this.http.post(`${this.base}/registro`, data);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/usuarios`, this.headers());
  }

  getProductos(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/prod_all`, this.headers()); }
  getProducto(id: number): Observable<any> { return this.http.get(`${this.base}/prod/${id}`, this.headers()); }
  addProducto(p: any): Observable<any> { return this.http.post(`${this.base}/prod_add`, p, this.headers()); }
  updateProducto(id: number, p: any): Observable<any> { return this.http.put(`${this.base}/prod_update/${id}`, p, this.headers()); }
  deleteProducto(id: number): Observable<any> { return this.http.delete(`${this.base}/prod_borrar/${id}`, this.headers()); }

  getProveedores(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/prov_all`, this.headers()); }
  addProveedor(p: any): Observable<any> { return this.http.post(`${this.base}/prov_add`, p, this.headers()); }
  updateProveedor(id: number, p: any): Observable<any> { return this.http.put(`${this.base}/prov_update/${id}`, p, this.headers()); }
  deleteProveedor(id: number): Observable<any> { return this.http.delete(`${this.base}/prov_borrar/${id}`, this.headers()); }

  getClientes(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/cli_all`, this.headers()); }
  addCliente(c: any): Observable<any> { return this.http.post(`${this.base}/cli_add`, c, this.headers()); }
  updateCliente(id: number, c: any): Observable<any> { return this.http.put(`${this.base}/cli_update/${id}`, c, this.headers()); }
  deleteCliente(id: number): Observable<any> { return this.http.delete(`${this.base}/cli_borrar/${id}`, this.headers()); }

  getPedidos(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/ped_all`, this.headers()); }
  addPedido(p: any): Observable<any> { return this.http.post(`${this.base}/ped_add`, p, this.headers()); }
  updatePedido(id: number, p: any): Observable<any> { return this.http.put(`${this.base}/ped_update/${id}`, p, this.headers()); }
  deletePedido(id: number): Observable<any> { return this.http.delete(`${this.base}/ped_borrar/${id}`, this.headers()); }
}