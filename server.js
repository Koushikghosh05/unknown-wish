import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import redis from 'redis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('dist'));

// Path to replies file
const repliesFile = path.join(__dirname, 'replies.json');

// Check environment
const isVercel = !!process.env.VERCEL;
const redisUrl = process.env.REDIS_URL;

console.log(`\n🌍 Environment: ${isVercel ? 'Vercel' : 'Local'}`);
console.log(`📍 Redis URL: ${redisUrl ? '✅ Configured' : '❌ Not set'}`);

// Redis client setup - works with Vercel Upstash Redis
const redisClient = redis.createClient({
  url: redisUrl || 'redis://localhost:6379',
  socket: {
    tls: redisUrl && redisUrl.startsWith('rediss') ? true : false, // TLS for Upstash
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('⚠️  Max Redis reconnection attempts reached');
        return false;
      }
      console.log(`🔄 Redis reconnection attempt ${retries + 1}/10`);
      return Math.min(retries * 100, 3000);
    }
  }
});

let redisConnected = false;

// Connect to Redis
redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err.message);
  redisConnected = false;
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
  redisConnected = true;
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis attempting to reconnect...');
});

// Connect to Redis
await redisClient.connect().catch(err => {
  console.error('❌ Could not connect to Redis:', err.message);
  console.log('📁 Using file storage as fallback');
  console.log(`💡 REDIS_URL env variable: ${redisUrl || 'NOT SET'}`);
  redisConnected = false;
});

// Ensure replies file exists
function ensureRepliesFile() {
  if (!fs.existsSync(repliesFile)) {
    fs.writeFileSync(repliesFile, JSON.stringify([], null, 2));
  }
}

// Get all replies from Redis or file
async function getAllReplies() {
  let replies = [];

  // Try Redis first
  if (redisConnected) {
    try {
      const data = await redisClient.get('replies');
      if (data) {
        replies = JSON.parse(data);
        console.log(`✅ Retrieved ${replies.length} messages from Redis`);
        return replies;
      }
    } catch (err) {
      console.error('⚠️  Redis read error:', err);
    }
  }

  // Fallback to file storage
  try {
    ensureRepliesFile();
    const data = fs.readFileSync(repliesFile, 'utf8');
    replies = JSON.parse(data);
    console.log(`📁 Retrieved ${replies.length} messages from file storage`);
    
    // Sync file data to Redis if connected
    if (redisConnected && replies.length > 0) {
      try {
        await redisClient.set('replies', JSON.stringify(replies));
        console.log('🔄 Synced file data to Redis');
      } catch (err) {
        console.warn('⚠️  Could not sync to Redis:', err.message);
      }
    }
    
    return replies;
  } catch (err) {
    console.error('⚠️  File read error:', err);
    return [];
  }
}

// Save replies to both Redis and file
async function saveReplies(replies) {
  // Save to file
  try {
    ensureRepliesFile();
    fs.writeFileSync(repliesFile, JSON.stringify(replies, null, 2));
    console.log(`📁 Saved ${replies.length} messages to file`);
  } catch (err) {
    console.error('❌ File save error:', err);
  }

  // Save to Redis (no expiration - persistent!)
  if (redisConnected) {
    try {
      await redisClient.set('replies', JSON.stringify(replies));
      console.log(`✅ Saved ${replies.length} messages to Redis (persistent, no expiration)`);
    } catch (err) {
      console.error('❌ Redis save error:', err);
    }
  }
}

// POST: Submit a reply
app.post('/submit-reply', async (req, res) => {
  try {
    const { name, message } = req.body;
    
    if (!message || !name) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const newReply = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Get all existing replies
    const replies = await getAllReplies();
    replies.push(newReply);

    // Save to both Redis and file
    await saveReplies(replies);

    res.status(200).json({ 
      success: true, 
      message: 'Reply submitted successfully!',
      reply: newReply,
      totalReplies: replies.length,
      redisConnected: redisConnected
    });

  } catch (error) {
    console.error('❌ Error saving reply:', error);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});

// GET: Retrieve all replies
app.get('/get-replies', async (req, res) => {
  try {
    const replies = await getAllReplies();
    
    // Sort by most recent first
    replies.sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json({ 
      replies,
      redisConnected: redisConnected,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error reading replies:', error);
    res.status(500).json({ 
      error: 'Failed to read replies', 
      replies: [],
      redisConnected: redisConnected
    });
  }
});

// GET: Admin status
app.get('/admin-status', async (req, res) => {
  try {
    const replies = await getAllReplies();
    
    res.status(200).json({
      totalMessages: replies.length,
      redisConnected: redisConnected,
      storageType: redisConnected ? 'Redis (Primary) + File (Backup)' : 'File Only',
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// POST: Force sync messages to both storages
app.post('/admin-sync', async (req, res) => {
  try {
    const replies = await getAllReplies();
    await saveReplies(replies);
    
    res.status(200).json({
      success: true,
      message: `Synced ${replies.length} messages to Redis and file storage`,
      totalMessages: replies.length,
      redisConnected: redisConnected
    });
  } catch (error) {
    console.error('❌ Sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// GET: Verify Redis connection
app.get('/check-redis', async (req, res) => {
  if (!redisConnected) {
    return res.status(503).json({ 
      connected: false, 
      message: 'Redis not connected. Using file storage as fallback.',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379 (default)'
    });
  }

  try {
    await redisClient.ping();
    res.status(200).json({ 
      connected: true, 
      message: 'Redis is healthy!',
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379 (default)'
    });
  } catch (err) {
    res.status(503).json({ 
      connected: false, 
      error: err.message 
    });
  }
});

// Serve reply.html
app.get('/reply.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'reply.html'));
});

// Serve admin.html
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'admin.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🎉 Server running at http://localhost:${PORT}`);
  console.log(`📝 Reply page: http://localhost:${PORT}/reply.html`);
  console.log(`👑 Admin panel: http://localhost:${PORT}/admin.html`);
  console.log(`🔍 Check Redis: http://localhost:${PORT}/check-redis\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  
  // Close server
  server.close(() => {
    console.log('✅ Server closed');
  });

  // Disconnect Redis
  if (redisConnected) {
    try {
      await redisClient.quit();
      console.log('✅ Redis disconnected');
    } catch (err) {
      console.error('⚠️  Error disconnecting Redis:', err);
      await redisClient.disconnect();
    }
  }

  process.exit(0);
});
