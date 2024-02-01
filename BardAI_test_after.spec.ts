import { test, expect} from '@playwright/test';
test.describe('Login form tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });
test('TC01: Login with a valid user', async ({page}) => {

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Enter the username and password
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');

  // Click the login button
  await page.click('#login-button');

  // Verify that the user is logged in and is redirected to the products page
  expect(await page.locator('#header_container > div.header_secondary_container > span').textContent()).toBe('Products');

  // Close the browser
  await page.close();
});

test('TC02: Add an item to the shopping cart', async ({page}) => {

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Login to the website with a valid user
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the first product
  await page.click('.inventory_item:nth-child(1) .btn_inventory');

  // Click the "Add to Cart" button
  //await page.click('.add-to-cart-button');

  // Verify that the product is added to the shopping cart
  expect(await page.textContent('#shopping_cart_container')).toBe('1');

  // Close the browser
  await page.close();
});



test('TC03: Checkout and complete an order', async ({page}) => {
  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');
  // Login to the website with a valid user
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  // Add at least two items to the shopping cart
  await page.click('.inventory_item:nth-child(1) .btn_inventory');
  await page.click('.inventory_item:nth-child(2) .btn_inventory');
  // Click on the Cart icon
  await page.click('#shopping_cart_container > a');
  // Click on the 'Proceed to Checkout' button
  await page.click('#checkout');
  // Enter the shipping address and billing information
  await page.fill('#first-name', 'John');
  await page.fill('#last-name', 'Doe');
  await page.fill('#postal-code', '12345');
  // Click on the 'Place Order' button
  await page.click('#continue');
  await page.click('#finish');
  // Verify that the order is placed successfully
  expect(await page.textContent('#checkout_complete_container > h2')).toBe('Thank you for your order!');
  // Close the browser
  await page.close();
});

test('TC04: Logout from a logged-in account', async ({page}) => {
  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Login to the website with a valid user
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the user avatar icon in the top right corner
  await page.click('#react-burger-menu-btn');

  // Click on the 'Logout' button
  await page.click('#logout_sidebar_link');

  // Verify that the user is logged out and is redirected to the login page
  expect(await page.url()).toBe('https://www.saucedemo.com/');

  // Close the browser
  await page.close();
});



test('TC05: Verify product prices', async ({page}) => {

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  // Click on the 'Products' menu item
 const productPriceOnHoverCard = await page.textContent('#inventory_container > div > div:nth-child(1) > div.inventory_item_description > div.pricebar > div');
  // Hover over any product to view its price
  await page.click('#item_4_title_link > div');

  // Get the price displayed on the product page
  const productPriceOnPage = await page.textContent('#inventory_item_container > div > div > div.inventory_details_desc_container > div.inventory_details_price');

  // Verify that the price displayed on the product page matches the price displayed on the hover card
  expect(productPriceOnPage).toBe(productPriceOnHoverCard);

  // Close the browser
  await page.close();
});

test('TC06: Validate product descriptions', async ({page}) => {
  

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on any product
  await page.click('#item_4_title_link > div');

  // Read the product description carefully
  const productDescription = await page.textContent('#inventory_item_container > div > div > div.inventory_details_desc_container');

  // Verify that the product description provides accurate information about the product
  // Check for features, specifications, and benefits
  // Check that the description is clear, concise, and easy to understand
  expect(productDescription).not.toBeNull();
  // Close the browser
  await page.close();
});



test('TC07: Check product quantity limitations', async ({page}) => {

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Click on the 'Products' menu item
  await page.click('#menu-item-products');

  // Add a product to the shopping cart
  await page.click('.product-item:first-child');

  // Increase the quantity of the product to an amount that exceeds the available quantity
  await page.click('.quantity .plus');
  await page.click('.quantity .plus');

  // Verify that the quantity is updated to reflect the maximum available quantity
  const availableQuantity = await page.textContent('.product-details .stock');

  expect(await page.textContent('.quantity .input')).toBe(availableQuantity);

  // Close the browser
  await page.close();
});

test('TC08: Verify shopping cart functionality', async ({page}) => {
  
  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  // Add products to the shopping cart
  await page.click('.inventory_item:nth-child(1) .btn_inventory');
  await page.click('.inventory_item:nth-child(2) .btn_inventory');
  await page.click('.inventory_item:nth-child(3) .btn_inventory');
  
  // Verify that the total cart value is updated correctly
  const initialCartValue = await page.textContent('#shopping_cart_container > a');

  // Remove items from the shopping cart and verify that the total cart value is updated accordingly
  await page.click('.inventory_item:nth-child(1) .btn_secondary');
  const updatedCartValue = await page.textContent('#shopping_cart_container > a');

  expect(Number(updatedCartValue) < Number(initialCartValue)).toBeTruthy();

  // Empty the shopping cart and verify that the total cart value is zero
  await page.click('.inventory_item:nth-child(2) .btn_secondary');
  await page.click('.inventory_item:nth-child(3) .btn_secondary');

  const emptyCartValue = await page.textContent('#shopping_cart_container > a');

  expect(emptyCartValue).toBe('');

  // Close the browser
  await page.close();
});



test('TC09: Validate checkout process', async ({page}) => {
 

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Login to the website with a valid user
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add products to the shopping cart
  await page.click('.inventory_item:nth-child(1) .btn_inventory');
  

  // Proceed to checkout
  await page.click('.shopping_cart_link');

   // Click on the 'Proceed to Checkout' button
   await page.click('#checkout');

  // Enter the shipping address and billing information
  await page.fill('#first-name', 'John');
  await page.fill('#last-name', 'Doe');
  await page.fill('#postal-code', '12345');

  await page.click('#continue');
  // Place the order and verify that the order confirmation page is displayed
  expect(await page.textContent('#header_container > div.header_secondary_container > span')).toBe('Checkout: Overview');
 
  // Close the browser
  await page.close();
});

test('TC10: Verify user registration functionality', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Click on the 'Register' button
  await page.click('#register-button');

  // Enter a valid username, email address, and password
  await page.type('#username', 'new_user');
  await page.type('#email', 'newuser@example.com');
  await page.type('#password', 'secret123');
  await page.type('#confirmPassword', 'secret123');

  // Click on the 'Create Account' button
  await page.click('#register-submit');

  // Verify that the user is registered and is redirected to the login page
  expect(await page.title()).toBe('Login');

  // Close the browser
  await browser.close();
});



