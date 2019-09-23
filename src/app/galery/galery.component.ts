import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { MediaChange, MediaObserver} from '@angular/flex-layout';

interface Item {
  name: string;
  image: string;
  route: string;
}

@Component({
  selector: 'app-galery',
  templateUrl: './galery.component.html',
  styleUrls: ['./galery.component.scss']
})
export class GaleryComponent implements OnInit, OnDestroy {
  cols = 5;
  rowHeight = '250px';
  gridByBreakpoint = {
    xl: { cols: 5 },
    lg: { cols: 4 },
    md: { cols: 3 },
    sm: { cols: 2 },
    xs: { cols: 1 },
  };
  items: Item[];

  private mediaWatcher: Subscription;

  constructor(
    private mediaObserver: MediaObserver,
  ) {
    this.mediaWatcher = mediaObserver.asObservable().pipe(
      filter((changes: MediaChange[]) => changes.length > 0),
      map((changes: MediaChange[]) => changes[0])
    ).subscribe((change: MediaChange) => {
      this.cols = this.gridByBreakpoint[change.mqAlias].cols;
    });

    this.items = [
      { name: 'Tic Tac Toe', route: '/tic-tac-toe', image: '../../assets/tic-tac-toe.png'},
      { name: 'Maze', route: '/maze', image: '../../assets/maze.png'},
      { name: 'Hanoi Tower', route: '/hanoi-tower', image: '../../assets/hanoi-tower.png'},
    ];
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.mediaWatcher) { this.mediaWatcher.unsubscribe(); }
  }

}
