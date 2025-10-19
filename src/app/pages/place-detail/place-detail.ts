import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class PlaceDetail implements OnInit, AfterViewInit { // 1. Implementamos AfterViewInit
  private route = inject(ActivatedRoute);
  private placeService = inject(PlaceService);

  public place: Place | null = null;
  public loading = true;

  @ViewChild('miniMapContainer') miniMapContainer!: ElementRef;
  private map?: mapboxgl.Map; // Propiedad para guardar la instancia del mapa

  ngOnInit(): void {
    // En ngOnInit SOLO nos preocupamos de obtener los datos
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
        // Intentamos crear el mapa aquí, por si la vista ya está lista
        this.createMiniMap();
      },
      error: (err) => {
        console.error('Error fetching place details:', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Cuando la vista esté lista, también intentamos crear el mapa
    this.createMiniMap();
  }

  createMiniMap(): void {
    // --- LA LÓGICA DE SEGURIDAD ---
    // Si el mapa ya existe, o los datos no han llegado, o el contenedor no está listo, no hacemos nada.
    if (this.map || !this.place || !this.miniMapContainer) {
      return;
    }

    (mapboxgl as any).accessToken = environment.mapboxToken;

    this.map = new mapboxgl.Map({
      container: this.miniMapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [this.place.longitude, this.place.latitude],
      zoom: 13,
      interactive: false
    });

    new mapboxgl.Marker()
      .setLngLat([this.place.longitude, this.place.latitude])
      .addTo(this.map);
  }
}