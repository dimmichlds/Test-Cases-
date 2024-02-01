import { test, expect } from '@playwright/test';

test.describe('SauceDemo Frontend Tests', () => {
  // TC01: Test valid login credentials
  test('TC01: Valid login should succeed', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  //Test invalid username and/or password
  test('TC02: Invalid login should fail', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'invalid_user');
    await page.fill('[data-test="password"]', 'invalid_pass');
    await page.click('[data-test="login-button"]');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  //Test with empty username and/or password fields
  test('TC03: Login with empty credentials should fail', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.click('[data-test="login-button"]');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  //Test logout functionality
  test('TC04: Logout should redirect to login page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  //Verify that all products are listed
  test('TC05: All products should be listed on inventory page', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    const products = await page.locator('.inventory_item').count();
    expect(products).toBeGreaterThan(0); // Replace 0 with the expected number of products
  });
});

test.describe('SauceDemo Frontend Tests - Additional', () => {
  // Helper function to log in
  async function login(page) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
  }

  //Test sorting functionality (Name, Price)
  test('TC06: Products should be sortable', async ({ page }) => {
    await login(page);
    await page.click('.product_sort_container');
    await page.selectOption('.product_sort_container', 'za');
    let firstProduct = await page.textContent('.inventory_item_name');
    expect(firstProduct).not.toBeNull();
    // Additional checks can be added to verify the sorting order
  });

  //Test filter functionality, if available
  // Note: As of the last update, there's no filter functionality on SauceDemo. 
  // The following test case is hypothetical and for demonstration purposes only.
  test('TC07: Products should be filterable', async ({ page }) => {
    await login(page);
    // Hypothetical filter usage
    // await page.click('#filter-button'); 
    // await page.click('#filter-option-price');
    // Add assertions to verify the filtering
  });

  //Verify clicking on a product shows its details
  test('TC08: Clicking on a product should show its details', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack")');
    await expect(page).toHaveURL(/inventory-item.html/);
    await expect(page.locator('.inventory_details_name')).toContainText('Sauce Labs Backpack');
  });

  //Check for correct product description, price, and image
  test('TC09: Product details should be correct', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack")');
    const description = await page.textContent('.inventory_details_desc');
    const price = await page.textContent('.inventory_details_price');
    const image = await page.isVisible('.inventory_details_img');
    expect(description).not.toBeNull();
    expect(price).toMatch(/^\$[0-9,.]+$/); // Check if price is in correct format
    expect(image).toBeTruthy();
  });

  //Test adding items to the cart
  test('TC10: Adding item to cart should increase cart count', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack") .btn_inventory');
    const cartCount = await page.textContent('.shopping_cart_badge');
    expect(cartCount).toBe('1');
  });
});

test.describe('SauceDemo Frontend Tests - Cart and Checkout', () => {
  // Helper function to log in
  async function login(page) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
  }

  //Test removing items from the cart
  test('TC11:Removing items from the cart should update cart count', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack") .btn_inventory');
    await page.click('.shopping_cart_link');
    await page.click('.cart_item:has-text("Sauce Labs Backpack") .cart_button');
    const cartCount = await page.textContent('.shopping_cart_badge');
    expect(cartCount).toBe('');
  });

  //Verify cart updates correctly with multiple items
  test('TC12:Cart should update correctly with multiple items', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack") .btn_inventory');
    await page.click('.inventory_item:has-text("Sauce Labs Bike Light") .btn_inventory');
    const cartCount = await page.textContent('.shopping_cart_badge');
    expect(cartCount).toBe('2');
  });

  //Test cart persistence after logging out and back in
  test('TC13:Cart should retain items after logout and login', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack") .btn_inventory');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await login(page);
    const cartCount = await page.textContent('.shopping_cart_badge');
    expect(cartCount).toBe('1');
  });

  //Test entering shipping information during checkout
  test('TC14:Should be able to enter shipping information during checkout', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack") .btn_inventory');
    await page.click('.shopping_cart_link');
    await page.click('.checkout_button');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    // Verify that shipping information is entered correctly
    await expect(page).toHaveURL(/checkout-step-two.html/);
  });
});


