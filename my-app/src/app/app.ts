import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true,
  imports: [CommonModule]
})
export class App implements OnInit {

  RAD = Math.PI / 180;
moonData: {
    date?: string;
    longitude?: number;
    latitude?: number;
    distance?: number;
  } = {};

  constructor(private zone: NgZone) {}

  ngOnInit(): void {
    this.updateMoon(); // initial update

    this.zone.runOutsideAngular(() => {
      setInterval(() => {
        this.zone.run(() => this.updateMoon());
      }, 1000);
    });
  }




