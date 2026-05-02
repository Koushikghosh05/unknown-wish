# 🚀 Installation & Running Guide

## 🎯 TLDR - Super Quick Start

**Windows Users:**
1. Double-click `START.bat` in the project folder
2. Wait for installation and server start
3. Open browser: http://localhost:3000
4. Done! ✅

**Next time:**
- Double-click `RUN.bat` to just start server

---

## 📋 Prerequisites

### Must Have: Node.js
**Check if installed:**
```bash
node -v
npm -v
```

**If not installed:**
1. Visit: https://nodejs.org/
2. Download **LTS** version (Long Term Support)
3. Run installer with default settings
4. Restart terminal/computer

**Verify installation:**
```bash
node -v        # Should show: v18.x.x or higher
npm -v         # Should show: 9.x.x or higher
```

---

## ⚙️ Complete Setup Steps

### Step 1️⃣ - Navigate to Project
```bash
cd "e:\web Development\project\wish 2"
```

Or use Windows Explorer:
1. Open `e:\web Development\project\wish 2`
2. Hold Shift + Right-click in empty space
3. Select "Open PowerShell window here"

### Step 2️⃣ - Install Dependencies
```bash
npm install
```

**What it does:**
- Downloads Express and other packages
- Creates `node_modules` folder
- Installs all dependencies

**Time:** ~30-60 seconds

### Step 3️⃣ - Build Project (First Time Only)
```bash
npm run build
```

**What it does:**
- Compiles Vite project
- Creates `dist` folder with optimized files
- Bundles CSS and JavaScript

**Output:** Should see ✓ symbol and "built in XXms"

### Step 4️⃣ - Start Server
```bash
npm run server
```

**What it does:**
- Starts Express server on port 3000
- Serves files from `dist` folder
- Listens for requests

**Expected output:**
```
🎉 Server running at http://localhost:3000
📝 Reply page: http://localhost:3000/reply.html
👑 Admin panel: http://localhost:3000/admin.html
```

### Step 5️⃣ - Open in Browser
Click or type in address bar:
```
http://localhost:3000
```

**You should see:**
- Beautiful birthday website
- Balloon animation
- Background music playing

---

## 🔄 Subsequent Starts (After First Setup)

### Option A: Use Batch File (Easiest)
```bash
Double-click: RUN.bat
```

### Option B: Use Terminal
```bash
npm run server
```

### Option C: Rebuild + Start
If you made code changes:
```bash
npm start     # Builds and starts server
```

---

## 🌐 Access URLs

Once server is running, open these in browser:

| Purpose | URL |
|---------|-----|
| **Main Birthday Website** | http://localhost:3000 |
| **Send a Reply** | http://localhost:3000/reply.html |
| **View Replies (Admin)** | http://localhost:3000/admin.html |

---

## ✅ Verify Everything Works

### 1. Check Main Website
```
✅ See balloon animation
✅ Hear countdown sound
✅ See solar system
✅ See age counter
✅ See shooting star
✅ See cloud button appears
```

### 2. Test Reply Page
```
✅ Open /reply.html
✅ See floating hearts
✅ Fill in name and message
✅ Click "Send My Reply"
✅ See thank you message
✅ Message appears in admin panel
```

### 3. Check Admin Panel
```
✅ Open /admin.html
✅ See your submitted message in a card
✅ Shows name, message, date, time
✅ Message count increased by 1
✅ Auto-refreshes every 10 seconds
```

---

## 🎨 File Management

### Created/Modified Files

| File | Status | Purpose |
|------|--------|---------|
| server.js | Created | Backend server |
| reply.html | Updated | Reply form |
| admin.html | Created | Message viewer |
| index.html | Updated | Link fix |
| replies.json | Created | Message storage |
| package.json | Updated | Dependencies |
| START.bat | Created | Quick setup |
| RUN.bat | Created | Quick start |
| README.md | Created | Documentation |

### Folders

| Folder | Purpose |
|--------|---------|
| `/dist` | Built files (served to browser) |
| `/public` | Audio files (copied to dist) |
| `/node_modules` | Downloaded packages |

---

## 🛠️ Customization Before Running

### Change Birthday Date
1. Open `index.html` in text editor
2. Find: `const BIRTHDAY = new Date(2006, 4, 12, 0, 0, 0, 0);`
3. Change the numbers:
   - First: Year (2006)
   - Second: Month - 1 (4 = May)
   - Third: Day (12)
   - Rest: hours, minutes, seconds

### Change Name
1. Open `index.html` in text editor
2. Find: `✦ Happy Birthday Dear Bristi ✦`
3. Replace "Bristi" with name
4. Save and rebuild: `npm run build`

### Change Colors
1. Open `reply.html` in text editor
2. Find `<style>` section
3. Find hex colors like `#ff69b4`
4. Replace with desired color
5. Save and rebuild: `npm run build`

