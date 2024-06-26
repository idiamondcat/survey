import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
