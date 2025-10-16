import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';

// ✅ 1. Asegúrate de que esta interfaz esté aquí y se exporte
export interface Place {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private apiUrl = 'http://localhost:5141/api/places';

  constructor(private http: HttpClient) { }

  // ✅ 2. Asegúrate de que el método devuelva un Observable<Place[]>
  getPlaces(): Observable<Place[]> {
    console.log('Connecting to API:', this.apiUrl);
    return this.http.get<Place[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error connecting to your API, using fallback data:', error);
        // Solo usar datos de prueba como último recurso si tu API falla
        const mockPlaces: Place[] = [
          {
            id: 1,
            name: "Chichen Itzá",
            category: "Zona Arqueológica",
            latitude: 20.6843,
            longitude: -88.5678
          },
          {
            id: 2,
            name: "Cenote Dos Ojos",
            category: "Cenote",
            latitude: 20.2259,
            longitude: -87.3906
          },
          {
            id: 3,
            name: "Palenque",
            category: "Zona Arqueológica",
            latitude: 17.4839,
            longitude: -92.0458
          },
          {
            id: 4,
            name: "Pico de Orizaba",
            category: "Volcán",
            latitude: 19.0310,
            longitude: -97.2679
          },
          {
            id: 5,
            name: "Reserva de la Biosfera Sian Ka'an",
            category: "Reserva Natural",
            latitude: 19.5206,
            longitude: -87.9394
          }
        ];
        return of(mockPlaces);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('PlaceService Error:', error);
    
    if (error.status === 0) {
      // Error de conexión
      return throwError(() => new Error('No se puede conectar al servidor. Verifica que la API esté ejecutándose.'));
    } else if (error.status >= 400 && error.status < 500) {
      // Error del cliente
      return throwError(() => new Error('Error en la solicitud: ' + error.message));
    } else if (error.status >= 500) {
      // Error del servidor
      return throwError(() => new Error('Error del servidor: ' + error.message));
    }
    
    return throwError(() => new Error('Ocurrió un error inesperado'));
  }
}