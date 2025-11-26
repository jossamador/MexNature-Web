import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { environment } from '../../environments/environment';

// --- 1. INTERFACES ACTUALIZADAS PARA LA PÁGINA DE DETALLE ---
export interface Photo {
  id: number;
  url: string;
}

export interface Trail {
  id: number;
  name: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  difficulty: string;
}

export interface Amenity {
  id: number;
  name: string;
}

// Interfaz Place actualizada para incluir los detalles
export interface Place {
  id: number;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  accessible: boolean;
  entryFee: number;
  openingHours: string;
  photos: Photo[];
  trails: Trail[];
  placeAmenities: { amenity: Amenity }[];
}


@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private apiUrl = environment.apiUrl + '/places';

  constructor(private http: HttpClient) { }

  // Tu método getPlaces() se queda como está
  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('API Error, using mock data:', error);
        // Tu lógica de datos de prueba se conserva
        const mockPlaces: any[] = [ /* ... tus datos de prueba ... */ ];
        return of(mockPlaces);
      })
    );
  }

  // --- 2. MÉTODO NUEVO AÑADIDO ---
  getPlaceById(id: number): Observable<Place> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Place>(url).pipe(
      catchError(this.handleError) // Reutilizamos tu excelente manejo de errores
    );
  }

  // Tu método handleError() se queda como está
  private handleError(error: HttpErrorResponse) {
    console.error('PlaceService Error:', error);
    if (error.status === 0) {
      return throwError(() => new Error('No se puede conectar al servidor.'));
    }
    return throwError(() => new Error('Ocurrió un error inesperado'));
  }
}