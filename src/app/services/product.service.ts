import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { PageableResponse, PageRequest } from '../models/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> { return this.http.get<Product[]>(this.apiUrl); }

  getAllPaginated(pageRequest: PageRequest): Observable<PageableResponse<Product>> {
    let params = new HttpParams()
      .set('_page', (pageRequest.page + 1).toString()) // json-server uses 1-based indexing
      .set('_limit', pageRequest.size.toString());

    return this.http.get<Product[]>(this.apiUrl, { params, observe: 'response' })
      .pipe(
        // Transform json-server response to our PageableResponse format
        map(response => {
          const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
          const content: Product[] = response.body || [];
          const pageSize = pageRequest.size;
          const currentPage = pageRequest.page;

          return {
            content,
            totalElements: totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            size: pageSize,
            number: currentPage,
            first: currentPage === 0,
            last: currentPage >= Math.ceil(totalCount / pageSize) - 1,
            numberOfElements: content.length,
            empty: content.length === 0
          };
        })
      );
  }

  getById(id: number): Observable<Product> {
    console.log('ProductService.getById called with id:', id, 'type:', typeof id);
    const url = `${this.apiUrl}/${id}`;
    console.log('Requesting URL:', url);
    return this.http.get<Product>(url);
  }
  create(p: Product): Observable<Product> { return this.http.post<Product>(this.apiUrl, p); }
  update(id: number, p: Product): Observable<Product> { return this.http.put<Product>(`${this.apiUrl}/${id}`, p); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}