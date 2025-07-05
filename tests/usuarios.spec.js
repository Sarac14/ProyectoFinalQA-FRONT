// const { test, expect } = require('@playwright/test');

// const BASE_URL = 'http://localhost:8081';
// const USER = 'admin@example.com';
// const PASS = 'admin';

// async function ensureTestUserExists(page) {
//     const filaUsuario = page.locator('tr', { hasText: 'TestNombre' });
//     if (await filaUsuario.count() === 0) {
//         await page.click('button:has-text("Crear Usuario")');
//         await page.fill('input[placeholder="Ingresa el nombre"]', 'TestNombre');
//         await page.fill('input[placeholder="Ingresa el apellido"]', 'TestApellido');
//         await page.fill('input[placeholder="ejemplo@correo.com"]', 'testuser@example.com');
//         await page.fill('input[placeholder="Contraseña segura"]', 'testpassword');
//         await page.fill('input[placeholder="ID del rol"]', '2');
//         await page.waitForSelector('.modal-content', { state: 'visible' });
//         await page.click('.modal-content button:has-text("Crear Usuario")');
//         await page.waitForSelector('.modal-content', { state: 'hidden' });
//         await expect(filaUsuario).toBeVisible({ timeout: 10000 });
//     }
// }


// async function login(page) {
//   await page.goto(`${BASE_URL}/login`);
//   await page.fill('input[type="email"]', USER);
//   await page.fill('input[type="password"]', PASS);
//   await page.click('button[type="submit"]');
//   await page.waitForURL('**/productos', { timeout: 10000 });
// }

// async function eliminarUsuarioSiExiste(page, nombre) {
//     const filaUsuario = page.locator('tr', { hasText: nombre });
//     if (await filaUsuario.count() > 0) {
//         page.once('dialog', dialog => dialog.accept());
//         await filaUsuario.locator('button[title="Eliminar usuario"]').click();
//         await expect(filaUsuario).toHaveCount(0, { timeout: 10000 }); 
//     }
// }



// test.describe('Gestión de Usuarios - Pruebas E2E Robustas', () => {

//   test.beforeEach(async ({ page }) => {
//     await login(page);
//     await page.goto(`${BASE_URL}/admin/usuarios`);
//     await expect(page.locator('h2')).toContainText('Gestión de Usuarios');
//   });

//   test('Crear usuario y verificar en la tabla', async ({ page }) => {
//     await eliminarUsuarioSiExiste(page, 'TestNombre');

//     await page.click('button:has-text("Crear Usuario")');
//     await page.fill('input[placeholder="Ingresa el nombre"]', 'TestNombre');
//     await page.fill('input[placeholder="Ingresa el apellido"]', 'TestApellido');
//     await page.fill('input[placeholder="ejemplo@correo.com"]', 'testuser@example.com');
//     await page.fill('input[placeholder="Contraseña segura"]', 'testpassword');
//     await page.fill('input[placeholder="ID del rol"]', '2'); 

//     await page.waitForSelector('.modal-content', { state: 'visible' });
//     await page.click('.modal-content button:has-text("Crear Usuario")');
//     await page.waitForSelector('.modal-content', { state: 'hidden' });
//     await expect(page.locator('tr', { hasText: 'TestNombre' })).toBeVisible({ timeout: 10000 });


//     await page.waitForSelector('.modal-content', { state: 'hidden' });

//     await expect(page.locator('tr', { hasText: 'TestNombre' })).toBeVisible({ timeout: 10000 });


//     await page.reload();
//     const filaUsuario = page.locator('tr', { hasText: 'TestNombre' });
//     await expect(filaUsuario).toBeVisible();
//   });

//     test('Bloquear y desbloquear usuario', async ({ page }) => {
//         await ensureTestUserExists(page);

//         const filaUsuario = page.locator('tr', { hasText: 'TestNombre' });
//         await expect(filaUsuario).toBeVisible();

//         await filaUsuario.locator('button[title="Bloquear usuario"]').click();
//         await expect.poll(async () => {
//             return await filaUsuario.locator('td').nth(4).innerText();
//         }, {
//             message: 'Waiting for user state to become BLOQUEADO',
//             timeout: 10000
//         }).toBe('BLOQUEADO');

//         await filaUsuario.locator('button[title="Desbloquear usuario"]').click();
//         await expect.poll(async () => {
//             return await filaUsuario.locator('td').nth(4).innerText();
//         }, {
//             message: 'Waiting for user state to become ACTIVO',
//             timeout: 10000
//         }).toBe('ACTIVO');
//     });




// test('Eliminar usuario', async ({ page }) => {
//     await ensureTestUserExists(page);

//     const filaUsuario = page.locator('tr', { hasText: 'TestNombre' });
//     await expect(filaUsuario).toBeVisible();

//     page.once('dialog', dialog => dialog.accept());

//     await filaUsuario.locator('button[title="Eliminar usuario"]').click();

//     await expect(filaUsuario).toHaveCount(0, { timeout: 10000 });
// });

// });
