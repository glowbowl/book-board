import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'brd-book-info-dialog',
  standalone: true,
  imports: [],
  templateUrl: './book-info-dialog.component.html',
  styleUrl: './book-info-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookInfoDialogComponent {

}
