import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

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
    return this.http.get<Place[]>(this.apiUrl).pipe(
      catchError(this.handleError)
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