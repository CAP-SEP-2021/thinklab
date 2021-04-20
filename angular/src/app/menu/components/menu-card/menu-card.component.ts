import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DishView, ExtraView } from '../../../shared/view-models/interfaces';

@Component({
  selector: 'app-public-menu-card',
  templateUrl: './menu-card.component.html',
  styleUrls: ['./menu-card.component.scss'],
})
export class MenuCardComponent {
  @Input() extras: ExtraView;
  @Input() menuInfo: DishView;
  @Input() auth: boolean;
  @Output() orderAdded = new EventEmitter<DishView>();//@mo this can be changes to DishView because the emit methode would take in this case only one parameter
  @Output() extraSelected = new EventEmitter< any>();//@mo only one generic type can be accepted also an Array would cause problems  inline 25 because we need to bind the two values 

  constructor() {}

  changeFavouriteState(): void {
    this.menuInfo.isfav = !this.menuInfo.isfav;
  }

  selectedOption(extra: ExtraView): void {
    const dish = this.menuInfo;
    this.extraSelected.emit({dish, extra});
  }

  addOrderMenu(): void {
    this.orderAdded.emit(this.menuInfo);
  }
}
