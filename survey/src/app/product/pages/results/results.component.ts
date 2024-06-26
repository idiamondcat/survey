import { CurrencyPipe, NgClass, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, DestroyRef, inject, ViewChild, ElementRef } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faRotateLeft, faRotateRight, faTruckFast, faStar, faAngleLeft, faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { ResponseData } from '../../../models/survey';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ScreenService } from '../../../core/services/screen.service';
import { BreakPoints } from '../../../models/breakpoints';

@Component({
  selector: 'app-results',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, FaIconComponent, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle, MatAccordion, ReactiveFormsModule, NgClass, PercentPipe],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  @ViewChild('moveSlider') moveSlider: ElementRef<HTMLDivElement>;
  private destroyRef = inject(DestroyRef);
  public isSmall: boolean = false;
  public faCircleCheck = faCircleCheck;
  public faRotateLeft = faRotateLeft;
  public faRotateRight = faRotateRight;
  public faTruckFast = faTruckFast;
  public faStar = faStar;
  public faAngleLeft = faAngleLeft;
  public faAngleRight = faAngleRight;
  public faXmark = faXmark;
  public isShowCertificate: boolean = false;
  public experienceForm = this.fb.group({
    experience: new FormControl('', [])
  });
  public orderForm = this.fb.group({
    discountCode: new FormControl(''),
    certificate: new FormControl('')
  });
  public questions = [
    {question: 'Вопрос 1', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 2', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 3', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 4', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 5', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 6', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 7', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 8', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 9', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'},
    {question: 'Вопрос 10', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Semper eget duis at tellus at urna. In fermentum posuere urna nec tincidunt. Non blandit massa enim nec dui nunc mattis enim. Magna eget est lorem ipsum dolor sit amet.'}
  ];
  public results: ResponseData;

  constructor(private surveyService: SurveyService, private cd: ChangeDetectorRef, private fb: FormBuilder, private screenService: ScreenService) {}

  ngOnInit(): void {
    this.screenService.screenSizeObserver$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      if (res === BreakPoints.SM || res === BreakPoints.XS)
        this.isSmall = true;
      else
        this.isSmall = false;
      this.cd.markForCheck();
    });
    this.surveyService.postData().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.results = res;
      this.cd.markForCheck();
    });
  }

  submitExperience() {
    console.log(this.experienceForm.value);
  }

  get discountCode() {
    return this.orderForm.get('discountCode');
  }

  get certificate() {
    return this.orderForm.get('certificate');
  }

  public moveRight(): void {
    const width: number =
      this.moveSlider.nativeElement.getBoundingClientRect().width;
    this.moveSlider.nativeElement.scrollLeft += width;
  }

  public moveLeft(): void {
    const width: number =
      this.moveSlider.nativeElement.getBoundingClientRect().width;
    this.moveSlider.nativeElement.scrollLeft -= width;
  }

  public clearField(field: AbstractControl<string | null, string | null> | null) {
    field?.setValue('');
  }
}
