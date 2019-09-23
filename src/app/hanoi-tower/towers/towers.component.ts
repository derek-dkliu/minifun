import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { CdkDragDrop, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DiskData } from '../disk/disk-data';

@Component({
  selector: 'app-towers',
  templateUrl: './towers.component.html',
  styleUrls: ['./towers.component.scss']
})
export class TowersComponent implements OnInit, OnChanges {
  @Input() diskNum: number;
  @Input() labels: string[];
  @Output() moved = new EventEmitter<boolean>();
  @Output() done = new EventEmitter<boolean>();
  dataMap = new Map<string, DiskData[]>();
  targetId: string;

  constructor() {}

  ngOnInit() {
    this.targetId = this.labels[this.labels.length - 1];
    this.resetDisksData();
  }

  ngOnChanges(changes: SimpleChanges) {
    const diskNum: SimpleChange = changes.diskNum;
    this.diskNum = diskNum.currentValue;

    // reset data
    this.resetDisksData();
  }

  resetDisksData() {
    for (const label of this.labels) {
      this.dataMap.set(label, []);
    }

    // place disks in the first post, i.e. label 0
    this.dataMap.set(this.labels[0], this.getDiskDataList(this.diskNum));
  }

  getDiskDataList(num: number): DiskData[] {
    return Array(num).fill(1).map((x, i) => new DiskData(i, num));
  }

  isDroppable(item: CdkDrag<DiskData>, target: CdkDropList<DiskData[]>) {
    const len = target.data.length;
    if (len === 0) {
      return true;
    } else {
      if (target.data.includes(item.data)) {
        return false;
      } else {
        return item.data.value > target.data[len - 1].value;
      }
    }
  }

  drop(event: CdkDragDrop<DiskData[]>) {
    if (event.previousContainer === event.container) {
      // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.moveDisk(event.container.id, event.previousContainer.data, event.container.data);
      // transferArrayItem(event.previousContainer.data,
      //                   event.container.data,
      //                   event.previousIndex,
      //                   event.container.data.length);

      // // update if other disks are draggable after this move
      // const len = event.previousContainer.data.length;
      // if (len > 0) {
      //   event.previousContainer.data[len - 1].draggable = true;
      // }
      // for (const data of event.container.data) {
      //   data.draggable = false;
      // }
      // event.item.data.draggable = true;

      // // add move count
      // this.moved.emit(true);

      // // done
      // if (event.container.id === this.targetId) {
      //   if (event.container.data.length === this.diskNum) {
      //     for (const data of event.container.data) {
      //       data.draggable = false;
      //     }
      //     this.done.emit(true);
      //   }
      // }
    }
  }

  moveDisk(to: string, fromData: DiskData[], toData: DiskData[]) {
    transferArrayItem(fromData, toData, fromData.length - 1, toData.length);

    // update if other disks are draggable after this move
    if (fromData.length > 0) {
      fromData[fromData.length - 1].draggable = true;
    }
    for (const data of toData) {
      data.draggable = false;
    }
    toData[toData.length - 1].draggable = true;

    // add move count
    this.moved.emit(true);

    // check if game is done
    if (to === this.targetId) {
      if (toData.length === this.diskNum) {
        for (const data of toData) {
          data.draggable = false;
        }
        this.done.emit(true);
      }
    }
  }

  step(from: string, to: string) {
    const fromData = this.dataMap.get(from);
    const toData = this.dataMap.get(to);
    this.moveDisk(to, fromData, toData);
  }
}
