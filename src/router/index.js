import { createRouter, createWebHistory } from 'vue-router';
import ProductForm from '../components/ProductForm.vue';
import ProductList from '../components/ProductList.vue';
import LoginView from '../views/LoginView.vue';
import HistorialPlaceholder from '../components/HistorialInventario.vue';
import UserAdminView from '../views/UserAdminView.vue';
import DashboardInventario from '../components/DashboardInventario.vue';


import { obtenerToken } from '@/services/authService';

const routes = [
  { path: '/', redirect: '/productos' },
  { path: '/login', component: LoginView },
  {
    path: '/form',
    name: 'Formulario',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/productos',
    component: ProductList,
    meta: { requiresAuth: true }
  },
  {
    path: '/editar/:id',
    component: ProductForm,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    component: HistorialPlaceholder,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/usuarios',
    component: UserAdminView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/dashboard',
    component: DashboardInventario,
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = obtenerToken();
  const requiereAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiereAuth && !token) {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  } else if (to.path === '/login' && token) {
    next('/productos');
  } else {
    next();
  }
});

export default router;
