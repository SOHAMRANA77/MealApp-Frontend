## Meal App Website - Frontend Documentation

### Project Overview

Welcome to the Meal App Website! This project is designed to streamline the process of meal booking and collection with an intuitive interface and robust functionality. The frontend of this application is built using Angular, ensuring a dynamic, responsive, and user-friendly experience.

### Backend Code

To check out the backend code, visit the [Meal App Backend Repository](https://github.com/SOHAMRANA77/MealApp-Backend).

### Key Features

1. **Login Page**
2. **Forgot Password Page with Email OTP System**
3. **Notification System**
4. **Calendar with Booking Marking**
5. **QR Code System**
6. **Time Constraints on Booking and Canceling**

### Installation and Setup

#### Prerequisites

- Node.js
- Angular CLI

#### Installation Steps

1. **Clone the Repository**
    ```sh
    git clone https://github.com/yourusername/meal-app-website.git
    ```
2. **Navigate to the Project Directory**
    ```sh
    cd meal-app-website
    ```
3. **Install Dependencies**
    ```sh
    npm install
    ```
4. **Run the Application**
    ```sh
    ng serve
    ```
   Open your browser and navigate to `http://localhost:4200`.

### Project Structure

```plaintext
app/
    ├── authentication/
    │   ├── forgot-page/
    │   ├── login-page/
    │   ├── otpdialog/
    │   ├── register-page/
    │   └── services/
    ├── core/
    │   ├── guards/
    │   └── interceptors/
    ├── dashboard/
    │   ├── about-us/
    │   ├── bulk-booking/
    │   ├── custom-alert-dialog/
    │   ├── footer/
    │   ├── home/
    │   ├── logout-confirmation-dialog/
    │   ├── navbar/
    │   ├── privacy-policy/
    │   ├── qrcode/
    │   └── services/
    │   ├── terms-ndcondi/
    └── environments/
        └── env.ts
```

### Key Components

#### Authentication Module

- **Login Page**: Allows users to sign in with their credentials.
  ![Login Page](/src/assets/readme/Login%20page.png)

- **Forgot Password Page**: Users can reset their password using an OTP sent to their email.
  ![Forgot Password Page](/src/assets/readme/Forgot%20page.png)

- **OTP Dialog**: Dialog for entering the OTP received via email.
  ![OTP Dialog](/src/assets/readme/OTP%20page.png)

- **Register Page**: New users can register for an account.
  ![Register Page](/src/assets/readme/Create%20your%20account%20page.png)

#### Core Module

- **Guards**: Protect routes based on authentication and authorization.
- **Interceptors**: Handle HTTP requests and responses globally.

#### Dashboard Module

- **Home**: The landing page after a successful login.
  ![Home](/src/assets/readme/Homepage2.png)

- **About Us**: Information about the app and its purpose.
  ![About Us](/src/assets/readme/aboutme.png)

- **Bulk Booking**: Allows users to book meals for multiple dates at once.
  ![Bulk Booking](/src/assets/readme/Bulkbooking.png)

- **QR Code**: Generates a QR code for meal collection.
  ![QR Code](path_to_screenshot/qrcode.png)

### Services

#### Authentication Services

- **AuthService**: Handles login, registration, and OTP verification.
  - Methods: `login()`, `register()`, `sendOTP()`, `verifyOTP()`

#### Notification Services

- **NotificationService**: Manages notifications displayed to the user.
  - Methods: `showSuccess()`, `showWarning()`, `showError()`

#### Booking Services

- **BookingService**: Manages meal bookings.
  - Methods: `createBooking()`, `cancelBooking()`, `getBookings()`

#### QR Code Services

- **QRCodeService**: Generates QR codes for meal collection.
  - Method: `generateQRCode()`

### Usage

#### Authentication

Use the `AuthService` for handling login, registration, and OTP verification.

#### Booking

Use the `BookingService` for managing meal bookings, including creating, canceling, and retrieving bookings.

#### Notifications

Use the `NotificationService` for displaying notifications with different colors based on the activity:
- Green for success.
- Yellow for warnings.
- red for errors.

#### QR Code Generation

Use the `QRCodeService` to generate QR codes for meal collection.

### Conclusion

This Meal App Website project aims to provide a seamless meal booking experience with a focus on user convenience and efficient meal management. With features like OTP-based password reset, color-coded notifications, calendar-based meal booking, and QR code meal collection, users will find it easy to manage their meal bookings.

For any further questions or contributions, please refer to the project's GitHub repository.

---