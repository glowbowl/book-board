import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import books from './books.json';
import { IBook } from '../interfaces/api.interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookApiService {
  private articles: Observable<IBook[]> | undefined;

  getArticles(): Observable<IBook[]> {
    if (!this.articles) {
      this.articles = from(this.delayForPosts(2000));
    }
    return this.articles;
  }

  private delayForPosts(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    }).then(() => {
      return books;
    });
  }
}
