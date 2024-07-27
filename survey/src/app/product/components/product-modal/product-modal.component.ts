import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { Supplement } from 'src/app/models/survey';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ScreenService } from '../../../core/services/screen.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakPoints } from '../../../models/breakpoints';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [MatDialogContent, FaIconComponent, MatDialogClose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss'
})
export class ProductModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ProductModalComponent>)
  readonly data = inject<Supplement>(MAT_DIALOG_DATA);
  public faXmark = faXmark;
  private destroyRef = inject(DestroyRef);
  public isSmall: boolean = false;

  constructor(private screenService: ScreenService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.screenService.screenSizeObserver$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      if (res === BreakPoints.SM || res === BreakPoints.XS)
        this.isSmall = true;
      else
        this.isSmall = false;
      this.cd.markForCheck();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
