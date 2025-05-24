import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToursService } from '../../services/tours.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-edit-tour',
  standalone: false,
  templateUrl: './edit-tour.component.html',
  styleUrl: './edit-tour.component.css',
})
export class EditTourComponent {
  tourForm!: FormGroup;
  difficulties: string[] = ['easy', 'medium', 'difficult'];
  imageCover: File | null = null;
  images: File[] = [];
  readonly IMAGES_LIMIT = 3;
  tourId!: string;
  isLoading = false;
  existingImageCover: string = '';
  existingImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toursService: ToursService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.tourId = this.route.snapshot.paramMap.get('id') || '';
    if (this.tourId) {
      this.fetchTour(this.tourId);
    } else {
      this.router.navigate(['/tours']);
    }
  }

  initForm() {
    this.tourForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(10)]],
      duration: [null, [Validators.required, Validators.min(1)]],
      maxGroupSize: [null, [Validators.required, Validators.min(1)]],
      difficulty: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      priceDiscount: [0],
      summary: ['', Validators.required],
      description: [''],
      startDates: this.fb.array([]),
      startLocation: this.fb.group({
        description: [''],
        address: [''],
        coordinates: this.fb.array([
          this.fb.control('', Validators.required),
          this.fb.control('', Validators.required),
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

  getImageUrl(imageName: string): string {
    return `${environment.imgUrl}/tours/${imageName}`;
  }

  fetchTour(id: string) {
    this.isLoading = true;
    this.toursService.getTourById(id).subscribe({
      next: (tour: any) => {
        this.patchForm(tour.data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tour:', err);
        this.isLoading = false;
        this.router.navigate(['/tours']);
      },
    });
  }

  patchForm(tour: any) {
    // Basic fields
    const basicData = {
      name: tour.name,
      duration: tour.duration,
      maxGroupSize: tour.maxGroupSize,
      difficulty: tour.difficulty,
      price: tour.price,
      priceDiscount: tour.priceDiscount || 0,
      summary: tour.summary,
      description: tour.description,
    };
    this.tourForm.patchValue(basicData);

    // Start Dates
    this.startDates.clear();
    if (tour.startDates && tour.startDates.length > 0) {
      tour.startDates.forEach((date: string) => {
        const formattedDate = new Date(date).toISOString().split('T')[0];
        this.addStartDate(formattedDate);
      });
    } else {
      this.addStartDate();
    }

    // Start Location
    if (tour.startLocation) {
      const startLocationGroup = this.tourForm.get(
        'startLocation'
      ) as FormGroup;
      startLocationGroup.patchValue({
        description: tour.startLocation.description,
        address: tour.startLocation.address,
      });

      const coordinates = startLocationGroup.get('coordinates') as FormArray;
      coordinates.at(0).setValue(tour.startLocation.coordinates[0]);
      coordinates.at(1).setValue(tour.startLocation.coordinates[1]);
    }

    // Locations
    this.locations.clear();
    if (tour.locations && tour.locations.length > 0) {
      tour.locations.forEach((location: any) => {
        this.addLocation(location);
      });
    }

    // Images
    this.existingImageCover = tour.imageCover;
    this.existingImages = tour.images || [];
  }

  addStartDate(dateValue: string = ''): void {
    this.startDates.push(this.fb.control(dateValue, Validators.required));
  }

  removeStartDate(index: number): void {
    if (this.startDates.length > 1) {
      this.startDates.removeAt(index);
    }
  }

  addLocation(location?: any): void {
    const locationGroup = this.fb.group({
      description: [location?.description || ''],
      day: [location?.day || 1, [Validators.required, Validators.min(1)]],
      coordinates: this.fb.array([
        this.fb.control(
          location?.coordinates ? location.coordinates[0] : '',
          Validators.required
        ),
        this.fb.control(
          location?.coordinates ? location.coordinates[1] : '',
          Validators.required
        ),
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

    const formData = new FormData();

    // Add primitive fields
    Object.entries(this.tourForm.value).forEach(([key, value]) => {
      if (['startDates', 'startLocation', 'locations'].includes(key)) return;
      if (value === undefined || value === null) value = '';
      formData.append(key, String(value));
    });

    // Process dates
    const startDatesArr = this.startDates.controls
      .map((c) => (c.value ? new Date(c.value).toISOString() : null))
      .filter((d) => !!d);

    // Process start location
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

    // Process locations
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

    // Append processed arrays/objects
    formData.append('startDates', JSON.stringify(startDatesArr));
    formData.append('startLocation', JSON.stringify(startLocation));
    formData.append('locations', JSON.stringify(locationsArr));

    // Append images only if new ones were selected
    if (this.imageCover) {
      formData.append('imageCover', this.imageCover);
    }
    if (this.images.length > 0) {
      this.images.forEach((file) => {
        formData.append('images', file);
      });
    }

    this.toursService.updateTour(this.tourId, formData).subscribe({
      next: () => {
        alert('Tour updated successfully!');
        this.router.navigate(['/tours', this.tourId]);
      },
      error: (err) => {
        alert('Failed to update tour');
        console.error(err);
      },
    });
  }
}
