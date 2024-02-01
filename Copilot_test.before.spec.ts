// Import the test and expect functions from the Playwright Test module
import { test, expect } from '@playwright/test';

// Define the base URL for the website to test
const BASE_URL = 'https://www.saucedemo.com/';

//Verify that the user can log in with valid credentials
test('TC01: Login with valid credentials', async ({ page }) => {
  // Navigate to the base URL
  await page.goto(BASE_URL);

  // Enter a valid username and password in the login fields
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');

  // Click on the login button
  await page.click('#login-button');

  // Expect that the user should be redirected to the inventory page and see a list of products
  await expect(page).toHaveURL(BASE_URL + 'inventory.html');
  await expect(page).toHaveSelector('.inventory_item');
});

//Verify that the user can add a product to the shopping cart
test('TC02: Add a product to the cart', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Select a product from the inventory page
  const product = await page.$('.inventory_item');

  // Click on the add to cart button
  await product.click('.btn_inventory');

  // Expect that the product should be added to the cart and the cart icon should show the number of items in the cart
  await expect(product).toHaveText('REMOVE');
  await expect(page).toHaveText('.shopping_cart_badge', '1');
});

//Verify that the user can remove a product from the shopping cart
test('TC03: Remove a product from the cart', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add a product to the cart
  const product = await page.$('.inventory_item');
  await product.click('.btn_inventory');

  // Click on the cart icon
  await page.click('.shopping_cart_link');

  // Click on the remove button for the product
  await product.click('.btn_secondary');

  // Expect that the product should be removed from the cart and the cart icon should show the updated number of items in the cart
  await expect(product).toHaveText('ADD TO CART');
  await expect(page).not.toHaveText('.shopping_cart_badge', '1');
});



//Verify that the user can sort the products by price, name, or popularity
test('TC04: Sort products', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the drop-down menu on the inventory page
  await page.click('.product_sort_container');

  // Select one of the sorting options (low to high, high to low, A to Z, Z to A)
  await page.selectOption('.product_sort_container', 'lohi');

  // Expect that the products should be sorted according to the selected option
  const prices = await page.$$eval('.inventory_item_price', elements => elements.map(e => parseFloat(e.textContent.replace('$', ''))));
  expect(prices).toEqual(prices.slice().sort((a, b) => a - b));
});

//Verify that the user can checkout with the products in the cart
test('TC05: Checkout', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add one or more products to the cart
  await page.click('.inventory_item:nth-child(1) .btn_inventory');
  await page.click('.inventory_item:nth-child(2) .btn_inventory');

  // Click on the cart icon
  await page.click('.shopping_cart_link');

  // Click on the checkout button
  await page.click('#checkout');

  // Enter the first name, last name, and zip code in the checkout information page
  await page.fill('#first-name', 'John');
  await page.fill('#last-name', 'Doe');
  await page.fill('#postal-code', '12345');

  // Click on the continue button
  await page.click('#continue');

  // Click on the finish button on the checkout overview page
  await page.click('#finish');

  // Expect that the user should see a confirmation message that the order has been placed
  await expect(page).toHaveText('.complete-header', 'THANK YOU FOR YOUR ORDER');
});

//Verify that the user can log out from the menu
test('TC06: Logout', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the menu icon on the top left corner
  await page.click('.bm-burger-button');

  // Click on the logout option
  await page.click('#logout_sidebar_link');

  // Expect that the user should be logged out and see the login page
  await expect(page).toHaveURL(BASE_URL);
  await expect(page).toHaveSelector('#login-button');
});

//Verify that the user can filter the products by category
test('TC07: Filter products by category', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the menu icon on the top left corner
  await page.click('.bm-burger-button');

  // Select one of the category options (All Items, Sauce Labs Backpack, Sauce Labs Bike Light, etc.)
  await page.click('#inventory_sidebar_link');

  // Expect that the products should be filtered according to the selected category and only show the relevant items
  const products = await page.$$eval('.inventory_item_name', elements => elements.map(e => e.textContent));
  expect(products).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
});


