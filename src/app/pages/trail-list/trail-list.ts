import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// ✅ CORREGIDO: Importamos Trail desde el servicio
import { Trail, TrailService } from '../../services/trail';

@Component({
  selector: 'app-trail-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trail-list.html',
  styleUrl: './trail-list.css'
})
export class TrailList implements OnInit {
  trails: Trail[] = [];
  loading = true;
  selectedDifficulty = 'all';

  private trailService = inject(TrailService);

  ngOnInit(): void {
    this.loadTrails();
  }

  loadTrails(): void {
    this.loading = true;
    this.trailService.getTrails().subscribe({
      next: (data) => {
        this.trails = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching trails:', err);
        this.loading = false;
      }
    });
  }

  // El resto de tus métodos no necesitan cambios.
  get filteredTrails(): Trail[] {
    if (this.selectedDifficulty === 'all') {
      return this.trails;
    }
    return this.trails.filter(trail => trail.difficulty === this.selectedDifficulty);
  }

  get difficulties(): string[] {
    return [...new Set(this.trails.map(trail => trail.difficulty))].sort();
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Fácil': return '#48bb78';
      case 'Moderada': return '#ed8936';
      case 'Difícil': return '#e53e3e';
      case 'Muy Difícil': return '#9f2c2c';
      default: return '#718096';
    }
  }
}