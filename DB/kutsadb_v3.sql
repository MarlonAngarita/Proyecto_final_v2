--
-- Create model Avatares
--
CREATE TABLE `avatares` (`id_avatar` integer AUTO_INCREMENT NOT NULL 
PRIMARY KEY, `nombre_avatar` varchar(100) NOT NULL, `imagen_url` varchar(255) NOT NULL);
--
-- Create model Cursos
--
CREATE TABLE `cursos` (`id_curso` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nombre_curso` varchar(100) NOT NULL, `descripcion_curso` longtext NOT NULL, `fecha_inicio` date NOT NULL, `fecha_fin` date NOT 
NULL, `fecha_creacion` datetime(6) NULL);
--
-- Create model Desafios
--
CREATE TABLE `desafios` (`id_desafio` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nombre_desafio` varchar(100) NOT NULL, `descripcion` longtext NOT NULL, `recompensa` integer NULL, `dificultad` varchar(50) NOT NULL);
--
-- Create model Medallas
--
CREATE TABLE `medallas` (`id_medalla` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nombre_medalla` varchar(100) NOT NULL, `descripcion` longtext NOT NULL, `icono_url` varchar(255) NOT NULL);
--
-- Create model Niveles
--
CREATE TABLE `niveles` (`id_nivel` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nombre_nivel` varchar(100) NOT NULL, `requisitos` longtext NOT NULL);
--
-- Create model Roles
--
CREATE TABLE `roles` (`id_rol` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nombre_rol` varchar(50) NOT NULL UNIQUE);
--
-- Create model TipoDocumento
--
CREATE TABLE `tipo_documento` (`id_tipo_documento` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nombre_tipo` varchar(50) NOT NULL UNIQUE);
--
-- Create model Modulos
--
CREATE TABLE `modulos` (`id_modulo` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `nombre_modulo` varchar(100) NOT NULL, `contenido_modulo` longtext NOT NULL, `id_curso` integer NOT NULL);
--
-- Create model Quiz
--
CREATE TABLE `quiz` (`id_quiz` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `pregunta` longtext NOT NULL, `opcion_a` varchar(255) NOT NULL, `opcion_b` varchar(255) NOT NULL, `opcion_c` varchar(255) NOT NULL, `opcion_d` varchar(255) NOT NULL, `respuesta_correcta` varchar(255) 
NOT NULL, `id_modulo` integer NOT NULL);
--
-- Create model Usuarios
--
CREATE TABLE `usuarios` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY 
KEY, `password` varchar(128) NOT NULL, `last_login` datetime(6) NULL, `is_superuser` bool NOT NULL, `username` varchar(150) NOT NULL UNIQUE, `first_name` varchar(150) NOT NULL, `last_name` varchar(150) NOT NULL, `is_staff` bool NOT NULL, `is_active` bool NOT NULL, `date_joined` datetime(6) NOT NULL, `email` varchar(254) NOT NULL UNIQUE, `nombre` varchar(100) NOT NULL, `id_avatar` integer NULL, `id_rol` integer 
NULL, `id_tipo_documento` integer NULL);
CREATE TABLE `usuarios_groups` (`id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY, `usuarios_id` bigint NOT NULL, `group_id` integer NOT NULL);
CREATE TABLE `usuarios_user_permissions` (`id` bigint AUTO_INCREMENT 
NOT NULL PRIMARY KEY, `usuarios_id` bigint NOT NULL, `permission_id` 
integer NOT NULL);
--
-- Create model RachasUsuario
--
CREATE TABLE `rachas_usuario` (`id_racha` integer AUTO_INCREMENT NOT 
NULL PRIMARY KEY, `dias_consecutivos` integer NOT NULL, `ultima_actividad` datetime(6) NULL, `id_usuario` bigint NOT NULL UNIQUE);        
--
-- Create model Gamificacion
--
CREATE TABLE `gamificacion` (`id_gamificacion` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `tipo_recompensa` varchar(50) NOT NULL, `cantidad` integer NULL, `fecha_obtenida` datetime(6) NOT NULL, `id_usuario` bigint NOT NULL);
--
-- Create model Foro
--
CREATE TABLE `foro` (`id_foro` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `titulo` varchar(255) NOT NULL, `contenido` longtext NOT NULL, `fecha_publicacion` datetime(6) NOT NULL, `id_usuario` bigint NOT NULL);
--
-- Add field id_profesor to cursos
--
ALTER TABLE `cursos` ADD COLUMN `id_profesor` bigint NULL , ADD CONSTRAINT `cursos_id_profesor_1aca49b5_fk_usuarios_id` FOREIGN KEY (`id_profesor`) REFERENCES `usuarios`(`id`);
--
-- Create model CursosNivel
--
CREATE TABLE `cursos_nivel` (`id_curso_nivel` integer AUTO_INCREMENT 
NOT NULL PRIMARY KEY, `id_curso` integer NOT NULL, `id_nivel` integer NOT NULL);
--
-- Create model ProgresoUsuario
--
CREATE TABLE `progreso_usuario` (`id_progreso` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `completado` bool NOT NULL, `fecha_completado` datetime(6) NULL, `id_modulo` integer NOT NULL, `id_usuario` bigint 
NOT NULL);
--
-- Create model NivelesUsuario
--
CREATE TABLE `niveles_usuario` (`id_nivel_usuario` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `fecha_asignacion` datetime(6) NOT NULL, `id_nivel` integer NOT NULL, `id_usuario` bigint NOT NULL);
--
-- Create model MedallasUsuario
--
CREATE TABLE `medallas_usuario` (`id_medalla_usuario` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `fecha_obtencion` datetime(6) NOT NULL, `id_medalla` integer NOT NULL, `id_usuario` bigint NOT NULL);       
--
-- Create model DesafiosUsuario
--
CREATE TABLE `desafios_usuario` (`id_desafio_usuario` integer AUTO_INCREMENT NOT NULL PRIMARY KEY, `completado` bool NOT NULL, `fecha_completado` datetime(6) NULL, `id_desafio` integer NOT NULL, `id_usuario` bigint NOT NULL);
ALTER TABLE `modulos` ADD CONSTRAINT `modulos_id_curso_6bf45596_fk_cursos_id_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`);
ALTER TABLE `quiz` ADD CONSTRAINT `quiz_id_modulo_38889840_fk_modulos_id_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`);
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_avatar_7c565e4e_fk_avatares_id_avatar` FOREIGN KEY (`id_avatar`) REFERENCES `avatares` 
(`id_avatar`);
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_rol_af950121_fk_roles_id_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);    
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_id_tipo_documento_b3e930ba_fk_tipo_docu` FOREIGN KEY (`id_tipo_documento`) REFERENCES `tipo_documento` (`id_tipo_documento`);
ALTER TABLE `usuarios_groups` ADD CONSTRAINT `usuarios_groups_usuarios_id_group_id_d3682510_uniq` UNIQUE (`usuarios_id`, `group_id`);     
ALTER TABLE `usuarios_groups` ADD CONSTRAINT `usuarios_groups_usuarios_id_a9fa29e6_fk_usuarios_id` FOREIGN KEY (`usuarios_id`) REFERENCES 
`usuarios` (`id`);
ALTER TABLE `usuarios_groups` ADD CONSTRAINT `usuarios_groups_group_id_18c61092_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);
ALTER TABLE `usuarios_user_permissions` ADD CONSTRAINT `usuarios_user_permission_usuarios_id_permission_i_0cd0bc89_uniq` UNIQUE (`usuarios_id`, `permission_id`);
ALTER TABLE `usuarios_user_permissions` ADD CONSTRAINT `usuarios_user_permissions_usuarios_id_cdb60ce9_fk_usuarios_id` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`);
ALTER TABLE `usuarios_user_permissions` ADD CONSTRAINT `usuarios_user_permis_permission_id_af615ca1_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);
ALTER TABLE `rachas_usuario` ADD CONSTRAINT `rachas_usuario_id_usuario_9c39baf7_fk_usuarios_id` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);
ALTER TABLE `gamificacion` ADD CONSTRAINT `gamificacion_id_usuario_e9fcc5ff_fk_usuarios_id` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);
ALTER TABLE `foro` ADD CONSTRAINT `foro_id_usuario_62360363_fk_usuarios_id` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);      
ALTER TABLE `cursos_nivel` ADD CONSTRAINT `cursos_nivel_id_curso_id_nivel_d976f62d_uniq` UNIQUE (`id_curso`, `id_nivel`);
ALTER TABLE `cursos_nivel` ADD CONSTRAINT `cursos_nivel_id_curso_e07d9e6a_fk_cursos_id_curso` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id_curso`);
ALTER TABLE `cursos_nivel` ADD CONSTRAINT `cursos_nivel_id_nivel_cecfac81_fk_niveles_id_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id_nivel`);
ALTER TABLE `progreso_usuario` ADD CONSTRAINT `progreso_usuario_id_usuario_id_modulo_6f95d987_uniq` UNIQUE (`id_usuario`, `id_modulo`);   
ALTER TABLE `progreso_usuario` ADD CONSTRAINT `progreso_usuario_id_modulo_f6f1f6f9_fk_modulos_id_modulo` FOREIGN KEY (`id_modulo`) REFERENCES `modulos` (`id_modulo`);
ALTER TABLE `progreso_usuario` ADD CONSTRAINT `progreso_usuario_id_usuario_fa6ef70d_fk_usuarios_id` FOREIGN KEY (`id_usuario`) REFERENCES 
`usuarios` (`id`);
ALTER TABLE `niveles_usuario` ADD CONSTRAINT `niveles_usuario_id_usuario_id_nivel_422646c2_uniq` UNIQUE (`id_usuario`, `id_nivel`);       
ALTER TABLE `niveles_usuario` ADD CONSTRAINT `niveles_usuario_id_nivel_ccf6ae0d_fk_niveles_id_nivel` FOREIGN KEY (`id_nivel`) REFERENCES `niveles` (`id_nivel`);
ALTER TABLE `niveles_usuario` ADD CONSTRAINT `niveles_usuario_id_usuario_1a7a81e2_fk_usuarios_id` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);
ALTER TABLE `medallas_usuario` ADD CONSTRAINT `medallas_usuario_id_usuario_id_medalla_8f89493f_uniq` UNIQUE (`id_usuario`, `id_medalla`); 
ALTER TABLE `medallas_usuario` ADD CONSTRAINT `medallas_usuario_id_medalla_0c9a0657_fk_medallas_id_medalla` FOREIGN KEY (`id_medalla`) REFERENCES `medallas` (`id_medalla`);
ALTER TABLE `medallas_usuario` ADD CONSTRAINT `medallas_usuario_id_usuario_46f22671_fk_usuarios_id` FOREIGN KEY (`id_usuario`) REFERENCES 
`usuarios` (`id`);
ALTER TABLE `desafios_usuario` ADD CONSTRAINT `desafios_usuario_id_usuario_id_desafio_33f20c6a_uniq` UNIQUE (`id_usuario`, `id_desafio`); 
ALTER TABLE `desafios_usuario` ADD CONSTRAINT `desafios_usuario_id_desafio_c3815c60_fk_desafios_id_desafio` FOREIGN KEY (`id_desafio`) REFERENCES `desafios` (`id_desafio`);
ALTER TABLE `desafios_usuario` ADD CONSTRAINT `desafios_usuario_id_usuario_4de034b5_fk_usuarios_id` FOREIGN KEY (`id_usuario`) REFERENCES 
`usuarios` (`id`);
