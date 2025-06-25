import { createRouter, createWebHistory } from 'vue-router'
import ProductForm from '../components/ProductForm.vue'
import ProductList from '../components/ProductList.vue'
//import EditProduct from '@/views/EditProduct.vue'

const routes = [
  { path: '/', redirect: '/productos' },
  { path: '/form', name: 'Formulario', component: ProductForm },
  { path: '/productos', component: ProductList },
  { path: '/editar/:id', component: ProductForm, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
