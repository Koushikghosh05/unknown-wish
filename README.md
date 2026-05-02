# 🎉 Bristi's Birthday Wishing Site - Complete Setup Guide

A romantic, interactive birthday website with a reply/messaging system built with HTML, CSS, JavaScript, and Node.js.

## 📋 Features

### 🎈 Main Website (index.html)
- Beautiful balloon pop animation (Stage 1)
- Cosmic solar system with orbiting planets (Stage 2)
- Interactive planet tooltips with birthday wishes
- Shooting star animation from "Mr. Unknown" to Bristi
- Real-time age counter (years, months, days, hours, minutes, seconds)
- Romantic floral decorations
- Background music and sound effects

### 💌 Reply Page (reply.html)
- Beautiful romantic form with pink/red gradient background
- Floating heart animations
- Input fields for name and message
- Real-time form validation
- Sparkle effects on submission
- Thank-you message after successful submission
- Stores all replies in replies.json

### 👑 Admin Panel (admin.html)
- View all submitted replies in beautiful card layout
- Real-time message display
- Auto-refresh every 10 seconds
- Shows reply count and last update time
- Modern gradient design
- No password protection (view-only)

### 🔧 Backend (server.js)
- Express.js HTTP server
- Two API endpoints:
  - `POST /submit-reply` - Save new reply to replies.json
  - `GET /get-replies` - Retrieve all stored replies
- Automatic file handling

## 🚀 Quick Start Guide

### Step 1: Install Node.js
Download and install from: https://nodejs.org/
- Choose the **LTS (Long Term Support)** version
- Install with default settings

### Step 2: Open Project in Terminal
```bash
# Navigate to project folder
cd "e:\web Development\project\wish 2"
```

### Step 3: Install Dependencies
```bash
npm install
```
This installs Express and other required packages.

### Step 4: Build the Frontend
```bash
npm run build
```
This builds the Vite project and prepares static files.

### Step 5: Start the Server
```bash
npm start
```

Or separately:
```bash
npm run build    # First build
npm run server   # Then run server
```

### Step 6: Access in Browser
Once server is running, open your browser and go to:

- **Main Site**: http://localhost:3000
- **Reply Page**: http://localhost:3000/reply.html
- **Admin Panel**: http://localhost:3000/admin.html

## 📁 Project Structure

```
wish 2/
├── index.html              # Main birthday website
├── reply.html              # Reply/message form page
├── admin.html              # Admin panel to view replies
├── server.js               # Express.js backend
├── replies.json            # Stored replies (auto-created)
├── package.json            # Project dependencies
├── vite.config.js          # Vite build config
├── public/
│   ├── countdown.mp3       # Pop animation audio
│   └── birthday_song.mp3   # Background music
└── dist/
    ├── index.html          # Built main website
    ├── reply.html          # Built reply page
    ├── admin.html          # Built admin panel
    └── [other assets]
```

## 🎯 How to Use

### For Bristi (The Birthday Girl)
1. Open http://localhost:3000
2. Watch the animations (balloon pop, cosmic scene, shooting star)
3. Click the cloud button to send a reply
4. Fill in your name and message
5. Click "Send My Reply"
6. See the beautiful thank-you message!

### For Admin
1. Open http://localhost:3000/admin.html
2. View all submitted replies
3. Click "Refresh" button to manually refresh
4. Auto-refreshes every 10 seconds

## 💾 Data Storage

All replies are stored in **replies.json** file in this format:
```json
[
  {
    "id": 1714592345000,
    "name": "Sender Name",
    "message": "Your heartfelt message here...",
    "date": "2026-05-01T15:39:05.000Z",
    "timestamp": 1714592345000
  }
]
```

## 🎨 Customization

### Change Birthday Date
Edit `index.html`, find this line:
```javascript
const BIRTHDAY = new Date(2006, 4, 12, 0, 0, 0, 0);
```
Change the numbers: `(year, month-1, day, hours, mins, secs, ms)`
- Month is 0-indexed: 0=Jan, 1=Feb, ... 4=May

### Change Header Text
In `index.html`, find:
```html
<div id="header-text">✦ Happy Birthday Dear Bristi ✦</div>
```
Replace "Bristi" with the desired name.

### Modify Colors
In `reply.html` or `admin.html`, find the `<style>` section and change color values like:
- `#ff69b4` (hot pink)
- `#d946a6` (magenta)
- `#667eea` (purple)

## 🔧 Troubleshooting

### Server won't start
- Make sure Node.js is installed: `node -v`
- Make sure you're in the correct folder
- Try deleting `node_modules` and run `npm install` again

### Port 3000 already in use
- The port is already used by another application
- Stop the other application or use a different port:
  - Edit `server.js` line: `const PORT = 3000;`
  - Change `3000` to another number like `8000` or `5000`

### Audio not playing
- Audio files must be in the `/public` folder
- Run `npm run build` to rebuild
- Check browser console for errors (F12)

### Replies not saving
- Check if `replies.json` file exists in project root
- Check file permissions
- Look at browser console and server terminal for errors

## 📝 API Reference

### Submit Reply
```
POST /submit-reply
Content-Type: application/json

Request Body:
{
  "name": "Your Name",
  "message": "Your message here"
}

Response (Success):
{
  "success": true,
  "message": "Reply submitted successfully!",
  "reply": { ... }
}

Response (Error):
{
  "error": "Name and message are required"
}
```

### Get Replies
```
GET /get-replies

Response:
{
  "replies": [
    {
      "id": 1714592345000,
      "name": "Sender Name",
      "message": "Message text",
      "date": "2026-05-01T15:39:05.000Z",
      "timestamp": 1714592345000
    }
  ]
}
```

## 🎬 Animation Timeline

### Main Website (index.html)
1. **Stage 1**: Balloon pop with countdown audio (5 seconds)
2. **Stage 2**: Transition to space scene with music (8+ seconds)
3. **Planets orbit** at different speeds
4. **Shooting star launches** when Bristi planet is 12 seconds away from lower-right
5. **Cloud button appears** when shooting star reaches Bristi

### Reply Page (reply.html)
- Floating hearts in background
- Form slides in from top
- Sparkles on successful submission
- Thank-you message slides in

### Admin Panel (admin.html)
- Cards slide in with staggered timing
- Auto-refresh every 10 seconds
- Smooth hover effects

## 🚀 Deployment

### To run in production:
1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Keep terminal running or use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js
   ```

### To run 24/7:
- Use a cloud service like:
  - Heroku
  - Railway.app
  - Render.com
  - AWS EC2

## 💡 Tips

- Keep the terminal open while developing
- Auto-rebuild with: `npm run dev` (for development)
- To view source of any page, right-click → "View Page Source"
- Replies are backed up in `replies.json` file
- You can manually edit `replies.json` to add/remove replies

## 📞 Support

If something doesn't work:
1. Check the browser console (F12)
2. Check the terminal/server logs
3. Verify all files are in the correct folders
4. Try restarting the server
5. Make sure Node.js is installed correctly

## 🎉 Enjoy!

This is a personalized gift for Bristi's 19th birthday. Share the main site with her and use the admin panel to collect beautiful messages from friends and family!

**Created with 💖 - May 2026**
