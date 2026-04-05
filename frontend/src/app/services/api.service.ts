import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://127.0.0.1:8000/zapatos';

  constructor(private http: HttpClient) {}

  // PRODUCTOS
  getProductos(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/prod_all`); }
  getProducto(id: number): Observable<any> { return this.http.get(`${this.base}/prod/${id}`); }
  addProducto(p: any): Observable<any> { return this.http.post(`${this.base}/prod_add`, p); }
  updateProducto(id: number, p: any): Observable<any> { return this.http.put(`${this.base}/prod_update/${id}`, p); }
  deleteProducto(id: number): Observable<any> { return this.http.delete(`${this.base}/prod_borrar/${id}`); }

  // PROVEEDORES
  getProveedores(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/prov_all`); }
  addProveedor(p: any): Observable<any> { return this.http.post(`${this.base}/prov_add`, p); }
  updateProveedor(id: number, p: any): Observable<any> { return this.http.put(`${this.base}/prov_update/${id}`, p); }
  deleteProveedor(id: number): Observable<any> { return this.http.delete(`${this.base}/prov_borrar/${id}`); }

  // CLIENTES
  getClientes(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/cli_all`); }
  addCliente(c: any): Observable<any> { return this.http.post(`${this.base}/cli_add`, c); }
  updateCliente(id: number, c: any): Observable<any> { return this.http.put(`${this.base}/cli_update/${id}`, c); }
  deleteCliente(id: number): Observable<any> { return this.http.delete(`${this.base}/cli_borrar/${id}`); }

  // PEDIDOS
  getPedidos(): Observable<any[]> { return this.http.get<any[]>(`${this.base}/ped_all`); }
  addPedido(p: any): Observable<any> { return this.http.post(`${this.base}/ped_add`, p); }
  updatePedido(id: number, p: any): Observable<any> { return this.http.put(`${this.base}/ped_update/${id}`, p); }
  deletePedido(id: number): Observable<any> { return this.http.delete(`${this.base}/ped_borrar/${id}`); }
}