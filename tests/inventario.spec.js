// tests/inventario.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8081';
const USER = 'admin@example.com';
const PASS = 'admin';

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', USER);
  await page.fill('input[type="password"]', PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/productos', { timeout: 10000 });
  await expect(page.locator('h2')).toContainText('Lista de Productos');
}

async function eliminarProductoSiExiste(page, nombre) {
  let filas = page.locator(`tr:has-text("${nombre}")`);
  while (await filas.count() > 0) {
    const count = await filas.count(); 

    page.once('dialog', dialog => dialog.accept());

    const botonEliminar = filas.first().locator('button[title="Eliminar"]');
    await botonEliminar.scrollIntoViewIfNeeded();
    await botonEliminar.click({ force: true });

    await page.waitForLoadState('networkidle', { timeout: 5000 });
    
    await page.waitForFunction(
      (nombre) => {
        const filas = document.querySelectorAll(`tr:has-text("${nombre}")`);
        return filas.length === 0;
      },
      nombre,
      { timeout: 10000 }
    ).catch(() => {
      return page.reload();
    });

    filas = page.locator(`tr:has-text("${nombre}")`);
  }
}


async function buscarProductoEnTodasLasPaginas(page, nombre, maxPaginas = 20) {
  while (true) {
    const botonAnterior = page.locator('button:has-text("Anterior")');
    if (await botonAnterior.isDisabled()) break;
    await botonAnterior.click();
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  }
  
  for (let i = 0; i < maxPaginas; i++) {
    const productoFila = page.locator(`tr:has-text("${nombre}")`);
    if (await productoFila.count() > 0) {
      return productoFila;
    }
    const botonSiguiente = page.locator('button:has-text("Siguiente")');
    if (await botonSiguiente.isDisabled() || !(await botonSiguiente.isVisible())) break;
    await botonSiguiente.click();
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  }
  throw new Error(`Producto "${nombre}" no encontrado en ninguna página.`);
}

async function crearProducto(page, nombre = 'ProductoTest') {
  await eliminarProductoSiExiste(page, nombre);

  const botonCrear = page.locator('button:has-text("Crear")');
  await botonCrear.waitFor({ state: "visible" });

  const box = await botonCrear.boundingBox();
  if (!box) {
    throw new Error('El botón Crear no está en el viewport');
  }
  await botonCrear.click({ force: true });
  await page.waitForURL('**/form', { timeout: 10000 });

  await page.fill('#nombre', nombre);
  await page.fill('#descripcion', 'Descripción de prueba');
  
  const select = page.locator('#categoria');
  await select.waitFor({ state: 'visible' });
  
  await select.selectOption('ELECTRONICA');
  
  await page.fill('#precio', '99.99');
  await page.fill('#cantidad', '10');
  
  await page.waitForSelector('#webpack-dev-server-client-overlay', { 
    state: 'detached', 
    timeout: 5000 
  }).catch(() => {});
  
  await page.click('button[type="submit"]', { force: true });

  await page.waitForURL('**/productos', { timeout: 10000 });
  
  await page.waitForLoadState('networkidle', { timeout: 10000 });
  
  await page.locator('button:has-text("Anterior")').click({ force: true }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 5000 });
  
  const productoFila = await buscarProductoEnTodasLasPaginas(page, nombre);
  await expect(productoFila.first()).toBeVisible();
}

test.describe('Inventario - Pruebas E2E Robustas', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('Crear producto y verlo en la lista', async ({ page }) => {
    await crearProducto(page, 'ProductoCreadoTest');
  });

test('Editar producto existente', async ({ page }) => {
  const nuevoNombre = 'ProductoEditadoTest';

  await crearProducto(page, 'ProductoEditarTest');
  
  const fila = page.locator('tr', { hasText: 'ProductoEditarTest' });
  const botonEditar = fila.first().locator('button[title="Editar"]');
  
  await botonEditar.waitFor({ state: 'visible', timeout: 10000 });
  await botonEditar.scrollIntoViewIfNeeded();
  await botonEditar.click({ force: true });
  
  await page.waitForURL(/\/editar\/.*/, { timeout: 10000 });
  await page.fill('#nombre', nuevoNombre);
  
  await page.waitForSelector('#webpack-dev-server-client-overlay', { 
    state: 'detached', 
    timeout: 5000 
  }).catch(() => {});
  
  await page.click('button[type="submit"]', { force: true });
  await page.waitForURL('**/productos', { timeout: 10000 }).catch(async () => {
    await expect(page.locator('table.product-table')).toBeVisible({ timeout: 10000 });
  });

  const filaProductoEditado = page.locator('tr', {
    has: page.locator('td:first-child', { hasText: nuevoNombre }),
  });
  await expect(filaProductoEditado.first()).toBeVisible({ timeout: 10000 });
});

test('Eliminar producto existente', async ({ page }) => {
  await crearProducto(page, 'ProductoEliminarTest');

  page.once('dialog', dialog => dialog.accept());
  
  const botonEliminar = page.locator(`tr:has-text("ProductoEliminarTest") button[title="Eliminar"]`).first();
  await botonEliminar.scrollIntoViewIfNeeded();
  await botonEliminar.click({ force: true });
  
  await expect(page.locator(`tr:has-text("ProductoEliminarTest")`)).toHaveCount(0, { timeout: 10000 });
});

  test('Aplicar filtros y limpiar filtros', async ({ page }) => {
    await crearProducto(page, 'ProductoFiltroTest');

    await page.click('button:has-text("Filtros")');
    await page.fill('#nombre', 'ProductoFiltroTest');
    await page.waitForSelector('button:has-text("Aplicar Filtros")', { state: 'visible' });
    await page.click('button:has-text("Aplicar Filtros")', { force: true });

    await expect(page.locator(`tr:has-text("ProductoFiltroTest")`).first()).toBeVisible();

    await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });

    await page.locator('button.btn-limpiar-filtros').scrollIntoViewIfNeeded();
    await page.locator('button.btn-limpiar-filtros').click();

    await expect(page.locator('h2')).toContainText('Lista de Productos');
  });

  test('Logout y re-login', async ({ page }) => {
    const botonLogout = page.locator('button:has-text("Salir")');
    await botonLogout.waitFor({ state: 'visible' });
    await botonLogout.scrollIntoViewIfNeeded();
    await expect(botonLogout).toBeVisible();
    await expect(botonLogout).toBeEnabled();
    await botonLogout.click();
    await page.waitForURL('**/login', { timeout: 10000 });
    await expect(page.locator('h2')).toContainText('Iniciar Sesión');

    await page.goto(`${BASE_URL}/productos`);
    await expect(page).toHaveURL(/\/login/);

    await login(page);
  });
});

test.describe('Autenticación - Inventario', () => {
  test('Login inválido muestra error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    if (await page.locator('button:has-text("Salir")').isVisible()) {
      const botonLogout = page.locator('button:has-text("Salir")');
      await botonLogout.waitFor({ state: 'visible' });
      await expect(botonLogout).toBeVisible();
      await expect(botonLogout).toBeEnabled();
      await botonLogout.scrollIntoViewIfNeeded();
      await botonLogout.click();
      await page.waitForURL('**/login', { timeout: 10000 });
    }

    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    await page.fill('input[type="email"]', 'wrong@user.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('.error-message')).toContainText('Credenciales inválidas');
  });
});