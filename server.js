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

    let replies = [];
    let kvReplies = [];
    let fileReplies = [];

    // Get existing replies from both sources
    if (isVercel && kv) {
      try {
        const data = await kv.get('replies');
        if (data) {
          kvReplies = typeof data === 'string' ? JSON.parse(data) : data;
        }
      } catch (kvError) {
        console.error('⚠️  KV read error:', kvError);
      }
    }

    try {
      ensureRepliesFile();
      const filePath = getRepliesFilePath();
      const data = fs.readFileSync(filePath, 'utf8');
      fileReplies = JSON.parse(data);
    } catch (fileError) {
      console.error('⚠️  File read error:', fileError);
    }

    // Merge from both sources
    const mergedMap = new Map();
    [...kvReplies, ...fileReplies].forEach(reply => {
      if (!mergedMap.has(reply.id)) {
        mergedMap.set(reply.id, reply);
      }
    });
    replies = Array.from(mergedMap.values());
    
    // Add new reply
    replies.push(newReply);

    // Save to file storage
    try {
      const filePath = getRepliesFilePath();
      fs.writeFileSync(filePath, JSON.stringify(replies, null, 2));
      console.log(`✅ Reply saved to file storage (total: ${replies.length})`);
    } catch (fileError) {
      console.error('⚠️  File save error:', fileError);
    }

    // Save to KV storage
    if (isVercel && kv) {
      try {
        await kv.set('replies', JSON.stringify(replies));
        console.log(`✅ Reply synced to Vercel KV (total: ${replies.length})`);
      } catch (kvError) {
        console.error('⚠️  KV save error:', kvError);
      }
    }

    res.status(200).json({ 
      success: true, 
      message: 'Reply submitted successfully!',
      reply: newReply,
      totalReplies: replies.length
    });

  } catch (error) {
    console.error('Error saving reply:', error);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});

// GET: Retrieve all replies
app.get('/get-replies', async (req, res) => {
  try {
    let kvReplies = [];
    let fileReplies = [];

    // Get data from Vercel KV
    if (isVercel && kv) {
      try {
        const data = await kv.get('replies');
        if (data) {
          kvReplies = typeof data === 'string' ? JSON.parse(data) : data;
        }
        console.log(`✅ Retrieved ${kvReplies.length} messages from Vercel KV`);
      } catch (kvError) {
        console.error('⚠️  KV Error:', kvError);
      }
    }

    // Get data from file storage as backup
    try {
      ensureRepliesFile();
      const filePath = getRepliesFilePath();
      const data = fs.readFileSync(filePath, 'utf8');
      fileReplies = JSON.parse(data);
      console.log(`✅ Retrieved ${fileReplies.length} messages from file storage`);
    } catch (fileError) {
      console.error('⚠️  File storage error:', fileError);
    }

    // Merge replies from both sources and remove duplicates
    const mergedMap = new Map();
    
    [...kvReplies, ...fileReplies].forEach(reply => {
      if (!mergedMap.has(reply.id)) {
        mergedMap.set(reply.id, reply);
      }
    });

    let replies = Array.from(mergedMap.values());
    
    // If merged result has more data, sync it back to both storages
    if (replies.length > kvReplies.length || replies.length > fileReplies.length) {
      console.log(`🔄 Syncing ${replies.length} total messages to both storages`);
      
      // Sync to file
      try {
        const filePath = getRepliesFilePath();
        fs.writeFileSync(filePath, JSON.stringify(replies, null, 2));
      } catch (err) {
        console.error('⚠️  Failed to sync to file:', err);
      }
      
      // Sync to KV
      if (isVercel && kv) {
        try {
          await kv.set('replies', JSON.stringify(replies));
        } catch (err) {
          console.error('⚠️  Failed to sync to KV:', err);
        }
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

// GET: Admin status and sync report
app.get('/admin-status', async (req, res) => {
  try {
    let kvReplies = [];
    let fileReplies = [];

    if (isVercel && kv) {
      try {
        const data = await kv.get('replies');
        if (data) {
          kvReplies = typeof data === 'string' ? JSON.parse(data) : data;
        }
      } catch (err) {
        console.error('KV status check failed:', err);
      }
    }

    try {
      ensureRepliesFile();
      const filePath = getRepliesFilePath();
      const data = fs.readFileSync(filePath, 'utf8');
      fileReplies = JSON.parse(data);
    } catch (err) {
      console.error('File status check failed:', err);
    }

    const mergedMap = new Map();
    [...kvReplies, ...fileReplies].forEach(reply => {
      if (!mergedMap.has(reply.id)) {
        mergedMap.set(reply.id, reply);
      }
    });
    const totalUnique = mergedMap.size;

    res.status(200).json({
      kvMessages: kvReplies.length,
      fileMessages: fileReplies.length,
      totalUnique: totalUnique,
      kvAvailable: !!kv,
      fileAvailable: fileReplies.length > 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// POST: Manually sync/restore all messages
app.post('/admin-sync', async (req, res) => {
  try {
    let kvReplies = [];
    let fileReplies = [];

    // Get from KV
    if (isVercel && kv) {
      try {
        const data = await kv.get('replies');
        if (data) {
          kvReplies = typeof data === 'string' ? JSON.parse(data) : data;
        }
      } catch (err) {
        console.error('KV sync error:', err);
      }
    }

    // Get from file
    try {
      ensureRepliesFile();
      const filePath = getRepliesFilePath();
      const data = fs.readFileSync(filePath, 'utf8');
      fileReplies = JSON.parse(data);
    } catch (err) {
      console.error('File sync error:', err);
    }

    // Merge
    const mergedMap = new Map();
    [...kvReplies, ...fileReplies].forEach(reply => {
      if (!mergedMap.has(reply.id)) {
        mergedMap.set(reply.id, reply);
      }
    });
    const mergedReplies = Array.from(mergedMap.values())
      .sort((a, b) => b.timestamp - a.timestamp);

    // Sync merged data to file
    try {
      const filePath = getRepliesFilePath();
      fs.writeFileSync(filePath, JSON.stringify(mergedReplies, null, 2));
      console.log(`✅ Synced ${mergedReplies.length} messages to file`);
    } catch (err) {
      console.error('File sync write error:', err);
    }

    // Sync to KV
    if (isVercel && kv) {
      try {
        await kv.set('replies', JSON.stringify(mergedReplies));
        console.log(`✅ Synced ${mergedReplies.length} messages to KV`);
      } catch (err) {
        console.error('KV sync write error:', err);
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${mergedReplies.length} total messages`,
      kvCount: kvReplies.length,
      fileCount: fileReplies.length,
      mergedCount: mergedReplies.length
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
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
