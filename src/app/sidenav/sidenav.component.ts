import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {
  drawerOpened = true;

  toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }

  @ViewChild('drawer') drawer: MatDrawer;

  toggleSidebar() {
    this.drawer.toggle(); // Toggles the expanded/collapsed state
    // this.drawer.opened ? this.drawer.close() : this.drawer.open(); // Alternative approach
  }
}
