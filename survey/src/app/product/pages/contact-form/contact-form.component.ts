import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SurveyService } from '../../services/survey.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  private destroyRef = inject(DestroyRef);
  public contactForm = this.fb.group({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/)])
  });

  constructor(private fb: FormBuilder, private surveyService: SurveyService, private cd: ChangeDetectorRef, private router: Router) {}

  get getName() {
    return this.contactForm.get('name');
  }

  get getEmail() {
    return this.contactForm.get('email');
  }

  get getPhone() {
    return this.contactForm.get('phone');
  }

  public sendForm() {
    const form = this.contactForm.value;
    this.surveyService.postContact(form).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/survey']);
        this.cd.markForCheck();
      },
      error: (err) => {
        console.log(err.message);
        this.cd.markForCheck();
      }
    });
  }
}
