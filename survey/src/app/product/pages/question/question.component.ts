import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Field, Question, SurveyCurrentState } from '../../../models/survey';
import { AsyncPipe, NgClass } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Observable } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IndicatorComponent } from '../../components/indicator/indicator.component';
import { SurveyStore } from './question.component-store';

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

  private initializeCurrForm(currentQuestion: Question, answeredQuestions: Record<string, any>): void {
    const fields: Field[] = currentQuestion.answers;
    switch(currentQuestion.type) {
      case('radio'): this.createRadio(currentQuestion.id, fields, answeredQuestions);
      break;
      case('checkbox'): this.createCheckbox(currentQuestion, answeredQuestions);
      break;
      default: this.createTextField(currentQuestion.id, currentQuestion.type, answeredQuestions);
      break;
    }

  }

  public onRadioChange(id: string, answerId: string): void {
    this.form.get(id)?.setValue(answerId);
    this.cd.detectChanges();
  }

  public onCheckboxChange(id: string, event: any, answerId: string): void {
  const formArray = this.form.get(String(id)) as FormArray;
  const isChecked: boolean = event.target.checked;
  let filteredControls: FormControl[];
  if (isChecked) {
    if (!formArray.controls.some(elem => elem.value === answerId)) formArray.push(new FormControl(answerId));
  } else {
    const index: number = formArray.controls.findIndex(x => x.value === answerId);
    if (index !== -1) formArray.removeAt(index);
  }
  filteredControls = formArray.controls
  .filter(control => typeof control.value === 'string')
  .map(control => control as FormControl);

  while (formArray.length !== 0) {
    formArray.removeAt(0);
  }

  filteredControls.forEach(control => formArray.push(control));
  this.cd.detectChanges();
  }

  private createTextField(currId: string, type: string, answeredQuestions: Record<string, any>) {
    const formControls: { [key: string]: FormControl } = {};
    let initialValue = answeredQuestions[currId] || '';
    let validators = [Validators.required];
    formControls[currId] = new FormControl(initialValue, validators);
    this.form = this.fb.group(formControls);
    return this.form;
  }

  private createRadio(currId: string, fields: Field[], answeredQuestions: Record<string, any>) {
    const formControls: { [key: string]: FormControl } = {};
    fields.forEach((field: Field) => {
      let initialValue = answeredQuestions[currId] || '';
      if (!initialValue) {
        initialValue = field.answerId;
      }
      if (!formControls[currId]) {
        formControls[currId] = new FormControl(initialValue, Validators.required);
      }
    })
    this.form = this.fb.group(formControls);
    return this.form;
  }

  private createCheckbox(currentQuestion: Question, answeredQuestions: Record<string, any>) {
    const { id, answers } = currentQuestion;
    const newId: string = String(id);
    const formArray = this.fb.array([]);
    answers.forEach((field: Field) => {
      let initialValue: string | boolean = answeredQuestions[newId]?.includes(field.answerId) ? field.answerId : false;
      formArray.push(new FormControl(initialValue));
    });
    const formControls: { [key: string]: FormArray | FormControl } = {};
    formControls[newId] = formArray;
    this.form = this.fb.group(formControls);
    return this.form;
  }
}
