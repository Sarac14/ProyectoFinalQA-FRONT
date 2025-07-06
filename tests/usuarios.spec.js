// tests/usuarios.spec.js
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8081';
const ADMIN_USER = 'admin@example.com';
const ADMIN_PASS = 'admin';

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', ADMIN_USER);
  await page.fill('input[type="password"]', ADMIN_PASS);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/productos', { timeout: 10000 });
  await expect(page.locator('h2')).toContainText('Lista de Productos');
}

async function navegarAUsuarios(page) {
  await page.click('button:has-text("Admin")');
  
  await page.click('button:has-text("Usuarios")');
  await page.waitForURL('**/admin/usuarios', { timeout: 10000 });
  await expect(page.locator('h2')).toContainText('Gestión de Usuarios');
}

async function eliminarUsuarioSiExiste(page, email) {
  let encontrado = false;
  let maxIntentos = 10;
  let intentos = 0;

  while (intentos < maxIntentos) {
    const filaUsuario = page.locator(`tr:has-text("${email}")`);
    if (await filaUsuario.count() > 0) {
      encontrado = true;
      
      page.once('dialog', dialog => dialog.accept());
      const botonEliminar = filaUsuario.first().locator('button[title="Eliminar usuario"]');
      await botonEliminar.click();
      
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      break;
    }

    const botonSiguiente = page.locator('button:has-text("Siguiente")');
    if (await botonSiguiente.isDisabled() || !(await botonSiguiente.isVisible())) {
      break;
    }
    await botonSiguiente.click();
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    intentos++;
  }

  while (true) {
    const botonAnterior = page.locator('button:has-text("Anterior")');
    if (await botonAnterior.isDisabled()) break;
    await botonAnterior.click();
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  }
}

async function crearUsuario(page, userData) {
  await eliminarUsuarioSiExiste(page, userData.email);

  await page.click('button:has-text("Crear Usuario")');
  
  await page.waitForSelector('.modal', { state: 'visible' });
  
  await page.fill('input[placeholder="Ingresa el nombre"]', userData.nombre);
  await page.fill('input[placeholder="Ingresa el apellido"]', userData.apellido);
  await page.fill('input[placeholder="ejemplo@correo.com"]', userData.email);
  await page.fill('input[placeholder="Contraseña segura"]', userData.password);
  await page.fill('input[placeholder="ID del rol"]', userData.idRol.toString());
  
  await page.click('button[type="submit"]:has-text("Crear Usuario")');
  
  await page.waitForSelector('.modal', { state: 'hidden', timeout: 10000 });
  
  await page.waitForLoadState('networkidle', { timeout: 5000 });
}

