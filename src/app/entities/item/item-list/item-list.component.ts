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
  size: number = 25;
  sort: string = "name,asc";

  first: boolean = false;
  last: boolean = false;
  totalPages: number = 0;
  totalElements: number = 0;

  nameFilter?: string;
  priceFilter?: number;

  private itemToDelete?: number;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get("categoryId")) {
      this.categoryId = +this.route.snapshot.paramMap.get("categoryId")!;
      this.title = "Artículos de la categoría " + this.categoryId;
    } else {
      this.title = "Lista de artículos"
    }
    this.getAllItems();
  }

  private getAllItems(): void {

    const filters: string | undefined = this.buildFilters();

    this.itemService.getAllItems(this.page, this.size, this.sort, filters).subscribe({
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

  searchByFilters(): void {
    this.getAllItems()
  }

  private buildFilters(): string | undefined {
    const filters: string[] = [];

    if (this.categoryId) {
      filters.push("category.id:EQUAL:" + this.categoryId)
    }

    if (this.nameFilter) {
      filters.push("name:MATCH:" + this.nameFilter);
    }

    if (this.priceFilter) {
      filters.push("price:LESS_THAN_EQUAL:" + this.priceFilter);
    }

    if(filters.length > 0) {

      let globalFilters: string = "";

      filters.forEach( filter => {
        globalFilters += filter + ",";
      })

      globalFilters = globalFilters.substring(0, globalFilters.length-1);
      return globalFilters;

    } else {
      return undefined;
    }
  }

  prepareItemToDelete(itemId: number): void {
    this.itemToDelete = itemId;
  }

  deleteItem(): void {
    if (this.itemToDelete) {
      this.itemService.deleteItem(this.itemToDelete).subscribe({
        next: (data) => { this.getAllItems() },
        error: (err) => { this.handleError(err) }
      });
    }
  }
}