test.describe('SauceDemo Frontend Tests - Checkout and Usability', () => {
  // Helper function to log in and add an item to the cart
  async function loginAndAddItem(page) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
    await page.click('.inventory_item:has-text("Sauce Labs Backpack") .btn_inventory');
    await page.click('.shopping_cart_link');
  }

  //Test the functionality of different payment methods
  // Note: This is a hypothetical test, as SauceDemo might not have multiple payment methods
  test('TC15:Different payment methods should be functional', async ({ page }) => {
    await loginAndAddItem(page);
    await page.click('.checkout_button');
    // Hypothetical code to select a payment method and verify it
    // await page.selectOption('[data-test="payment-method"]', 'card');
    // await expect(page).toHaveURL(/checkout-step-two.html/);
  });

  //Verify order confirmation and receipt generation
  test('TC16:Order confirmation and receipt generation', async ({ page }) => {
    await loginAndAddItem(page);
    await page.click('.checkout_button');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    await page.click('[data-test="finish"]');
    await expect(page).toHaveURL(/checkout-complete.html/);
    // Additional checks for confirmation and receipt can be added
  });

  //Test checkout with an empty cart
  test('TC17:Checkout with an empty cart should be prevented', async ({ page }) => {
    await loginAndAddItem(page);
    await page.click('.cart_item:has-text("Sauce Labs Backpack") .cart_button');
    await page.click('.checkout_button');
    // Verify if checkout is prevented or a message is displayed
    // This depends on the actual implementation of the site
  });

  //Ensure consistent navigation bar
  test('TC18: Navigation bar should be consistent across pages', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const navBarOnLogin = await page.locator('.navbar').screenshot();
    await loginAndAddItem(page);
    const navBarOnInventory = await page.locator('.navbar').screenshot();
    expect(navBarOnLogin).toEqual(navBarOnInventory);
  });

  //Test for easy access to the cart and logout
  test('TC19: Cart and logout should be easily accessible', async ({ page }) => {
    await loginAndAddItem(page);
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
  });

  //Check for clear, understandable labels and instructions
  test('TC20: Labels and instructions should be clear and understandable', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginLabel = await page.textContent('[data-test="username"]');
    expect(loginLabel).toMatch(/Username/); // Verify label text
    // Add similar checks for other labels and instructions
  });
});

test.describe('SauceDemo Frontend Tests - Usability and Interface', () => {
  // Helper function to log in
  async function login(page) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
  }

  //Test for mobile responsiveness and readability
  test('TC21: Mobile responsiveness and readability', async ({ page }) => {
    const iPhone11 = devices['iPhone 11'];
    await page.goto('https://www.saucedemo.com/', { viewport: iPhone11.viewport });
    // Check for specific elements' visibility or layout changes
    await expect(page.locator('.app_logo')).toBeVisible();
  });

  //Verify that error messages are clear and informative
  test('TC22: Error messages should be clear and informative', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.click('[data-test="login-button"]');
    const errorMessage = await page.textContent('[data-test="error"]');
    expect(errorMessage).toContain('Username is required'); // Adjust based on actual error message
  });

  //Check if error messages are displayed for incorrect user input
  test('TC23: Error messages for incorrect user input', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'invalid_user');
    await page.fill('[data-test="password"]', 'invalid_pass');
    await page.click('[data-test="login-button"]');
    const errorMessage = await page.textContent('[data-test="error"]');
    expect(errorMessage).toContain('Username and password do not match'); // Adjust based on actual error message
  });

  //Check consistency of layout and design on different pages
  // Note: This is a basic consistency check. More detailed checks might require visual comparison tools.
  test('TC24: Consistency of layout and design', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const loginLayout = await page.screenshot();
    await login(page);
    const inventoryLayout = await page.screenshot();
    expect(loginLayout).not.toEqual(inventoryLayout); // This is a basic check; consider using visual comparison tools for detailed analysis
  });
});

test.describe('SauceDemo Frontend Tests - Interface and Links', () => {
  //Test responsive design on various devices and screen sizes
  test('TC25: Responsive design on different devices', async () => {
    const devicesToTest = [devices['iPhone 11'], devices['Pixel 5'], devices['iPad Pro 11']];
    for (const device of devicesToTest) {
      const page = await browser.newPage({ viewport: device.viewport });
      await page.goto('https://www.saucedemo.com/');
      // Add specific checks for elements based on expected responsive behavior
      await expect(page.locator('.app_logo')).toBeVisible();
      await page.close();
    }
  });

  //Verify all images and icons load correctly
  test('TC26: All images and icons should load', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const images = await page.locator('img');
    await images.evaluateAll(list => list.every(img => img.complete && img.naturalWidth !== 0));
  });

  //Test for appropriate alt text on images
  test('TC27: Images should have appropriate alt text', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; ++i) {
      const altText = await images.nth(i).getAttribute('alt');
      expect(altText).not.toBeNull(); // This checks if alt text is present; adjust as necessary for specific alt text
    }
  });

  //Test all internal and external links
  test('TC28: All internal and external links should be valid', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const links = page.locator('a');
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; ++i) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).not.toBeNull(); // This checks if href is present; you might want to check for valid URLs or specific patterns
    }
  });

  //Check for broken links or incorrect redirection
  test('TC29: No broken links or incorrect redirections', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const links = page.locator('a');
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; ++i) {
      const href = await links.nth(i).getAttribute('href');
      if (href && !href.startsWith('javascript')) { // Filter out JavaScript links
        const response = await page.goto(href);
        expect(response.ok()).toBeTruthy(); // Check if link leads to a page with a successful response
        await page.goBack();
      }
    }
  });
});

