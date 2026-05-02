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

// Ensure replies.json exists
function ensureRepliesFile() {
  if (!fs.existsSync(repliesFile)) {
    fs.writeFileSync(repliesFile, JSON.stringify([], null, 2));
  }
}

// POST: Submit a reply
app.post('/submit-reply', (req, res) => {
  try {
    ensureRepliesFile();
    
    const { name, message } = req.body;
    
    if (!message || !name) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    // Read existing replies
    const data = fs.readFileSync(repliesFile, 'utf8');
    const replies = JSON.parse(data);

    // Create new reply object
    const newReply = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
      timestamp: Date.now()
    };

    // Add to array
    replies.push(newReply);

    // Save back to file
    fs.writeFileSync(repliesFile, JSON.stringify(replies, null, 2));

    res.status(200).json({ 
      success: true, 
      message: 'Reply submitted successfully!',
      reply: newReply 
    });
  } catch (error) {
    console.error('Error saving reply:', error);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});

// GET: Retrieve all replies
app.get('/get-replies', (req, res) => {
  try {
    ensureRepliesFile();
    
    const data = fs.readFileSync(repliesFile, 'utf8');
    const replies = JSON.parse(data);

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
