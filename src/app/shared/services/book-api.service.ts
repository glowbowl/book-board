import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import books from './books.json';
import { IBook } from '../interfaces/api.interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class BookApiService {
  private booksSubject$: BehaviorSubject<IBook[]> = new BehaviorSubject<
    IBook[]
  >(books);

  constructor(private snackBar: MatSnackBar) {}

  public getBooks(): Observable<IBook[]> {
    return this.booksSubject$.pipe(delay(500));
  }

  public addBook(book: IBook): void {
    const updatedBooks = [
      ...this.booksSubject$.value,
      { ...book, id: this.getNextId() },
    ];
    this.simulateServerResponse(updatedBooks, 'Book added successfully');
  }

  public updateBook(updatedBook: IBook): void {
    const updatedBooks = this.booksSubject$.value.map((book) =>
      book.id === updatedBook.id ? updatedBook : book
    );
    console.log(updatedBooks, updatedBook);

    this.simulateServerResponse(updatedBooks, 'Book updated successfully');
  }

  public deleteBook(bookId: number): void {
    const updatedBooks = this.booksSubject$.value.filter(
      (book) => book.id !== bookId
    );
    this.simulateServerResponse(updatedBooks, 'Book deleted successfully');
  }

  private simulateServerResponse(updatedBooks: IBook[], message: string): void {
    setTimeout(() => {
      this.booksSubject$.next(updatedBooks);
      this.showSnackBar(message);
    }, 500);
  }

  private getNextId(): number {
    const highestId = this.booksSubject$.value.reduce(
      (maxId, book) => Math.max(maxId, book.id),
      0
    );

    return highestId + 1;
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
