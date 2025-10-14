// src/app/pages/home/home.ts
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core'; // 1. IMPORTA AfterViewInit
import { environment } from '../../../environments/environment';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
// 2. IMPLEMENTA AfterViewInit
export class Home implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  // 3. CAMBIA EL MÉTODO A ngAfterViewInit
  ngAfterViewInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;

    const map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-99.1332, 19.4326],
      zoom: 5
    });
  }
}