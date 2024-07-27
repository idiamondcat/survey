import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeModalComponent } from './change-modal.component';

describe('ChangeModalComponent', () => {
  let component: ChangeModalComponent;
  let fixture: ComponentFixture<ChangeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
