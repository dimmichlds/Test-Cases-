import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('TC01: Verify that a user can log in with a valid username and the correct password', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    // Add your assertion for a successful login, e.g., checking for a URL change or an element on the dashboard
  });

  test('TC02: Check that the placeholder text "Username" is visible in the username input field when the field is empty', async ({ page }) => {
    await expect(page.locator('#user-name')).toHaveAttribute('placeholder', 'Username');
  });

  test('TC03: Check that the placeholder text "Password" is visible in the password input field when the field is empty', async ({ page }) => {
    await expect(page.locator('#password')).toHaveAttribute('placeholder', 'Password');
  });

  test('TC04: Confirm that typing into the username field works correctly and reflects the inputted text', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await expect(page.locator('#user-name')).toHaveValue('standard_user');
  });

  test('TC05: Confirm that typing into the password field works correctly and reflects the inputted text', async ({ page }) => {
    await page.fill('#password', 'secret_sauce');
    await expect(page.locator('#password')).toHaveValue('secret_sauce');
  });

  test('TC06: Validate that the login button is clickable and submits the form data', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    // Add your assertion for a successful form submission
  });

  test('TC07: Ensure that after successful login, the user is directed to the appropriate logged-in page or dashboard', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    // Add your assertion for a successful login, e.g., checking for a URL change or an element on the dashboard
  });

  test('TC08: Test that the autocorrect and autocapitalize attributes are effectively disabled for both the username and password fields', async ({ page }) => {
    await expect(page.locator('#user-name')).toHaveAttribute('autocorrect', 'off');
    await expect(page.locator('#user-name')).toHaveAttribute('autocapitalize', 'none');
    await expect(page.locator('#password')).toHaveAttribute('autocorrect', 'off');
    await expect(page.locator('#password')).toHaveAttribute('autocapitalize', 'none');
  });

  test('TC09: Attempt to log in with a valid username and an incorrect password to ensure the login fails', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'incorrect_password');
    await page.click('#login-button');
    // Add your assertion for a failed login, e.g., checking for an error message
  });

  test('TC10: Attempt to log in with an invalid username and the correct password to ensure the login fails', async ({ page }) => {
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    // Add your assertion for a failed login, e.g., checking for an error message
  });

  test('TC11: Attempt to log in with both an invalid username and an incorrect password to ensure the login fails', async ({ page }) => {
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'incorrect_password');
    await page.click('#login-button');
    // Add your assertion for a failed login, e.g., checking for an error message
  });

  test('TC12: Try to log in with the username field left blank to confirm that an error message is displayed', async ({ page }) => {
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    // Add your assertion for a failed login, e.g., checking for an error message
  });

  test('TC13: Try to log in with the password field left blank to confirm that an error message is displayed', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');
    // Add your assertion for a failed login, e.g., checking for an error message
  });

  test('TC14: Check for the error message display functionality by entering incorrect login credentials', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    // Add your assertion for the error message
  });

  test('TC15: Verify that the login form does not allow SQL injection or script injection attacks', async ({ page }) => {
    const sqlInjection = "' OR '1'='1";
    const scriptInjection = "<script>alert('xss')</script>";
    await page.fill('#user-name', sqlInjection);
    await page.fill('#password', scriptInjection);
    await page.click('#login-button');
    // Add your assertion for a failed login, e.g., checking for no XSS pop-up or error message
  });

  test('TC16: Test the behavior when the user inputs excessively long strings in the username and password fields', async ({ page }) => {
    const longString = 'a'.repeat(1000);
    await page.fill('#user-name', longString);
    await page.fill('#password', longString);
    await page.click('#login-button');
    // Add your assertion for a failed login or check for any potential buffer overflow issues
  });
});

test.describe('Product interaction tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
  });

  test('TC17: Verify that clicking on the image of a product navigates to detailed view', async ({ page }) => {
    await page.click('#item_4_img_link');
    // Assuming there's a detail view identifier, e.g., .inventory_details
    await expect(page.locator('.inventory_details')).toBeVisible();
  });

  test('TC18: Confirm that clicking on the product name link navigates to the product\'s detailed view', async ({ page }) => {
    await page.click('#item_4_title_link');
    await expect(page.locator('.inventory_details')).toBeVisible();
  });

  test('TC19: Ensure that the product description is visible and matches the product listed', async ({ page }) => {
    const description = await page.locator('#item_4_title_link').textContent();
    await expect(page.locator('.inventory_item_desc')).toContainText(description);
  });

  test('TC20: Check if the "Add to cart" button adds the respective product to the shopping cart', async ({ page }) => {
    await page.click('#add-to-cart-sauce-labs-backpack');
    // Assuming there's a shopping cart badge element that shows the count of items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC21: Validate that the product price is displayed correctly for each item', async ({ page }) => {
    const price = await page.locator('#add-to-cart-sauce-labs-backpack').textContent();
    await expect(price).toMatch(/^\$\d+\.\d{2}$/);
  });

  test('TC22: Test that the alt text for each product image accurately describes the product', async ({ page }) => {
    const altText = await page.locator('#item_4_img_link img').getAttribute('alt');
    await expect(altText).toBe('Sauce Labs Backpack');
  });

  test('TC23: Confirm that the "Add to cart" button for each product has a unique identifier that corresponds to the product', async ({ page }) => {
    const buttonId = await page.locator('#add-to-cart-sauce-labs-backpack').getAttribute('id');
    await expect(buttonId).toBe('add-to-cart-sauce-labs-backpack');
  });


