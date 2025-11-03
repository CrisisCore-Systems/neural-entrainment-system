# Session History & Analytics Feature

## Overview
The session history and analytics feature tracks neural entrainment sessions, calculates statistics, and provides insights into user progress over time.

## Architecture

### Components
- **SessionAnalytics.tsx** - Main analytics dashboard UI
  - Stats grid with key metrics (total sessions, completion rate, streaks)
  - Recent sessions list with detailed metrics
  - Export and clear history functionality

### Services
- **sessionHistoryService.ts** - localStorage-based persistence
  - `saveSession()` - Persists session records
  - `getStats()` - Calculates streaks, averages, totals
  - `getDailyStats()` - Aggregates sessions by date for charting
  - `calculateStreaks()` - Finds consecutive practice days

### Types
- **SessionRecord** - Individual session data (duration, metrics, completion status)
- **SessionStats** - Aggregated statistics (streaks, averages, totals)
- **DailyStats** - Day-level aggregations for charts

### Event System
- **eventBus.ts** - Cross-component communication
  - `SESSION_COMPLETED` - Fired when session finishes successfully
  - `SESSION_STOPPED` - Fired when session terminates early
  - Analytics component auto-refreshes on these events

## Features

### Statistics Dashboard
- 📊 Total sessions count
- ✅ Completed sessions (completion rate)
- ⏱️ Total time practiced
- 🔥 Current streak (consecutive practice days)
- 🏆 Longest streak ever
- 🧠 Average coherence score
- 🎯 Average focus score
- 📅 Sessions this week

### Session History
- Recent 5 sessions with details:
  - Protocol name
  - Start time and duration
  - Completion status
  - Phase progress (e.g., "Phase 4/6")
  - Average coherence and focus metrics

### Data Management
- **Export**: Downloads session history as JSON
- **Clear History**: Removes all localStorage data (with confirmation)

## Data Storage

### localStorage Schema
```json
{
  "neural-entrainment-history": [
    {
      "id": "session-1234567890",
      "protocolId": "default",
      "protocolName": "Default Protocol",
      "startTime": 1234567890000,
      "endTime": 1234567890000,
      "duration": 420,
      "completed": true,
      "phasesCompleted": 6,
      "totalPhases": 6,
      "finalMetrics": {
        "coherence": 0.82,
        "focus": 0.75,
        "arousal": 0.45
      },
      "averageMetrics": {
        "coherence": 0.78,
        "focus": 0.71,
        "arousal": 0.43
      }
    }
  ]
}
```

## Integration Points

### SessionManager Integration
When a session completes or stops:
1. Calculates average metrics from `metricsHistory[]`
2. Creates `SessionRecord` with completion status
3. Calls `sessionHistoryService.saveSession()`
4. Emits event via `eventBus`

### UI Integration
- Main App.tsx has tab navigation: "Session" | "Analytics"
- Analytics component listens for session events
- Auto-refreshes stats when sessions complete

## Streak Calculation Logic
```typescript
// Consecutive days with at least 1 session
// Days without sessions break the streak
currentStreak: Days from today backwards
longestStreak: Maximum consecutive days in history
```

## Future Enhancements
- [ ] Progress charts (daily stats visualization)
- [ ] Weekly/monthly summaries
- [ ] Goal setting and tracking
- [ ] Session comparisons (before/after)
- [ ] Export to CSV format
- [ ] Cloud sync (requires backend)
- [ ] Achievement badges
- [ ] Social sharing features

## Testing

### Manual Test Cases
1. **Complete a session** → Check analytics show 1 total session
2. **Stop mid-session** → Check analytics show incomplete session
3. **Practice daily** → Verify streak increments
4. **Skip a day** → Verify streak resets
5. **Export data** → Verify JSON download works
6. **Clear history** → Verify confirmation prompt and data removal

### Browser Compatibility
- Chrome 90+: ✅ localStorage support
- Firefox 88+: ✅ localStorage support  
- Safari 14+: ✅ localStorage support
- Edge 90+: ✅ localStorage support

## Performance Considerations
- localStorage limit: ~5-10MB per origin (supports 1000s of sessions)
- Stats calculation: O(n) where n = total sessions
- Streak calculation: O(n) worst case, optimized with early returns
- Analytics refresh: Debounced on session events

## Security & Privacy
- All data stored locally in browser
- No server transmission
- User controls export and deletion
- GDPR compliant (local-only storage)

---
**Status**: ✅ Feature Complete  
**Next Steps**: Add progress charts visualization