test.describe('Gestión de Usuarios - Pruebas E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navegarAUsuarios(page);
  });

  test('Navegar a la página de usuarios', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Gestión de Usuarios');
    await expect(page.locator('button:has-text("Crear Usuario")')).toBeVisible();
    await expect(page.locator('.user-table')).toBeVisible();
  });

  test('Crear nuevo usuario', async ({ page }) => {
    const nuevoUsuario = {
      nombre: 'TestUser',
      apellido: 'Playwright',
      email: 'testuser@playwright.com',
      password: 'password123',
      idRol: 2
    };

    await crearUsuario(page, nuevoUsuario);

    const filaUsuario = page.locator(`tr:has-text("${nuevoUsuario.email}")`);
    await expect(filaUsuario).toBeVisible({ timeout: 10000 });
    await expect(filaUsuario).toContainText(nuevoUsuario.nombre);
    await expect(filaUsuario).toContainText(nuevoUsuario.apellido);
    await expect(filaUsuario).toContainText(nuevoUsuario.email);
  });

  test('Cancelar creación de usuario', async ({ page }) => {
    await page.click('button:has-text("Crear Usuario")');
    
    await page.waitForSelector('.modal', { state: 'visible' });
    
    await page.fill('input[placeholder="Ingresa el nombre"]', 'Usuario');
    await page.fill('input[placeholder="ejemplo@correo.com"]', 'test@test.com');
    
    await page.click('button:has-text("Cancelar")');
    
    await page.waitForSelector('.modal', { state: 'hidden' });
    
    const filaUsuario = page.locator('tr:has-text("test@test.com")');
    await expect(filaUsuario).not.toBeVisible();
  });

  test('Cerrar modal con X', async ({ page }) => {
    await page.click('button:has-text("Crear Usuario")');
    
    await page.waitForSelector('.modal', { state: 'visible' });
    
    await page.click('.close-btn');
    
    await page.waitForSelector('.modal', { state: 'hidden' });
  });

  test('Validación de formulario - campos requeridos', async ({ page }) => {
    await page.click('button:has-text("Crear Usuario")');
    
    await page.waitForSelector('.modal', { state: 'visible' });
    
    await page.click('button[type="submit"]:has-text("Crear Usuario")');
    
    await expect(page.locator('.modal')).toBeVisible();
  });

  test('Bloquear usuario', async ({ page }) => {
    const usuarioTest = {
      nombre: 'UsuarioBloquear',
      apellido: 'Test',
      email: 'bloquear@test.com',
      password: 'password123',
      idRol: 2
    };

    await crearUsuario(page, usuarioTest);

    const filaUsuario = page.locator(`tr:has(td:text-is("${usuarioTest.email}"))`);
    await expect(filaUsuario).toBeVisible();
    
    const botonBloquear = filaUsuario.locator('button[title="Bloquear usuario"]');
    await botonBloquear.click();
    
    await expect(filaUsuario.locator('.status.bloqueado')).toBeVisible({ timeout: 10000 });
    
    await expect(filaUsuario.locator('.status.bloqueado')).toBeVisible({ timeout: 10000 });
  });

  test('Desbloquear usuario', async ({ page }) => {
    const usuarioTest = {
      nombre: 'UsuarioDesbloquear',
      apellido: 'Test',
      email: 'desbloquear@test.com',
      password: 'password123',
      idRol: 2
    };

    await crearUsuario(page, usuarioTest);

    const filaUsuario = page.locator(`tr:has(td:text-is("${usuarioTest.email}"))`);

    
    const botonBloquear = filaUsuario.locator('button[title="Bloquear usuario"]');
    await botonBloquear.click();
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    
    const botonDesbloquear = filaUsuario.locator('button[title="Desbloquear usuario"]');
    await botonDesbloquear.click();
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    
    await expect(filaUsuario.locator('.status:not(.bloqueado)')).toBeVisible({ timeout: 10000 });
  });

  test('Eliminar usuario', async ({ page }) => {
    const usuarioTest = {
      nombre: 'UsuarioEliminar',
      apellido: 'Test',
      email: 'eliminar@test.com',
      password: 'password123',
      idRol: 2
    };

    await crearUsuario(page, usuarioTest);

    page.once('dialog', dialog => dialog.accept());
    
    const filaUsuario = page.locator(`tr:has-text("${usuarioTest.email}")`);
    const botonEliminar = filaUsuario.locator('button[title="Eliminar usuario"]');
    await botonEliminar.click();
    
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    
    await expect(page.locator(`tr:has-text("${usuarioTest.email}")`)).not.toBeVisible();
  });

  test('Navegación de páginas', async ({ page }) => {
    await expect(page.locator('.pagination-controls')).toBeVisible();
    
    await expect(page.locator('text=/Página \\d+ de \\d+/')).toBeVisible();
    
    const botonSiguiente = page.locator('button:has-text("Siguiente")');
    if (!(await botonSiguiente.isDisabled())) {
      await botonSiguiente.click();
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      
      await expect(page.locator('text=/Página [2-9]\\d* de \\d+/')).toBeVisible();
      
      const botonAnterior = page.locator('button:has-text("Anterior")');
      await botonAnterior.click();
      await page.waitForLoadState('networkidle', { timeout: 5000 });
    }
  });

  test('Verificar campos del formulario de creación', async ({ page }) => {
    await page.click('button:has-text("Crear Usuario")');
    
    await page.waitForSelector('.modal', { state: 'visible' });
    
    await expect(page.locator('input[placeholder="Ingresa el nombre"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Ingresa el apellido"]')).toBeVisible();
    await expect(page.locator('input[placeholder="ejemplo@correo.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Contraseña segura"]')).toBeVisible();
    await expect(page.locator('input[placeholder="ID del rol"]')).toBeVisible();
    
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
    
    await expect(page.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(page.locator('.modal button:has-text("Crear Usuario")')).toBeVisible();

  });

});

test.describe('Gestión de Usuarios - Casos de Error', () => {
  
  test.beforeEach(async ({ page }) => {
    await login(page);
    await navegarAUsuarios(page);
  });

  test('Manejar error al crear usuario con email duplicado', async ({ page }) => {
    const usuarioTest = {
      nombre: 'Usuario',
      apellido: 'Duplicado',
      email: 'duplicado@test.com',
      password: 'password123',
      idRol: 2
    };

    await crearUsuario(page, usuarioTest);

    await page.click('button:has-text("Crear Usuario")');
    await page.waitForSelector('.modal', { state: 'visible' });
    
    await page.fill('input[placeholder="Ingresa el nombre"]', usuarioTest.nombre);
    await page.fill('input[placeholder="Ingresa el apellido"]', usuarioTest.apellido);
    await page.fill('input[placeholder="ejemplo@correo.com"]', usuarioTest.email);
    await page.fill('input[placeholder="Contraseña segura"]', usuarioTest.password);
    await page.fill('input[placeholder="ID del rol"]', usuarioTest.idRol.toString());
    
    await page.click('button[type="submit"]:has-text("Crear Usuario")');
  });

  test('Cancelar eliminación de usuario', async ({ page }) => {
    const usuarioTest = {
      nombre: 'UsuarioNoCancelar',
      apellido: 'Test',
      email: 'nocancelar@test.com',
      password: 'password123',
      idRol: 2
    };

    await crearUsuario(page, usuarioTest);

    page.once('dialog', dialog => dialog.dismiss());
    
    const filaUsuario = page.locator(`tr:has-text("${usuarioTest.email}")`);
    const botonEliminar = filaUsuario.locator('button[title="Eliminar usuario"]');
    await botonEliminar.click();
    
    await expect(filaUsuario).toBeVisible();
  });

});