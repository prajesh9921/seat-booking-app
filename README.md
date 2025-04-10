# 🪑 Online Seat Booking App (Frontend)

This is the **frontend assignment** built with **Next.js**, **Chakra UI**, and **Axios**. It allows users to book and reset seat reservations by interacting with a Node.js + PostgreSQL backend.

---

## 🚀 Features

- Displays seats in a grid layout
- Allows booking up to 7 seats at once
- Displays live booking status
- Integrates with a REST API backend
- Uses Chakra UI for styling and responsiveness

---

## 🧾 Folder Structure

online-seat-booking-frontend/
│
├── app/                     # App Router pages and layout
│   ├── page.js              # Main UI with Compartment + InputBox
│   └── layout.js            # ChakraProvider wrapper & metadata
│
├── components/              # UI Components
│   ├── Compartment.jsx      # Renders seat grid
│   ├── InputBox.jsx         # Booking form
│   └── Seat.jsx             # Individual seat component
│
├── styles/                  # Global styles
│   └── globals.css
│
├── public/                  # Static assets
│
├── .env.local               # Environment variables (API base URL)
├── package.json
└── README.md                # You are here

---

## 🛠️ Tech Stack

- Framework: Next.js 13+
- UI: Chakra UI
- HTTP Client: Axios
- Backend API: Node.js + Express (running on localhost:5000)
- Database: PostgreSQL (via backend)

---

## 📦 Installation & Setup

1. Clone the Repository

   git clone https://github.com/your-username/online-seat-booking-frontend.git
   cd online-seat-booking-frontend

2. Install Dependencies

   npm install

3. Set Up Environment Variables

   Create a `.env.local` file in the root:

   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

4. Run the Development Server

   npm run dev

   Open http://localhost:3000 to view it in your browser.

   > Make sure your backend (Node.js server) is running on port 5000.

---

## 🧪 API Endpoints Used

- GET /api/seats → Fetches seat data
- POST /api/seats/book → Books selected seats
- POST /api/seats → Resets all bookings