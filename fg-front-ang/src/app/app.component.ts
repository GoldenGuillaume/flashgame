import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  windowScrolled: boolean;
  badgeHidden: boolean;
  private yOffSet: any;

  @ViewChild('navbar') navElement: ElementRef;

  constructor() {
    this.windowScrolled = false;
    this.badgeHidden    = true;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.yOffSet = this.navElement.nativeElement.offsetTop;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currYOffset = window.pageYOffset;

    if (this.yOffSet < currYOffset) {
      this.windowScrolled = true;
    } else {
      this.windowScrolled = false;
    }
  }
}
