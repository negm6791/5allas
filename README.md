# 5allas (خلاص) - Modern Productivity App

A minimal, premium productivity tool for managing tasks and routines. Built with **React**, **TypeScript**, and **Tailwind CSS**. It uses **Browser Local Storage**, meaning it runs entirely on your device without needing a backend or database server.

## 🚀 Features

- ✅ **Task Management** - Create, complete, and organize daily tasks with **Edit** support
- 🔄 **Routine Tracking** - Build lasting habits with daily/weekly/monthly routines
- ⏩ **Task Carry-Over** - Unfinished tasks and routine subtasks automatically roll over to the next day
- 📁 **Project Organization** - Group tasks by projects with custom colors
- 📊 **Productivity Curve** - Track your efficiency with interactive charts
- 📅 **Year Board** - A minimalist heatmap of your consistency
- 💾 **Local-First** - Data is saved automatically in your browser's LocalStorage
- 🎨 **Premium UI** - Clean, dark-mode aesthetics with smooth Framer Motion animations

## 📦 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/5allas.git
   cd 5allas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to `http://localhost:5173` in your web browser.

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
