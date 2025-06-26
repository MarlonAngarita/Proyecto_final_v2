from rest_framework.routers import DefaultRouter
from .views import (
    AvataresViewSet, UsuariosViewSet, CursosViewSet, NivelesViewSet, CursosNivelViewSet,
    DesafiosViewSet, DesafiosUsuarioViewSet, ForoViewSet, GamificacionViewSet, MedallasViewSet,
    MedallasUsuarioViewSet, ModulosViewSet, NivelesUsuarioViewSet, ProgresoUsuarioViewSet,
    QuizViewSet, RachasUsuarioViewSet,
    RegistroUsuarioView, RegistroProfesorView, RegistroAdminView, LoginUsuarioView
)
from django.urls import path, include

router = DefaultRouter()

router.register(r'avatares', AvataresViewSet)
router.register(r'usuarios', UsuariosViewSet)
router.register(r'cursos', CursosViewSet)
router.register(r'niveles', NivelesViewSet)
router.register(r'cursos-nivel', CursosNivelViewSet)
router.register(r'desafios', DesafiosViewSet)
router.register(r'desafios-usuario', DesafiosUsuarioViewSet)
router.register(r'foro', ForoViewSet)
router.register(r'gamificacion', GamificacionViewSet)
router.register(r'medallas', MedallasViewSet)
router.register(r'medallas-usuario', MedallasUsuarioViewSet)
router.register(r'modulos', ModulosViewSet)
router.register(r'niveles-usuario', NivelesUsuarioViewSet)
router.register(r'progreso-usuario', ProgresoUsuarioViewSet)
router.register(r'quiz', QuizViewSet)
router.register(r'rachas-usuario', RachasUsuarioViewSet)

app_name = 'backend'

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/register/', RegistroUsuarioView.as_view(), name='register'),
    path('api/v1/register/profesor/', RegistroProfesorView.as_view(), name='register_profesor'),
    path('api/v1/register/admin/', RegistroAdminView.as_view(), name='register_admin'),
    path('api/v1/login/', LoginUsuarioView.as_view(), name='login'),
]
