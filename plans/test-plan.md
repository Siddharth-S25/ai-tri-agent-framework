# Test Plan: Login and Shopping Cart Management
Site: https://www.saucedemo.com
Generated: 2026-08-10

## Overview
This test plan verifies the login functionality and shopping cart operations on SauceDemo. It covers positive, negative, and edge case scenarios using the specified URLs and selectors.

## Test Cases

### TC001 — Successful Login and Add Item to Cart
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on the login page.
- **Steps**:
  1. Enter username `standard_user` in the field with selector `#user-name`.
  2. Enter password `secret_sauce` in the field with selector `#password`.
  3. Click the login button with selector `#login-button`.
  4. Click the first "Add to cart" button within an element matching selector `.inventory_item button`.
- **Selector**: `.inventory_item button`
- **Expected Result**: User is redirected to the inventory page and the cart badge shows `1`.
- **Assertion**: URL equals `https://www.saucedemo.com/inventory.html` and `.shopping_cart_badge` text equals `1`.

### TC002 — Remove Item from Cart
- **Type**: Positive
- **Priority**: Medium
- **Page**: https://www.saucedemo.com/cart.html
- **Precondition**: User has at least one item in the cart.
- **Steps**:
  1. Click the cart link with selector `.shopping_cart_link`.
  2. Click the "Remove" button on the cart item with selector `.cart_item button`.
- **Selector**: `.cart_item button`
- **Expected Result**: Cart becomes empty and the cart badge disappears.
- **Assertion**: `.shopping_cart_badge` is not present.

### TC003 — Login with Locked User
- **Type**: Negative
- **Priority**: High
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on the login page.
- **Steps**:
  1. Enter username `locked_out_user` in the field with selector `#user-name`.
  2. Enter password `secret_sauce` in the field with selector `#password`.
  3. Click the login button with selector `#login-button`.
- **Selector**: `[data-test="error"]`
- **Expected Result**: An error message appears indicating the user is locked out.
- **Assertion**: Text of `[data-test="error"]` equals `Epic sadface: Sorry, this user has been locked out.`

### TC004 — Login with Incorrect Credentials
- **Type**: Negative
- **Priority**: High
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on the login page.
- **Steps**:
  1. Enter username `wrong_user` in the field with selector `#user-name`.
  2. Enter password `wrong_pass` in the field with selector `#password`.
  3. Click the login button with selector `#login-button`.
- **Selector**: `[data-test="error"]`
- **Expected Result**: An error message appears indicating invalid credentials.
- **Assertion**: Text of `[data-test="error"]` equals `Epic sadface: Username and password do not match any user in this service`.

### TC005 — Add Same Item Twice and Verify Cart Badge Count
- **Type**: Edge Case
- **Priority**: Medium
- **Page**: https://www.saucedemo.com/inventory.html
- **Precondition**: User is logged in and on the inventory page.
- **Steps**:
  1. Click the "Add to cart" button for a specific item twice using selector `.inventory_item button`.
  2. Verify the cart badge with selector `.shopping_cart_badge` shows `2`.
- **Selector**: `.shopping_cart_badge`
- **Expected Result**: Cart badge displays the correct count of items added.
- **Assertion**: Text of `.shopping_cart_badge` equals `2`.

## Summary
- Total Tests: 5
- High Priority: 3
- Medium Priority: 2
- Low Priority: 0