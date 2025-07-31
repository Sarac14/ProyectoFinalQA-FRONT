const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8081';
const USER = 'admin@example.com';
const PASS = 'admin';

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

test.describe('Formulario de Productos', () => {

  test('Crear producto correctamente', async ({ page }) => {
    await login(page);

    await page.goto(`${BASE_URL}/form`);

    await page.fill('#nombre', 'Laptop Gamer');
    await page.fill('#descripcion', 'Laptop de alto rendimiento');
    
    await page.selectOption('#categoria', { label: 'ELECTRONICA' });

    await page.fill('#precio', '1599.99');
    await page.fill('#cantidad', '10');
    await page.fill('#minimoStock', '2');

    await page.click('button[type="submit"]');

    await expect(page.locator('.mensaje.success')).toContainText('Producto creado exitosamente.');
    
    await page.waitForURL('**/productos');
    await expect(page.locator('h2')).toHaveText('Lista de Productos');
  });

  test('Validar campos obligatorios', async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/form`);

    await page.click('button[type="submit"]');

    await expect(page.locator('h2')).toHaveText('Crear Producto');
  });

test('Editar producto existente', async ({ page }) => {
  await login(page);

  await page.goto(`${BASE_URL}/editar/1`);

  await expect(page.locator('#nombre')).toBeVisible();

  await page.fill('#nombre', 'Laptop Gamer PRO');
  await page.fill('#precio', '1899.99');
  await page.click('button[type="submit"]');

  await expect(page.locator('.mensaje.success'))
    .toContainText('Producto actualizado correctamente.');

  await page.waitForURL('**/productos');
});


});
