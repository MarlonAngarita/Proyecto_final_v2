# ===================================================================================================
# VISTAS API REST - SISTEMA KÜTSA
# ===================================================================================================

"""
Vistas API REST para la plataforma educativa Kütsa

Este archivo contiene todos los ViewSets y vistas API que manejan las operaciones
CRUD y endpoints específicos del sistema educativo.

Arquitectura API:
- ViewSets basados en Django REST Framework
- Endpoints RESTful para cada modelo
- Autenticación JWT implementada
- Permisos configurables por endpoint
- Endpoints personalizados para funcionalidades específicas

Funcionalidades principales:
- Gestión de usuarios y autenticación
- CRUD de cursos, módulos y contenido educativo
- Sistema de gamificación (medallas, rachas, progreso)
- Foros y comunicación
- Quiz y evaluaciones
- Estadísticas y analytics

@author Sistema Kütsa
@version 2.0 - API REST documentada y organizada
"""

from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Avatares,
    Usuarios,
    Cursos,
    Niveles,
    CursosNivel,
    Desafios,
    DesafiosUsuario,
    Foro,
    Gamificacion,
    Medallas,
    MedallasUsuario,
    Modulos,
    NivelesUsuario,
    ProgresoUsuario,
    Quiz,
    RachasUsuario,
)
from .serializers import (
    AvataresSerializer,
    UsuariosSerializer,
    RegistroUsuarioSerializer,
    CursosSerializer,
    NivelesSerializer,
    CursosNivelSerializer,
    DesafiosSerializer,
    DesafiosUsuarioSerializer,
    ForoSerializer,
    GamificacionSerializer,
    MedallasSerializer,
    MedallasUsuarioSerializer,
    ModulosSerializer,
    NivelesUsuarioSerializer,
    ProgresoUsuarioSerializer,
    QuizSerializer,
    RachasUsuarioSerializer,
)
from .permissions import IsAdmin, IsProfesor, IsAdminOrReadOnly, IsProfesorOrAdminOrReadOnly

# ===================================================================================================
# VIEWSETS PARA MODELOS DE CONFIGURACIÓN
# ===================================================================================================


class AvataresViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de avatares de usuario

    Permite obtener la lista de avatares disponibles
    para personalización de perfiles de usuario.
    """

    queryset = Avatares.objects.all()
    serializer_class = AvataresSerializer
    permission_classes = [
        IsAuthenticated
    ]  # Solo autenticados pueden ver avatares
    lookup_field = "id_avatar"


# ===================================================================================================
# VIEWSETS PARA GESTIÓN DE USUARIOS
# ===================================================================================================


class UsuariosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión completa de usuarios

    Proporciona operaciones CRUD para usuarios del sistema,
    incluyendo creación, actualización, listado y eliminación.
    """

    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    permission_classes = [IsAdmin]  # Solo administradores pueden gestionar usuarios
    lookup_field = "id"


# ===================================================================================================
# VIEWSETS PARA GESTIÓN EDUCATIVA
# ===================================================================================================


class CursosViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de cursos

    Maneja la creación, actualización y consulta de cursos
    disponibles en la plataforma educativa.
    """

    queryset = Cursos.objects.all()
    serializer_class = CursosSerializer
    permission_classes = [IsProfesorOrAdminOrReadOnly]  # Solo admins/profesores pueden crear/editar, todos pueden ver
    lookup_field = "id_curso"


class NivelesViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de niveles de dificultad

    Permite definir y gestionar los diferentes niveles
    de dificultad disponibles en los cursos.
    """

    queryset = Niveles.objects.all()
    serializer_class = NivelesSerializer
    permission_classes = [IsAdminOrReadOnly]  # Solo admins pueden crear/editar, todos pueden ver
    lookup_field = "id_nivel"


class CursosNivelViewSet(viewsets.ModelViewSet):
    queryset = CursosNivel.objects.all()
    serializer_class = CursosNivelSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id_curso_nivel"


