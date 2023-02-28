import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ValidationError } from 'class-validator';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'looper-elists-form-field-error',
  template: `
    <span *ngFor="let e of errors | keyvalue"> * {{ e.value }} </span>
  `,
})
export class ElistsFormFieldErrorComponent {
  @Input() errors: ValidationErrors | null = {};
}
