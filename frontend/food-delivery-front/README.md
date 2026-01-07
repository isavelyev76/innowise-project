# Food Delivery Frontend

This project is the frontend client for a microservices-based food delivery application. It is built as a Single Page Application (SPA) using React and interacts with three separate backend services: User Service, Restaurant Service, and Order Service.

## Technology Stack

- **Core:** React 18, Vite
- **State Management:** Redux Toolkit (Auth, Cart, Notifications)
- **UI Framework:** Material UI (MUI)
- **Routing:** React Router DOM
- **HTTP Client:** Axios (configured with JWT interceptors)

## Key Features

### Customer Interface

- **Authentication:** Registration, Login, and Account Reactivation flow (Soft Deletion support).
- **Restaurant Catalog:** Server-side pagination and filtering by name, cuisine, or address.
- **Ordering System:** Menu browsing, shopping cart management, and checkout.
- **Order Tracking:** Real-time order status updates and payment processing integration.
- **Profile Management:** Personal details editing, password security, and CRUD operations for delivery addresses.

### Admin Dashboard

- **Order Management:** Workflow for updating order statuses (Placed -> Cooking -> Ready -> Delivered).
- **Content Management:** Full CRUD capabilities for restaurants and menu items, including image uploads.

## Project Structure

- `src/api`: Axios instances configured for different microservice ports.
- `src/components`: Reusable UI components (Navbar, ProtectedRoute, Dialogs).
- `src/pages`: Main application views for Users and Admins.
- `src/redux`: Redux slices for global state management.
- `src/theme.js`: Custom Material UI theme configuration.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend services running on the following ports:
  - **Order Service:** 8080
  - **User Service:** 8081
  - **Restaurant Service:** 9090

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173.
