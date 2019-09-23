import { Component, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import { DiskData } from './disk-data';

@Component({
  selector: 'app-disk',
  templateUrl: './disk.component.html',
  styleUrls: ['./disk.component.scss']
})
export class DiskComponent implements OnInit {
  @Input() cdkDragData: DiskData;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.renderer.setStyle(this.el.nativeElement, 'width', this.cdkDragData.width + 'px');
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.cdkDragData.color);
  }

}
