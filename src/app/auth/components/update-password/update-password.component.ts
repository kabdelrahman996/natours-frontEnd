import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent {
  passwordForm!: FormGroup;
  isSuccess: boolean = false;
  isError: boolean = false;
  errorMsg: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.passwordForm = this.fb.group({
      passwordCurrent: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    this.authService.updateMyPassword(this.passwordForm.value).subscribe({
      next: (res: any) => {
        this.isSuccess = true;
        this.isError = false;
        this.passwordForm.reset();
        setTimeout(() => (this.isSuccess = false), 3000);
      },
      error: (err) => {
        this.isError = true;
        this.errorMsg = err.error?.message || 'حدث خطأ ما!';
        setTimeout(() => (this.isError = false), 4000);
      },
    });
  }
}
