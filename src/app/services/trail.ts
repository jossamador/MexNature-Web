import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trail {
  id: number;
  placeId: number;
  name: string;
  distanceKm: number;
  estimatedTimeMinutes: number;
  difficulty: string;
  isLoop: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TrailService {
  // Apunta al nuevo endpoint que creaste en .NET
  private apiUrl = 'http://localhost:5141/api/places/trails';

  constructor(private http: HttpClient) { }

  getTrails(): Observable<Trail[]> {
    return this.http.get<Trail[]>(this.apiUrl);
  }
}