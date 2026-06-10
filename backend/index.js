import express from 'express';
import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
import cors from 'cors';
import http from 'http';
import path from 'path';
import multer from 'multer';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Message from './models/Message.js';
import JobRole from './models/JobRole.js';

import dotenv from 'dotenv';
dotenv.config();
const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});


// Required to simulate __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🧠 MongoDB connection
mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/resume_analytics', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await seedJobRoles();
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

async function seedJobRoles() {
  try {
    const count = await JobRole.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default job roles...');
      const defaultRoles = [
        {
          title: "Frontend Engineer",
          description: "Develop and optimize responsive client-side web components.",
          industry: "Tech",
          level: "mid",
          requiredSkills: [
            { name: "React", weight: 1.5, category: "technical" },
            { name: "JavaScript", weight: 1.2, category: "technical" },
            { name: "HTML", weight: 1.0, category: "technical" },
            { name: "CSS", weight: 1.0, category: "technical" },
            { name: "TypeScript", weight: 1.2, category: "technical" },
            { name: "Git", weight: 1.0, category: "tool" }
          ],
          keywords: [
            { term: "React", weight: 1.5, synonyms: ["ReactJS", "React.js"] },
            { term: "JavaScript", weight: 1.2, synonyms: ["JS", "ES6"] },
            { term: "CSS", weight: 1.0, synonyms: ["Tailwind", "Bootstrap", "Sass"] },
            { term: "TypeScript", weight: 1.2, synonyms: ["TS"] },
            { term: "Frontend", weight: 1.0, synonyms: ["Client-side", "UI", "UX"] }
          ],
          minimumScore: 60
        },
        {
          title: "Backend Engineer",
          description: "Design scalable API routes, schemas, and database query triggers.",
          industry: "Tech",
          level: "mid",
          requiredSkills: [
            { name: "Node.js", weight: 1.5, category: "technical" },
            { name: "Express", weight: 1.2, category: "technical" },
            { name: "MongoDB", weight: 1.5, category: "technical" },
            { name: "SQL", weight: 1.2, category: "technical" },
            { name: "REST API", weight: 1.0, category: "technical" },
            { name: "Git", weight: 1.0, category: "tool" }
          ],
          keywords: [
            { term: "Node.js", weight: 1.5, synonyms: ["Node", "NodeJS"] },
            { term: "Express", weight: 1.2, synonyms: ["Express.js", "ExpressJS"] },
            { term: "MongoDB", weight: 1.5, synonyms: ["Mongo", "Mongoose"] },
            { term: "SQL", weight: 1.2, synonyms: ["MySQL", "PostgreSQL"] },
            { term: "API", weight: 1.0, synonyms: ["REST", "RESTful", "GraphQL"] }
          ],
          minimumScore: 60
        },
        {
          title: "Full Stack Engineer",
          description: "Lead end-to-end component design and cloud devops integrations.",
          industry: "Tech",
          level: "mid",
          requiredSkills: [
            { name: "React", weight: 1.5, category: "technical" },
            { name: "Node.js", weight: 1.5, category: "technical" },
            { name: "JavaScript", weight: 1.2, category: "technical" },
            { name: "MongoDB", weight: 1.2, category: "technical" },
            { name: "Git", weight: 1.0, category: "tool" },
            { name: "Docker", weight: 1.0, category: "tool" }
          ],
          keywords: [
            { term: "React", weight: 1.5, synonyms: ["ReactJS", "React.js"] },
            { term: "Node.js", weight: 1.5, synonyms: ["Node", "NodeJS"] },
            { term: "Full Stack", weight: 1.2, synonyms: ["MERN", "MEAN"] },
            { term: "Docker", weight: 1.0, synonyms: ["Containerization", "Containers"] },
            { term: "Cloud", weight: 1.0, synonyms: ["AWS", "Azure", "GCP"] }
          ],
          minimumScore: 60
        }
      ];
      await JobRole.insertMany(defaultRoles);
      console.log('🌱 Seeded default job roles into database.');
    }
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

// 📦 Middlewares
app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files (e.g., uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🧩 Routes (must be using ES Module exports too)
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoleRoutes from './routes/jobRoleRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import mockInterviewRoutes from './routes/mockInterviewRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import jobs from './routes/jobs.js';
import ChatRoute from './routes/ChatRoute.js';

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/mock', mockInterviewRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/jobs', jobs);
app.use('/api/ai', ChatRoute);

// 🏠 Welcome route
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Welcome to the HireBuddy API server!' });
});

// 🏥 Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Resume Analytics API is running' });
});


app.use((req, res, next) => {
  res.status(404).json({ message: 'API Not Found' });
});

// 🧯 Error handler
app.use((err, req, res, next) => {
  console.error(' Error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

async function generateAIReply(message) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return "⚠️ Server is missing OpenRouter API key.";
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else {
      return '❗ Sorry, no valid reply from AI.';
    }

  } catch (err) {
    return '⚠️ Oops! Failed to contact OpenRouter.';
  }
}




// 🔌 Setup socket.io
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('user_message', async (userMessage) => {

    const aiReply = await generateAIReply(userMessage);
    console.log('📩 Received from user:', userMessage);
    await Message.create({
      user: socket.id,
      prompt: userMessage,
      aiReply,
    });

    socket.emit('bot reply', aiReply);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
