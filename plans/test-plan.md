# Test Plan: User Login and Shopping Cart Management
Site: https://www.saucedemo.com
Generated: 2023-10-27

## Overview
This test plan validates the authentication flow and the core shopping cart functionality. It covers successful login, error handling for locked accounts, and the end-to-end process of adding items to the cart.

## Test Cases

### TC001 — Successful Login
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on the login page.
- **Steps**:
  1. Enter username `standard_user` into `#user-name`.
  2. Enter password `secret_sauce` into `#password`.
  3. Click `#login-button`.
- **Selector**: #login-button
- **Expected Result**: User is redirected to the inventory page.
- **Assertion**: https://www.saucedemo.com/inventory.html

### TC002 — Locked Out User Login Attempt
- **Type**: Negative
- **Priority**: Medium
- **Page**: https://www.saucedemo.com/
- **Precondition**: User is on the login page.
- **Steps**:
  1. Enter username `locked_out_user` into `#user-name`.
  2. Enter password `secret_sauce` into `#password`.
  3. Click `#login-button`.
- **Selector**: [data-test="error"]
- **Expected Result**: Error message is displayed to the user.
- **Assertion**: [data-test="error"]

### TC003 — Add Product to Cart
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/inventory.html
- **Precondition**: User is logged in.
- **Steps**:
  1. Click the Add to Cart button for an `.inventory_item`.
  2. Observe the cart badge.
- **Selector**:.shopping_cart_badge
- **Expected Result**: Cart badge increments to show the number of items.
- **Assertion**:.shopping_cart_badge

### TC004 — Verify Cart Contents
- **Type**: Positive
- **Priority**: High
- **Page**: https://www.saucedemo.com/cart.html
- **Precondition**: User has added items to the cart.
- **Steps**:
  1. Click on `.shopping_cart_link`.
  2. Verify items are listed.
- **Selector**:.cart_item
- **Expected Result**: The cart page displays the selected items.
- **Assertion**:.cart_item

### TC005 — Product Sorting Functionality
- **Type**: Edge Case
- **Priority**: Low
- **Page**: https://www.saucedemo.com/inventory.html
- **Precondition**: User is logged in and on the products page.
- **Steps**:
  1. Interact with the sort container `[data-test="product-sort-container"]`.
  2. Select a sorting option.
- **Selector**: [data-test="product-sort-container"]
- **Expected Result**: Product list reorders based on selected criteria.
- **Assertion**:.inventory_item

## Summary
- Total Tests: 5
- High Priority: 3
- Medium Priority: 1
- Low Priority: 1