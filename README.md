# 5allas (خلاص) - Full-Stack Productivity Application

A modern, production-ready task management and routine tracking application built with **React**, **TypeScript**, **Express**, and **PostgreSQL**.

## 🚀 Features

- ✅ **Task Management** - Create, complete, and organize daily tasks with **Edit** support
- 🔄 **Routine Tracking** - Build lasting habits with daily/weekly/monthly routines
- ⏩ **Task Carry-Over** - Unfinished tasks and routine subtasks automatically roll over to the next day
- 📁 **Project Organization** - Group tasks by projects with custom colors
- 📊 **Insights Dashboard** - Visualize your productivity with charts and stats
- 📅 **Year Board (Heatmap)** - Track your consistency with a dynamic concentration-based view
- 🚀 **Error Proofing** - Implementation of a Global Error Boundary to prevent silent crashes
- 🎨 **Beautiful Aesthetics** - Deep emerald themes, smooth Framer Motion animations, and a premium Glassmorphic UI

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- React Query (data fetching)
- Zustand (state management)
- Chart.js (visualizations)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcrypt (password hashing)

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/5allas"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

4. Run Prisma migrations:
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## 🎯 Usage

1. **Register** - Create a new account
2. **Login** - Sign in with your credentials
3. **Create Tasks** - Add tasks for today or future dates
4. **Build Routines** - Set up daily, weekly, or monthly habits
5. **Organize Projects** - Group related tasks together
6. **Track Progress** - View your productivity insights

## 📁 Project Structure

```
5allas/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── prisma/          # Database schema
│   │   └── server.ts        # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page views
│   │   ├── hooks/           # React Query hooks
│   │   ├── store/           # Zustand stores
│   │   ├── services/        # API services
│   │   └── animations/      # Framer Motion variants
│   └── package.json
│
└── README.md
```

## 🎨 Key Features

### Animations
- Smooth page transitions
- Stagger animations for lists
- Checkbox completion animations
- Modal entrance/exit effects
- Hover and tap interactions

### API Endpoints

**Auth**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in

**Tasks**
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/reorder` - Reorder tasks

**Routines**
- `GET /api/routines` - Get all routines
- `POST /api/routines` - Create routine
- `POST /api/routines/:id/complete` - Mark complete
- `GET /api/routines/stats` - Get completion stats

**Projects**
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `DELETE /api/projects/:id` - Delete project

## 🚢 Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Frontend (Vercel)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Configure environment variables in Vercel dashboard

## 📝 License

MIT

## 👨‍💻 Author

Built with ❤️ for productivity enthusiasts
