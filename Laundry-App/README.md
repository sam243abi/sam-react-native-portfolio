# 🧺 Laundry Application (Personal Project)

A real-world **laundry service mobile application** built with **React Native**, covering the complete user journey from authentication to order scheduling and address management.

This project focuses on **practical app flows**, **persistent authentication**, and **scalable UI architecture**, similar to production-ready consumer apps.

---

## 📸 App Preview

### 📸 Screenshots
👉 **[Click here to view app screenshots](assets/Preview)**

### 🎥 Demo Video
👉 **[Click here to view app Demo Vedio](assets/Preview)**

---

## 🔐 Authentication Flow

- 📱 Phone Number Login
- 🔢 OTP Verification using Firebase Authentication  
  - Test phone numbers & test OTP supported
- 👤 User detection logic  
  - New user → profile/details flow  
  - Existing user → direct dashboard access
- 🔁 Persistent login  
  - User stays logged in even after app restart  
  - Logout or account deletion required to reset session

---

## 🏠 Dashboard

The dashboard displays multiple laundry services such as:

- Express Laundary
- Dry Cleaning
- Wash & Fold  
- Wash & Iron
- Ironing
- Household Spa
- Starching 
- Shoe Cleaning  
- Stain Removal  
- Helmet Cleaning   

Each service is represented as a selectable card.

---

## 🧾 Service Selection & Cart

- Selecting a service opens an **overlay modal**
- User can:
  - Choose service type
  - Add items to cart
- 🛒 Cart Page:
  - Displays added services
  - Item count
  - Individual & total price
- Cart state is maintained across screens

---

## 📅 Scheduling Flow

- User selects:
  - Pickup date
  - Pickup time
- ⏱ Smart delivery logic  
  Example:
  - Pickup: **Today at 11:00 PM**
  - Delivery automatically set to: **Next day at 12:00 PM**
- Designed to reflect real logistics behavior

---

## 📍 Address Book & Map Integration

- Address book stores multiple user addresses
- 📌 Map-based location selection:
  - User can select **current location**
  - Save it to address book
- Address can be reused for future orders

---

## 👤 Profile Section

- View & edit user profile
- About Us
- Address management
- Logout
- Delete account

---

## 🛠 Tech Stack

- React Native
- JavaScript (ES6)
- Firebase Authentication (Phone OTP)
- FireStore (saving and using user data)
- React Navigation
- Reusable Component Architecture
- API-ready architecture (JSON-based)

> Backend APIs are structured but not fully connected yet.  
> The app is designed to plug into APIs without refactoring UI logic.

---

## 🧠 What This Project Demonstrates

- Real-world authentication handling
- Persistent login logic
- Complex UI flows (modals, cart, scheduling)
- State management using React Hooks
- Clean screen separation
- Practical mobile UX thinking
- Industry-style folder structure

---

## 🚀 How to Run

```bash
npm install
npx react-native run-android
# or
npx react-native run-ios
```
## 📌 Project Status

🛠 Actively maintained & improved

Planned enhancements:

- Backend API integration
- Order history
- Payment flow
- Performance optimizations


## 👤 Author

Sam Abhishek A C  

React Native Developer

📍 Open to React Native opportunities
