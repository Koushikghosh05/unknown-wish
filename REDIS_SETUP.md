# Redis Setup Guide - Message Persistence Fix

## Problem That Was Fixed
Messages were disappearing from admin.html after some time because:
- Previous implementation used Vercel KV (deprecated) with fallback file storage
- Vercel's temporary file storage (`/tmp`) gets cleared periodically
- No persistent backup mechanism

## Solution Implemented
✅ **True Redis Database Integration** with automatic file backup

### Key Features
1. **Primary Storage**: Redis (persistent, no expiration)
2. **Backup Storage**: Local JSON file (automatic sync)
3. **Graceful Fallback**: Works without Redis using file storage
4. **Auto-Sync**: Every 5 minutes to both storages
5. **Manual Sync**: Button in admin panel to force sync anytime
6. **Status Checking**: Monitor Redis connection health

---

## Setup Instructions

### Option 1: Local Redis (Development)
```bash
# Install Redis on Windows from: https://github.com/microsoftarchive/redis/releases
# Or use: choco install redis-64 (if you have Chocolatey)
# Then start Redis:
redis-server
```

Your `.env` already has: `REDIS_URL=redis://localhost:6379`

### Option 2: Cloud Redis (Production)

#### Using Upstash Redis (Free tier available)
1. Go to https://upstash.com
2. Create a Redis database
3. Copy the connection URL
4. Add to `.env`:
```
REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT
```

#### Using Redis Cloud
1. Go to https://redis.com/try-free
2. Create a database
3. Update `.env`:
```
REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT
```
(Note: `rediss://` for SSL connection)

---

## How It Works

### When Message is Submitted
1. Message is saved to Redis (permanent, no TTL)
2. Message is also saved to `replies.json` (backup)
3. Response confirms save with Redis status

### When Admin Loads Messages
1. Retrieves all messages from Redis
2. If Redis unavailable, gets from file
3. Syncs merged data back to both storages
4. Always displays ALL messages (never lost)

### Auto-Protection Features
- **Every 5 minutes**: Auto-sync all messages to both storages
- **Every 10 seconds**: Display refreshes to show latest messages
- **On error**: Falls back to file storage automatically
- **Manual override**: Click "💾 Sync to Redis" button anytime

---

## Testing the Fix

### Verify Redis Connection
Click **🔗 Redis Status** button in admin panel

Expected: ✅ Redis is connected and healthy!

### Test Message Persistence
1. Send a message from reply page
2. Go to admin panel - message appears
3. Click **💾 Sync to Redis** - ensures backup
4. Refresh page multiple times - message stays
5. Wait and refresh again - message STILL there

### Check Storage Health
Click **📊 Storage Status** button to see:
- Total messages in Redis
- Backup messages in file
- Last sync time

---

## Troubleshooting

### "Redis disconnected" Error
- Ensure Redis server is running
- Check REDIS_URL in `.env` is correct
- Messages will still work with file backup

### "0 messages after restart"
- Click **💾 Sync to Redis** button
- Messages from file will restore to Redis

### Messages still disappearing?
1. Click **🔗 Redis Status** - check connection
2. Click **📊 Storage Status** - verify data
3. Click **💾 Sync to Redis** - force restore
4. Check server logs for errors

---

## Server Endpoints (for debugging)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/get-replies` | GET | Get all messages |
| `/submit-reply` | POST | Add new message |
| `/admin-status` | GET | Check storage health |
| `/admin-sync` | POST | Manual sync to Redis |
| `/check-redis` | GET | Test Redis connection |

---

## What Changed

### Before (Broken)
- Vercel KV + temporary file
- Fallback only if primary failed
- No data merging
- Messages disappeared

### After (Fixed)
- True Redis + file backup
- Automatic sync between storages
- Merge data if needed
- Messages never disappear

---

## Environment Variables

```bash
# Required for production
REDIS_URL=redis://localhost:6379

# Other API keys (unchanged)
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash
GROQ_API_KEY=your_key_here
```

---

## Architecture

```
User Sends Message
    ↓
Server Receives
    ├→ Save to Redis (Primary) ✅
    ├→ Save to File (Backup) ✅
    └→ Return Confirmation

Admin Loads Page
    ↓
Get Data
    ├→ Query Redis
    ├→ Query File
    ├→ Merge if needed
    └→ Sync back to both ✅

Background (Every 5 min)
    ├→ Get all messages
    └→ Sync to Redis + File ✅
```

---

## Support

If messages are still disappearing:
1. Check Redis connection: `http://localhost:3000/check-redis`
2. Verify Redis URL in `.env` file
3. Check server console for error messages
4. Ensure Redis server is running (if local)
5. Try manual sync via admin panel button

**All previous messages should now persist permanently in Redis!**
