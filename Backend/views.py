from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import (
    Avatares, Usuarios, Cursos, Niveles, CursosNivel,
    Desafios, DesafiosUsuario, Foro, Gamificacion, Medallas, MedallasUsuario,
    Modulos, NivelesUsuario, ProgresoUsuario, Quiz, RachasUsuario
)
from .serializers import (
    AvataresSerializer, UsuariosSerializer,
    CursosSerializer, NivelesSerializer, CursosNivelSerializer, DesafiosSerializer,
    DesafiosUsuarioSerializer, ForoSerializer, GamificacionSerializer, MedallasSerializer,
    MedallasUsuarioSerializer, ModulosSerializer, NivelesUsuarioSerializer,
    ProgresoUsuarioSerializer, QuizSerializer, RachasUsuarioSerializer
)
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import Usuarios
from .serializers import UsuariosSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import re

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

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    email = serializers.EmailField()

    class Meta:
        model = Usuarios
        fields = ['email', 'username', 'nombre', 'password']

    def validate_email(self, value):
        if Usuarios.objects.filter(email=value).exists():
            raise serializers.ValidationError('El correo electrónico ya está registrado.')
        return value

    def validate_password(self, value):
        # Ejemplo de validación de fortaleza de contraseña
        if len(value) < 8:
            raise serializers.ValidationError('La contraseña debe tener al menos 8 caracteres.')
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError('La contraseña debe contener al menos una letra mayúscula.')
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError('La contraseña debe contener al menos una letra minúscula.')
        if not re.search(r'\d', value):
            raise serializers.ValidationError('La contraseña debe contener al menos un número.')
        return value

    def create(self, validated_data):
        user = Usuarios(
            email=validated_data['email'],
            username=validated_data['username'],
            nombre=validated_data['nombre']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class RegistroUsuarioView(APIView):
    permission_classes = []
    def post(self, request):
        serializer = RegistroUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'detail': 'Usuario registrado correctamente.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUsuarioView(APIView):
    permission_classes = []
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id,
                'email': user.email
            })
        return Response({'detail': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)
