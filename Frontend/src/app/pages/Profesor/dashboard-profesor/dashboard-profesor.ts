import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard-profesor',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-profesor.html',
  styleUrl: './dashboard-profesor.css',
})
export class DashboardProfesor {
  nombreProfesor = 'Profe Sandra';
  avatarURL = 'https://api.dicebear.com/9.x/fun-emoji/svg';

  cursosAsignados = [
    {
      id: 1,
      nombre: 'Lógica Computacional',
      estudiantes: ['Carlos', 'Ana', 'Luis'],
    },
    {
      id: 2,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
    {
      id: 3,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
    {
      id: 3,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
    {
      id: 4,
      nombre: 'Pensamiento Algorítmico',
      estudiantes: ['María', 'Pedro'],
    },
  ];

  progresoEstudiantes = [
    {
      nombre: 'Carlos',
      curso: 'Lógica Computacional',
      modulo: 'Intro',
      porcentaje: 85,
    },
    {
      nombre: 'Ana',
      curso: 'Lógica Computacional',
      modulo: 'Condicionales',
      porcentaje: 60,
    },
    {
      nombre: 'Pedro',
      curso: 'Pensamiento Algorítmico',
      modulo: 'Bucles',
      porcentaje: 40,
    },
  ];
}
