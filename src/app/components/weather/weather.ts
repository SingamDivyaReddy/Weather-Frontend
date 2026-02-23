import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './weather.html',
  styleUrls: ['./weather.css']
})
export class Weather implements AfterViewInit {

  city = '';
  weatherData: any;

  map: any;
  marker: any;
  private L: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngAfterViewInit(): Promise<void> {

    if (isPlatformBrowser(this.platformId)) {

      this.L = await import('leaflet');

      this.map = this.L.map('map').setView([20.5937, 78.9629], 5);

      this.L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '&copy; OpenStreetMap contributors' }
      ).addTo(this.map);
    }
  }

  searchWeather(): void {

    if (!this.city) return;

    this.http.get<any>(
      `https://localhost:7164/api/weather/${this.city}`
    ).subscribe({
      next: (response) => {

        this.weatherData = response;

        if (isPlatformBrowser(this.platformId) && this.map) {

          const lat = Number(response.latitude);
          const lon = Number(response.longitude);

          if (!isNaN(lat) && !isNaN(lon)) {

            setTimeout(() => {

              this.map.invalidateSize();
              this.map.setView([lat, lon], 10);

              if (this.marker) {
                this.map.removeLayer(this.marker);
              }

              this.marker = this.L.marker([lat, lon])
                .addTo(this.map)
                .bindPopup(response.city)
                .openPopup();

            }, 0);
          }
        }
      },

      error: (error) => {

        console.log("Error status:", error.status);

        if (error.status === 401) {
          console.log("Token expired → logging out");

          localStorage.removeItem('token');
          this.router.navigate(['']);
        }
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}