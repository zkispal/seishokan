import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import {Navmenu} from '../_models/index';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit, OnChanges {


   @Input()  title = '';
   @Input()  navmenu: Navmenu[] = [];



  constructor() { }

  ngOnChanges(changes: SimpleChanges) {

  }

  ngOnInit() {
  }
  onHidden(): void {

  }
  onShown(): void {

  }
  isOpenChange(): void {

  }


}
