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
    this.itemService.getAllItems().subscribe({
      next: (itemRequest) => { this.items = itemRequest },
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
}
