from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdmin(BasePermission):
    """Permite acceso solo a usuarios con rol Administrador."""
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and hasattr(user, 'id_rol') and getattr(user.id_rol, 'nombre_rol', None) == 'Administrador'

class IsProfesor(BasePermission):
    """Permite acceso solo a usuarios con rol Profesor."""
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and hasattr(user, 'id_rol') and getattr(user.id_rol, 'nombre_rol', None) == 'Profesor'

class IsAdminOrReadOnly(BasePermission):
    """Permite solo lectura a todos, escritura solo a admins."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return user.is_authenticated and hasattr(user, 'id_rol') and getattr(user.id_rol, 'nombre_rol', None) == 'Administrador'

class IsProfesorOrAdminOrReadOnly(BasePermission):
    """Permite solo lectura a todos, escritura a admins o profesores."""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return user.is_authenticated and hasattr(user, 'id_rol') and getattr(user.id_rol, 'nombre_rol', None) in ['Administrador', 'Profesor']
