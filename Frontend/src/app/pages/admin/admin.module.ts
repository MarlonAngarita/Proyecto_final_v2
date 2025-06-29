import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [CommonModule, FormsModule]
  // Este módulo puede ser eliminado si no se usa para otros componentes no-standalone
})
export class AdminModule {}
