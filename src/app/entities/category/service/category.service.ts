import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../model/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public getAllCategories(partialName?: string): Observable<Category[]> {
    let urlEndPoint: string = "http://localhost:8080/store/categories";

    if (partialName) {
      urlEndPoint += `?partialName=${partialName}`;
    }

    return this.http.get<Category[]>(urlEndPoint);
  }

}