test.describe('Menu Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
  });

  test('TC24: Verify that the menu is visible and accessible on the page.', async ({ page }) => {
    const menu = page.locator('.bm-menu');
    await expect(menu).toBeVisible();
  });

  test('TC25: Check that the "All Items" link is clickable and redirects the user to the appropriate section or page.', async ({ page }) => {
    const allItemsLink = page.locator('#inventory_sidebar_link');
    await allItemsLink.click();
    // Assuming that clicking the link should navigate to the inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('TC26: Ensure that the "About" link navigates to the "https://saucelabs.com/" URL when clicked.', async ({ page }) => {
    const aboutLink = page.locator('#about_sidebar_link');
    await aboutLink.click();
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'),
      aboutLink.click(),
    ]);
    await expect(newPage).toHaveURL('https://saucelabs.com/');
  });

  test('TC27: Confirm that the "Logout" link triggers the logout functionality and signs the user out.', async ({ page }) => {
    const logoutLink = page.locator('#logout_sidebar_link');
    await logoutLink.click();
    // Assuming that clicking the logout link should navigate to the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('TC28: Validate that the "Reset App State" link resets the application to its default state without errors.', async ({ page }) => {
    const resetLink = page.locator('#reset_sidebar_link');
    await resetLink.click();
    // Assuming there is some indicator of the app state being reset, like a toast message or a change in UI
    await expect(page.locator('text=App state has been reset')).toBeVisible();
  });

  test('TC29: Try to navigate to the "About" link with a slow internet connection to check if there\'s a loading indicator or timeout message.', async ({ page }) => {
    await page.route('**/*', (route) => route.continue({ delay: 5000 })); // 5 second delay
    const aboutLink = page.locator('#about_sidebar_link');
    await aboutLink.click();
    // Check for a loading indicator or timeout message
    await expect(page.locator('text=Loading...')).toBeVisible();
  });

  test('TC30: Click the "Logout" link after the session has already expired to see if it handles the scenario gracefully.', async ({ page }) => {
    // Assuming there is a way to expire the session, such as deleting a cookie or local storage item
    await page.evaluate(() => localStorage.removeItem('session'));
    const logoutLink = page.locator('#logout_sidebar_link');
    await logoutLink.click();
    // Check for a message indicating the session has expired or that the user is already logged out
    await expect(page.locator('text=Your session has expired')).toBeVisible();
  });

  test('TC31: Test the menu links with an incorrect or modified href value to see how the application handles broken links.', async ({ page }) => {
    const allItemsLink = page.locator('#inventory_sidebar_link');
    await allItemsLink.evaluate((node) => node.setAttribute('href', '/non-existent'));
    await allItemsLink.click();
    // Check for a 404 page or error message
    await expect(page.locator('text=Page not found')).toBeVisible();
  });
});

const BASE_URL = 'https://www.saucedemo.com/cart.html';

