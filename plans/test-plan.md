# Test Plan: User Login and Add Product to Cart
Site: https://automationexercise.com
Generated: 2023-10-25

## Overview
This test plan verifies the core e-commerce functionality of logging into the application using valid and invalid credentials, searching for products, and successfully adding items to the shopping cart. It ensures that the user session is maintained and the cart accurately reflects added items.

## Test Cases

### TC001 — Successful User Login with Valid Credentials
- **Type**: Positive
- **Priority**: High
- **Page**: https://automationexercise.com/login
- **Precondition**: User is registered and on the login page
- **Steps**:
  1. Navigate to https://automationexercise.com/login
  2. Enter valid email in the login email field
  3. Enter valid password in the login password field
  4. Click the login button
- **Selector**: button[data-qa="login-button"]
- **Expected Result**: User is successfully logged in and redirected to the home page or account page
- **Assertion**: URL should be https://automationexercise.com/

### TC002 — Failed Login with Invalid Password
- **Type**: Negative
- **Priority**: High
- **Page**: https://automationexercise.com/login
- **Precondition**: User is on the login page
- **Steps**:
  1. Navigate to https://automationexercise.com/login
  2. Enter valid email (testuser@mailinator.com) in the login email field
  3. Enter incorrect password in the login password field
  4. Click the login button
- **Selector**: button[data-qa="login-button"]
- **Expected Result**: Login fails and an error message is displayed
- **Assertion**: Text "Your email or password is incorrect!" should be visible

### TC003 — Search for a Product in the Products Catalog
- **Type**: Positive
- **Priority**: High
- **Page**: https://automationexercise.com/products
- **Precondition**: User is on the products page
- **Steps**:
  1. Navigate to https://automationexercise.com/products
  2. Enter product keyword into the search input
  3. Click the search button
- **Selector**: button#submit_search
- **Expected Result**: Relevant products matching the search query are displayed on the page
- **Assertion**: Text "Searched Products" should be visible

### TC004 — Add Product to Cart from Products Page
- **Type**: Positive
- **Priority**: High
- **Page**: https://automationexercise.com/products
- **Precondition**: User is viewing products and sees the add to cart button
- **Steps**:
  1. Navigate to https://automationexercise.com/products
  2. Locate the first product
  3. Click the add to cart button
- **Selector**: button.add-to-cart
- **Expected Result**: Product is added to the cart and a modal confirms the addition
- **Assertion**: Cart badge count should update to reflect the added item

### TC005 — Verify Item Appears in Shopping Cart
- **Type**: Positive
- **Priority**: High
- **Page**: https://automationexercise.com/view_cart
- **Precondition**: User has added at least one product to the cart
- **Steps**:
  1. Add a product to the cart
  2. Click on the navigation cart link
- **Selector**: a[href="/view_cart"]
- **Expected Result**: User is navigated to the cart page and the added product is listed in the cart table
- **Assertion**: URL should be https://automationexercise.com/view_cart

## Summary
- Total Tests: 5
- High Priority: 5
- Medium Priority: 0
- Low Priority: 0