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
// ----------------------------
  // 1. Julian Day
  // ----------------------------
  julianDay(date: Date): number {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate() +
      date.getUTCHours() / 24 +
      date.getUTCMinutes() / 1440 +
      date.getUTCSeconds() / 86400;
    if (month <= 2) {
      month += 12;
      year -= 1;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day + B - 1524.5;
  }






