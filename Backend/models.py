# ===================================================================================================
# MODELOS DE DATOS - SISTEMA KÜTSA
# ===================================================================================================

"""
Modelos de datos para la plataforma educativa Kütsa

Este archivo contiene todos los modelos de Django que representan las entidades
del sistema educativo, incluyendo usuarios, cursos, gamificación, y funcionalidades
de aprendizaje.

Arquitectura:
- Usuarios y autenticación
- Gestión de cursos y contenido educativo
- Sistema de gamificación (medallas, rachas, progreso)
- Foros y comunicación
- Quiz y evaluaciones

TODO: Considerar integrar el modelo Usuarios con el sistema de autenticación de Django
      (por ejemplo, heredando de AbstractUser o AbstractBaseUser) para un manejo
      seguro y automático de contraseñas y otras funcionalidades de usuario.
      ¡IMPORTANTE! Las contraseñas NUNCA deben almacenarse en texto plano.
      Asegúrate de que se están hasheando correctamente antes de guardarlas si no usas
      el sistema de autenticación de Django.

@author Sistema Kütsa
@version 2.0 - Modelos con documentación completa
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# ===================================================================================================
# MODELOS DE CONFIGURACIÓN Y CATÁLOGOS
# ===================================================================================================


class Avatares(models.Model):
    """
    Modelo para gestionar avatares de usuarios

    Permite a los usuarios personalizar su perfil con imágenes
    representativas. Los avatares son opcionales y mejoran la
    experiencia de usuario.
    """

    id_avatar = models.AutoField(primary_key=True)
    nombre_avatar = models.CharField(
        max_length=100, help_text="Nombre descriptivo del avatar"
    )
    imagen_url = models.CharField(
        max_length=255, help_text="URL de la imagen del avatar"
    )

    class Meta:
        db_table = "avatares"
        verbose_name = "Avatar"
        verbose_name_plural = "Avatares"

    def __str__(self):
        return self.nombre_avatar


class Roles(models.Model):
    """
    Modelo para definir roles de usuario en el sistema

    Define los diferentes tipos de usuarios y sus permisos:
    - Estudiante: acceso a cursos y contenido
    - Profesor: creación y gestión de contenido
    - Administrador: gestión completa del sistema
    """

    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(
        unique=True, max_length=50, help_text="Nombre único del rol"
    )

    class Meta:
        db_table = "roles"
        verbose_name = "Rol"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.nombre_rol


class TipoDocumento(models.Model):
    """
    Modelo para tipos de documentos de identificación

    Permite gestionar diferentes tipos de identificación
    según el país o región (CI, DNI, Pasaporte, etc.)
    """

    id_tipo_documento = models.AutoField(primary_key=True)
    nombre_tipo = models.CharField(
        unique=True, max_length=50, help_text="Tipo de documento de identificación"
    )

    class Meta:
        db_table = "tipo_documento"
        verbose_name = "Tipo de Documento"
        verbose_name_plural = "Tipos de Documento"

    def __str__(self):
        return self.nombre_tipo


class Usuarios(AbstractUser):
    # AbstractUser ya provee: username, first_name, last_name, email, password,
    # groups, user_permissions, is_staff, is_active, is_superuser, last_login, date_joined.
    # El campo 'id' (AutoField, primary_key=True) también es heredado.

    # 1. Hacemos que el campo 'email' (heredado de AbstractUser) sea único.
    email = models.EmailField(_("correo electrónico"), unique=True)

    # 2. Establecemos 'email' como el USERNAME_FIELD.
    USERNAME_FIELD = "email"

    # 3. Campos requeridos al crear un superusuario.
    # 'username' es el campo original de AbstractUser.
    # 'nombre' es nuestro campo personalizado.
    REQUIRED_FIELDS = ["username", "nombre"]

    # --- Tus campos personalizados ---
    nombre = models.CharField(
        _("nombre completo"), max_length=100, blank=True
    )  # blank=True si no es estrictamente requerido siempre

    id_rol = models.ForeignKey(
        Roles,
        on_delete=models.PROTECT,
        db_column="id_rol",
        null=True,
        blank=True,  # Permitir que un usuario no tenga rol inicialmente
        related_name="usuarios_con_este_rol",
    )
    id_avatar = models.ForeignKey(
        Avatares,
        on_delete=models.SET_NULL,
        db_column="id_avatar",
        null=True,
        blank=True,
        related_name="usuarios_con_este_avatar",
    )
    id_tipo_documento = models.ForeignKey(
        TipoDocumento,
        on_delete=models.PROTECT,
        db_column="id_tipo_documento",
        null=True,
        blank=True,  # Permitir que un usuario no tenga tipo de doc. inicialmente
        related_name="usuarios_con_este_tipo_doc",
    )

    class Meta(AbstractUser.Meta):
        db_table = "usuarios"  # Mantenemos el nombre de tabla original si es necesario
        verbose_name = _("Usuario")
        verbose_name_plural = _("Usuarios")
        # swappable = 'AUTH_USER_MODEL' # No es necesario aquí, se define en settings.py

    def __str__(self):
        return self.email


class Cursos(models.Model):
    id_curso = models.AutoField(primary_key=True)
    nombre_curso = models.CharField(max_length=100)
    descripcion_curso = models.TextField()
    # id_profesor ahora apunta al nuevo modelo Usuarios
    id_profesor = models.ForeignKey(
        Usuarios,
        on_delete=models.SET_NULL,
        db_column="id_profesor",
        null=True,
        blank=True,
        related_name="cursos_impartidos",
    )
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    fecha_creacion = models.DateTimeField(
        auto_now_add=True, null=True, blank=True
    )  # auto_now_add es mejor si es fecha de creación

    class Meta:
        db_table = "cursos"
        verbose_name = "Curso"
        verbose_name_plural = "Cursos"

    def __str__(self):
        return self.nombre_curso


class Niveles(models.Model):
    id_nivel = models.AutoField(primary_key=True)
    nombre_nivel = models.CharField(max_length=100)
    requisitos = models.TextField()

    class Meta:
        db_table = "niveles"
        verbose_name = "Nivel"
        verbose_name_plural = "Niveles"

    def __str__(self):
        return self.nombre_nivel


class CursosNivel(models.Model):
    id_curso_nivel = models.AutoField(primary_key=True)
    id_curso = models.ForeignKey(Cursos, on_delete=models.CASCADE, db_column="id_curso")
    id_nivel = models.ForeignKey(
        Niveles, on_delete=models.CASCADE, db_column="id_nivel"
    )

    class Meta:
        db_table = "cursos_nivel"
        unique_together = (
            "id_curso",
            "id_nivel",
        )  # Buena práctica para tablas de muchos a muchos
        verbose_name = "Nivel de Curso"
        verbose_name_plural = "Niveles de Curso"

    def __str__(self):
        return f"{self.id_curso} - {self.id_nivel}"


class Desafios(models.Model):
    id_desafio = models.AutoField(primary_key=True)
    nombre_desafio = models.CharField(max_length=100)
    descripcion = models.TextField()
    recompensa = models.IntegerField(blank=True, null=True)
    dificultad = models.CharField(max_length=50)

    class Meta:
        db_table = "desafios"
        verbose_name = "Desafío"
        verbose_name_plural = "Desafíos"

    def __str__(self):
        return self.nombre_desafio


class DesafiosUsuario(models.Model):
    id_desafio_usuario = models.AutoField(primary_key=True)
    # id_usuario ahora apunta al nuevo modelo Usuarios
    id_usuario = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
        db_column="id_usuario",
        related_name="desafios_completados",
    )
    id_desafio = models.ForeignKey(
        Desafios, on_delete=models.CASCADE, db_column="id_desafio"
    )
    completado = models.BooleanField(default=False)  # BooleanField es más apropiado
    fecha_completado = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "desafios_usuario"
        unique_together = ("id_usuario", "id_desafio")
        verbose_name = "Desafío de Usuario"
        verbose_name_plural = "Desafíos de Usuario"

    def __str__(self):
        return f"{self.id_usuario} - {self.id_desafio}"


class Foro(models.Model):
    id_foro = models.AutoField(primary_key=True)
    # id_usuario ahora apunta al nuevo modelo Usuarios
    id_usuario = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
        db_column="id_usuario",
        related_name="publicaciones_foro",
    )
    titulo = models.CharField(max_length=255)
    contenido = models.TextField()
    fecha_publicacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "foro"
        verbose_name = "Publicación de Foro"
        verbose_name_plural = "Publicaciones de Foro"

    def __str__(self):
        return self.titulo


class Gamificacion(models.Model):
    id_gamificacion = models.AutoField(primary_key=True)
    # id_usuario ahora apunta al nuevo modelo Usuarios
    id_usuario = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
        db_column="id_usuario",
        related_name="recompensas_gamificacion",
    )
    tipo_recompensa = models.CharField(max_length=50)
    cantidad = models.IntegerField(blank=True, null=True)
    fecha_obtenida = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "gamificacion"
        verbose_name = "Recompensa de Gamificación"
        verbose_name_plural = "Recompensas de Gamificación"

    def __str__(self):
        return f"{self.id_usuario} - {self.tipo_recompensa}"


class Medallas(models.Model):
    id_medalla = models.AutoField(primary_key=True)
    nombre_medalla = models.CharField(max_length=100)
    descripcion = models.TextField()
    icono_url = models.CharField(
        max_length=255
    )  # Considerar ImageField si las imágenes se gestionan con Django

    class Meta:
        db_table = "medallas"
        verbose_name = "Medalla"
        verbose_name_plural = "Medallas"

    def __str__(self):
        return self.nombre_medalla


class MedallasUsuario(models.Model):
    id_medalla_usuario = models.AutoField(primary_key=True)
    # id_usuario ahora apunta al nuevo modelo Usuarios
    id_usuario = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
        db_column="id_usuario",
        related_name="medallas_obtenidas",
    )
    id_medalla = models.ForeignKey(
        Medallas, on_delete=models.CASCADE, db_column="id_medalla"
    )
    fecha_obtencion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "medallas_usuario"
        unique_together = ("id_usuario", "id_medalla")
        verbose_name = "Medalla de Usuario"
        verbose_name_plural = "Medallas de Usuario"

    def __str__(self):
        return f"{self.id_usuario} - {self.id_medalla}"


class Modulos(models.Model):
    id_modulo = models.AutoField(primary_key=True)
    nombre_modulo = models.CharField(max_length=100)
    contenido_modulo = models.TextField()
    id_curso = models.ForeignKey(Cursos, on_delete=models.CASCADE, db_column="id_curso")

    class Meta:
        db_table = "modulos"
        verbose_name = "Módulo"
        verbose_name_plural = "Módulos"

    def __str__(self):
        return self.nombre_modulo


class NivelesUsuario(models.Model):
    id_nivel_usuario = models.AutoField(primary_key=True)
    # id_usuario ahora apunta al nuevo modelo Usuarios
    id_usuario = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
        db_column="id_usuario",
        related_name="niveles_alcanzados",
    )
    id_nivel = models.ForeignKey(
        Niveles, on_delete=models.CASCADE, db_column="id_nivel"
    )
    fecha_asignacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "niveles_usuario"
        unique_together = ("id_usuario", "id_nivel")
        verbose_name = "Nivel de Usuario"
        verbose_name_plural = "Niveles de Usuario"

    def __str__(self):
        return f"{self.id_usuario} - {self.id_nivel}"


class ProgresoUsuario(models.Model):
    id_progreso = models.AutoField(primary_key=True)
    # id_usuario ahora apunta al nuevo modelo Usuarios
    id_usuario = models.ForeignKey(
        Usuarios,
        on_delete=models.CASCADE,
        db_column="id_usuario",
        related_name="progreso_modulos",
    )
    id_modulo = models.ForeignKey(
        Modulos, on_delete=models.CASCADE, db_column="id_modulo"
    )
    completado = models.BooleanField(default=False)  # BooleanField es más apropiado
    fecha_completado = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = "progreso_usuario"
        unique_together = ("id_usuario", "id_modulo")
        verbose_name = "Progreso de Usuario"
        verbose_name_plural = "Progresos de Usuario"

    def __str__(self):
        return f"{self.id_usuario} - {self.id_modulo} ({'Completado' if self.completado else 'Pendiente'})"


class Quiz(models.Model):
    id_quiz = models.AutoField(primary_key=True)
    id_modulo = models.ForeignKey(
        Modulos, on_delete=models.CASCADE, db_column="id_modulo"
    )
    pregunta = models.TextField()
    opcion_a = models.CharField(max_length=255)
    opcion_b = models.CharField(max_length=255)
    opcion_c = models.CharField(max_length=255)
    opcion_d = models.CharField(max_length=255)
    respuesta_correcta = models.CharField(
        max_length=255
    )  # Considerar un CharField con choices si las opciones son fijas (A, B, C, D)

    class Meta:
        db_table = "quiz"
        verbose_name = "Quiz"
        verbose_name_plural = "Quizzes"

    def __str__(self):
        return f"Quiz del módulo: {self.id_modulo.nombre_modulo} - Pregunta: {self.pregunta[:50]}..."


# ===================================================================================================
# MODELO DE SISTEMA DE RACHAS
# ===================================================================================================


class RachasUsuario(models.Model):
    """
    Modelo que gestiona las rachas de actividad diaria de los usuarios.

    Una racha representa días consecutivos de actividad del usuario en la plataforma.
    Este modelo es fundamental para el sistema gamificado y de motivación.

    Relaciones:
    - OneToOne con Usuarios: Cada usuario tiene una única racha

    Funcionalidades:
    - Tracking de días consecutivos de actividad
    - Registro de última actividad para validación
    - Base para sistema de objetivos y recompensas

    Consideraciones técnicas:
    - OneToOneField garantiza que cada usuario tenga una sola racha
    - ultima_actividad permite validar continuidad de la racha
    - dias_consecutivos se resetea cuando se rompe la continuidad

    @author Sistema Kütsa
    @version 1.0 - Modelo base para sistema de rachas
    """

    id_racha = models.AutoField(
        primary_key=True, help_text="Identificador único de la racha"
    )

    id_usuario = models.OneToOneField(
        Usuarios,
        on_delete=models.CASCADE,
        db_column="id_usuario",
        related_name="racha",
        help_text="Usuario propietario de esta racha (relación 1:1)",
    )

    dias_consecutivos = models.IntegerField(
        default=0, help_text="Número de días consecutivos de actividad del usuario"
    )

    ultima_actividad = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Fecha y hora de la última actividad registrada",
    )

    class Meta:
        db_table = "rachas_usuario"
        verbose_name = "Racha de Usuario"
        verbose_name_plural = "Rachas de Usuario"
        indexes = [
            models.Index(
                fields=["ultima_actividad"], name="idx_racha_ultima_actividad"
            ),
            models.Index(
                fields=["dias_consecutivos"], name="idx_racha_dias_consecutivos"
            ),
        ]

    def __str__(self):
        return f"Racha de {self.id_usuario.email}: {self.dias_consecutivos} días"

    def incrementar_racha(self):
        """
        Incrementa la racha en 1 día y actualiza la fecha de última actividad.

        Returns:
            int: Nuevo valor de días consecutivos
        """
        from django.utils import timezone

        self.dias_consecutivos += 1
        self.ultima_actividad = timezone.now()
        self.save()
        return self.dias_consecutivos

    def resetear_racha(self):
        """
        Resetea la racha a 0 días (cuando se rompe la continuidad).

        Returns:
            int: Valor de días consecutivos (0)
        """
        self.dias_consecutivos = 0
        self.save()
        return self.dias_consecutivos

    def verificar_continuidad(self):
        """
        Verifica si la racha debe continuar, pausarse o resetearse
        basado en la última actividad.

        Returns:
            str: Estado de la racha ('activa', 'en_peligro', 'perdida')
        """
        from django.utils import timezone
        from datetime import timedelta

        if not self.ultima_actividad:
            return "perdida"

        ahora = timezone.now()
        diferencia = ahora - self.ultima_actividad

        if diferencia.days == 0:
            return "activa"
        elif diferencia.days == 1:
            return "en_peligro"
        else:
            return "perdida"
