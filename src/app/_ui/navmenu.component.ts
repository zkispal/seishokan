import { Component, OnInit, Input } from '@angular/core';
import {Navmenu} from '../_models/index';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {


   @Input()  title: String = '';
   @Input()  navmenu: Navmenu[] = [];



  constructor() { }

  ngOnInit() {
  }
  onHidden(): void {
    console.log('Dropdown is hidden');
  }
  onShown(): void {
    console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    console.log('Dropdown state is changed');
  }


}
