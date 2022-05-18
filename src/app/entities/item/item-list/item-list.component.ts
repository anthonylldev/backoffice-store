import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ItemService} from "../service/item.service";
import {Item} from "../model/item.model";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  categoryId?: number;
  title: string = "";
  items: Item[] = []

  page: number = 0;
  size: number = 1;
  sort: string = "name,asc";

  first: boolean = false;
  last: boolean = false;
  totalPages: number = 0;
  totalElements: number = 0;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get("categoryId")) {
      this.categoryId = +this.route.snapshot.paramMap.get("categoryId")!;
      this.title = "Artículos de la categoría " + this.categoryId;
      this.getAllItemsByCategoryId(this.categoryId);
    } else {
      this.title = "Lista de artículos"
      this.getAllItems();
    }
  }

  private getAllItems(): void {
    this.itemService.getAllItems(this.page, this.size, this.sort).subscribe({
      next: (data: any) => {
        this.items = data.content;
        this.first = data.first;
        this.last = data.last;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements
      },
      error: (err) => { this.handleError(err) }
    })
  }

  private getAllItemsByCategoryId(categoryId: number): void {
    this.itemService.getAllItemsByCategoryId(categoryId).subscribe({
      next: (itemRequest) => { this.items = itemRequest },
      error: (err) => { this.handleError(err) }
    })
  }

  private handleError(err: any) {
    console.log(err)
  }

  itemsIsLoaded(): boolean {
    return this.items.length > 0;
  }

  previousPage(): void {
    this.page = this.page - 1;
    this.getAllItems();
  }

  nextPage(): void {
   this.page = this.page + 1;
   this.getAllItems();
  }

}
