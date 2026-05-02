import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('dist'));

// Path to replies file (for local/development)
const repliesFile = path.join(__dirname, 'replies.json');

// Check if running on Vercel
const isVercel = !!process.env.VERCEL;
let kv = null;

// In-memory fallback storage
let memoryStorage = [];

// Initialize Vercel KV if available
if (isVercel) {
  try {
    const { kv: vercelKv } = await import('@vercel/kv');
    kv = vercelKv;
  } catch (err) {
    console.warn('⚠️  Vercel KV not available. Using in-memory storage.');
  }
}

// Ensure replies.json exists (local development only)
function ensureRepliesFile() {
  if (!isVercel && !fs.existsSync(repliesFile)) {
    fs.writeFileSync(repliesFile, JSON.stringify([], null, 2));
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

    if (isVercel) {
      // Try KV first
      if (kv) {
        try {
          let replies = [];
          const data = await kv.get('replies');
          if (data) {
            replies = typeof data === 'string' ? JSON.parse(data) : data;
          }
          
          replies.push(newReply);
          await kv.set('replies', JSON.stringify(replies));
          
          return res.status(200).json({ 
            success: true, 
            message: 'Reply submitted successfully!',
            reply: newReply 
          });
        } catch (kvError) {
          console.error('KV Error:', kvError);
          // Fall back to memory storage
          console.log('Falling back to memory storage');
        }
      }
      
      // Fallback: use in-memory storage
      memoryStorage.push(newReply);
      res.status(200).json({ 
        success: true, 
        message: 'Reply submitted successfully! (cached)',
        reply: newReply 
      });
    } else {
      // Local development: use file storage
      ensureRepliesFile();
      const data = fs.readFileSync(repliesFile, 'utf8');
      const replies = JSON.parse(data);
      replies.push(newReply);
      fs.writeFileSync(repliesFile, JSON.stringify(replies, null, 2));

      res.status(200).json({ 
        success: true, 
        message: 'Reply submitted successfully!',
        reply: newReply 
      });
    }
  } catch (error) {
    console.error('Error saving reply:', error);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});

// GET: Retrieve all replies
app.get('/get-replies', async (req, res) => {
  try {
    let replies = [];

    if (isVercel) {
      // Try KV first
      if (kv) {
        try {
          const data = await kv.get('replies');
          if (data) {
            replies = typeof data === 'string' ? JSON.parse(data) : data;
          }
        } catch (kvError) {
          console.error('KV Error:', kvError);
          // Fall back to memory storage
          replies = memoryStorage;
        }
      } else {
        // Use in-memory storage as fallback
        replies = memoryStorage;
      }
    } else {
      // Get from local file
      ensureRepliesFile();
      const data = fs.readFileSync(repliesFile, 'utf8');
      replies = JSON.parse(data);
    }

    // Sort by most recent first
    replies.sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json({ replies });
  } catch (error) {
    console.error('Error reading replies:', error);
    res.status(500).json({ error: 'Failed to read replies', replies: [] });
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
app.listen(PORT, () => {
  console.log(`🎉 Server running at http://localhost:${PORT}`);
  console.log(`📝 Reply page: http://localhost:${PORT}/reply.html`);
  console.log(`👑 Admin panel: http://localhost:${PORT}/admin.html`);
});