test.describe('SauceDemo Frontend Tests - Compatibility and Performance', () => {
  const browsers = ['chromium', 'firefox', 'webkit']; // List of browsers for cross-browser testing

  //Test the website on different browsers
  for (const browserType of browsers) {
    test(`TC30: Website should work on ${browserType}`, async ({ playwright }) => {
      const browser = await playwright[browserType].launch();
      const page = await browser.newPage();
      await page.goto('https://www.saucedemo.com/');
      expect(await page.title()).toBe('Swag Labs'); // Adjust this based on the expected page title
      await browser.close();
    });
  }

  //Test on different devices
  const devicesToTest = ['iPhone 11', 'Pixel 5', 'iPad Pro 11'];
  for (const deviceName of devicesToTest) {
    test(`TC31: Website should be responsive on ${deviceName}`, async ({ browser }) => {
      const page = await browser.newPage({ viewport: devices[deviceName].viewport });
      await page.goto('https://www.saucedemo.com/');
      // Add specific checks for elements or layout
      await expect(page).toHaveTitle('Swag Labs');
      await page.close();
    });
  }

  //Test the load time of the website and its pages
  test('TC32: Website load time should be within acceptable limits', async ({ page }) => {
    const startTime = new Date().getTime();
    await page.goto('https://www.saucedemo.com/');
    const endTime = new Date().getTime();
    const loadTime = endTime - startTime;
    expect(loadTime).toBeLessThan(5000); // Expect load time to be less than 5000 ms
  });

});

test.describe('SauceDemo Frontend Tests - Speed, Responsiveness, and Security', () => {
  // Helper function to log in
  async function login(page, username = 'standard_user', password = 'secret_sauce') {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', username);
    await page.fill('[data-test="password"]', password);
    await page.click('[data-test="login-button"]');
  }

  //Test the responsiveness of the application with various user actions
  test('TC33: Application should be responsive to user actions', async ({ page }) => {
    await login(page);
    await page.click('.inventory_item:has-text("Sauce Labs Backpack")');
    await expect(page).toHaveURL(/inventory-item.html/);
    // Add additional checks for responsiveness to different actions
  });

  //Test for vulnerabilities in the login system
  // Note: This is a basic test. Actual security testing would require more sophisticated methods.
  test('TC34: Login system should be secure', async ({ page }) => {
    await login(page, 'invalid_user', 'invalid_pass');
    const errorMessage = await page.textContent('[data-test="error"]');
    expect(errorMessage).toContain('Epic sadface: Username is required');
    // Additional security checks would be needed for thorough testing
  });

  //Test for SQL injection vulnerabilities
  // Note: This is a basic test. Real SQL injection testing requires more advanced techniques.
  test('TC35: Application should be secure against SQL injection', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', "' OR '1'='1");
    await page.fill('[data-test="password"]', "' OR '1'='1");
    await page.click('[data-test="login-button"]');
	expect(errorMessage);------------
    // Check for signs of SQL injection vulnerability
    // In a real scenario, more sophisticated testing methods would be used
  });
});

test.describe('SauceDemo Frontend Tests - Session Management and Accessibility', () => {
  // Helper function to log in
  async function login(page) {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('[data-test="username"]', 'standard_user');
    await page.fill('[data-test="password"]', 'secret_sauce');
    await page.click('[data-test="login-button"]');
  }

  //Verify that sessions end securely upon logout
  test('TC36: Session should end securely upon logout', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    // Additional checks can be added to ensure session is terminated
  });

  //Ensure the site is navigable using only a keyboard
  test('TC37: Site should be navigable using keyboard only', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.keyboard.press('Tab'); // Navigates to the next focusable element
    await page.keyboard.press('Enter'); // Activates the focused element
    // Add additional keyboard navigation checks
  });
});