class DesafiosViewSet(viewsets.ModelViewSet):
    queryset = Desafios.objects.all()
    serializer_class = DesafiosSerializer
    permission_classes = [IsProfesorOrAdminOrReadOnly]
    lookup_field = "id_desafio"


class DesafiosUsuarioViewSet(viewsets.ModelViewSet):
    queryset = DesafiosUsuario.objects.all()
    serializer_class = DesafiosUsuarioSerializer
    permission_classes = [IsAuthenticated]  # Solo autenticados pueden gestionar desafíos de usuario
    lookup_field = "id_desafio_usuario"


class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all()
    serializer_class = ForoSerializer
    permission_classes = [IsAuthenticated]  # Todos autenticados pueden participar
    lookup_field = "id_foro"


class GamificacionViewSet(viewsets.ModelViewSet):
    queryset = Gamificacion.objects.all()
    serializer_class = GamificacionSerializer
    permission_classes = [IsAuthenticated]  # Solo autenticados pueden gestionar gamificación
    lookup_field = "id_gamificacion"


class MedallasViewSet(viewsets.ModelViewSet):
    queryset = Medallas.objects.all()
    serializer_class = MedallasSerializer
    permission_classes = [IsAdminOrReadOnly]  # Solo admins pueden crear/editar medallas
    lookup_field = "id_medalla"


class MedallasUsuarioViewSet(viewsets.ModelViewSet):
    queryset = MedallasUsuario.objects.all()
    serializer_class = MedallasUsuarioSerializer
    permission_classes = [IsAuthenticated]  # Solo autenticados pueden gestionar medallas de usuario
    lookup_field = "id_medalla_usuario"


class ModulosViewSet(viewsets.ModelViewSet):
    queryset = Modulos.objects.all()
    serializer_class = ModulosSerializer
    permission_classes = [IsProfesorOrAdminOrReadOnly]
    lookup_field = "id_modulo"


class NivelesUsuarioViewSet(viewsets.ModelViewSet):
    queryset = NivelesUsuario.objects.all()
    serializer_class = NivelesUsuarioSerializer
    permission_classes = [IsAuthenticated]  # Solo autenticados pueden gestionar niveles de usuario
    lookup_field = "id_nivel_usuario"


class ProgresoUsuarioViewSet(viewsets.ModelViewSet):
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer
    permission_classes = [IsAuthenticated]  # Solo autenticados pueden gestionar progreso
    lookup_field = "id_progreso"


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsProfesorOrAdminOrReadOnly]  # Solo admins/profesores pueden crear/editar quizzes
    lookup_field = "id_quiz"


# ===================================================================================================
# VIEWSET PARA SISTEMA DE RACHAS
# ===================================================================================================


class RachasUsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar las rachas de usuario.

    Proporciona endpoints CRUD completos para el sistema de rachas, incluyendo:
    - Consulta de racha actual del usuario
    - Actualización de días consecutivos
    - Registro de actividad diaria
    - Validación de continuidad de racha

    Endpoints disponibles:
    - GET /api/rachas/ - Lista todas las rachas
    - GET /api/rachas/{id}/ - Detalle de una racha específica
    - POST /api/rachas/ - Crear nueva racha
    - PUT/PATCH /api/rachas/{id}/ - Actualizar racha
    - DELETE /api/rachas/{id}/ - Eliminar racha

    Métodos personalizados:
    - incrementar_racha(): Incrementa la racha del usuario autenticado
    - verificar_estado(): Verifica el estado actual de la racha
    - obtener_estadisticas(): Obtiene estadísticas completas de la racha

    @author Sistema Kütsa
    @version 2.0 - Soporte para sistema gamificado avanzado
    """

    queryset = RachasUsuario.objects.all()
    serializer_class = RachasUsuarioSerializer
    permission_classes = [IsAuthenticated]  # Solo autenticados pueden gestionar rachas
    lookup_field = "id_racha"

    def get_queryset(self):
        """
        Personaliza el queryset para incluir información relacionada.
        Optimiza las consultas usando select_related.
        """
        return RachasUsuario.objects.select_related("id_usuario").all()

    @action(detail=False, methods=["get"])
    def mi_racha(self, request):
        """
        Endpoint personalizado para obtener la racha del usuario autenticado.

        URL: GET /api/rachas/mi_racha/

        Returns:
            Response: Datos de la racha del usuario actual
        """
        try:
            # TODO: Usar request.user cuando se implemente autenticación
            usuario_id = request.query_params.get("usuario_id")
            if not usuario_id:
                return Response(
                    {"error": "Se requiere usuario_id"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            racha, created = RachasUsuario.objects.get_or_create(
                id_usuario_id=usuario_id, defaults={"dias_consecutivos": 0}
            )

            serializer = self.get_serializer(racha)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {"error": f"Error al obtener racha: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["post"])
    def incrementar(self, request):
        """
        Endpoint para incrementar la racha del usuario.

        URL: POST /api/rachas/incrementar/
        Body: {"usuario_id": 123}

        Returns:
            Response: Datos actualizados de la racha
        """
        try:
            usuario_id = request.data.get("usuario_id")
            if not usuario_id:
                return Response(
                    {"error": "Se requiere usuario_id"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            racha, created = RachasUsuario.objects.get_or_create(
                id_usuario_id=usuario_id, defaults={"dias_consecutivos": 0}
            )

            # Verificar si ya se registró actividad hoy
            from django.utils import timezone
            from datetime import timedelta

            ahora = timezone.now()

            if racha.ultima_actividad:
                diferencia = ahora - racha.ultima_actividad

                if diferencia.days == 0:
                    return Response(
                        {
                            "mensaje": "Ya se registró actividad hoy",
                            "racha": racha.dias_consecutivos,
                        },
                        status=status.HTTP_200_OK,
                    )
                elif diferencia.days > 1:
                    # Se rompió la racha
                    racha.resetear_racha()

            # Incrementar la racha
            nuevos_dias = racha.incrementar_racha()

            serializer = self.get_serializer(racha)
            return Response(
                {
                    "mensaje": f"Racha incrementada a {nuevos_dias} días",
                    "racha": serializer.data,
                }
            )

        except Exception as e:
            return Response(
                {"error": f"Error al incrementar racha: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def verificar_estado(self, request):
        """
        Endpoint para verificar el estado actual de la racha.

        URL: GET /api/rachas/verificar_estado/?usuario_id=123

        Returns:
            Response: Estado de la racha ('activa', 'en_peligro', 'perdida')
        """
        try:
            usuario_id = request.query_params.get("usuario_id")
            if not usuario_id:
                return Response(
                    {"error": "Se requiere usuario_id"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                racha = RachasUsuario.objects.get(id_usuario_id=usuario_id)
                estado = racha.verificar_continuidad()

                return Response(
                    {
                        "estado": estado,
                        "dias_consecutivos": racha.dias_consecutivos,
                        "ultima_actividad": racha.ultima_actividad,
                    }
                )

            except RachasUsuario.DoesNotExist:
                return Response(
                    {
                        "estado": "sin_racha",
                        "dias_consecutivos": 0,
                        "ultima_actividad": None,
                    }
                )

        except Exception as e:
            return Response(
                {"error": f"Error al verificar estado: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @action(detail=False, methods=["get"])
    def estadisticas(self, request):
        """
        Endpoint para obtener estadísticas completas de rachas.

        URL: GET /api/rachas/estadisticas/?usuario_id=123

        Returns:
            Response: Estadísticas detalladas del usuario
        """
        try:
            usuario_id = request.query_params.get("usuario_id")
            if not usuario_id:
                # Retornar estadísticas globales
                from django.db.models import Max, Avg, Count

                estadisticas_globales = RachasUsuario.objects.aggregate(
                    racha_maxima_global=Max("dias_consecutivos"),
                    promedio_rachas=Avg("dias_consecutivos"),
                    total_usuarios_con_racha=Count("id_racha"),
                )

                return Response(
                    {"tipo": "estadisticas_globales", "datos": estadisticas_globales}
                )

            try:
                racha = RachasUsuario.objects.get(id_usuario_id=usuario_id)

                # Calcular estadísticas personalizadas
                estadisticas = {
                    "racha_actual": racha.dias_consecutivos,
                    "ultima_actividad": racha.ultima_actividad,
                    "estado": racha.verificar_continuidad(),
                    # Agregar más estadísticas según necesidades
                }

                return Response(
                    {
                        "tipo": "estadisticas_usuario",
                        "usuario_id": usuario_id,
                        "datos": estadisticas,
                    }
                )

            except RachasUsuario.DoesNotExist:
                return Response(
                    {
                        "tipo": "estadisticas_usuario",
                        "usuario_id": usuario_id,
                        "datos": {
                            "racha_actual": 0,
                            "ultima_actividad": None,
                            "estado": "sin_racha",
                        },
                    }
                )

        except Exception as e:
            return Response(
                {"error": f"Error al obtener estadísticas: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]  # Público: registro de usuario

    def post(self, request):
        # Forzar rol de estudiante por defecto
        data = request.data.copy()
        try:
            from .models import Roles

            rol_estudiante = Roles.objects.get(nombre_rol="Usuario")
            data["id_rol"] = rol_estudiante.id_rol
        except Roles.DoesNotExist:
            # Si no existe el rol, proceder sin asignarlo
            pass

        serializer = RegistroUsuarioSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "detail": "Usuario registrado correctamente.",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "nombre": user.nombre,
                        "rol": user.id_rol.nombre_rol if user.id_rol else "Usuario",
                    },
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistroProfesorView(APIView):
    """Registro específico para profesores - URL especial"""

    permission_classes = [AllowAny]  # Público: registro de profesor

    def post(self, request):
        # Forzar rol de profesor
        data = request.data.copy()
        try:
            from .models import Roles

            rol_profesor = Roles.objects.get(nombre_rol="Profesor")
            data["id_rol"] = rol_profesor.id_rol
        except Roles.DoesNotExist:
            return Response(
                {"detail": "Error en configuración de roles."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        serializer = RegistroUsuarioSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "detail": "Profesor registrado correctamente.",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "nombre": user.nombre,
                        "rol": "Profesor",
                    },
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistroAdminView(APIView):
    """Registro específico para administradores - URL especial"""

    permission_classes = [AllowAny]  # Público: registro de admin

    def post(self, request):
        # Forzar rol de administrador
        data = request.data.copy()
        try:
            from .models import Roles

            rol_admin = Roles.objects.get(nombre_rol="Administrador")
            data["id_rol"] = rol_admin.id_rol
        except Roles.DoesNotExist:
            return Response(
                {"detail": "Error en configuración de roles."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        serializer = RegistroUsuarioSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "detail": "Administrador registrado correctamente.",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "nombre": user.nombre,
                        "rol": "Administrador",
                    },
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginUsuarioView(APIView):
    """Vista para login de usuarios"""

    permission_classes = [AllowAny]  # Público: login

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email y contraseña son requeridos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Buscar usuario por email
            usuario = Usuarios.objects.get(email=email)

            # Verificar contraseña
            if usuario.check_password(password):
                # Generar tokens JWT
                refresh = RefreshToken.for_user(usuario)

                # Obtener nombre del rol
                rol_nombre = usuario.id_rol.nombre_rol if usuario.id_rol else "Usuario"

                return Response(
                    {
                        "detail": "Login exitoso.",
                        "user": {
                            "id": usuario.id,
                            "email": usuario.email,
                            "username": usuario.username,
                            "nombre": usuario.nombre,
                            "rol": rol_nombre,
                        },
                        "tokens": {
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"detail": "Credenciales inválidas."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        except Usuarios.DoesNotExist:
            return Response(
                {"detail": "Credenciales inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