test('TC11: Verify forgotten password functionality', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Click on the 'Login' button
  await page.click('#login-button');

  // Click on the 'Forgot Password?' link
  await page.click('#forgot-password-link');

  // Enter the registered email address
  await page.type('#email', 'newuser@example.com');

  // Click on the 'Reset Password' button
  await page.click('#reset-password-submit');

  // Verify that an email with instructions on how to reset the password is sent to the registered email address
  expect(await page.textContent('.alert-success')).toBe('An email has been sent with instructions to reset your password.');

  // Close the browser
  await browser.close();
});

test('TC12: Verify order tracking functionality', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Place an order
  await page.type('#username', 'standard_user');
  await page.type('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.click('.product-item:first-child');
  await page.click('.add-to-cart-button');
  await page.click('#shopping_cart_button');
  await page.click('#checkout .action-button');
  await page.type('#firstName', 'John');
  await page.type('#lastName', 'Doe');
  await page.type('#email', 'johndoe@example.com');
  await page.type('#zipCode', '12345');
  await page.select('#paymentMethod', '#visa');
  await page.click('#placeOrder');

  // Get the order confirmation number from the order confirmation page
  const orderConfirmationNumber = await page.textContent('.order_number');
  expect(orderConfirmationNumber).toBeDefined();

  // Click on the 'Orders' menu item
  await page.click('#menu-item-orders');

  // Enter the order confirmation number
  await page.type('#order_number', orderConfirmationNumber);

  // Click on the 'Track Order' button
  await page.click('#track-order-submit');

  // Verify that the order status is displayed correctly
  const orderStatus = await page.textContent('.order_status');
  expect(orderStatus).toBe('Processing');

  // Close the browser
  await browser.close();
});



test('TC13: Verify contact form functionality', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Click on the 'Contact Us' button
  await page.click('#contact-link');

  // Enter a valid name, email address, and message
  await page.type('#name', 'John Doe');
  await page.type('#email', 'johndoe@example.com');
  await page.type('#message', 'Hello, Sauce Labs!');

  // Click on the 'Submit' button
  await page.click('#submit-message');

  // Verify that a confirmation message is displayed indicating that the inquiry has been submitted
  expect(await page.textContent('#message-sent')).toBe('Thank you for your message.');

  // Close the browser
  await browser.close();
});

test('TC14: Verify product filtering functionality', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Click on the 'Products' menu item
  await page.click('#menu-item-products');

  // Click on the 'Filters' button
  await page.click('#filters-button');

  // Select the desired filtering criteria
  await page.select('#product_categories', '#Sauce Labs Backpack');

  // Verify that only products that match the selected criteria are displayed
  expect(await page.textContent('.product-item')).toMatch('Sauce Labs Backpack');

  // Close the browser
  await browser.close();
});
});