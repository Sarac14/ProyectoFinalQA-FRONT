// tests/inventario.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8080';
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


      await expect(filas).toHaveCount(count - 1, { timeout: 5000 });
      filas = page.locator(`tr:has-text("${nombre}")`);
  }
}


async function crearProducto(page, nombre = 'ProductoTest') {
  await eliminarProductoSiExiste(page, nombre);

  const botonCrear = page.locator('button:has-text("Crear Producto")');
  await botonCrear.waitFor({ state: "visible" });

  // Asegura visibilidad real antes de clic
  const box = await botonCrear.boundingBox();
  if (!box) {
      throw new Error('El botón Crear Producto no está en el viewport');
  }
  await botonCrear.click({ force: true });
  await page.waitForURL('**/form', { timeout: 10000 });

  await page.fill('#nombre', nombre);
  await page.fill('#descripcion', 'Descripción de prueba');
  const select = page.locator('#categoria');
  const opciones = await select.locator('option').all();
  if (opciones.length > 1) {
    await select.selectOption({ index: 1 });
  }
  await page.fill('#precio', '99.99');
  await page.fill('#cantidad', '10');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/productos', { timeout: 10000 });
  await expect(
    page.locator('table tr', { hasText: nombre }).locator('td').first()
  ).toBeVisible();

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
  const fila = page.locator('tr', { hasText: `ProductoEditarTest` });
  const botonEditar = fila.first().locator('button[title="Editar"]');
  await botonEditar.scrollIntoViewIfNeeded();
  await botonEditar.click({ force: true });
  await page.waitForURL(/\/editar\/.*/, { timeout: 10000 });
  await page.fill('#nombre', nuevoNombre);
  await Promise.all([
      page.waitForURL('**/productos', { timeout: 10000 }),
      page.click('button[type="submit"]'),
  ]);
  const filaProductoEditado = page.locator('tr', {
    has: page.locator('td:first-child', { hasText: nuevoNombre }),
  });
  await expect(filaProductoEditado.first()).toBeVisible({ timeout: 10000 });
});


  test('Eliminar producto existente', async ({ page }) => {
    await crearProducto(page, 'ProductoEliminarTest');

    page.once('dialog', dialog => dialog.accept());
    const botonEliminar = page.locator(`tr:has-text("ProductoEliminarTest") button[title="Eliminar"]`);
    await botonEliminar.scrollIntoViewIfNeeded();
    await botonEliminar.click({ force: true });


    await expect(page.locator(`tr:has-text("ProductoEliminarTest")`)).toHaveCount(0);
  });

test('Aplicar filtros y limpiar filtros', async ({ page }) => {
  await crearProducto(page, 'ProductoFiltroTest');

  await page.click('button:has-text("Filtros")');
  await page.fill('#nombre', 'ProductoFiltroTest');
  await page.waitForSelector('button:has-text("Aplicar Filtros")', { state: 'visible' });
  await page.click('button:has-text("Aplicar Filtros")', { force: true });


  await expect(page.locator(`tr:has-text("ProductoFiltroTest")`).first()).toBeVisible();

  await page.click('button.btn-close'); 
  await page.waitForSelector('.modal-overlay', { state: 'hidden', timeout: 5000 });

  await page.locator('button.btn-limpiar-filtros').scrollIntoViewIfNeeded();
  await page.locator('button.btn-limpiar-filtros').click();

  await expect(page.locator('h2')).toContainText('Lista de Productos');
});


  test('Logout y re-login', async ({ page }) => {
  const botonLogout = page.locator('button.logout');
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

test.describe('Autenticación - Inventario', () => {
  test('Login inválido muestra error', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    if (await page.locator('button.logout').isVisible()) {
      const botonLogout = page.locator('button.logout');
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
    await expect(page.locator('p.error')).toContainText('Credenciales inválidas');
  });
});

});
