# Test Plan: User Login and Add Product to Cart
Site: https://automationexercise.com
Generated: May 20, 2024

## Overview
This test plan verifies the core authentication and product purchase flow for registered users on AutomationExercise.com. It covers user login validation, searching for products, adding items to the shopping cart, and checking shopping cart counter updates.

## Test Cases

### TC001 — Successful Login and Add Product to Cart
- **Type**: Positive
- **Priority**: High
- **Page**: https://automationexercise.com/login
- **Precondition**: User exists with valid credentials (`testuser@mailinator.com` / `Test@1234`).
- **Steps**:
  1. Navigate to https://automationexercise.com/login.
  2. Enter `testuser@mailinator.com` into `input[data-qa="login-email"]`.
  3. Enter `Test@1234` into `input[data-qa="login-password"]`.
  4. Click `button[data-qa="login-button"]`.
  5. Navigate to https://automationexercise.com/products.
  6. Click `button.add-to-cart`.
  7. Click `a[href="/view_cart"]`.
- **Selector**: `button.add-to-cart`
- **Expected Result**: User successfully logs in, adds the item to the cart, and navigates to the cart view.
- **Assertion**: URL equals https://automationexercise.com/view_cart

### TC002 — Login Attempt with Invalid Credentials
- **Type**: Negative
- **Priority**: High
- **Page**: https://automationexercise.com/login
- **Precondition**: User is on the login page.
- **Steps**:
  1. Navigate to https://automationexercise.com/login.
  2. Enter `invaliduser@mailinator.com` into `input[data-qa="login-email"]`.
  3. Enter `WrongPass123` into `input[data-qa="login-password"]`.
  4. Click `button[data-qa="login-button"]`.
- **Selector**: `button[data-qa="login-button"]`
- **Expected Result**: User authentication fails, and user remains on the login page.
- **Assertion**: URL equals https://automationexercise.com/login

### TC003 — Search Product and Add to Cart After Login
- **Type**: Positive
- **Priority**: Medium
- **Page**: https://automationexercise.com/products
- **Precondition**: User is logged in and navigated to the products page.
- **Steps**:
  1. Navigate to https://automationexercise.com/products.
  2. Enter product search term in `input#search_input`.
  3. Click `button#submit_search`.
  4. Click `button.add-to-cart` on the resulting product.
- **Selector**: `button#submit_search`
- **Expected Result**: Search results are displayed and the requested item is added to the cart.
- **Assertion**: Element `button.add-to-cart` is visible and interactable.

### TC004 — Verify Cart Badge Count Update
- **Type**: Edge Case
- **Priority**: Medium
- **Page**: https://automationexercise.com/products
- **Precondition**: User is logged in and cart is currently empty.
- **Steps**:
  1. Navigate to https://automationexercise.com/products.
  2. Click `button.add-to-cart`.
  3. Observe the cart badge indicator element `li#cart_li a span`.
- **Selector**: `li#cart_li a span`
- **Expected Result**: Cart count indicator updates dynamically to display the updated total item count.
- **Assertion**: Element `li#cart_li a span` is visible.

### TC005 — Attempt Login with Empty Inputs
- **Type**: Negative
- **Priority**: Low
- **Page**: https://automationexercise.com/login
- **Precondition**: User is on the login page with clear input fields.
- **Steps**:
  1. Navigate to https://automationexercise.com/login.
  2. Leave `input[data-qa="login-email"]` empty.
  3. Leave `input[data-qa="login-password"]` empty.
  4. Click `button[data-qa="login-button"]`.
- **Selector**: `button[data-qa="login-button"]`
- **Expected Result