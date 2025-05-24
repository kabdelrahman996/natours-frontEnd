import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToursService } from '../../services/tours.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-tours-filters',
  standalone: false,
  templateUrl: './tours-filters.component.html',
  styleUrl: './tours-filters.component.css',
})
export class ToursFiltersComponent {
  @Input() locations: string[] = []; // Receive locations from parent
  @Output() filterChange = new EventEmitter<any>();

  filterForm: FormGroup;
  isExpanded = false;

  priceRanges = [
    { label: 'الكل', value: '' },
    { label: 'أقل من 1000 جنيه', value: '0-1000' },
    { label: '1000 - 2000 جنيه', value: '1000-2000' },
    { label: '2000 - 3000 جنيه', value: '2000-3000' },
    { label: 'أكثر من 3000 جنيه', value: '3000-999999' },
  ];

  ratings = [
    { label: 'الكل', value: '' },
    { label: '4.5 وأعلى', value: '4.5' },
    { label: '4.0 وأعلى', value: '4.0' },
    { label: '3.5 وأعلى', value: '3.5' },
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      priceRange: [''],
      rating: [''],
      location: [''],
      searchTerm: [''],
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((filters) => {
        this.emitFilters(filters);
      });
  }

  toggleFilters() {
    this.isExpanded = !this.isExpanded;
  }

  resetFilters() {
    this.filterForm.reset();
    this.emitFilters(this.filterForm.value);
  }

  private emitFilters(filters: any) {
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-');
      filters.minPrice = min;
      filters.maxPrice = max;
    }

    this.filterChange.emit(filters);
  }

  getPriceRangeLabel(value: string): string {
    const range = this.priceRanges.find((r) => r.value === value);
    return range ? range.label : '';
  }

  getRatingLabel(value: string): string {
    const rating = this.ratings.find((r) => r.value === value);
    return rating ? rating.label : '';
  }
}
