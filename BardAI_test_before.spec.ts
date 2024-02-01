import { Browser } from 'playwright';

test('TC01: Login with a valid user', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Enter the username and password
  await page.type('#username', 'standard_user');
  await page.type('#password', 'secret_sauce');

  // Click the login button
  await page.click('#login-button');

  // Verify that the user is logged in and is redirected to the products page
  expect(await page.title()).toBe('Products');

  // Close the browser
  await browser.close();
});

test('TC02: Add an item to the shopping cart', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Login to the website with a valid user
  await page.type('#username', 'standard_user');
  await page.type('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the first product
  await page.click('.product-list .product-item:first-child');

  // Click the "Add to Cart" button
  await page.click('.add-to-cart-button');

  // Verify that the product is added to the shopping cart
  expect(await page.textContent('#shopping_cart_container')).toBe('1 item');

  // Close the browser
  await browser.close();
});



test('TC03: Checkout and complete an order', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Login to the website with a valid user
  await page.type('#username', 'standard_user');
  await page.type('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add at least two items to the shopping cart
  await page.click('.product-list .product-item:first-child');
  await page.click('.add-to-cart-button');

  // Click on the Cart icon
  await page.click('#shopping_cart_button');

  // Click on the 'Proceed to Checkout' button
  await page.click('#checkout .action-button');

  // Enter the shipping address and billing information
  await page.type('#firstName', 'John');
  await page.type('#lastName', 'Doe');
  await page.type('#email', 'johndoe@example.com');
  await page.type('#zipCode', '12345');

  // Select the payment method
  await page.select('#paymentMethod', '#visa');

  // Click on the 'Place Order' button
  await page.click('#placeOrder');

  // Verify that the order is placed successfully
  expect(await page.textContent('#order_confirmation .subheading')).toBe('Thank you for your order!');

  // Close the browser
  await browser.close();
});

test('TC04: Logout from a logged-in account', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Login to the website with a valid user
  await page.type('#username', 'standard_user');
  await page.type('#password', 'secret_sauce');
  await page.click('#login-button');

  // Click on the user avatar icon in the top right corner
  await page.click('.user-profile-link');

  // Click on the 'Logout' button
  await page.click('.user-profile-dropdown .logout a');

  // Verify that the user is logged out and is redirected to the login page
  expect(await page.title()).toBe('Login');

  // Close the browser
  await browser.close();
});

import { Browser } from 'playwright';

test('TC05: Verify product prices', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Click on the 'Products' menu item
  await page.click('#menu-item-products');

  // Hover over any product to view its price
  await page.hover('.product-item');

  // Get the price displayed on the product page
  const productPriceOnPage = await page.textContent('.product-price');

  // Get the price displayed on the hover card
  const productPriceOnHoverCard = await page.textContent('.product-information .price');

  // Verify that the price displayed on the product page matches the price displayed on the hover card
  expect(productPriceOnPage).toBe(productPriceOnHoverCard);

  // Close the browser
  await browser.close();
});

test('TC06: Validate product descriptions', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Click on the 'Products' menu item
  await page.click('#menu-item-products');

  // Click on any product
  await page.click('.product-item:first-child');

  // Read the product description carefully
  const productDescription = await page.textContent('.product-description');

  // Verify that the product description provides accurate information about the product
  // Check for features, specifications, and benefits
  // Check that the description is clear, concise, and easy to understand

  // Close the browser
  await browser.close();
});



test('TC07: Check product quantity limitations', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

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
  await browser.close();
});

test('TC08: Verify shopping cart functionality', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Add products to the shopping cart
  await page.click('.product-item:first-child');
  await page.click('.add-to-cart-button');

  // Verify that the total cart value is updated correctly
  const initialCartValue = await page.textContent('.shopping_cart_container .subtotal');

  // Remove items from the shopping cart and verify that the total cart value is updated accordingly
  await page.click('.shopping_cart_container .cart_item:first-child .remove_item.btn_secondary');

  const updatedCartValue = await page.textContent('.shopping_cart_container .subtotal');

  expect(Number(updatedCartValue) < Number(initialCartValue)).toBeTruthy();

  // Empty the shopping cart and verify that the total cart value is zero
  await page.click('#empty-cart');

  const emptyCartValue = await page.textContent('.shopping_cart_container .subtotal');

  expect(emptyCartValue).toBe('0.00');

  // Close the browser
  await browser.close();
});



test('TC09: Validate checkout process', async () => {
  const browser = await Browser.launch();
  const page = await browser.newPage();

  // Go to the Saucedemo website
  await page.goto('https://www.saucedemo.com/');

  // Login to the website with a valid user
  await page.type('#username', 'standard_user');
  await page.type('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add products to the shopping cart
  await page.click('.product-item:first-child');
  await page.click('.add-to-cart-button');

  // Proceed to checkout
  await page.click('#shopping_cart_button');

  // Enter the shipping address and billing information
  await page.type('#firstName', 'John');
  await page.type('#lastName', 'Doe');
  await page.type('#email', 'johndoe@example.com');
  await page.type('#zipCode', '12345');

  // Select the payment method
  await page.select('#paymentMethod', '#visa');

  // Place the order and verify that the order confirmation page is displayed
  await page.click('#placeOrder');
  expect(await page.title()).toBe('Checkout - Order Confirmation');

  // Close the browser
  await browser.close();
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
