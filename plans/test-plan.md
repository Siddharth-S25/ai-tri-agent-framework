# Test Plan: User Login and Shopping Cart Management
Site: https://www.saucedemo.com
Generated: 2026-08-06

## Overview
This test plan verifies the core e-commerce functionality of
SauceDemo application — logging in with valid and invalid
credentials, adding products to cart, verifying cart contents,
and removing items from cart. It ensures user session is
maintained and cart accurately reflects all actions.

## Test Cases

### TC001 — Successful Login with Valid Credentials
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on the SauceDemo login page
- **Steps**:
  1. Navigate to https://www.saucedemo.com/
  2. Enter valid username: standard_user
  3. Enter valid password: secret_sauce
  4. Click the Login button
- **Selector**: #login-button
- **Expected Result**: User is successfully logged in and
  redirected to the products inventory page
- **Assertion**: URL should be
  https://www.saucedemo.com/inventory.html
  and .inventory_list should be visible

### TC002 — Failed Login with Invalid Credentials
- **Type**: Negative
- **Priority**: High
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on the SauceDemo login page
- **Steps**:
  1. Navigate to https://www.saucedemo.com/
  2. Enter invalid username: wrong_user
  3. Enter invalid password: wrong_pass
  4. Click the Login button
- **Selector**: #login-button
- **Expected Result**: Login fails and error message is displayed
- **Assertion**: Text "Username and password do not match"
  should be visible in [data-test="error"]

### TC003 — Add First Product to Cart
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/inventory.html
- **Precondition**: User is logged in and on inventory page
- **Steps**:
  1. Login with standard_user / secret_sauce
  2. Navigate to inventory page
  3. Click Add to Cart button on first product
- **Selector**: .inventory_item button
- **Expected Result**: Product is added to cart and
  cart badge updates to show count
- **Assertion**: .shopping_cart_badge should be visible
  and contain text "1"

### TC004 — Verify Product Appears in Cart
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/cart.html
- **Precondition**: User is logged in and has added one product
- **Steps**:
  1. Login with standard_user / secret_sauce
  2. Add first product to cart
  3. Click cart icon in navigation
- **Selector**: .shopping_cart_link
- **Expected Result**: User is navigated to cart page
  and added product is listed
- **Assertion**: URL should be
  https://www.saucedemo.com/cart.html
  and .cart_item count should be 1

### TC005 — Remove Product from Cart
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/cart.html
- **Precondition**: User is logged in and has one item in cart
- **Steps**:
  1. Login with standard_user / secret_sauce
  2. Add first product to cart
  3. Navigate to cart page
  4. Click Remove button on the product
- **Selector**: .cart_item button
- **Expected Result**: Product is removed from cart
  and cart becomes empty
- **Assertion**: .cart_item count should be 0

### TC006 — Locked Out User Cannot Log in
- **Type**: Negative
- **Priority**: Medium
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on login page
- **Steps**:
  1. Navigate to https://www.saucedemo.com/
  2. Enter username: locked_out_user
  3. Enter password: secret_sauce
  4. Click Login button
- **Selector**: #login-button
- **Expected Result**: Login is blocked with error message
- **Assertion**: Text "Sorry, this user has been locked out"
  should be visible

### TC007 — Add Multiple Products to Cart
- **Type**: Positive
- **Priority**: Medium
- **Page**: https://www.saucedemo.com/inventory.html
- **Precondition**: User is logged in on inventory page
- **Steps**:
  1. Login with standard_user / secret_sauce
  2. Add first product to cart
  3. Add second product to cart
- **Selector**: .inventory_item button
- **Expected Result**: Both products added to cart
- **Assertion**: .shopping_cart_badge should contain "2"

### TC008 — Sort Products by Price Low to High
- **Type**: Positive
- **Priority**: Low
- **Page**: https://www.saucedemo.com/inventory.html
- **Precondition**: User is logged in on inventory page
- **Steps**:
  1. Login with standard_user / secret_sauce
  2. Click sort dropdown
  3. Select "Price (low to high)"
- **Selector**: [data-test="product-sort-container"]
- **Expected Result**: Products are sorted by price ascending
- **Assertion**: First product price should be lowest

## Summary
- Total Tests: 8
- High Priority: 5
- Medium Priority: 2
- Low Priority: 1