import { Component, Input, inject } from '@angular/core';
import { Supplement } from '../../../models/survey';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as actions from '../../../redux/app.actions';

@Component({
  selector: 'app-supplement',
  standalone: true,
  imports: [ProductModalComponent],
  templateUrl: './supplement.component.html',
  styleUrl: './supplement.component.scss'
})
export class SupplementComponent {
  @Input() info: Supplement;
  @Input() isCatalog?: boolean;
  @Input() isSet?: boolean;
  readonly dialog = inject(MatDialog);

  constructor(private store: Store) {}

  openInfo() {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '630px',
      data: this.info,
    });
  }

  public addSupplement() {
    this.store.dispatch(actions.addItem(this.info));
  }

  public removeSupplement() {

  }
}
