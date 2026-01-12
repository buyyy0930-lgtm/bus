const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// In-memory database
const db = {
  users: [],
  admins: [],
  messages: [],
  reports: [],
  settings: {
    type: 'general',
    rules: 'Bakı Dövlət Universiteti Chat Qaydaları\n\n1. Hörmətli ünsiyyət\n2. Spam göndərməyin\n3. Şəxsi məlumatları paylaşmayın\n4. Akademik etikaya riayət edin',
    topicOfTheDay: 'Xoş gəlmisiniz! BSU Chat-a',
    filterWords: ['pis', 'nalayiq'],
    groupMessageExpiry: 24,
    privateMessageExpiry: 48
  }
};

let userIdCounter = 1;
let adminIdCounter = 1;
let messageIdCounter = 1;
let reportIdCounter = 1;

// Helper functions
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'bsu-chat-secret-key-618',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './public/uploads/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.random().toString(36).substring(7) + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Verification questions
const verificationQuestions = [
  { question: "Mexanika-riyaziyyat fakültəsi hansı korpusda yerləşir?", answer: "3" },
  { question: "Tətbiqi riyaziyyat və kibernetika fakültəsi hansı korpusda yerləşir?", answer: "3" },
  { question: "Fizika fakültəsi hansı korpusda yerləşir?", answer: "əsas" },
  { question: "Kimya fakültəsi hansı korpusda yerləşir?", answer: "əsas" },
  { question: "Biologiya fakültəsi hansı korpusda yerləşir?", answer: "əsas" },
  { question: "Ekologiya və torpaqşünaslıq fakültəsi hansı korpusda yerləşir?", answer: "əsas" },
  { question: "Coğrafiya fakültəsi hansı korpusda yerləşir?", answer: "əsas" },
  { question: "Geologiya fakültəsi hansı korpusda yerləşir?", answer: "əsas" },
  { question: "Filologiya fakültəsi hansı korpusda yerləşir?", answer: "1" },
  { question: "Tarix fakültəsi hansı korpusda yerləşir?", answer: "3" },
  { question: "Beynəlxalq münasibətlər və iqtisadiyyat fakültəsi hansı korpusda yerləşir?", answer: "1" },
  { question: "Hüquq fakültəsi hansı korpusda yerləşir?", answer: "1" },
  { question: "Jurnalistika fakültəsi hansı korpusda yerləşir?", answer: "2" },
  { question: "İnformasiya və sənəd menecmenti fakültəsi hansı korpusda yerləşir?", answer: "2" },
  { question: "Şərqşünaslıq fakültəsi hansı korpusda yerləşir?", answer: "2" },
  { question: "Sosial elmlər və psixologiya fakültəsi hansı korpusda yerləşir?", answer: "2" }
];

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, phone, faculty, degree, course, password } = req.body;
    
    // Validate email domain
    if (!email.endsWith('@bsu.edu.az')) {
      return res.json({ success: false, message: 'Yalnız @bsu.edu.az domeni qəbul edilir' });
    }

    // Check if user exists
    const existingUser = db.users.find(u => u.email === email || u.phone === phone);
    
    if (existingUser) {
      return res.json({ success: false, message: 'Bu email və ya telefon artıq qeydiyyatdan keçib' });
    }

    // Select random 3 questions
    const shuffled = [...verificationQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 3).map((q, i) => ({
      id: i,
      question: q.question,
      answer: q.answer
    }));

    res.json({ success: true, questions: selectedQuestions });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Xəta baş verdi' });
  }
});

