import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Item} from "../model/item.model";

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }


  public getAllItems(page: number, size: number, sort: string, filters?: string): Observable<Item[]> {
    let urlEndPoint: string = `http://localhost:8080/store/items?page=${page}&size=${size}&sort=${sort}`;
    if (filters) {
      urlEndPoint += `&filter=${filters}`;
    }
    return this.http.get<Item[]>(urlEndPoint);
  }

  public deleteItem(itemToDelete: number): Observable<any> {
    const urlEndPoint: string = `http://localhost:8080/store/items/${itemToDelete}`
    return this.http.delete<any>(urlEndPoint);
  }

  public getItemById(itemId: number): Observable<Item> {
    const urlEndPoint: string = `http://localhost:8080/store/items/${itemId}`
    return this.http.get<Item>(urlEndPoint);
  }
}
