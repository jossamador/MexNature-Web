import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Place, PlaceService } from '../../services/place';
import { switchMap } from 'rxjs/operators';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.css'
})
export class PlaceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private placeService = inject(PlaceService);

  public place: Place | null = null;
  public loading = true;

  @ViewChild('miniMapContainer') miniMapContainer!: ElementRef;

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        this.loading = true;
        return this.placeService.getPlaceById(id);
      })
    ).subscribe({
      next: (data) => {
        this.place = data;
        this.loading = false;
        
        // --- LA SOLUCIÓN ESTÁ AQUÍ ---
        // Ponemos la creación del mapa dentro de un setTimeout.
        // Esto le da a Angular el tiempo justo para renderizar el @if y crear el div del mapa.
        setTimeout(() => {
          this.createMiniMap();
        }, 0);
      },
      error: (err) => {
        console.error('Error fetching place details:', err);
        this.loading = false;
      }
    });
  }

  createMiniMap(): void {
    if (!this.place || !this.miniMapContainer) return;

    (mapboxgl as any).accessToken = environment.mapboxToken;
    
    const map = new mapboxgl.Map({
      container: this.miniMapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.place.longitude, this.place.latitude],
      zoom: 13,
      interactive: false
    });

    new mapboxgl.Marker()
      .setLngLat([this.place.longitude, this.place.latitude])
      .addTo(map);
  }
}