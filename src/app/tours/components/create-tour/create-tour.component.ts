import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToursService } from '../../services/tours.service';
import { environment } from '../../../../environments/environment.prod';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StartLocation, Tour, Location } from '../../interfaces/tour';

@Component({
  selector: 'app-create-tour',
  standalone: false,
  templateUrl: './create-tour.component.html',
  styleUrl: './create-tour.component.css',
})
export class CreateTourComponent {
  tourForm!: FormGroup;
  difficulties: string[] = ['easy', 'medium', 'difficult'];
  imageCover: File | null = null;
  images: File[] = [];
  readonly IMAGES_LIMIT = 3;

  constructor(private fb: FormBuilder, private toursService: ToursService) {}

  ngOnInit(): void {
    this.tourForm = this.fb.group({
      name: ['', Validators.required],
      duration: [null, [Validators.required, Validators.min(1)]],
      maxGroupSize: [null, [Validators.required, Validators.min(1)]],
      difficulty: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      priceDiscount: [0],
      summary: ['', Validators.required],
      description: [''],
      startDates: this.fb.array([this.fb.control('', Validators.required)]),
      startLocation: this.fb.group({
        description: [''],
        address: [''],
        coordinates: this.fb.array([
          this.fb.control('', Validators.required), // Longitude
          this.fb.control('', Validators.required), // Latitude
        ]),
      }),
      locations: this.fb.array([]),
    });
  }

  get locations(): FormArray {
    return this.tourForm.get('locations') as FormArray;
  }

  get startDates(): FormArray {
    return this.tourForm.get('startDates') as FormArray;
  }

  addStartDate(): void {
    this.startDates.push(this.fb.control('', Validators.required));
  }

  removeStartDate(index: number): void {
    if (this.startDates.length > 1) {
      this.startDates.removeAt(index);
    }
  }

  addLocation(): void {
    const locationGroup = this.fb.group({
      description: [''],
      day: [1, [Validators.required, Validators.min(1)]],
      coordinates: this.fb.array([
        this.fb.control('', Validators.required), // Longitude
        this.fb.control('', Validators.required), // Latitude
      ]),
    });
    this.locations.push(locationGroup);
  }

  removeLocation(index: number) {
    this.locations.removeAt(index);
  }

  onImageCoverSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.imageCover = event.target.files[0];
    }
  }

  onImagesSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const files: FileList = event.target.files;
      if (files.length > this.IMAGES_LIMIT) {
        alert(`You can select a maximum of ${this.IMAGES_LIMIT} images.`);
        return;
      }
      this.images = Array.from(files);
    }
  }

  onSubmit(): void {
    if (this.tourForm.invalid) return;

    const formValue = this.tourForm.value;
    const formData = new FormData();

    // Add primitive fields
    Object.entries(formValue).forEach(([key, value]) => {
      if (['startDates', 'startLocation', 'locations'].includes(key)) return;
      if (value === undefined || value === null) value = '';
      formData.append(key, String(value));
    });

    // Prepare startDates as ISO strings array (NOT array of controls)
    const startDatesArr = this.startDates.controls
      .map((c) => (c.value ? new Date(c.value).toISOString() : null))
      .filter((d) => !!d);

    // Prepare startLocation as an object with geojson structure
    const startLocationFG = this.tourForm.get('startLocation') as FormGroup;
    const startLocation = {
      description: startLocationFG.get('description')?.value,
      address: startLocationFG.get('address')?.value,
      type: 'Point',
      coordinates: [
        Number((startLocationFG.get('coordinates') as FormArray).at(0).value),
        Number((startLocationFG.get('coordinates') as FormArray).at(1).value),
      ],
    };

    // Prepare locations array of objects, using the correct cast
    const locationsArr = this.locations.controls.map((ctrl) => {
      const group = ctrl as FormGroup;
      return {
        description: group.get('description')?.value,
        day: Number(group.get('day')?.value),
        type: 'Point',
        coordinates: [
          Number((group.get('coordinates') as FormArray).at(0).value),
          Number((group.get('coordinates') as FormArray).at(1).value),
        ],
      };
    });

    // Add structured arrays/objects as JSON strings
    formData.append('startDates', JSON.stringify(startDatesArr));
    formData.append('startLocation', JSON.stringify(startLocation));
    formData.append('locations', JSON.stringify(locationsArr));

    if (this.imageCover) {
      formData.append('imageCover', this.imageCover, this.imageCover.name);
    }
    this.images.forEach((file) => {
      formData.append('images', file, file.name);
    });

    this.toursService.createTour(formData).subscribe({
      next: () => {
        alert('Tour successfully created!');
        this.tourForm.reset();
        this.imageCover = null;
        this.images = [];
      },
      error: (err) => {
        alert('Failed to create tour');
        console.error(err);
      },
    });
  }
}
