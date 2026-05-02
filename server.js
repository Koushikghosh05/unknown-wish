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

// Path to replies file
const repliesFile = path.join(__dirname, 'replies.json');
const tmpRepliesFile = '/tmp/replies.json';

// Check if running on Vercel
const isVercel = !!process.env.VERCEL;
let kv = null;

// Initialize Vercel KV if available
if (isVercel) {
  try {
    const { kv: vercelKv } = await import('@vercel/kv');
    kv = vercelKv;
    console.log('✅ Vercel KV connected');
  } catch (err) {
    console.warn('⚠️  Vercel KV not available. Using temporary file storage.');
  }
}

// Get the appropriate replies file path
function getRepliesFilePath() {
  if (isVercel) {
    return tmpRepliesFile;
  }
  return repliesFile;
}

// Ensure replies file exists
function ensureRepliesFile() {
  const filePath = getRepliesFilePath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
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

    if (isVercel && kv) {
      // Use Vercel KV if available
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
        // Fall through to file storage
      }
    }
    
    // Use file storage (local or Vercel /tmp)
    try {
      ensureRepliesFile();
      const filePath = getRepliesFilePath();
      const data = fs.readFileSync(filePath, 'utf8');
      const replies = JSON.parse(data);
      replies.push(newReply);
      fs.writeFileSync(filePath, JSON.stringify(replies, null, 2));

      res.status(200).json({ 
        success: true, 
        message: 'Reply submitted successfully!',
        reply: newReply 
      });
    } catch (fileError) {
      console.error('File storage error:', fileError);
      res.status(500).json({ error: 'Failed to save reply' });
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

    if (isVercel && kv) {
      // Try Vercel KV first
      try {
        const data = await kv.get('replies');
        if (data) {
          replies = typeof data === 'string' ? JSON.parse(data) : data;
        }
      } catch (kvError) {
        console.error('KV Error:', kvError);
        // Fall through to file storage
      }
    }

    // If no KV data or KV failed, try file storage
    if (replies.length === 0) {
      try {
        ensureRepliesFile();
        const filePath = getRepliesFilePath();
        const data = fs.readFileSync(filePath, 'utf8');
        replies = JSON.parse(data);
      } catch (fileError) {
        console.error('File storage error:', fileError);
      }
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
