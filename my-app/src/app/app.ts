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
// ----------------------------
  // 2. Fundamental arguments
  // ----------------------------
  getFundamentalArgs(T: number) {
    const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T*T + T*T*T/538841 - T*T*T*T/65194000;
    const D  = 297.8501921 + 445267.1114034 * T - 0.0018819 * T*T + T*T*T/545868 - T*T*T*T/113065000;
    const M  = 357.5291092 + 35999.0502909 * T - 0.0001536 * T*T + T*T*T/24490000;
    const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T*T + T*T*T/69699 - T*T*T*T/14712000;
    const F  = 93.2720950 + 483202.0175233 * T - 0.0036539 * T*T - T*T*T/3526000 + T*T*T*T/863310000;
    return { L0: L0*this.RAD, D: D*this.RAD, M: M*this.RAD, Mp: Mp*this.RAD, F: F*this.RAD };
  }
 // ----------------------------
  // 3. Meeus Base Model
  // ----------------------------
  meeusBase(args: any) {
    const {L0, D, M, Mp, F} = args;
    const lonMeeus = L0 + (
      6.289 * Math.sin(Mp) +
      1.274 * Math.sin(2*D - Mp) +
      0.658 * Math.sin(2*D) +
      0.214 * Math.sin(2*Mp) -
      0.186 * Math.sin(M)
    ) * this.RAD;

    const latMeeus = (
      5.128 * Math.sin(F) +
      0.280 * Math.sin(Mp + F) +
      0.277 * Math.sin(Mp - F) +
      0.173 * Math.sin(2*D - F)
    ) * this.RAD;

    const distMeeus = 385000.56 -
      20905.0 * Math.cos(Mp) -
      3699.0  * Math.cos(2*D - Mp) -
      2956.0  * Math.cos(2*D) -
      570.0   * Math.cos(2*Mp);

    return { lonMeeus, latMeeus, distMeeus };
  }
 // ----------------------------
  // 4. ELP Corrections
  // ----------------------------
  ELP_LON = [
    [1.6769, 0,0,1,0,0],
    [0.5160, 2,0,-1,0,0],
    [0.4110, 0,0,2,0,0],
    [0.1850, 2,0,1,0,0],
    [0.1250, 2,0,0,0,0]
  ];
  ELP_LAT = [
    [0.2800, 0,0,1,1,0],
    [0.2500, 2,0,-1,1,0],
    [0.1100, 2,0,1,-1,0]
  ];
  ELP_DIST = [
    [-30.0,0,0,1,0,0],
    [-15.0,2,0,-1,0,0],
    [-12.0,2,0,1,0,0]
  ];

  applyELP(args: any) {
    const {D,M,Mp,F} = args;
    let dLon = 0, dLat = 0, dDist = 0;

    for (const t of this.ELP_LON) {
      const [A,dD,dM,dMp,dF] = t;
      const arg = dD*D + dM*M + dMp*Mp + dF*F;
      dLon += A * Math.sin(arg);
    }
    for (const t of this.ELP_LAT) {
      const [A,dD,dM,dMp,dF] = t;
      const arg = dD*D + dM*M + dMp*Mp + dF*F;
      dLat += A * Math.sin(arg);
    }
    for (const t of this.ELP_DIST) {
      const [A,dD,dM,dMp,dF] = t;
      const arg = dD*D + dM*M + dMp*Mp + dF*F;
      dDist += A * Math.cos(arg);
    }
    return { lonELP: dLon*this.RAD, latELP: dLat*this.RAD, distELP: dDist };
  }










