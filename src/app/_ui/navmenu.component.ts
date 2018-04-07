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
    // console.log(JSON.stringify(changes));
    // console.log(this.navmenu);
  }

  ngOnInit() {
  }
  onHidden(): void {
    // console.log('Dropdown is hidden');
  }
  onShown(): void {
    // console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    // console.log('Dropdown state is changed');
  }


}