---

## 🐛 Troubleshooting

### ❌ "npm is not recognized"
**Problem:** Node.js not installed or not in PATH
**Solution:**
1. Install Node.js from nodejs.org
2. Restart terminal
3. Restart computer if still not working

### ❌ "Cannot find module 'express'"
**Problem:** Dependencies not installed
**Solution:**
```bash
npm install
```

### ❌ "Port 3000 already in use"
**Problem:** Another app using port 3000
**Solution:**
1. Option A: Stop other app using port 3000
2. Option B: Change port in server.js:
   ```javascript
   const PORT = 8000;  // Change 3000 to 8000
   ```
3. Then access: http://localhost:8000

### ❌ "Cannot find replies.json"
**Problem:** File not created
**Solution:**
```bash
# Create empty file
echo [] > replies.json
```

### ❌ "Audio not playing"
**Problem:** Browser blocks autoplay
**Solution:**
- Click anywhere on page first
- Or adjust browser autoplay settings

### ❌ "Replies not saving"
**Problem:** Backend error
**Solution:**
1. Check server terminal for errors
2. Check browser console (F12)
3. Verify replies.json exists
4. Check file permissions

### ❌ "Website won't load"
**Problem:** Server not running
**Solution:**
1. Check terminal shows "Server running at http://localhost:3000"
2. Make sure you didn't close terminal
3. Try restarting: Ctrl+C then `npm run server`

---

## 📦 What Gets Installed (npm install)

When you run `npm install`, it downloads:

| Package | Purpose |
|---------|---------|
| express | HTTP server framework |
| vite | Build tool (already was) |

**Total size:** ~100MB (includes dependencies)

---

## 🚀 First-Time Complete Walkthrough

### Step-by-step with expected outputs:

```bash
# 1. Navigate to project
cd "e:\web Development\project\wish 2"
# Output: Should change folder

# 2. Install dependencies
npm install
# Output: "added 69 packages in 5s"

# 3. Build project
npm run build
# Output: "✓ built in 240ms"

# 4. Start server
npm run server
# Output: 
#   🎉 Server running at http://localhost:3000
#   📝 Reply page: http://localhost:3000/reply.html
#   👑 Admin panel: http://localhost:3000/admin.html

# 5. Open browser
# Type: http://localhost:3000
# You should see the birthday website!
```

---

## 🎯 Tips & Tricks

### Keep terminal window visible
- Don't minimize or close terminal while server running
- Server will stop if terminal closes

### View terminal logs
- All server messages appear in terminal
- Useful for debugging

### Test different pages quickly
1. Main: http://localhost:3000
2. Reply: http://localhost:3000/reply.html (same window, type in address bar)
3. Admin: http://localhost:3000/admin.html (same window, type in address bar)

### Clear messages (optional)
- Edit `replies.json` and replace `[]` with `[]`
- Or delete and create new empty file

### Make a backup
- Copy `replies.json` to `replies_backup.json`
- Easy restore if needed

---

## 📝 Command Reference

### Common Commands

```bash
# Install dependencies (first time)
npm install

# Build project (first time & after changes)
npm run build

# Start server only
npm run server

# Build + Start (all in one)
npm start

# View all scripts in package.json
npm run
```

### View Files

```bash
# List all files in current folder
dir                    # (Windows)
ls -la                 # (Mac/Linux)

# Go to project folder
cd "e:\web Development\project\wish 2"

# Go back one level
cd ..
```

---

## 🎉 Success Checklist

- [ ] Node.js installed (`node -v` works)
- [ ] In correct folder (`wish 2`)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Project built (`npm run build` shows ✓)
- [ ] Server running (`npm run server` shows 🎉)
- [ ] Can access http://localhost:3000
- [ ] See birthday website with animations
- [ ] Audio plays (or click first)
- [ ] Submit a test message
- [ ] See message in admin panel

**If all checkmarks done, you're ready to go! 🚀**

---

## 🆘 Quick Help

| Issue | Quick Fix |
|-------|-----------|
| Nothing happens | Close terminal, reopen, try again |
| Page blank | Wait 5 seconds, refresh browser (F5) |
| Audio not playing | Click anywhere on page first |
| Message not saving | Check replies.json exists |
| Port in use | Change PORT in server.js to 8000 |
| Terminal won't execute | Right-click→ "Run as Administrator" |

---

## 📞 Getting More Help

- **README.md** - Full documentation
- **QUICK_START.md** - Quick reference
- **ARCHITECTURE.md** - Technical details
- **Browser Console** - Press F12 to see errors
- **Server Terminal** - Check for error messages

---

## ✨ You're All Set!

Everything is configured and ready to use.

**Just run:**
```bash
npm start
```

**Then open:**
```
http://localhost:3000
```

**That's it! Enjoy the beautiful birthday website! 🎉💖**
