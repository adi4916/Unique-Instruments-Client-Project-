# Unique Instruments Client Project

This project is a web application developed for **Unique Instruments**, a company that supplies **civil engineering surveying equipment and laboratory testing instruments**.  

The website serves two main purposes:
1. Present company information, services, and contact details.
2. Provide an internal system for managing inventory and generating quotations.

---

## Project Overview

The application allows authorized users to manage equipment inventory and generate professional quotations for clients. The quotation system automatically generates a **PDF using the company’s official quotation format**.

The public part of the website displays information about the company, the products they provide, and contact details.

---

## Features

### Authentication
- Login system using **Firebase Authentication**
- Only authorized users can access internal features
- User credentials are manually managed in Firebase

### Public Website
- Company introduction and services
- Information about civil and laboratory testing equipment
- Contact details and office locations
- Catalog browsing
- Responsive design
  <img width="1900" height="871" alt="Screenshot 2026-03-08 122618" src="https://github.com/user-attachments/assets/168c0775-44ce-4a8f-9af3-eeafd91f27a0" />


### Inventory Management
- Add inventory items
- Edit inventory details
- Delete inventory items
- Store inventory data using **Firebase Database**
  <img width="1901" height="866" alt="Screenshot 2026-03-08 122647" src="https://github.com/user-attachments/assets/1508cfaf-7116-4931-8af4-3a2c662a077f" />

### Quotation Generator
- Browse available products
- Select items to include in a quotation
- Adjust quantity and price if required
- Automatically calculate totals
- Generate a **PDF quotation with the company’s official background format**
  <img width="1906" height="873" alt="Screenshot 2026-03-08 122637" src="https://github.com/user-attachments/assets/17e7ce01-63ae-445e-a004-fa8e8567c2f2" />

---

## Technology Stack

Frontend:
- React
- TypeScript
- Tailwind CSS

Backend / Database:
- Firebase Realtime Database
- Firebase Authentication

Libraries Used:
- Framer Motion (animations)
- jsPDF
- jsPDF-AutoTable
- Lucide React Icons

Deployment:
- Firebase Hosting

---

## Access Control

Certain features are restricted and only available to logged-in users:

- Inventory Management
- Quotation Generator
- PDF Quotation Creation

Public visitors can only view the company website and contact information.


