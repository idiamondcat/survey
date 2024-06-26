import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { BreakPoints } from '../../models/breakpoints';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  public screenSizeObserver$ = new BehaviorSubject<string>(BreakPoints.LG);
  private destroyRef = inject(DestroyRef);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(res => {
      if (res.breakpoints[Breakpoints.Medium]) {
        this.screenSizeObserver$.next(BreakPoints.MD);
      } else if (res.breakpoints[Breakpoints.Small]) {
        this.screenSizeObserver$.next(BreakPoints.SM);
      } else if (res.breakpoints[Breakpoints.XSmall]) {
        this.screenSizeObserver$.next(BreakPoints.XS);
      } else {
        this.screenSizeObserver$.next(BreakPoints.LG);
      }
    })
  }
}