test.describe('Shopping Cart Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC32: Verify that the "Continue Shopping" button takes the user back to the shopping page when clicked', async ({ page }) => {
    await page.click('#continue-shopping');
    // Add your assertion to confirm the user is on the shopping page
  });

  test('TC33: Confirm that the "Checkout" button takes the user to the checkout page when clicked', async ({ page }) => {
    await page.click('#checkout');
    // Add your assertion to confirm the user is on the checkout page
  });

  test('TC34: Check that the cart displays the correct quantity (QTY) and description of items added by the user', async ({ page }) => {
    // Add logic to add an item to the cart
    const cartQuantity = await page.locator('.cart_quantity_label');
    const cartDescription = await page.locator('.cart_desc_label');
    await expect(cartQuantity).toHaveText('QTY');
    await expect(cartDescription).toHaveText('Description');
    // Add more assertions to confirm the correct quantity and description
  });

  test('TC35: Ensure that the cart updates correctly when items are added or removed', async ({ page }) => {
    // Add logic to add an item to the cart
    // Add logic to remove an item from the cart
    // Add assertions to confirm the cart updates correctly
  });

  test('TC36: Validate that the cart\'s quantity and description labels are visible and readable', async ({ page }) => {
    await expect(page.locator('.cart_quantity_label')).toBeVisible();
    await expect(page.locator('.cart_desc_label')).toBeVisible();
  });

  test('TC37: Confirm that the images for the "Continue Shopping" button load correctly and represent a visual cue for going back', async ({ page }) => {
    const image = page.locator('.back-image');
    await expect(image).toBeVisible();
    // Add assertion to confirm it has a visual cue for going back if necessary
  });

  test('TC38: Test that the alt text for the "Go back" image is displayed if the image fails to load', async ({ page }) => {
    const image = page.locator('.back-image');
    await expect(image).toHaveAttribute('alt', 'Go back');
    // Add logic to simulate image load failure if possible and check alt text
  });

  test('TC39: Verify that clicking the "Continue Shopping" button with an empty cart does not cause any errors', async ({ page }) => {
    await page.click('#continue-shopping');
    // Add assertions to confirm no errors are thrown
  });

  test('TC40: Check that the "Checkout" button is disabled or provides an appropriate message when the cart is empty', async ({ page }) => {
    // Add logic to ensure the cart is empty
    const checkoutButton = page.locator('#checkout');
    // Replace this with the appropriate condition for your application
    await expect(checkoutButton).toBeDisabled();
    // Or check for an appropriate message if the button is not disabled
  });

  test('TC41: Attempt to navigate to the checkout page without any items in the cart and ensure an appropriate message is displayed or navigation is prevented', async ({ page }) => {
    await page.click('#checkout');
    // Add assertions to confirm that navigation is prevented or an appropriate message is displayed
  });
});

test.describe('Checkout form tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
  });

  test('TC42: Verify form accepts valid input and allows proceeding', async ({ page }) => {
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    // Add assertion to verify the next page or successful submission
  });

  test('TC43: Ensure autocorrect and autocapitalize are', async ({ page }) => {
    await expect(page.locator('#first-name')).toHaveAttribute('autocorrect', 'off');
    await expect(page.locator('#first-name')).toHaveAttribute('autocapitalize', 'none');
    await expect(page.locator('#last-name')).toHaveAttribute('autocorrect', 'off');
    await expect(page.locator('#last-name')).toHaveAttribute('autocapitalize', 'none');
    await expect(page.locator('#postal-code')).toHaveAttribute('autocorrect', 'off');
    await expect(page.locator('#postal-code')).toHaveAttribute('autocapitalize', 'none');
  });

  test('TC44: Check placeholder texts are visible', async ({ page }) => {
    await expect(page.locator('#first-name')).toHaveAttribute('placeholder', 'First Name');
    await expect(page.locator('#last-name')).toHaveAttribute('placeholder', 'Last Name');
    await expect(page.locator('#postal-code')).toHaveAttribute('placeholder', 'Zip/Postal Code');
  });

  test('TC45: Confirm "Cancel" button redirects or cancels', async ({ page }) => {
    await page.click('#cancel');
    // Add assertion to verify redirection or cancellation
  });

  test('TC46: Validate form retains input after error', async ({ page }) => {
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    // Trigger an error by not filling in the postal code
    await page.click('#continue');
    // Add assertion to verify the page has reloaded and input is retained
  });

  test('TC47: Attempt to submit form with empty fields', async ({ page }) => {
    await page.click('#continue');
    // Add assertion to verify error message and that user cannot proceed
  });

  test('TC48: Input invalid characters name fields', async ({ page }) => {
    await page.fill('#first-name', '123');
    await page.fill('#last-name', '@#$');
    await page.click('#continue');
    // Add assertion to verify error message and that form is not submitted
  });

  test('TC49: Enter invalid zip/postal code format', async ({ page }) => {
    await page.fill('#postal-code', 'ABCDE');
    await page.click('#continue');
    // Add assertion to verify error message for invalid postal code format
  });

  test('TC50: Submit form with excessively long values', async ({ page }) => {
    const longValue = 'A'.repeat(1000);
    await page.fill('#first-name', longValue);
    await page.fill('#last-name', longValue);
    await page.fill('#postal-code', longValue);
    await page.click('#continue');
    // Add assertion to check for buffer overflow vulnerabilities
  });

  test('TC51: Test form for code injection vulnerabilities', async ({ page }) => {
    const maliciousCode = '<script>alert("xss")</script>';
    await page.fill('#first-name', maliciousCode);
    await page.fill('#last-name', maliciousCode);
    await page.fill('#postal-code', maliciousCode);
    await page.click('#continue');
    // Add assertion to ensure code injection is not possible
  });
});

