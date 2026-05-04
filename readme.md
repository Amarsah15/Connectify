<img src="/Frontend/public/logo.svg" width="220" />

A full-stack social networking application built with the MERN stack, enabling user profiles, posts, and social interactions.

## 🌐 Live Demo

| App       | URL                                               |
| --------- | ------------------------------------------------- |
| Front-end | **https://connectify-amarnath-kumar.vercel.app/** |

---

## 🚀 Features

### User Authentication

- **Register/Login** with email and password
- **JWT Authentication** with HTTP-only cookies
- **Protected Routes** for authenticated users
- **Profile Management** with name, email, and bio

### Public Post Feed

- **Create Posts** with text content (10-2500 characters)
- **View All Posts** in chronological order
- **Delete Posts** your own posts
- **Real-time Character Counter**

### Profile Management

- **View User Profile** with personal information
- **Edit Profile**
- **User Posts Display** with post count
- **Profile Pictures** with automatic avatar generation

### Additional Features

- **Responsive Design** for mobile and desktop
- **Real-time Notifications** with toast messages
- **Form Validation** with Zod schemas
- **Loading States** and error handling
- **Rate Limiting** and security middleware

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **React Router Dom** for navigation
- **Zustand** for state management
- **React Hook Form** for form handling
- **Zod** for validation schemas
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Axios** for API calls

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **express-rate-limit** for rate limiting
- **CORS** for cross-origin requests
- **Cookie Parser** for cookie handling

## 📁 Project Structure

```
mini-linkedin/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── post.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── profile.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Post.js
│   │   └── routes/
│   │       ├── auth.routes.js
│   │       ├── posts.routes.js
│   │       ├── user.routes.js
│   │       └── profile.routes.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── posts/
│   │   │   └── profile/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── schemas/
│   │   └── utils/
│   ├── public/
│   ├── index.html
│   ├── vercel.json
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Clone the repository**

```bash
git clone https://github.com/Amarsah15/Connectify.git
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Create a `.env` file in the backend directory:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/connectify
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

4. **Start the backend server**

```bash
npm start
```

Server will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd ../frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the frontend development server**

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔒 Security Features

- **Password Hashing** with bcryptjs
- **JWT Authentication** with HTTP-only cookies
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests
- **XSS Protection** with input sanitization

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨💻 Author

**Amarnath Kumar**

- GitHub: [@Amarnath Kuamr GitHub](https://github.com/Amarsah15)
- LinkedIn: [Amarnath Kumar LinkedIn](https://linkedin.com/in/amarnath15)

**Happy Coding! 🚀**
