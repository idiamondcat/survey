import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Field, Question, SurveyCurrentState } from '../../models/survey';
import { AsyncPipe, NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { SurveyStore } from './question.component-store';
import { Observable } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { IndicatorComponent } from '../indicator/indicator.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [NgClass, FaIconComponent, AsyncPipe, ReactiveFormsModule, IndicatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SurveyStore],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent implements OnInit {
  public vm$: Observable<SurveyCurrentState> = this.surveyStore.vm$;
  public form: FormGroup;
  public faCircleCheck = faCircleCheck;
  public questionCount: number = 0;
  public answeredQuestionCount: number = 0;
  public progress: number = 0;

  constructor(private cd: ChangeDetectorRef, private surveyStore: SurveyStore, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.surveyStore.loadSurvey();
    this.vm$.subscribe(res => {
      if (res.currentQuestion) {
        this.initializeCurrForm(res.currentQuestion, res.answeredQuestions);
        this.cd.detectChanges();
      } else {
        this.form = this.fb.group({});
      }
      if (res.survey) {
        this.questionCount = res.survey.sections.reduce((acc, curr) => {
          return acc + curr.questions.length;
        }, 0);
      }
      this.cd.markForCheck();
    })
  }

  public prevQuestion(): void {
    if (this.progress > 0 && this.progress < this.questionCount) {
      const currQuestion: {[key: string]: any} = this.form.value;
      this.surveyStore.prevQuestion(currQuestion);
      this.progress = Math.max(0, this.progress - 1);
    }
  }

  public nextQuestion(): void {
    if (this.progress < this.questionCount) {
      const currQuestion: {[key: string]: any} = this.form.value;
      this.surveyStore.nextQuestion(currQuestion);
      this.progress = Math.min(this.questionCount, this.progress + 1);
    }
  }

  private initializeCurrForm(currentQuestion: Question, answeredQuestions: { [key: string]: any }): void {
    const fields: Field[] = currentQuestion.fields;
    switch(currentQuestion.questionType) {
      case('radio'): this.createRadio(fields, answeredQuestions);
      break;
      case('checkbox'): this.createCheckbox(currentQuestion, answeredQuestions);
      break;
      default: this.createTextField(fields, answeredQuestions);
      break;
    }

  }

  public onRadioChange(name: string, value: any): void {
    this.form.get(name)?.setValue(value);
    this.cd.detectChanges();
  }

  public onCheckboxChange(name: string, event: any, value: any): void {
  const formArray = this.form.get(name) as FormArray;
  const isChecked: boolean = event.target.checked;
  if (isChecked) {
    formArray.push(new FormControl(value));
  } else {
    const index: number = formArray.controls.findIndex(x => x.value === value);
    formArray.removeAt(index);
  }
  formArray.controls = formArray.controls.filter(control => typeof control.value === 'string');
  console.log(formArray);
  this.cd.detectChanges();
  }

  private createTextField(fields: Field[], answeredQuestions: { [key: string]: any }) {
    const formControls: { [key: string]: FormControl } = {};
    fields.forEach((field: Field) => {
      let initialValue = answeredQuestions[field.name] || '';
      let validators = [];
      if (field.type === 'text' || field.type === 'textarea') {
        validators.push(Validators.required);
      }
      if (field.type === 'email') {
        validators.push(Validators.required, Validators.email);
      }
      if (field.type === 'phone') {
        validators.push(Validators.required, Validators.pattern(/^((8|\+374|\+994|\+995|\+375|\+7)[\- ]?)?\(?\d{3,5}\)?[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}(([\- ]?\d{1})?[\- ]?\d{1})?$/));
      }
      formControls[field.name] = new FormControl(initialValue, validators);
    })
    this.form = this.fb.group(formControls);
    return this.form;
  }

  private createRadio(fields: Field[], answeredQuestions: { [key: string]: any }) {
    const formControls: { [key: string]: FormControl } = {};
    fields.forEach((field: Field, idx: number) => {
      let initialValue = answeredQuestions[field.name] || '';
      if (!initialValue) {
        initialValue = field.variant;
      }
      if (!formControls[field.name]) {
        formControls[field.name] = new FormControl(initialValue, Validators.required);
      }
    })
    this.form = this.fb.group(formControls);
    return this.form;
  }

  private createCheckbox(currentQuestion: Question, answeredQuestions: { [key: string]: any }) {
    const { questionName, fields } = currentQuestion;
    const formArray = this.fb.array([]);
    fields.forEach((field: Field) => {
      let initialValue = answeredQuestions[questionName!]?.includes(field.variant) || false;
      formArray.push(new FormControl(initialValue));
    });
    const formControls: { [key: string]: FormArray | FormControl } = {};
    formControls[questionName!] = formArray;
    this.form = this.fb.group(formControls);
    return this.form;
  }
}
