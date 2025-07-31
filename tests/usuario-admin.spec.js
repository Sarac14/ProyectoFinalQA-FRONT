const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8081';
const USER = 'admin@example.com';
const PASS = 'admin';

// Función de login más robusta
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  
  // Método más directo para llenar el form
  await page.fill('input[type="email"]', USER);
  await page.fill('input[type="password"]', PASS);
  
  // Esperar que el botón se habilite y hacer click
  const submitButton = page.getByRole('button', { name: 'Iniciar Sesión' });
  await expect(submitButton).toBeEnabled({ timeout: 10000 });
  await submitButton.click();
  
  // Esperar redirección
  await page.waitForURL('**/productos', { timeout: 20000 });
}

async function findUserInPaginatedTable(page, email) {
  let found = false;

  while (true) {
    const row = page.locator('.user-table tbody tr', { hasText: email });

    if (await row.count() > 0) {
      found = true;
      await expect(row.first()).toBeVisible();
      return row.first();
    }

    const nextBtn = page.locator('.pagination-controls button:has-text("Siguiente")');
    if (await nextBtn.isDisabled()) break;

    await nextBtn.click();
    await page.waitForTimeout(500);
  }

  if (!found) throw new Error(`Usuario con email ${email} no encontrado en la tabla`);
}

test.describe('Gestión de Usuarios', () => {
  // Variable local para cada test
  let testUserEmail;
  test.describe.configure({ timeout: 60000 });

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/admin/usuarios`);
    await expect(page.locator('h2')).toHaveText('Gestión de Usuarios');
  });

  test('Mostrar lista de usuarios', async ({ page }) => {
    const tableRows = page.locator('.user-table tbody tr');
    await expect(tableRows.first()).toBeVisible({ timeout: 10000 });
    const count = await tableRows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Crear nuevo usuario', async ({ page }) => {
    testUserEmail = `testuser_${Date.now()}@example.com`;

    await page.click('button.create-btn');
    await expect(page.locator('.modal h3')).toHaveText('Crear Usuario');

    await page.fill('input[placeholder="Ingresa el nombre"]', 'Juan');
    await page.fill('input[placeholder="Ingresa el apellido"]', 'Pérez');
    await page.fill('input[placeholder="ejemplo@correo.com"]', testUserEmail);
    await page.fill('input[type="password"]', '12345678');

    const firstRole = page.locator('.modal select option').nth(1);
    await page.selectOption('.modal select', await firstRole.getAttribute('value'));

    await Promise.all([
      page.waitForResponse(resp =>
        resp.url().includes('/usuarios') && resp.status() === 200
      ),
      page.click('.modal button[type="submit"]')
    ]);
  });

  test('Bloquear y desbloquear usuario', async ({ page }) => {
    const firstRow = page.locator('.user-table tbody tr').nth(1);

    const bloquearBtn = firstRow.locator('button[title="Bloquear usuario"]');
    if (await bloquearBtn.isVisible()) {
      await bloquearBtn.click();
      await expect(firstRow.locator('.status')).toHaveText(/BLOQUEADO/);
    }

    const desbloquearBtn = firstRow.locator('button[title="Desbloquear usuario"]');
    if (await desbloquearBtn.isVisible()) {
      await desbloquearBtn.click();
      await expect(firstRow.locator('.status')).toHaveText(/ACTIVO/);
    }
  });

  // Test independiente que crea y elimina su propio usuario
  test('Crear y eliminar usuario', async ({ page }) => {
    const uniqueEmail = `testuser_delete_${Date.now()}@example.com`;

    // Crear usuario
    await page.click('button.create-btn');
    await expect(page.locator('.modal h3')).toHaveText('Crear Usuario');

    await page.fill('input[placeholder="Ingresa el nombre"]', 'Test');
    await page.fill('input[placeholder="Ingresa el apellido"]', 'Delete');
    await page.fill('input[placeholder="ejemplo@correo.com"]', uniqueEmail);
    await page.fill('input[type="password"]', '12345678');

    const firstRole = page.locator('.modal select option').nth(1);
    await page.selectOption('.modal select', await firstRole.getAttribute('value'));

    await Promise.all([
      page.waitForResponse(resp =>
        resp.url().includes('/usuarios') && resp.status() === 200
      ),
      page.click('.modal button[type="submit"]')
    ]);

    // Buscar y eliminar el usuario recién creado
    const userRow = await findUserInPaginatedTable(page, uniqueEmail);
    
    page.once('dialog', dialog => dialog.accept());
    await userRow.locator('button[title="Eliminar usuario"]').click();

    // Verificar que se eliminó
    await expect(page.locator('.user-table')).not.toContainText(uniqueEmail);
  });

  test('Paginación funciona', async ({ page }) => {
    const nextBtn = page.locator('.pagination-controls button:has-text("Siguiente")');
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await expect(page.locator('.pagination-controls span')).toContainText('Página 2');
    }
  });
});