app.post('/api/verify-register', async (req, res) => {
  try {
    const { fullName, email, phone, faculty, degree, course, password, answers } = req.body;
    
    // Check verification answers
    let correctCount = 0;
    for (let i = 0; i < answers.length; i++) {
      const question = verificationQuestions.find(q => q.question === answers[i].question);
      if (question && question.answer === answers[i].userAnswer) {
        correctCount++;
      }
    }

    if (correctCount < 2) {
      return res.json({ success: false, message: 'Minimum 2 sual düzgün cavablandırılmalıdır' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      _id: generateId(),
      fullName,
      email,
      phone,
      faculty,
      degree,
      course: parseInt(course),
      password: hashedPassword,
      profilePicture: null,
      isActive: true,
      blockedUsers: [],
      createdAt: new Date()
    };

    db.users.push(newUser);

    res.json({ success: true, message: 'Qeydiyyat uğurla tamamlandı' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Qeydiyyat xətası' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.json({ success: false, message: 'İstifadəçi tapılmadı' });
    }

    if (!user.isActive) {
      return res.json({ success: false, message: 'Hesabınız deaktiv edilib' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.json({ success: false, message: 'Şifrə səhvdir' });
    }

    req.session.userId = user._id.toString();
    res.json({ success: true, user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      faculty: user.faculty,
      degree: user.degree,
      course: user.course,
      profilePicture: user.profilePicture
    }});
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Giriş xətası' });
  }
});

app.post('/api/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check super admin
    if (username === '618ursamajor618' && password === '618ursa618') {
      req.session.adminId = 'super';
      req.session.isSuperAdmin = true;
      return res.json({ success: true, isSuperAdmin: true });
    }

    // Check sub-admin
    const admin = db.admins.find(a => a.username === username);
    
    if (!admin) {
      return res.json({ success: false, message: 'Admin tapılmadı' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      return res.json({ success: false, message: 'Şifrə səhvdir' });
    }

    req.session.adminId = admin._id.toString();
    req.session.isSuperAdmin = false;
    res.json({ success: true, isSuperAdmin: false });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Giriş xətası' });
  }
});

app.get('/api/check-session', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, type: 'user' });
  } else if (req.session.adminId) {
    res.json({ authenticated: true, type: 'admin', isSuperAdmin: req.session.isSuperAdmin });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/user-profile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, message: 'Giriş tələb olunur' });
    }

    const user = db.users.find(u => u._id === req.session.userId);
    
    if (!user) {
      return res.json({ success: false, message: 'İstifadəçi tapılmadı' });
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        faculty: user.faculty,
        degree: user.degree,
        course: user.course,
        profilePicture: user.profilePicture,
        blockedUsers: user.blockedUsers || []
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Xəta baş verdi' });
  }
});

app.post('/api/update-profile', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, message: 'Giriş tələb olunur' });
    }

    const { fullName, faculty, degree, course } = req.body;
    const user = db.users.find(u => u._id === req.session.userId);
    
    if (!user) {
      return res.json({ success: false, message: 'İstifadəçi tapılmadı' });
    }

    user.fullName = fullName;
    user.faculty = faculty;
    user.degree = degree;
    user.course = parseInt(course);

    if (req.file) {
      user.profilePicture = '/uploads/' + req.file.filename;
    }

    res.json({ success: true, message: 'Profil yeniləndi' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Yeniləmə xətası' });
  }
});

