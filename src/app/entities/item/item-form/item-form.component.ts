import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormMode} from "../model/form-mode.enum";
import {ItemService} from "../service/item.service";
import {Item} from "../model/item.model";

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  itemId?: number;
  mode: FormMode = FormMode.NEW;
  item?: Item;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) { }

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
      next: (itemRequest) => { this.item = itemRequest; },
      error: (err) => { this.handleError(err); }
    })
  }

  private handleError(err: any) {
    console.log(err);
  }

  private initializeItem() {
    this.item = new Item(undefined, "", 0);
  }
}
