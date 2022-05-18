import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormMode} from "../model/form-mode.enum";
import {ItemService} from "../service/item.service";
import {Item} from "../model/item.model";
import {Category} from "../../category/model/category.model";
import {CategoryService} from "../../category/service/category.service";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  itemId?: number;
  mode: FormMode = FormMode.NEW;
  item?: Item;

  selectedCategory?: Category;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit(): void {
    const entryParam: string = this.route.snapshot.paramMap.get("itemId") ?? "new";

    if (entryParam != "new") {
      this.itemId = +entryParam;
      this.mode = FormMode.UPDATE;
      this.getItemById(this.itemId!);
    } else {
      this.mode = FormMode.NEW;
      this.initializeItem();
    }
  }

  private getItemById(itemId: number) {
    this.itemService.getItemById(itemId).subscribe({
      next: (itemRequest) => {
        this.item = itemRequest;
        this.selectedCategory = new Category(itemRequest.categoryId!, itemRequest.categoryName!);
      },
      error: (err) => {
        this.handleError(err);
      }
    })
  }

  private handleError(err: any) {
    console.log(err);
  }

  private initializeItem() {
    this.item = new Item(undefined, "", 0);
  }

  saveItem(): void {
    switch (this.mode) {
      case FormMode.NEW:
        this.insertItem();
        break;

      case FormMode.UPDATE:
        this.updateItem();
        break;
    }
  }

  private insertItem(): void {
    this.itemService.insertItem(this.item!).subscribe({
      next: (itemInserted) => {
        alert(`Articulo: ${itemInserted.id}/${itemInserted.name} se ha insertado.`);
      },
      error: (err) => {
        this.handleError(err)
      }
    });
  }


  private updateItem(): void {
    this.itemService.updateItem(this.item!).subscribe({
      next: (itemUpdated) => {
        alert(`Articulo: ${itemUpdated.id}/${itemUpdated.name} se ha actualizado.`);
      },
      error: (err) => {
        this.handleError(err)
      }
    });
  }

  getAllCategories(event?: any): void {
    let categorySearch: string | undefined;

    if (event.query) {
      categorySearch = event.query;
    }

    this.categoryService.getAllCategories(categorySearch).subscribe({
      next: (categoriesFiltered) => {
        this.categories = categoriesFiltered;
      },
      error: (err) => {
        this.handleError(err);
      }
    })
  }

  categorySelected(): void {
    this.item!.categoryId = this.selectedCategory!.id;
    this.item!.categoryName = this.selectedCategory!.name;
  }

  categoryCleaned() {
    this.item!.categoryId = undefined;
    this.item!.categoryName = undefined;
  }
}

