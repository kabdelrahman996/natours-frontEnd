import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SpinnerComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [SpinnerComponent, FormsModule, RouterModule],
})
export class SharedModule {}
