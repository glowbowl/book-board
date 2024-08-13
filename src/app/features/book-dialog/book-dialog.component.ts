import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { MatIconModule } from '@angular/material/icon';
import { BookApiService } from '../../shared/services/book-api.service';

@Component({
  selector: 'brd-book-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent implements OnInit {
  public bookForm!: FormGroup;
  public isEditMode: boolean;
  public viewMode: boolean;
  public today = new Date();
  public imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: BookApiService,
    private cdr: ChangeDetectorRef,
    private dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { book: IBook; viewMode: boolean }
  ) {
    this.isEditMode = !!data.book && !data.viewMode;
    this.viewMode = data.viewMode;
  }

  ngOnInit(): void {
    this.initFormGroup();
    if (this.isEditMode && this.data.book?.imageUrl) {
      this.imagePreview = this.data.book.imageUrl;
    }
  }

  public toggleEditMode(): void {
    this.viewMode = false;
    this.isEditMode = true;
    if (this.data.book?.imageUrl) {
      this.imagePreview = this.data.book.imageUrl;
    }
    this.bookForm.enable();
  }

  public onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.bookForm.patchValue({ imageUrl: this.imagePreview });
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  public deleteBook(): void {
    this.dialogRef.close();
    this.api.deleteBook(this.data.book.id);
  }

  public save(): void {
    if (this.bookForm.valid && this.data.book) {
      this.dialogRef.close({...this.bookForm.value, id: this.data.book.id});
    } else {
      this.dialogRef.close(this.bookForm.value);
    }
  }

  public cancel(): void {
    if (this.isEditMode && this.data.viewMode) {
      this.isEditMode = false;
      this.viewMode = true;
      this.imagePreview = null;
      this.bookForm.disable();
    } else {
      this.dialogRef.close();
    }
  }

  private initFormGroup(): void {
    this.bookForm = this.fb.group({
      name: [
        { value: this.data.book?.name || '', disabled: this.viewMode },
        Validators.required,
      ],
      author: [
        { value: this.data.book?.author || '', disabled: this.viewMode },
        Validators.required,
      ],
      createdAt: [
        {
          value: this.data.book?.createdAt || '',
          disabled: this.viewMode,
        },
        [
          Validators.required,
          Validators.min(1000),
          Validators.max(this.today.getFullYear()),
        ],
      ],
      description: [
        { value: this.data.book?.description || '', disabled: this.viewMode },
      ],
      imageUrl: [{ value: this.data.book?.imageUrl || '', disabled: this.viewMode }],
    });
  }
}
