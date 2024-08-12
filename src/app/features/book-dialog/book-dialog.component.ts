import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IBook } from '../../shared/interfaces/api.interfaces';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'brd-book-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent implements OnInit {
  public bookForm!: FormGroup;
  public isEditMode: boolean;
  public today = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IBook
  ) {
    this.isEditMode = !!data;
  }

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      name: [this.data?.name || '', Validators.required],
      author: [this.data?.author || '', Validators.required],
      createdAt: [
        this.data?.createdAt || '',
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(this.today.getFullYear()),
        ],
      ],
      description: [this.data?.description || ''],
    });
  }

  public save(): void {
    if (this.bookForm.valid) {
      this.dialogRef.close(this.bookForm.value);
    }
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
