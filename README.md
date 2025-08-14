# Job Board System

A full-stack job board platform built with React + Redux (frontend) and Node.js + Express + SQLite (backend).

## Features

- **Authentication**: User registration/login with JWT
- **Role-based Access**: Admin (post jobs) and User (apply to jobs) roles
- **Job Management**: Create, read, update, delete job listings (admin only)
- **Job Applications**: Users can apply with cover letter and CV link
- **Application Management**: Admins can view and update application status
- **Filtering**: Filter jobs by title, location, etc.
- **Protected Routes**: Authentication-based route protection

## Tech Stack

### Backend
- Node.js + Express.js
- SQLite with raw SQL queries (no ORM)
- JWT authentication
- bcryptjs for password hashing
- Input validation with express-validator

### Frontend
- React 18
- Redux Toolkit for state management
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

### Testing
- Backend: Jest + Supertest
- Frontend: React Testing Library + Jest

## Project Structure

```
jpleaadd all of these job-board/
├── backend/
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── db.js
│   │   ├── migrations/
│   │   │   └── init.sql
│   │   ├── seeds/
│   │   │   └── seed.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── jobsController.js
│   │   │   └── applicationsController.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── jobs.js
│   │   │   └── applications.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── admin.js
│   │   └── utils/
│   │       └── hash.js
│   └── tests/
│       └── auth.test.js
└── frontend/
│    ├── package.json
│    ├── tailwind.config.js
│    ├── postcss.config.js
│    └── src/
│        ├── index.js
│        ├── App.js
│        ├── main.css
│        ├── store/
│        │   └── index.js
│        │   └── slices/ (authSlice.js, jobsSlice.js, applicationsSlice.js)
│        ├── services/api.js
│        ├── components/ProtectedRoute.jsx
│        └── pages/ (JobList.jsx, JobDetails.jsx, Login.jsx, Register.jsx, AdminJobs.jsx, AdminApplications.jsx)
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

4. Run database migrations:
```bash
# Run migrations
npm run migrate

# Rollback (drop tables)
npm run migrate:rollback

```

5. Seed the database:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Test Credentials

### Admin Account
- Email: admin@jobboard.com
- Password: admin123

### Regular User Account
- Email: user@jobboard.com
- Password: user123

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create job (admin only)
- `PUT /api/jobs/:id` - Update job (admin only)
- `DELETE /api/jobs/:id` - Delete job (admin only)

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/job/:jobId` - Get applications for job (admin only)
- `PUT /api/applications/:id` - Update application status (admin only)

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
DB_PATH=./database/jobboard.db
```

## Database Schema

### Users Table
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE)
- password (TEXT)
- firstName (TEXT)
- lastName (TEXT)
- role (TEXT) - 'admin' or 'user'
- createdAt (DATETIME)

### Jobs Table
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- company (TEXT)
- location (TEXT)
- description (TEXT)
- requirements (TEXT)
- salary (TEXT)
- createdBy (INTEGER) - Foreign key to users
- createdAt (DATETIME)
- updatedAt (DATETIME)

### Applications Table
- id (INTEGER PRIMARY KEY)
- jobId (INTEGER) - Foreign key to jobs
- userId (INTEGER) - Foreign key to users
- coverLetter (TEXT)
- cvLink (TEXT)
- status (TEXT) - 'pending', 'reviewed', 'accepted', 'rejected'
- createdAt (DATETIME)
- updatedAt (DATETIME)

## Deployment

### Backend Deployment (Heroku)
1. Create Heroku app
2. Set environment variables
3. Deploy using Git

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the build folder
3. Set up environment variables for API URL

## Performance Optimizations

- Database indexing on frequently queried columns
- JWT token caching
- React.memo for component optimization
- Lazy loading for routes
- API response caching

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Protected API routes
- XSS protection
- Rate limiting (optional enhancement)

## Future Enhancements

- Email notifications
- Advanced search and filtering
- File upload for CVs
- Real-time notifications
- Company profiles
- Application tracking
- Analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

- ## this project done by bazimya saphani
