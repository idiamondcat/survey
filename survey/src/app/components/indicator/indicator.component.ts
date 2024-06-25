import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, Input, InputSignal, OnChanges, OnInit, SimpleChanges, WritableSignal, input, signal } from '@angular/core';
import { SurveyStore } from '../question/question.component-store';
import { Survey, SurveyCurrentState } from 'src/app/models/survey';

@Component({
  selector: 'app-indicator',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './indicator.component.html',
  styleUrl: './indicator.component.scss'
})
export class IndicatorComponent implements OnChanges {
  @Input() progress: number = 0;
  @Input() questionCount: number = 0;

  constructor(private cd: ChangeDetectorRef) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress']) {
      this.progress = changes['progress'].currentValue;
    }
  }
}
