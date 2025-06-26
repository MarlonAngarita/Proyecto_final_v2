from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Avatares, Usuarios, Cursos, Niveles, CursosNivel,
    Desafios, DesafiosUsuario, Foro, Gamificacion, Medallas, MedallasUsuario,
    Modulos, NivelesUsuario, ProgresoUsuario, Quiz, RachasUsuario
)
from .serializers import (
    AvataresSerializer, UsuariosSerializer, RegistroUsuarioSerializer,
    CursosSerializer, NivelesSerializer, CursosNivelSerializer, DesafiosSerializer,
    DesafiosUsuarioSerializer, ForoSerializer, GamificacionSerializer, MedallasSerializer,
    MedallasUsuarioSerializer, ModulosSerializer, NivelesUsuarioSerializer,
    ProgresoUsuarioSerializer, QuizSerializer, RachasUsuarioSerializer
)

# Create your views here.

class AvataresViewSet(viewsets.ModelViewSet):
    queryset = Avatares.objects.all()
    serializer_class = AvataresSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_avatar'

class UsuariosViewSet(viewsets.ModelViewSet):
    queryset = Usuarios.objects.all()
    serializer_class = UsuariosSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'

class CursosViewSet(viewsets.ModelViewSet):
    queryset = Cursos.objects.all()
    serializer_class = CursosSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_curso'

class NivelesViewSet(viewsets.ModelViewSet):
    queryset = Niveles.objects.all()
    serializer_class = NivelesSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_nivel'

class CursosNivelViewSet(viewsets.ModelViewSet):
    queryset = CursosNivel.objects.all()
    serializer_class = CursosNivelSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_curso_nivel'

class DesafiosViewSet(viewsets.ModelViewSet):
    queryset = Desafios.objects.all()
    serializer_class = DesafiosSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_desafio'

class DesafiosUsuarioViewSet(viewsets.ModelViewSet):
    queryset = DesafiosUsuario.objects.all()
    serializer_class = DesafiosUsuarioSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_desafio_usuario'

class ForoViewSet(viewsets.ModelViewSet):
    queryset = Foro.objects.all()
    serializer_class = ForoSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_foro'

class GamificacionViewSet(viewsets.ModelViewSet):
    queryset = Gamificacion.objects.all()
    serializer_class = GamificacionSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_gamificacion'

class MedallasViewSet(viewsets.ModelViewSet):
    queryset = Medallas.objects.all()
    serializer_class = MedallasSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_medalla'

class MedallasUsuarioViewSet(viewsets.ModelViewSet):
    queryset = MedallasUsuario.objects.all()
    serializer_class = MedallasUsuarioSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_medalla_usuario'

class ModulosViewSet(viewsets.ModelViewSet):
    queryset = Modulos.objects.all()
    serializer_class = ModulosSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_modulo'

class NivelesUsuarioViewSet(viewsets.ModelViewSet):
    queryset = NivelesUsuario.objects.all()
    serializer_class = NivelesUsuarioSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_nivel_usuario'

class ProgresoUsuarioViewSet(viewsets.ModelViewSet):
    queryset = ProgresoUsuario.objects.all()
    serializer_class = ProgresoUsuarioSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_progreso'

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_quiz'

class RachasUsuarioViewSet(viewsets.ModelViewSet):
    queryset = RachasUsuario.objects.all()
    serializer_class = RachasUsuarioSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id_racha'

class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Forzar rol de estudiante por defecto
        data = request.data.copy()
        try:
            from .models import Roles
            rol_estudiante = Roles.objects.get(nombre_rol='Usuario')
            data['id_rol'] = rol_estudiante.id_rol
        except Roles.DoesNotExist:
            # Si no existe el rol, proceder sin asignarlo
            pass
        
        serializer = RegistroUsuarioSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                'detail': 'Usuario registrado correctamente.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'nombre': user.nombre,
                    'rol': user.id_rol.nombre_rol if user.id_rol else 'Usuario'
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistroProfesorView(APIView):
    """Registro específico para profesores - URL especial"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Forzar rol de profesor
        data = request.data.copy()
        try:
            from .models import Roles
            rol_profesor = Roles.objects.get(nombre_rol='Profesor')
            data['id_rol'] = rol_profesor.id_rol
        except Roles.DoesNotExist:
            return Response({
                'detail': 'Error en configuración de roles.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        serializer = RegistroUsuarioSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'detail': 'Profesor registrado correctamente.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'nombre': user.nombre,
                    'rol': 'Profesor'
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistroAdminView(APIView):
    """Registro específico para administradores - URL especial"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        # Forzar rol de administrador
        data = request.data.copy()
        try:
            from .models import Roles
            rol_admin = Roles.objects.get(nombre_rol='Administrador')
            data['id_rol'] = rol_admin.id_rol
        except Roles.DoesNotExist:
            return Response({
                'detail': 'Error en configuración de roles.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        serializer = RegistroUsuarioSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'detail': 'Administrador registrado correctamente.',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'nombre': user.nombre,
                    'rol': 'Administrador'
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUsuarioView(APIView):
    """Vista para login de usuarios"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'detail': 'Email y contraseña son requeridos.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscar usuario por email
            usuario = Usuarios.objects.get(email=email)
            
            # Verificar contraseña
            if usuario.check_password(password):
                # Generar tokens JWT
                refresh = RefreshToken.for_user(usuario)
                
                # Obtener nombre del rol
                rol_nombre = usuario.id_rol.nombre_rol if usuario.id_rol else 'Usuario'
                
                return Response({
                    'detail': 'Login exitoso.',
                    'user': {
                        'id': usuario.id,
                        'email': usuario.email,
                        'username': usuario.username,
                        'nombre': usuario.nombre,
                        'rol': rol_nombre
                    },
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token)
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'detail': 'Credenciales inválidas.'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Usuarios.DoesNotExist:
            return Response({
                'detail': 'Credenciales inválidas.'
            }, status=status.HTTP_401_UNAUTHORIZED)
