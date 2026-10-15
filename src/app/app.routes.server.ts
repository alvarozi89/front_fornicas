import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Páginas públicas principales que no cambian constantemente o pueden ser estáticas
  {
    path: '',
    renderMode: RenderMode.Client
  },
  {
    path: 'auth/**', // Todas las rutas de autenticación (login, registro) en Client
    renderMode: RenderMode.Client
  },
  // Todas las rutas del panel y perfiles deben ser Client o Server, NUNCA Prerender
  {
    path: 'panel',
    renderMode: RenderMode.Client
  },
  {
    path: 'panel/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'perfil/:id',
    renderMode: RenderMode.Client
  },
  // Comodín por defecto en Client o Server para evitar que rutas dinámicas caigan en Prerender
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