//Verify that the user can reset the app state from the menu
test('TC08: Reset app state', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add one or more products to the cart
  await page.click('.inventory_item:nth-child(1) .btn_inventory');
  await page.click('.inventory_item:nth-child(2) .btn_inventory');

  // Click on the menu icon on the top left corner
  await page.click('.bm-burger-button');

  // Click on the reset app state option
  await page.click('#reset_sidebar_link');

  // Expect that the products should be removed from the cart and the cart icon should show zero items
  await expect(page).not.toHaveText('.inventory_item:nth-child(1) .btn_inventory', 'REMOVE');
  await expect(page).not.toHaveText('.inventory_item:nth-child(2) .btn_inventory', 'REMOVE');
  await expect(page).not.toHaveText('.shopping_cart_badge', '2');
});

//Verify that the user can view the about page from the menu
test('TC09: View about page', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the menu icon on the top left corner
  await page.click('.bm-burger-button');

  // Click on the about option
  await page.click('#about_sidebar_link');

  // Expect that the user should see a new tab open with the Sauce Labs website
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('#about_sidebar_link'),
  ]);
  await expect(newPage).toHaveURL('https://saucelabs.com/');
});

//Verify that the user can view the product details
test('TC10: View product details', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Select a product from the inventory page
  const product = await page.$('.inventory_item');

  // Click on the product image or name
  await product.click('.inventory_item_img');

  // Expect that the user should see a product details page with the product name, description, price, and image
  await expect(page).toHaveURL(BASE_URL + 'inventory-item.html?id=4');
  await expect(page).toHaveText('.inventory_details_name', 'Sauce Labs Backpack');
  await expect(page).toHaveText('.inventory_details_desc', 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
  await expect(page).toHaveText('.inventory_details_price', '$29.99');
  await expect(page).toHaveSelector('.inventory_details_img');
});

//Verify that the user can change the quantity of the products in the cart
test('TC11: Change product quantity', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add one or more products to the cart
  await page.click('.inventory_item:nth-child(1) .btn_inventory');
  await page.click('.inventory_item:nth-child(2) .btn_inventory');

  // Click on the cart icon
  await page.click('.shopping_cart_link');

  // Click on the plus or minus button next to the product quantity
  await page.click('.cart_quantity:nth-child(1) .cart_quantity_up');
  await page.click('.cart_quantity:nth-child(2) .cart_quantity_down');

  // Expect that the product quantity should be increased or decreased accordingly and the total amount should be updated
  await expect(page).toHaveText('.cart_quantity:nth-child(1) .cart_quantity_input', '2');
  await expect(page).toHaveText('.cart_quantity:nth-child(2) .cart_quantity_input', '0');
  await expect(page).toHaveText('.summary_subtotal_label', 'Item total: $59.98');
});

//Verify that the user can cancel the checkout process
test('TC12: Cancel checkout', async ({ page }) => {
  // Log in with valid credentials
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add one or more products to the cart
  await page.click('.inventory_item:nth-child(1) .btn_inventory');
  await page.click('.inventory_item:nth-child(2) .btn_inventory');

  // Click on the cart icon
  await page.click('.shopping_cart_link');

  // Click on the checkout button
  await page.click('#checkout');

  // Enter the first name, last name, and zip code in the checkout information page
  await page.fill('#first-name', 'John');
  await page.fill('#last-name', 'Doe');
  await page.fill('#postal-code', '12345');

  // Click on the continue button
  await page.click('#continue');

  // Click on the cancel button on the checkout overview page
  await page.click('#cancel');

  // Expect that the user should be redirected to the inventory page and the products should remain in the cart
  await expect(page).toHaveURL(BASE_URL + 'inventory.html');
  await expect(page).toHaveText('.shopping_cart_badge', '2');
});
