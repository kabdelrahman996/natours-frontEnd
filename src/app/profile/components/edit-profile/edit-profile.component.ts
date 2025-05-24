import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent {
  userForm!: FormGroup;
  isLoading: boolean = true;
  isUpdated: boolean = false;
  currentImageUrl: string | null = null;
  selectedImage: File | null = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.authService.getMe().subscribe((res: any) => {
      const user = res.data;
      this.userForm.patchValue({
        fullName: user.name,
        email: user.email,
      });

      this.currentImageUrl = user.photo
        ? `http://localhost:5000/public/img/users/${user.photo}`
        : null;

      this.isLoading = false;
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.currentImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if (this.userForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.userForm.value.fullName);
    formData.append('email', this.userForm.value.email);

    if (this.selectedImage) {
      formData.append('photo', this.selectedImage);
    }

    this.authService.updateMe(formData).subscribe((res: any) => {
      console.log('User updated successfully:', res);
      this.isUpdated = true;

      setTimeout(() => {
        this.isUpdated = false;
        this.router.navigate(['/me']);
      }, 3000);
    });
  }
}
