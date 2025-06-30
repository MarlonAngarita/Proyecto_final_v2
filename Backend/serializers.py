"""
Serializadores para la API REST del sistema Kütsa

Este módulo contiene todos los serializadores de Django REST Framework que se encargan
de la conversión entre modelos de Django y formatos JSON para la API REST.
Los serializadores manejan la validación de datos, transformación y serialización
de los objetos del modelo.

Funcionalidades principales:
- Serialización de modelos a JSON
- Deserialización de JSON a modelos
- Validación de datos de entrada
- Transformación de campos
- Manejo de relaciones entre modelos
- Validaciones personalizadas

Autor: Sistema Kütsa
Fecha: 2024
"""

from rest_framework import serializers
from .models import (
    Avatares, Roles, TipoDocumento, Usuarios, Cursos, Niveles, CursosNivel,
    Desafios, DesafiosUsuario, Foro, Gamificacion, Medallas, MedallasUsuario,
    Modulos, NivelesUsuario, ProgresoUsuario, Quiz, RachasUsuario
)
from django.contrib.auth.hashers import make_password
import re

# ===================================
# SERIALIZADORES DE MODELOS BASE
# ===================================

class RolesSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Roles
    
    Maneja la serialización de los roles de usuario (Estudiante, Profesor, Admin).
    Campos incluidos: id_rol, nombre_rol
    """
    class Meta:
        model = Roles
        fields = ['id_rol', 'nombre_rol']

class TipoDocumentoSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo TipoDocumento
    
    Maneja la serialización de los tipos de documento de identificación.
    Campos incluidos: id_tipo_documento, nombre_tipo
    """
    class Meta:
        model = TipoDocumento
        fields = ['id_tipo_documento', 'nombre_tipo']

class AvataresSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Avatares
    
    Maneja la serialización de los avatares disponibles para los usuarios.
    Campos incluidos: id_avatar, nombre_avatar, imagen_url
    """
    class Meta:
        model = Avatares
        fields = ['id_avatar', 'nombre_avatar', 'imagen_url']

# ===================================
# SERIALIZADORES DE USUARIOS
# ===================================

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    """
    Serializador para registro de nuevos usuarios
    
    Maneja el proceso de registro de usuarios con validaciones específicas:
    - Validación de email único
    - Validación de username único
    - Encriptación de contraseña
    - Validación de fortaleza de contraseña
    - Asignación de rol, avatar y tipo de documento
    """
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
        """
        Valida que el email sea único en el sistema
        
        Args:
            value (str): Email a validar
            
        Returns:
            str: Email validado
            
        Raises:
            ValidationError: Si el email ya está registrado
        """
        if Usuarios.objects.filter(email=value).exists():
            raise serializers.ValidationError('El correo electrónico ya está registrado.')
        return value

    def validate_username(self, value):
        """
        Valida que el username sea único
        
        Permite que el username sea igual al email del mismo usuario,
        pero verifica que no exista otro usuario con el mismo username.
        
        Args:
            value (str): Username a validar
            
        Returns:
            str: Username validado
            
        Raises:
            ValidationError: Si el username ya está en uso por otro usuario
        """
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
        """
        Valida la fortaleza de la contraseña
        
        Implementa validaciones de seguridad para las contraseñas:
        - Mínimo 8 caracteres
        - Al menos una letra mayúscula
        - Al menos una letra minúscula
        - Al menos un número
        
        Args:
            value (str): Contraseña a validar
            
        Returns:
            str: Contraseña validada
            
        Raises:
            ValidationError: Si la contraseña no cumple los requisitos de seguridad
        """
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

# ===================================================================================================
# SERIALIZER PARA SISTEMA DE RACHAS
# ===================================================================================================

class RachasUsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo RachasUsuario.
    
    Proporciona serialización y deserialización de datos de racha, incluyendo:
    - Validación de datos de entrada
    - Campos calculados y de solo lectura
    - Información del usuario relacionado
    - Métodos para actualización segura
    
    Campos incluidos:
    - id_racha: Identificador único (solo lectura)
    - id_usuario: Relación con usuario (requerido)
    - dias_consecutivos: Días actuales de racha
    - ultima_actividad: Fecha de última actividad
    - usuario_email: Email del usuario (campo calculado)
    - estado_racha: Estado actual de la racha (campo calculado)
    
    @author Sistema Kütsa
    @version 2.0 - Serializer avanzado con campos calculados
    """
    
    # Campos de solo lectura calculados
    usuario_email = serializers.CharField(source='id_usuario.email', read_only=True)
    usuario_nombre = serializers.CharField(source='id_usuario.nombre', read_only=True)
    estado_racha = serializers.SerializerMethodField()
    tiempo_desde_ultima_actividad = serializers.SerializerMethodField()
    
    class Meta:
        model = RachasUsuario
        fields = [
            'id_racha',
            'id_usuario', 
            'dias_consecutivos',
            'ultima_actividad',
            'usuario_email',
            'usuario_nombre',
            'estado_racha',
            'tiempo_desde_ultima_actividad'
        ]
        extra_kwargs = {
            'id_racha': {'read_only': True},
            'id_usuario': {
                'queryset': Usuarios.objects.all(),
                'help_text': 'Usuario propietario de esta racha'
            },
            'dias_consecutivos': {
                'min_value': 0,
                'help_text': 'Número de días consecutivos de actividad'
            },
            'ultima_actividad': {
                'help_text': 'Fecha y hora de la última actividad registrada'
            }
        }
    
    def get_estado_racha(self, obj):
        """
        Calcula el estado actual de la racha.
        
        Returns:
            str: Estado de la racha ('activa', 'en_peligro', 'perdida', 'sin_actividad')
        """
        try:
            return obj.verificar_continuidad()
        except Exception:
            return 'sin_actividad'
    
    def get_tiempo_desde_ultima_actividad(self, obj):
        """
        Calcula el tiempo transcurrido desde la última actividad.
        
        Returns:
            dict: Información del tiempo transcurrido
        """
        if not obj.ultima_actividad:
            return {
                'dias': None,
                'horas': None,
                'mensaje': 'Sin actividad previa'
            }
        
        try:
            from django.utils import timezone
            
            ahora = timezone.now()
            diferencia = ahora - obj.ultima_actividad
            
            dias = diferencia.days
            horas = diferencia.seconds // 3600
            
            if dias > 0:
                mensaje = f"Hace {dias} día{'s' if dias != 1 else ''}"
            elif horas > 0:
                mensaje = f"Hace {horas} hora{'s' if horas != 1 else ''}"
            else:
                mensaje = "Hace menos de una hora"
            
            return {
                'dias': dias,
                'horas': horas,
                'mensaje': mensaje
            }
            
        except Exception:
            return {
                'dias': None,
                'horas': None,
                'mensaje': 'Error al calcular tiempo'
            }
    
    def validate_dias_consecutivos(self, value):
        """
        Valida que los días consecutivos sean un valor válido.
        
        Args:
            value (int): Valor a validar
            
        Returns:
            int: Valor validado
            
        Raises:
            serializers.ValidationError: Si el valor no es válido
        """
        if value < 0:
            raise serializers.ValidationError(
                'Los días consecutivos no pueden ser negativos.'
            )
        
        if value > 10000:  # Límite razonable
            raise serializers.ValidationError(
                'Los días consecutivos exceden el límite máximo permitido.'
            )
        
        return value
    
    def validate(self, attrs):
        """
        Validación a nivel de objeto.
        
        Args:
            attrs (dict): Atributos a validar
            
        Returns:
            dict: Atributos validados
            
        Raises:
            serializers.ValidationError: Si hay conflictos en los datos
        """
        # Validar que no exista otra racha para el mismo usuario
        if 'id_usuario' in attrs:
            usuario = attrs['id_usuario']
            existing_racha = RachasUsuario.objects.filter(
                id_usuario=usuario
            ).exclude(
                id_racha=self.instance.id_racha if self.instance else None
            ).first()
            
            if existing_racha:
                raise serializers.ValidationError(
                    'Ya existe una racha para este usuario. '
                    'Cada usuario puede tener solo una racha activa.'
                )
        
        return attrs
    
    def update(self, instance, validated_data):
        """
        Actualización personalizada que mantiene la integridad de datos.
        
        Args:
            instance: Instancia existente de RachasUsuario
            validated_data (dict): Datos validados para actualización
            
        Returns:
            RachasUsuario: Instancia actualizada
        """
        # Preservar campos críticos si no se proporcionan explícitamente
        if 'ultima_actividad' not in validated_data and 'dias_consecutivos' in validated_data:
            # Si se actualiza días consecutivos sin actividad, usar timestamp actual
            from django.utils import timezone
            validated_data['ultima_actividad'] = timezone.now()
        
        return super().update(instance, validated_data)
    
    def to_representation(self, instance):
        """
        Personaliza la representación de salida del serializer.
        
        Args:
            instance: Instancia de RachasUsuario
            
        Returns:
            dict: Representación serializada personalizada
        """
        representation = super().to_representation(instance)
        
        # Agregar metadatos útiles
        representation['metadata'] = {
            'es_racha_nueva': instance.dias_consecutivos <= 3,
            'es_racha_larga': instance.dias_consecutivos >= 30,
            'requiere_atencion': self.get_estado_racha(instance) in ['en_peligro', 'perdida']
        }
        
        return representation
