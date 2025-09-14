const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for images/videos

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;
const JWT_SECRET = '';

// --- IN-MEMORY DATABASE ---
// In a real application, this would be a persistent database like MongoDB or PostgreSQL.
let users = {};
let posts = {};
let conversations = {};
let groupMessages = [];

// --- SEED DATA INITIALIZATION ---
const initializeData = () => {
    const alex = {
      id: 'alex',
      name: 'Alex Doe',
      email: 'alex@test.com',
      password: 'password', // In a real app, this would be hashed
      phone: '111-222-3333',
      avatarUrl: 'https://i.pravatar.cc/150?u=alex',
      bio: 'Lover of sunsets and technology.',
      friends: ['brian', 'casey'],
      notifications: [
        { id: 'n1', type: 'like', fromUserId: 'brian', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false, postId: 'post1' },
        { id: 'n2', type: 'friend_request', fromUserId: 'diana', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
      ],
      stories: [
        { id: 's1', imageUrl: 'https://picsum.photos/seed/story1/1080/1920', timestamp: new Date().toISOString() },
        { id: 's2', imageUrl: 'https://picsum.photos/seed/story2/1080/1920', timestamp: new Date().toISOString() },
      ]
    };

    const brian = {
      id: 'brian',
      name: 'Brian Smith',
      email: 'brian@test.com',
      password: 'password',
      phone: '444-555-6666',
      avatarUrl: 'https://i.pravatar.cc/150?u=brian',
      friends: ['alex'],
      notifications: [],
      stories: []
    };

    const casey = {
      id: 'casey',
      name: 'Casey Jones',
      email: 'casey@test.com',
      password: 'password',
      phone: '777-888-9999',
      avatarUrl: 'https://i.pravatar.cc/150?u=casey',
      friends: ['alex'],
      notifications: [],
      stories: [
        { id: 's3', imageUrl: 'https://picsum.photos/seed/story3/1080/1920', timestamp: new Date().toISOString() }
      ]
    };
    
    const diana = { id: 'diana', name: 'Diana Prince', email: 'diana@test.com', password: 'password', phone: '123-123-1234', avatarUrl: 'https://i.pravatar.cc/150?u=diana', friends: [], notifications: [], stories: [] };
    const testuser = { id: 'testuser', name: 'Test User', email: 'test@user.com', password: 'password', phone: '000-000-0000', avatarUrl: 'https://i.pravatar.cc/150?u=testuser', friends: [], notifications: [], stories: [], };

    users = {
        [alex.id]: alex,
        [brian.id]: brian,
        [casey.id]: casey,
        [diana.id]: diana,
        [testuser.id]: testuser,
    };

    posts = {
        'post1': {
            id: 'post1',
            userId: 'alex',
            content: 'Just enjoying the beautiful sunset! #nofilter',
            imageUrl: 'https://picsum.photos/seed/picsum/600/400',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            likes: { count: 1, users: ['brian'] },
            comments: [
                { id: 'c1', userId: 'brian', text: 'Wow, amazing shot!', timestamp: new Date().toISOString() }
            ],
            shareCount: 2,
        },
        'post2': {
            id: 'post2',
            userId: 'brian',
            content: 'Check out this cool video I made!',
            videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            likes: { count: 0, users: [] },
            comments: [],
            shareCount: 1,
        },
        'post3': {
            id: 'post3',
            userId: 'casey',
            content: 'My new blog post is live! Link in bio.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            likes: { count: 2, users: ['alex', 'brian'] },
            comments: [],
        }
    };

    conversations = {
        'convo1': {
            id: 'convo1',
            participants: ['alex', 'brian'],
            messages: [
                { id: 'm1', senderId: 'brian', text: 'Hey, how are you?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), readBy: ['alex'] },
                { id: 'm2', senderId: 'alex', text: 'Doing great, thanks for asking! You?', timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(), readBy: [] },
            ]
        }
    };
    
    groupMessages = [
        { id: uuidv4(), user: getUserObject(brian.id), text: 'Hey everyone, welcome to the global chat!', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
        { id: uuidv4(), user: getUserObject(casey.id), text: 'This is cool!', timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString() }
    ];
};

initializeData();

// --- HELPER FUNCTIONS ---
function getUserObject(userId) {
    const user = users[userId];
    if (!user) return null;
    // Return a public-safe user object without sensitive info
    const { password, email, phone, ...userSafe } = user;
    return userSafe;
};

const enrichPost = (post) => ({
    ...post,
    user: getUserObject(post.userId),
    comments: post.comments.map(c => ({...c, user: getUserObject(c.userId)}))
});

const enrichNotification = (notification) => ({
    ...notification,
    fromUser: getUserObject(notification.fromUserId)
});

// --- AUTH MIDDLEWARE ---
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// --- API ENDPOINTS ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// AUTH
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = Object.values(users).find(u => u.email === email);
  if (user && user.password === password) {
    const userForToken = { id: user.id, name: user.name };
    const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '24h' });
    const userWithEnrichedNotifs = { ...user, notifications: user.notifications.map(enrichNotification) };
    res.json({ user: userWithEnrichedNotifs, token });
  } else {
    res.status(401).json({ message: 'Invalid credentials. Hint: alex@test.com / password' });
  }
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone, avatarUrl } = req.body;
    if (Object.values(users).some(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already in use.' });
    }
    const id = name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 100);
    const newUser = {
        id, name, email, password, phone,
        avatarUrl: avatarUrl || `https://i.pravatar.cc/150?u=${id}`,
        friends: [], notifications: [], stories: [], bio: '',
    };
    users[id] = newUser;
    const userForToken = { id: newUser.id, name: newUser.name };
    const token = jwt.sign(userForToken, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ user: newUser, token });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const user = users[userId];
    if (user) {
        const userWithEnrichedNotifs = { ...user, notifications: user.notifications.map(enrichNotification) };
        // Return the full user object, as the frontend App.tsx expects it
        res.json(userWithEnrichedNotifs);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// POSTS
app.get('/api/posts/feed', authMiddleware, (req, res) => {
    const feedPosts = Object.values(posts)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(enrichPost);
    res.json(feedPosts);
});

app.post('/api/posts', authMiddleware, (req, res) => {
    const { content, imageUrl, videoUrl } = req.body;
    const userId = req.user.id;
    
    if (!content && !imageUrl && !videoUrl) {
        return res.status(400).json({ message: 'Post cannot be empty.' });
    }

    const newPost = {
        id: `post-${uuidv4()}`,
        userId,
        content,
        imageUrl,
        videoUrl,
        timestamp: new Date().toISOString(),
        likes: { count: 0, users: [] },
        comments: [],
        shareCount: 0,
    };

    posts[newPost.id] = newPost;

    const enrichedNewPost = enrichPost(newPost);
    
    // Broadcast the new post to all connected clients
    io.emit('new_post', enrichedNewPost);
    
    res.status(201).json(enrichedNewPost);
});

app.get('/api/posts/explore', (req, res) => {
    const explorePosts = Object.values(posts)
        .filter(p => p.imageUrl || p.videoUrl)
        .sort(() => 0.5 - Math.random())
        .slice(0, 15)
        .map(enrichPost);
    res.json(explorePosts);
});

// GROUP CHAT
app.get('/api/chat/group', (req, res) => {
    res.json(groupMessages);
});

// --- SOCKET.IO REAL-TIME LOGIC ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  const userId = socket.handshake.query.userId;
  if(userId) {
      console.log(`User ${userId} is online.`);
      // Join a room for this user to send them direct notifications
      socket.join(userId);
      // Join the global group chat room
      socket.join('group-chat');
  }

  socket.on('send_group_message', (data) => {
      const { userId, text } = data;
      const user = users[userId];
      if (user) {
          const message = {
              id: uuidv4(),
              user: getUserObject(user.id),
              text,
              timestamp: new Date().toISOString()
          };
          groupMessages.push(message);
          // Broadcast to everyone in the group chat room
          io.to('group-chat').emit('new_group_message', message);
      }
  });

  socket.on('typing_status', ({ conversationId, userId, isTyping }) => {
    const convo = conversations[conversationId];
    if (convo) {
        const otherParticipantId = convo.participants.find(p => p !== userId);
        if(otherParticipantId) {
            // Emit only to the other user in the conversation
            io.to(otherParticipantId).emit('typing_status', { conversationId, userId, isTyping });
        }
    }
  });
  
  socket.on('messages_read', ({ conversationId, userId }) => {
    const convo = conversations[conversationId];
    if (convo) {
        convo.messages.forEach(msg => {
            if (!msg.readBy.includes(userId)) {
                msg.readBy.push(userId);
            }
        });
        const otherParticipantId = convo.participants.find(p => p !== userId);
        if(otherParticipantId) {
            io.to(otherParticipantId).emit('messages_read', { conversationId, readerId: userId });
        }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if(userId) {
        console.log(`User ${userId} is offline.`);
    }
  });
});


// --- SERVER START ---
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
