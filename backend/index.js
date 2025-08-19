import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import createDefaultSuperAdmin from './utils/createDefaultSuperAdmin.js';
import path from 'path';
import { fileURLToPath } from 'url';

// 🌐 Load environment variables from .env
// dotenv.config(); // No longer needed, handled by import 'dotenv/config';

// 🔌 Connect to MongoDB
connectDB();

// 🚀 Create Express App
const app = express();

// 🌍 Global Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://emoployeecommunicationportal.netlify.app"
    ], // Allow local and Netlify frontend
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "role"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json()); // Parses JSON bodies

// 📦 Import API Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import pollRoutes from './routes/polls.js';
import settingsRoutes from './routes/settings.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// 🛣️ Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes); // ✅ tasks module
app.use('/api/issues', issueRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/analytics', analyticsRoutes);

// 🔧 Test Route
app.post('/test', (req, res) => {
  res.send('✅ POST /test working fine');
});

// 👑 Create default SuperAdmin
createDefaultSuperAdmin()
  .then(() => console.log('✅ Default SuperAdmin ensured'))
  .catch((err) => console.error('❌ SuperAdmin init failed:', err.message));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html
app.get('*', (req, res) => {
  // res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// 📅 Date formatting utility (optional)
export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString('en-GB') + ', ' + d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export default app;
