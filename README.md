# 🪑 Online Seat Booking App (Frontend)

This is the **frontend assignment** built with **Next.js**, **Chakra UI**, and **Axios**. It allows users to book and reset seat reservations by interacting with a Node.js + PostgreSQL backend.

---

## 🌐 Hosted Links
1. Frontend: https://bookseatapp.netlify.app/
2. Backend: https://seat-booking-app-hov9.onrender.com
---

## 🚀 Features

- Displays seats in a grid layout
- Allows booking up to 7 seats at once
- Displays live booking status
- Integrates with a REST API backend
- Uses Chakra UI for styling and responsiveness

---

## 🛠️ Tech Stack

- Framework: Next.js 13+
- UI: Chakra UI
- HTTP Client: Axios
- Backend API: Node.js + Express (https://seat-booking-app-hov9.onrender.com)
- Database: PostgreSQL (via backend)

---

## 📦 Installation & Setup

1. Clone the Repository
   ```js
   git clone https://github.com/prajesh9921/seat-booking-app.git
   cd online-seat-booking-frontend
   ```
2. Install Dependencies
   ```js
   npm install
   ```
3. Set Up Environment Variables
   ```js
   Create a `.env.local` file in the root:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://seat-booking-app-hov9.onrender.com

4. Run the Development Server
   ```js
   npm run dev
   ```
   Open http://localhost:3000 to view it in your browser.

   > Make sure your backend (Node.js server) is running on port 5000.
---

## 🧪 API Endpoints Used

- GET /api/seats → Fetches seat data
- POST /api/seats/book → Books selected seats
- POST /api/seats → Resets all bookings
