from rest_framework import serializers
from .models import (
    Avatares, Roles, TipoDocumento, Usuarios, Cursos, Niveles, CursosNivel,
    Desafios, DesafiosUsuario, Foro, Gamificacion, Medallas, MedallasUsuario,
    Modulos, NivelesUsuario, ProgresoUsuario, Quiz, RachasUsuario
)
from django.contrib.auth.hashers import make_password
import re

class RolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ['id_rol', 'nombre_rol']

class TipoDocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDocumento
        fields = ['id_tipo_documento', 'nombre_tipo']

class AvataresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Avatares
        fields = ['id_avatar', 'nombre_avatar', 'imagen_url']

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, style={'input_type': 'password'})
    email = serializers.EmailField()
    id_rol = serializers.PrimaryKeyRelatedField(queryset=Roles.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Usuarios
        fields = ['email', 'username', 'nombre', 'password', 'id_rol', 'id_avatar', 'id_tipo_documento']
        extra_kwargs = {
            'id_avatar': {'queryset': Avatares.objects.all(), 'required': False, 'allow_null': True},
            'id_tipo_documento': {'queryset': TipoDocumento.objects.all(), 'required': False, 'allow_null': True}
        }

    def validate_email(self, value):
        if Usuarios.objects.filter(email=value).exists():
            raise serializers.ValidationError('El correo electrónico ya está registrado.')
        return value

    def validate_username(self, value):
        # Permitir que username sea igual al email del mismo usuario
        email_from_request = self.initial_data.get('email')
        if email_from_request and value == email_from_request:
            # Si username es igual al email del mismo request, verificar solo que no exista otro usuario con ese username
            existing_user = Usuarios.objects.filter(username=value).first()
            if existing_user and existing_user.email != email_from_request:
                raise serializers.ValidationError('El nombre de usuario ya está en uso por otro usuario.')
        else:
            # Validación normal para usernames diferentes al email
            if Usuarios.objects.filter(username=value).exists():
                raise serializers.ValidationError('El nombre de usuario ya está en uso.')
        return value

    def validate_password(self, value):
        # Validación de fortaleza de contraseña
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
        # Asignar rol por defecto si no se proporciona
        if 'id_rol' not in validated_data or validated_data['id_rol'] is None:
            try:
                rol_usuario = Roles.objects.get(nombre_rol='usuario')
                validated_data['id_rol'] = rol_usuario
            except Roles.DoesNotExist:
                pass  # Si no existe el rol 'usuario', se creará sin rol
        
        user = Usuarios(
            email=validated_data['email'],
            username=validated_data['username'],
            nombre=validated_data['nombre'],
            id_rol=validated_data.get('id_rol'),
            id_avatar=validated_data.get('id_avatar'),
            id_tipo_documento=validated_data.get('id_tipo_documento')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UsuariosSerializer(serializers.ModelSerializer):
    rol_info = serializers.StringRelatedField(source='id_rol', read_only=True)
    avatar_info = serializers.StringRelatedField(source='id_avatar', read_only=True)
    tipo_documento_info = serializers.StringRelatedField(source='id_tipo_documento', read_only=True)

    class Meta:
        model = Usuarios
        fields = [
            'id', 'username', 'email', 'nombre', 'first_name', 'last_name',
            'password',
            'id_rol', 
            'id_avatar', 
            'id_tipo_documento', 
            'rol_info', 
            'avatar_info', 
            'tipo_documento_info', 
            'is_active', 'is_staff', 'is_superuser',
            'date_joined', 'last_login'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'style': {'input_type': 'password'}, 'required': False},
            'first_name': {'required': False, 'allow_blank': True, 'default': ''},
            'last_name': {'required': False, 'allow_blank': True, 'default': ''},
            'nombre': {'required': True},
            'id_rol': {'allow_null': True, 'required': False, 'queryset': Roles.objects.all()},
            'id_avatar': {'allow_null': True, 'required': False, 'queryset': Avatares.objects.all()},
            'id_tipo_documento': {'allow_null': True, 'required': False, 'queryset': TipoDocumento.objects.all()},
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Asegurarse de que los campos opcionales que no son ForeignKey se manejen si no están presentes
        validated_data.setdefault('first_name', '')
        validated_data.setdefault('last_name', '')
        
        user = Usuarios(**validated_data)
        user.set_password(password) # Hashea la contraseña
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password) # Hashea la nueva contraseña si se proporciona
        
        # super().update se encargará de asignar todos los demás campos validados
        # incluyendo las instancias de ForeignKey resueltas por PrimaryKeyRelatedField
        return super().update(instance, validated_data)

class CursosSerializer(serializers.ModelSerializer):
    profesor_info = serializers.StringRelatedField(source='id_profesor', read_only=True, allow_null=True)

    class Meta:
        model = Cursos
        fields = [
            'id_curso', 'nombre_curso', 'descripcion_curso', 'id_profesor', 
            'profesor_info', 'fecha_inicio', 'fecha_fin', 'fecha_creacion'
        ]
        extra_kwargs = {
            'id_profesor': {'queryset': Usuarios.objects.all(), 'allow_null': True, 'required': False}
        }

class NivelesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Niveles
        fields = '__all__'

class CursosNivelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursosNivel
        fields = '__all__'
        extra_kwargs = {
            'id_curso': {'queryset': Cursos.objects.all()},
            'id_nivel': {'queryset': Niveles.objects.all()},
        }

class DesafiosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desafios
        fields = '__all__'

class DesafiosUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesafiosUsuario
        fields = '__all__'
        extra_kwargs = {
            'id_usuario': {'queryset': Usuarios.objects.all()},
            'id_desafio': {'queryset': Desafios.objects.all()},
        }

class ForoSerializer(serializers.ModelSerializer):
    usuario_info = serializers.StringRelatedField(source='id_usuario', read_only=True)

    class Meta:
        model = Foro
        fields = ['id_foro', 'id_usuario', 'usuario_info', 'titulo', 'contenido', 'fecha_publicacion']
        extra_kwargs = {
            'id_usuario': {'queryset': Usuarios.objects.all()}
        }

class GamificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gamificacion
        fields = '__all__'
        extra_kwargs = {
            'id_usuario': {'queryset': Usuarios.objects.all()}
        }

class MedallasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medallas
        fields = '__all__'

class MedallasUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedallasUsuario
        fields = '__all__'
        extra_kwargs = {
            'id_usuario': {'queryset': Usuarios.objects.all()},
            'id_medalla': {'queryset': Medallas.objects.all()},
        }

class ModulosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modulos
        fields = '__all__'
        extra_kwargs = {
            'id_curso': {'queryset': Cursos.objects.all()}
        }

class NivelesUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelesUsuario
        fields = '__all__'
        extra_kwargs = {
            'id_usuario': {'queryset': Usuarios.objects.all()},
            'id_nivel': {'queryset': Niveles.objects.all()},
        }

class ProgresoUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoUsuario
        fields = '__all__'
        extra_kwargs = {
            'id_usuario': {'queryset': Usuarios.objects.all()},
            'id_modulo': {'queryset': Modulos.objects.all()},
        }

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'
        extra_kwargs = {
            'id_modulo': {'queryset': Modulos.objects.all()}
        }

class RachasUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = RachasUsuario
        fields = '__all__'
        extra_kwargs = {
            'id_usuario': {'queryset': Usuarios.objects.all()}
        }
