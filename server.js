const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bsu-chat';

// MongoDB connection
let db;
MongoClient.connect(MONGODB_URI, { useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection error:', err));

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

const faculties = [
  "Mexanika-riyaziyyat",
  "Tətbiqi riyaziyyat və kibernetika",
  "Fizika",
  "Kimya",
  "Biologiya",
  "Ekologiya və torpaqşünaslıq",
  "Coğrafiya",
  "Geologiya",
  "Filologiya",
  "Tarix",
  "Beynəlxalq münasibətlər və iqtisadiyyat",
  "Hüquq",
  "Jurnalistika",
  "İnformasiya və sənəd menecmenti",
  "Şərqşünaslıq",
  "Sosial elmlər və psixologiya"
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
    const existingUser = await db.collection('users').findOne({ 
      $or: [{ email }, { phone }] 
    });
    
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
    const result = await db.collection('users').insertOne({
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
    });

    res.json({ success: true, message: 'Qeydiyyat uğurla tamamlandı' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Qeydiyyat xətası' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await db.collection('users').findOne({ email });
    
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
    const admin = await db.collection('admins').findOne({ username });
    
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

    const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
    
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
    const updateData = { fullName, faculty, degree, course: parseInt(course) };

    if (req.file) {
      updateData.profilePicture = '/uploads/' + req.file.filename;
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(req.session.userId) },
      { $set: updateData }
    );

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

    await db.collection('users').updateOne(
      { _id: new ObjectId(req.session.userId) },
      { $addToSet: { blockedUsers: targetUserId } }
    );

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

    await db.collection('users').updateOne(
      { _id: new ObjectId(req.session.userId) },
      { $pull: { blockedUsers: targetUserId } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.post('/api/report-user', async (req, res) => {
  try {
    const { reportedUserId, reporterUserId, reason } = req.body;

    await db.collection('reports').insertOne({
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

    const users = await db.collection('users')
      .find({}, { projection: { password: 0 } })
      .toArray();

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

    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isActive } }
    );

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

    let settings = await db.collection('settings').findOne({ type: 'general' });
    
    if (!settings) {
      settings = {
        type: 'general',
        rules: 'Qaydalar buraya yazılacaq...',
        topicOfTheDay: 'Günün mövzusu',
        filterWords: [],
        groupMessageExpiry: 24,
        privateMessageExpiry: 48
      };
      await db.collection('settings').insertOne(settings);
    }

    res.json({ success: true, settings });
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

    await db.collection('settings').updateOne(
      { type: 'general' },
      { $set: { rules, topicOfTheDay, filterWords, groupMessageExpiry, privateMessageExpiry } },
      { upsert: true }
    );

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

    const reports = await db.collection('reports').aggregate([
      {
        $group: {
          _id: '$reportedUserId',
          count: { $sum: 1 },
          reports: { $push: '$$ROOT' }
        }
      },
      {
        $match: { count: { $gte: 16 } }
      }
    ]).toArray();

    const reportedUsers = [];
    for (const report of reports) {
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(report._id) },
        { projection: { password: 0 } }
      );
      if (user) {
        reportedUsers.push({
          user,
          reportCount: report.count
        });
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

    await db.collection('admins').insertOne({
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

    const admins = await db.collection('admins').find({}, { projection: { password: 0 } }).toArray();

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

    await db.collection('admins').deleteOne({ _id: new ObjectId(req.params.id) });

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
    const messages = await db.collection('messages')
      .find({ faculty, type: 'group' })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    
    socket.emit('load-messages', messages.reverse());
  });

  socket.on('send-group-message', async (data) => {
    try {
      const { userId, faculty, message } = data;
      
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      
      if (!user) return;

      // Get filter words
      const settings = await db.collection('settings').findOne({ type: 'general' });
      let filteredMessage = message;
      
      if (settings && settings.filterWords) {
        settings.filterWords.forEach(word => {
          const regex = new RegExp(word, 'gi');
          filteredMessage = filteredMessage.replace(regex, '*'.repeat(word.length));
        });
      }

      const messageDoc = {
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

      const result = await db.collection('messages').insertOne(messageDoc);
      messageDoc._id = result.insertedId;

      io.to(faculty).emit('new-group-message', messageDoc);

      // Auto-delete after expiry
      if (settings && settings.groupMessageExpiry) {
        setTimeout(async () => {
          await db.collection('messages').deleteOne({ _id: result.insertedId });
          io.to(faculty).emit('message-deleted', result.insertedId.toString());
        }, settings.groupMessageExpiry * 60 * 60 * 1000);
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
    const messages = await db.collection('messages')
      .find({ 
        type: 'private',
        $or: [
          { userId, targetUserId },
          { userId: targetUserId, targetUserId: userId }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
    
    socket.emit('load-private-messages', messages.reverse());
  });

  socket.on('send-private-message', async (data) => {
    try {
      const { userId, targetUserId, message } = data;
      
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      const targetUser = await db.collection('users').findOne({ _id: new ObjectId(targetUserId) });
      
      if (!user || !targetUser) return;

      // Check if blocked
      if (targetUser.blockedUsers && targetUser.blockedUsers.includes(userId)) {
        return;
      }

      const messageDoc = {
        userId: user._id.toString(),
        userName: user.fullName,
        userProfilePicture: user.profilePicture,
        targetUserId: targetUser._id.toString(),
        message,
        type: 'private',
        createdAt: new Date()
      };

      const result = await db.collection('messages').insertOne(messageDoc);
      messageDoc._id = result.insertedId;

      const roomId = [userId, targetUserId].sort().join('-');
      io.to(roomId).emit('new-private-message', messageDoc);

      // Auto-delete after expiry
      const settings = await db.collection('settings').findOne({ type: 'general' });
      if (settings && settings.privateMessageExpiry) {
        setTimeout(async () => {
          await db.collection('messages').deleteOne({ _id: result.insertedId });
          io.to(roomId).emit('message-deleted', result.insertedId.toString());
        }, settings.privateMessageExpiry * 60 * 60 * 1000);
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
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
