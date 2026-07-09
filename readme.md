<img src="/Frontend/public/logo.svg" width="220" alt="Connectify Logo" />

A Professional Full-stack social networking platform built with the MERN stack - featuring real-time interactions, dark mode, and a SaaS-grade design.

## Live Demo

| Application | URL |
| :--- | :--- |
| Frontend | **[connectify-amarnath-kumar.vercel.app](https://connectify-amarnath-kumar.vercel.app/)** |

---

## V1.5.0 Release Updates

- **Complete Design Overhaul** — Premium SaaS design with warm color palette, glassmorphism, and micro-animations.
- **Dark Mode** — System-aware theme with light, dark, and system default toggles.
- **Likes & Comments** — Real-time updates for post likes and nested comment threads.
- **Real-time Notifications** — Live push notifications for likes, comments, and follows using Socket.IO.
- **Dashboard** — Personal analytics metrics including stat cards and weekly activity charts.
- **User Search** — High-performance debounced network-wide search.
- **Settings** — Profile editing, password rotation, and persistent theme controls.
- **Backend Hardening** — Secured using Helmet, Express rate-limiting, custom error middleware, and database cascade deletes.
- **Marketing Landing Page** — Redesigned hero folds, feature lists, client testimonials, and gradient call-to-actions.
- **Smart Pagination** — Paginated feed queries, 15-item pagination with load-more buttons for notifications, and 10-item pagination for administration moderation tables.

---

## Core Features

### User Authentication
- Secure registration and login flow using email and password.
- JWT-based authentication stored in secure HTTP-only cookies.
- Protected client-side routing and route guarding.
- Password change functionality built directly into settings.

### Social Feed
- Post creation with strict character limits (10 to 2500 characters).
- Chronologically ordered public global feed.
- Personal following feed displaying only connected network posts.
- Fast post liking and unliking.
- Expandable nested comment threads.

### Profile & Network
- Custom profile updates (name, bio, avatars).
- Dedicated public user profiles.
- Follow and unfollow capabilities.
- Real-time connection and follower metrics.

### Notifications
- Real-time event notifications via WebSockets.
- Notifications triggered by follows, likes, and comments.
- Dynamic unread notification counter badge in global header.
- Bulk read actions ("Mark Read" and "Mark All Read").

### Dashboard
- Key performance metrics (posts shared, likes received, comments, followers count).
- Visual weekly activity charts mapping published posts.
- Registration age and member metrics.

### Search
- Debounced query processing.
- Profile cards displaying avatar, bio, developer roles, and follower count.

### Administration & Moderation
- Table-based user views for moderation.
- Moderation tools to temporarily ban/unban users.
- Administrator capabilities to delete profiles (automatically cascades to clear associated posts, comments, and notifications).
- Role promotion and credential assignment.

---

## Tech Stack

### Frontend
- **React 19** and **Vite 7**
- **Tailwind CSS v4** design-token system
- **Zustand** state store management
- **Framer Motion** scroll animations
- **Socket.IO Client** WebSocket links
- **React Hook Form** and **Zod** schema validations
- **Lucide React** vector icons
- **React Hot Toast** notifications

### Backend
- **Node.js** and **Express 5**
- **MongoDB** and **Mongoose ODM**
- **Socket.IO** server engine
- **JWT** session handlers
- **bcryptjs** password encryption
- **Helmet** HTTP header security
- **express-rate-limit** API request control
- **express-validator** payload verification

---

## Project Structure

```
Connectify/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── post.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── profile.controller.js
│   │   │   └── notification.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── validation.middleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   ├── Comment.js
│   │   │   └── Notification.js
│   │   └── routes/
│   │       ├── auth.routes.js
│   │       ├── posts.routes.js
│   │       ├── user.routes.js
│   │       ├── profile.routes.js
│   │       └── notification.routes.js
│   ├── socket.js
│   ├── index.js
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── posts/
│   │   │   ├── profile/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   └── socket.js
│   │   ├── pages/
│   │   ├── store/
│   │   ├── schemas/
│   │   └── utils/
│   ├── index.html
│   └── package.json
└── README.md
```

---

## API Endpoints

### Authentication (/api/v1/auth)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /register | Create a new user account |
| POST | /login | Authenticate user session |
| POST | /logout | Clear cookie and end session |
| GET | /check | Validate session token |

### Posts (/api/v1/posts)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /create | Create a new post |
| GET | /getAll | List feed posts |
| DELETE | /:id | Delete a post |
| POST | /:id/like | Toggle post like state |
| POST | /:id/comments | Add comment to post |
| GET | /:id/comments | Retrieve post comments |
| DELETE | /comments/:commentId | Delete a post comment |

### Profile (/api/v1/profile)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | / | Retrieve personal profile and posts |
| PUT | /update | Update profile information |
| PUT | /update-password | Change user password |
| GET | /dashboard-stats | Retrieve dashboard analytics data |
| GET | /:userId | Retrieve public profile details |

### Users (/api/v1/users)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /search | Query users |
| POST | /:userId/follow | Toggle connection follow |
| GET | /:userId/follow-status | Verify relationship status |
| GET | / | List all directory users (Moderators/Admins) |
| PATCH | /:userId/role | Modify user permissions (Admins) |
| PATCH | /:userId/ban | Toggle user ban state (Moderators) |
| DELETE | /:userId | Delete user account (Admins) |

### Notifications (/api/v1/notifications)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | / | List notification events |
| GET | /unread-count | Count unread notifications |
| PATCH | /:id/read | Mark notification as read |
| PATCH | /read-all | Mark all notifications as read |

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Amarsah15/Connectify.git
cd Backend
```

2. **Install package dependencies**
```bash
npm install
```

3. **Environment Variables** — create a `.env` file in the Backend directory:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/connectify
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. **Start development server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to the Frontend directory**
```bash
cd ../Frontend
```

2. **Install package dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

---

## Security Specifications

- **Helmet** — Secure HTTP headers.
- **Rate Limiting** — 200 requests/15 minutes general API throttling, 20 requests/15 minutes authentication rate limits.
- **Bcrypt** — Password salting and encryption using 12 salt rounds.
- **Cookies** — Session token payloads stored only in Secure, SameSite HTTP-only cookies.
- **Validation** — Double validation layers (express-validator on the API endpoints, Zod schema mapping on the client forms).
- **CORS** — Whitelisted cross-origin request policies.

---

## Contributing

1. Fork the project.
2. Create your branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push your branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## Developer & Designer Info

**Amarnath Kumar**
- **Roles**: Full Stack Developer, Creative Frontend Developer, Creative Backend Developer
- **Email**: [amarnath.kumar152003@gmail.com](mailto:amarnath.kumar152003@gmail.com)
- **Website**: [amarnathkumar.dev](https://amarnathkumar.dev)
- **GitHub**: [github.com/Amarsah15](https://github.com/Amarsah15/)
- **LinkedIn**: [linkedin.com/in/amarnathkumar1](https://www.linkedin.com/in/amarnathkumar1/)

Happy Coding!
