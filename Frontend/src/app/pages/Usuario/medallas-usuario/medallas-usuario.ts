import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedallasService } from '../../../services/medallas.service';

@Component({
  selector: 'app-medallas-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medallas-usuario.html',
  styleUrls: ['./medallas-usuario.css'],
})
export class MedallasUsuario implements OnInit {
  medallas: any[] = [];

  // Simulamos el estado actual del usuario
  estadoUsuario = {
    desafiosResueltos: 7,
    cursosCompletados: 2,
    rachaDias: 4,
    usoProteccionRacha: 1,
    recuperacionesUsadas: 1
  };

  constructor(private medallasService: MedallasService) {}

  ngOnInit(): void {
    this.medallas = this.medallasService.obtenerMedallas(this.estadoUsuario);
  }
}