test.describe('Checkout Summary Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/checkout-step-two.html');
  });

  test('TC52: Verify quantity and description labels', async ({ page }) => {
    const qtyLabel = await page.locator('.cart_quantity_label');
    const descLabel = await page.locator('.cart_desc_label');
    await expect(qtyLabel).toHaveText('QTY');
    await expect(descLabel).toHaveText('Description');
  });

  test('TC53: Confirm payment information displays correctly', async ({ page }) => {
    const paymentInfo = await page.locator('.summary_value_label');
    await expect(paymentInfo).toContainText('SauceCard #31337');
  });

  test('TC54: Ensure shipping information is visible', async ({ page }) => {
    const shippingInfo = await page.locator('.summary_value_label', { hasText: 'Free Pony Express Delivery!' });
    await expect(shippingInfo).toBeVisible();
  });

  test('TC55: Check price total section displays $0.00 initially', async ({ page }) => {
    const itemTotal = await page.locator('.summary_subtotal_label');
    const tax = await page.locator('.summary_tax_label');
    const total = await page.locator('.summary_total_label');
    await expect(itemTotal).toHaveText('Item total: $0');
    await expect(tax).toHaveText('Tax: $0.00');
    await expect(total).toHaveText('Total: $0.00');
  });

  test('TC56: Test "Cancel" button functionality', async ({ page }) => {
    const cancelButton = await page.locator('#cancel');
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
    // Assuming we have a way to check the previous page or action
    // e.g., expect(page).toHaveURL('https://www.saucedemo.com/previous-page');
  });

  test('TC57: Verify "Finish" button functionality', async ({ page }) => {
    const finishButton = await page.locator('#finish');
    await expect(finishButton).toBeVisible();
    await finishButton.click();
    // Assuming we have a confirmation page or message to check against
    // e.g., expect(page).toHaveURL('https://www.saucedemo.com/confirmation');
  });

  test('TC58: Ensure summary information labels are visible', async ({ page }) => {
    const paymentLabel = await page.locator('.summary_info_label', { hasText: 'Payment Information' });
    const shippingLabel = await page.locator('.summary_info_label', { hasText: 'Shipping Information' });
    const priceTotalLabel = await page.locator('.summary_info_label', { hasText: 'Price Total' });
    await expect(paymentLabel).toBeVisible();
    await expect(shippingLabel).toBeVisible();
    await expect(priceTotalLabel).toBeVisible();
  });

  test('TC59: Attempt to proceed with checkout with an empty cart', async ({ page }) => {
    const finishButton = await page.locator('#finish');
    await finishButton.click();
    // Assuming there is a way to check for empty cart scenario
    // e.g., expect(page).toHaveText('Your cart is empty');
  });

  test('TC60: Interact with checkout during network interruption', async ({ page }) => {
    await page.route('**', route => route.abort());
    const finishButton = await page.locator('#finish');
    await finishButton.click();
    // Assuming there is an error message to check against
    // e.g., expect(page).toHaveText('Network error occurred');
  });
});

test.describe('Checkout Complete Page Tests', () => {
  const baseUrl = 'https://www.saucedemo.com/checkout-complete.html';

  test.beforeEach(async ({ page }) => {
    // Navigate to the checkout complete page before each test
    await page.goto(baseUrl);
  });

  test('TC61: Verify that the "Thank you for your order!" message is displayed after a successful checkout process', async ({ page }) => {
    const thankYouMessage = page.locator('.complete-header');
    await expect(thankYouMessage).toBeVisible();
    await expect(thankYouMessage).toHaveText('Thank you for your order!');
  });

  test('TC62: Check if the image of the Pony Express is displayed correctly and matches the expected design', async ({ page }) => {
    const ponyExpressImage = page.locator('.pony_express');
    await expect(ponyExpressImage).toBeVisible();
    // To check if the image matches the expected design, a visual comparison or snapshot test should be performed here
  });

  test('TC63: Ensure the text "Your order has been dispatched, and will arrive just as fast as the pony can get there!" is visible and correctly formatted', async ({ page }) => {
    const dispatchMessage = page.locator('.complete-text');
    await expect(dispatchMessage).toBeVisible();
    await expect(dispatchMessage).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  });

  test('TC64: Confirm that the "Back Home" button is visible and clickable', async ({ page }) => {
    const backHomeButton = page.locator('#back-to-products');
    await expect(backHomeButton).toBeVisible();
    await expect(backHomeButton).toBeEnabled();
  });

  test('TC65: Validate that clicking the "Back Home" button redirects the user to the homepage or product list', async ({ page }) => {
    const backHomeButton = page.locator('#back-to-products');
    await backHomeButton.click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});
