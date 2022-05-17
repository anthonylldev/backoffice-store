import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../model/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  public getAllCategories(): Observable<Category[]> {
    const urlEndPoint: string = "http://localhost:8080/store/categories";
    return this.http.get<Category[]>(urlEndPoint);
  }

}
