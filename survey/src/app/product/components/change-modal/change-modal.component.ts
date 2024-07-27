import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { Supplement } from '../../../models/survey';
import { SurveyService } from '../../services/survey.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SupplementComponent } from '../supplement/supplement.component';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-change-modal',
  standalone: true,
  imports: [MatDialogContent, FaIconComponent, SupplementComponent, MatTab, MatTabGroup, MatDialogClose, CurrencyPipe],
  templateUrl: './change-modal.component.html',
  styleUrl: './change-modal.component.scss'
})
export class ChangeModalComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  readonly dialogRef = inject(MatDialogRef<ChangeModalComponent>)
  readonly data = inject<Supplement[]>(MAT_DIALOG_DATA);
  public catalog: Supplement[];
  public faXmark = faXmark;

  constructor(private surveyService: SurveyService) {}

  ngOnInit(): void {
    this.surveyService.getCatalog().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.catalog = res;
    })
  }

}



// {
        //     "title": "Контактная информация",
        //     "questions": [
        //         {
        //             "text": "Напишите нам немного информации о себе",
        //             "questionType": "text",
        //             "fields": [
        //                 {
        //                     "type": "text",
        //                     "name": "name",
        //                     "class": "field",
        //                     "placeholder": "Имя"
        //                 },
        //                 {
        //                     "type": "email",
        //                     "name": "email",
        //                     "class": "field",
        //                     "placeholder": "Email"
        //                 },
        //                 {
        //                     "type": "phone",
        //                     "name": "phone",
        //                     "class": "field",
        //                     "placeholder": "Телефон"
        //                 }
        //             ]
        //         }
        //     ]
        // },