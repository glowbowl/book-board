import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IBook } from '../../shared/interfaces/api.interfaces';
import { BookApiService } from '../../shared/services/book-api.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'brd-main-board',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './main-board.component.html',
  styleUrl: './main-board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
  ],
})
export class MainBoardComponent implements OnInit, OnDestroy {
  public books: IBook[] = [];
  public filteredBooks: IBook[] = [];
  public searchTerm = new FormControl<string | null>(null);

  readonly ngUnsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private api: BookApiService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initSubs();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  public clearSearch(): void {
    this.searchTerm.reset();
  }

  public openBookDialog(book?: IBook, viewMode: boolean = false): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '600px',
      data: { book: book, viewMode: viewMode },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result: IBook) => {
      if (result) {
        if (book) {
          this.updateBook(result);
        } else {
          this.addBook(result);
        }
      }
    });
  }

  public deleteBook(bookId: number, event: Event): void {
    event.stopPropagation();
    this.api.deleteBook(bookId);
  }

  public trackByBookId(index: number, book: IBook): number {
    return book.id;
  }

  private addBook(newBook: IBook): void {
    this.api.addBook(newBook);
  }

  private updateBook(updatedBook: IBook): void {
    this.api.updateBook(updatedBook);
  }

  private initSubs(): void {
    this.api
      .getBooks()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((result: IBook[]) => {
        this.books = structuredClone(result);
        this.filteredBooks = structuredClone(result);
        this.cdr.markForCheck();
      });

    this.searchTerm.valueChanges.pipe(debounceTime(600)).subscribe(() => {
      this.filterBooks();
      this.cdr.markForCheck();
    });
  }

  private filterBooks(): void {
    const term = (this.searchTerm?.value ? this.searchTerm.value : '')
      .toLowerCase()
      .trim();

    this.filteredBooks = this.books.filter(
      (post: IBook) =>
        post.name.toLowerCase().includes(term) ||
        post.author.toLowerCase().includes(term)
    );
  }
}