app.post('/api/block-user', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, message: 'Giriş tələb olunur' });
    }

    const { targetUserId } = req.body;
    const user = db.users.find(u => u._id === req.session.userId);
    
    if (!user) {
      return res.json({ success: false });
    }

    if (!user.blockedUsers) user.blockedUsers = [];
    if (!user.blockedUsers.includes(targetUserId)) {
      user.blockedUsers.push(targetUserId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post('/api/unblock-user', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ success: false, message: 'Giriş tələb olunur' });
    }

    const { targetUserId } = req.body;
    const user = db.users.find(u => u._id === req.session.userId);
    
    if (!user) {
      return res.json({ success: false });
    }

    user.blockedUsers = user.blockedUsers.filter(id => id !== targetUserId);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post('/api/report-user', async (req, res) => {
  try {
    const { reportedUserId, reporterUserId, reason } = req.body;

    db.reports.push({
      _id: generateId(),
      reportedUserId,
      reporterUserId,
      reason,
      createdAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Admin APIs
app.get('/api/admin/users', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.json({ success: false, message: 'Admin girişi tələb olunur' });
    }

    const users = db.users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post('/api/admin/toggle-user-status', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.json({ success: false, message: 'Admin girişi tələb olunur' });
    }

    const { userId, isActive } = req.body;
    const user = db.users.find(u => u._id === userId);
    
    if (user) {
      user.isActive = isActive;
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.get('/api/admin/settings', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.json({ success: false, message: 'Admin girişi tələb olunur' });
    }

    res.json({ success: true, settings: db.settings });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post('/api/admin/update-settings', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.json({ success: false, message: 'Admin girişi tələb olunur' });
    }

    const { rules, topicOfTheDay, filterWords, groupMessageExpiry, privateMessageExpiry } = req.body;

    db.settings.rules = rules;
    db.settings.topicOfTheDay = topicOfTheDay;
    db.settings.filterWords = filterWords;
    db.settings.groupMessageExpiry = groupMessageExpiry;
    db.settings.privateMessageExpiry = privateMessageExpiry;

    // Broadcast topic update
    io.emit('topicUpdated', topicOfTheDay);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.get('/api/admin/reported-users', async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.json({ success: false, message: 'Admin girişi tələb olunur' });
    }

    // Count reports per user
    const reportCounts = {};
    db.reports.forEach(report => {
      if (!reportCounts[report.reportedUserId]) {
        reportCounts[report.reportedUserId] = 0;
      }
      reportCounts[report.reportedUserId]++;
    });

    // Get users with 16+ reports
    const reportedUsers = [];
    for (const [userId, count] of Object.entries(reportCounts)) {
      if (count >= 16) {
        const user = db.users.find(u => u._id === userId);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          reportedUsers.push({
            user: userWithoutPassword,
            reportCount: count
          });
        }
      }
    }

    res.json({ success: true, reportedUsers });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post('/api/admin/create-sub-admin', async (req, res) => {
  try {
    if (!req.session.isSuperAdmin) {
      return res.json({ success: false, message: 'Super admin səlahiyyəti tələb olunur' });
    }

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.admins.push({
      _id: generateId(),
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.get('/api/admin/sub-admins', async (req, res) => {
  try {
    if (!req.session.isSuperAdmin) {
      return res.json({ success: false, message: 'Super admin səlahiyyəti tələb olunur' });
    }

    const admins = db.admins.map(a => {
      const { password, ...adminWithoutPassword } = a;
      return adminWithoutPassword;
    });

    res.json({ success: true, admins });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.delete('/api/admin/sub-admin/:id', async (req, res) => {
  try {
    if (!req.session.isSuperAdmin) {
      return res.json({ success: false, message: 'Super admin səlahiyyəti tələb olunur' });
    }

    db.admins = db.admins.filter(a => a._id !== req.params.id);

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-faculty', async (data) => {
    const { userId, faculty } = data;
    socket.join(faculty);
    socket.userId = userId;
    socket.faculty = faculty;
    
    // Load recent messages
    const messages = db.messages
      .filter(m => m.faculty === faculty && m.type === 'group')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50)
      .reverse();
    
    socket.emit('load-messages', messages);
  });

  socket.on('send-group-message', async (data) => {
    try {
      const { userId, faculty, message } = data;
      
      const user = db.users.find(u => u._id === userId);
      
      if (!user) return;

      // Get filter words
      let filteredMessage = message;
      
      if (db.settings.filterWords) {
        db.settings.filterWords.forEach(word => {
          const regex = new RegExp(word, 'gi');
          filteredMessage = filteredMessage.replace(regex, '*'.repeat(word.length));
        });
      }

      const messageDoc = {
        _id: generateId(),
        userId: user._id.toString(),
        userName: user.fullName,
        userFaculty: user.faculty,
        userDegree: user.degree,
        userCourse: user.course,
        userProfilePicture: user.profilePicture,
        faculty,
        message: filteredMessage,
        type: 'group',
        createdAt: new Date()
      };

      db.messages.push(messageDoc);

      io.to(faculty).emit('new-group-message', messageDoc);

      // Auto-delete after expiry
      if (db.settings.groupMessageExpiry) {
        setTimeout(() => {
          db.messages = db.messages.filter(m => m._id !== messageDoc._id);
          io.to(faculty).emit('message-deleted', messageDoc._id);
        }, db.settings.groupMessageExpiry * 60 * 60 * 1000);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('join-private-chat', async (data) => {
    const { userId, targetUserId } = data;
    const roomId = [userId, targetUserId].sort().join('-');
    socket.join(roomId);
    
    // Load recent messages
    const messages = db.messages
      .filter(m => 
        m.type === 'private' &&
        ((m.userId === userId && m.targetUserId === targetUserId) ||
         (m.userId === targetUserId && m.targetUserId === userId))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50)
      .reverse();
    
    socket.emit('load-private-messages', messages);
  });

  socket.on('send-private-message', async (data) => {
    try {
      const { userId, targetUserId, message } = data;
      
      const user = db.users.find(u => u._id === userId);
      const targetUser = db.users.find(u => u._id === targetUserId);
      
      if (!user || !targetUser) return;

      // Check if blocked
      if (targetUser.blockedUsers && targetUser.blockedUsers.includes(userId)) {
        return;
      }

      const messageDoc = {
        _id: generateId(),
        userId: user._id.toString(),
        userName: user.fullName,
        userProfilePicture: user.profilePicture,
        targetUserId: targetUser._id.toString(),
        message,
        type: 'private',
        createdAt: new Date()
      };

      db.messages.push(messageDoc);

      const roomId = [userId, targetUserId].sort().join('-');
      io.to(roomId).emit('new-private-message', messageDoc);

      // Auto-delete after expiry
      if (db.settings.privateMessageExpiry) {
        setTimeout(() => {
          db.messages = db.messages.filter(m => m._id !== messageDoc._id);
          io.to(roomId).emit('message-deleted', messageDoc._id);
        }, db.settings.privateMessageExpiry * 60 * 60 * 1000);
      }
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Database: In-Memory (no MongoDB required)');
  console.log('Super Admin: 618ursamajor618 / 618ursa618');
});
