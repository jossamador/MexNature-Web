import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaz para senderos
export interface Trail {
  id: number;
  name: string;
  difficulty: string;
  length: number; // en kilómetros
  duration: string; // tiempo estimado
  location: string;
  description: string;
}

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

  ngOnInit(): void {
    this.loadTrails();
  }

  loadTrails(): void {
    // Datos de prueba de senderos mexicanos
    this.trails = [
      {
        id: 1,
        name: "Sendero a la Cascada de Basaseachi",
        difficulty: "Moderado",
        length: 8.5,
        duration: "4-5 horas",
        location: "Chihuahua",
        description: "Un hermoso sendero que lleva a una de las cascadas más altas de México."
      },
      {
        id: 2,
        name: "Sendero Nevado de Toluca",
        difficulty: "Difícil",
        length: 12.0,
        duration: "6-8 horas",
        location: "Estado de México",
        description: "Ascenso al volcán Nevado de Toluca, con vistas espectaculares de los lagos cratéricos."
      },
      {
        id: 3,
        name: "Sendero La Malinche",
        difficulty: "Moderado",
        length: 6.2,
        duration: "3-4 horas",
        location: "Tlaxcala",
        description: "Caminata hacia la cumbre de La Malinche, ideal para principiantes en montañismo."
      },
      {
        id: 4,
        name: "Sendero Cerro de la Silla",
        difficulty: "Fácil",
        length: 4.0,
        duration: "2-3 horas",
        location: "Nuevo León",
        description: "Sendero urbano con excelentes vistas de Monterrey y el área metropolitana."
      },
      {
        id: 5,
        name: "Sendero Pico de Orizaba",
        difficulty: "Muy Difícil",
        length: 15.0,
        duration: "10-12 horas",
        location: "Veracruz/Puebla",
        description: "Ascenso al pico más alto de México, requiere experiencia en alta montaña."
      },
      {
        id: 6,
        name: "Sendero Hierve el Agua",
        difficulty: "Fácil",
        length: 2.5,
        duration: "1-2 horas",
        location: "Oaxaca",
        description: "Caminata corta hacia las formaciones naturales de carbonato de calcio."
      }
    ];
    
    setTimeout(() => {
      this.loading = false;
    }, 1000); // Simulamos carga
  }

  get filteredTrails(): Trail[] {
    if (this.selectedDifficulty === 'all') {
      return this.trails;
    }
    return this.trails.filter(trail => trail.difficulty === this.selectedDifficulty);
  }

  get difficulties(): string[] {
    const diffs = [...new Set(this.trails.map(trail => trail.difficulty))];
    return diffs.sort();
  }

  filterByDifficulty(difficulty: string): void {
    this.selectedDifficulty = difficulty;
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Fácil': return '#48bb78';
      case 'Moderado': return '#ed8936';
      case 'Difícil': return '#e53e3e';
      case 'Muy Difícil': return '#9f2c2c';
      default: return '#718096';
    }
  }
}
