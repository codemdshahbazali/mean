import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav1',
  templateUrl: './sidenav1.component.html',
  styleUrl: './sidenav1.component.css',
})
export class Sidenav1Component {
  open: boolean = true;
  toggleDrawer() {
    this.open = !this.open;
  }
}
