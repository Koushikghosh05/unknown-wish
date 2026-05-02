# ⚡ Quick Reference - Run Instructions

## Easiest Way - Use Batch Files (Windows)

### First Time Setup
1. Double-click: **START.bat**
   - Installs dependencies
   - Builds the project
   - Starts the server
2. Open browser: http://localhost:3000

### Subsequent Times
1. Double-click: **RUN.bat**
   - Starts the server immediately

---

## Manual Commands (Terminal/PowerShell)

### First Time Only (Install Dependencies)
```bash
cd "e:\web Development\project\wish 2"
npm install
```

### Build Project (After any code changes)
```bash
npm run build
```

### Start Server
```bash
npm run server
```

### Combined (Build + Start)
```bash
npm start
```

---

## 🌐 Access URLs

Once server is running:

| Page | URL |
|------|-----|
| **Main Website** | http://localhost:3000 |
| **Reply Form** | http://localhost:3000/reply.html |
| **Admin Panel** | http://localhost:3000/admin.html |

---

## 📂 File Locations

| File | Purpose |
|------|---------|
| `server.js` | Node.js/Express backend |
| `index.html` | Main birthday website |
| `reply.html` | Reply/message form |
| `admin.html` | View all replies |
| `replies.json` | Stored replies (auto-created) |
| `package.json` | Project dependencies |

---

## 🎯 What Each Page Does

### 🎈 Main Website (index.html)
- Balloon pop animation
- Cosmic solar system
- Age counter
- Beautiful animations
- Click cloud button → Go to reply page

### 💌 Reply Page (reply.html)
- Form to submit messages
- Name + Message fields
- Shows thank-you after submit
- Saves to replies.json

### 👑 Admin Panel (admin.html)
- View all submitted replies
- Auto-refreshes every 10 seconds
- Shows reply count
- Beautiful card layout

---

## ✅ Complete Setup Checklist

- [ ] Node.js installed (check: `node -v`)
- [ ] Project folder opened in terminal
- [ ] Dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] Server started (`npm run server` or double-click RUN.bat)
- [ ] Browser opened to http://localhost:3000
- [ ] Seen the balloon pop animation ✅
- [ ] Visited reply page
- [ ] Submitted a test message
- [ ] Viewed in admin panel

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| "npm is not recognized" | Install Node.js from nodejs.org |
| "Port 3000 already in use" | Edit server.js, change PORT to 8000 |
| "Cannot find module 'express'" | Run `npm install` |
| "Audio not playing" | Check browser console, verify audio files in /public |
| "Replies not saving" | Check file permissions, check replies.json exists |

---

## 🎨 Customize

### Change Birthday Date
Edit `index.html`, find:
```javascript
const BIRTHDAY = new Date(2006, 4, 12, 0, 0, 0, 0);
```

### Change Name
Edit `index.html`, find:
```html
<div id="header-text">✦ Happy Birthday Dear Bristi ✦</div>
```

### Change Colors
Edit `reply.html` or `admin.html`, find hex colors and change:
- `#ff69b4` (pink)
- `#667eea` (purple)
- `#d946a6` (magenta)

---

## 📊 API Endpoints

### POST /submit-reply
Submit a new message
```json
{
  "name": "Your Name",
  "message": "Your message here"
}
```

### GET /get-replies
Get all stored messages
Returns array of reply objects with timestamps

---

## 💾 Data Backup

All replies are stored in **replies.json**
- Can be backed up manually
- Can be edited manually
- Is persistent across restarts

---

## 🎉 You're All Set!

1. Run **START.bat** OR use commands above
2. Open http://localhost:3000
3. Enjoy the animations!
4. Share the link with friends
5. View messages in admin panel

**Questions?** See README.md for complete documentation.
