import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface LevelDialogParam {
  message: string;
  excellent?: boolean;
  hasNextLevel: boolean;
}

@Component({
  selector: 'app-level-dialog',
  templateUrl: './level-dialog.component.html',
  styleUrls: ['./level-dialog.component.scss']
})
export class LevelDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<LevelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public params: LevelDialogParam) { }

  ngOnInit() {
  }

  nextLevel() {
    this.dialogRef.close({next: true});
  }

  tryAgain() {
    this.dialogRef.close({next: false});
  }
}
