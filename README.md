# AreWeOkay - Relationship Reality Platform

**Tagline:** "Not every love is forever. Find your truth."

A mobile-first, anonymous relationship platform built with Next.js, TypeScript, and MongoDB.

## Features

### Core Platform Features

1. **Does My Babe Really Know Me?**
   - Users create up to 10 custom questions
   - Share private link with partner
   - Partner answers for free

2. **Does a Stranger Know Me More?**
   - Users write 10 personal questions
   - Anyone can answer for free
   - Compare partner vs stranger responses

3. **What Does It Take to Love You?**
   - Express true feelings
   - Share with someone special
   - Optional sound playback

4. **Your Love Is Appreciated**
   - Send anonymous appreciation messages
   - Share via link

5. **Break Up, or Forever**
   - Generate reflective relationship questions
   - Help users evaluate their relationship

6. **Is My Love Really Safe With Them?**
   - Random relationship safety questions
   - 100+ question bank
   - New questions on each retry

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Styling:** TailwindCSS v3
- **UI Components:** Headless UI, ShadCN UI
- **Animation:** Framer Motion
- **Email:** ZeptoMail (optional)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd areweokay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/areweokay
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ZEPTO_MAIL_TOKEN=your_zepto_mail_token_here
   ```

4. **Set up MongoDB**
   
   If using local MongoDB:
   ```bash
   # Install MongoDB Community Edition
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo apt-get install mongodb
   sudo systemctl start mongodb
   
   # Windows
   # Download and install from mongodb.com
   ```
   
   Or use MongoDB Atlas (cloud):
   - Create account at mongodb.com/atlas
   - Create a cluster
   - Get connection string
   - Update MONGODB_URI in .env.local

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
areweokay/
├── app/
│   ├── api/                    # API routes
│   │   ├── analytics/          # Visit tracking
│   │   └── session/            # Session management
│   ├── [type]/[id]/            # Dynamic session pages
│   ├── know-me/                # Know Me feature
│   ├── stranger-comparison/    # Stranger comparison
│   ├── expression/             # Expression feature
│   ├── appreciation/           # Appreciation feature
│   ├── breakup/                # Breakup reflection
│   ├── safe-love/              # Safe love questions
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── features/               # Feature-specific components
│   ├── ThemeProvider.tsx       # Theme management
│   ├── AnalyticsDisplay.tsx    # Analytics counter
│   ├── GenderSelectionModal.tsx
│   └── BackgroundAudio.tsx     # Ambient sound
├── lib/
│   ├── mongodb.ts              # Database connection
│   ├── utils.ts                # Utility functions
│   └── questions.ts            # Question bank (100+)
├── models/
│   ├── Analytics.ts            # Analytics schema
│   └── Session.ts              # Session schema
├── public/
│   └── sounds/                 # Audio files
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Key Features Implementation

### 1. Anonymity
- No user authentication
- No tracking of personal data
- Session-based gender tracking (optional)

### 2. Analytics
- Real-time visit counter
- Optional gender selection
- Live updates every 10 seconds
- Displayed in bottom-left corner

### 3. Theme Support
- Light mode
- Dark mode
- System mode (follows OS preference)
- Toggle button in top-right corner

### 4. Rich Link Previews
All shared links include Open Graph metadata for rich previews on social media and messaging apps.

## Database Schema

### Analytics Collection
```typescript
{
  totalVisits: Number,
  maleCount: Number,
  femaleCount: Number,
  lastUpdated: Date
}
```

### Session Collection
```typescript
{
  sessionId: String (unique),
  type: 'know-me' | 'stranger-comparison' | 'expression' | 'appreciation' | 'breakup' | 'safe-love',
  creatorEmail: String,
  questions: [{
    id: String,
    question: String,
    answer: String,
    answeredBy: 'partner' | 'stranger'
  }],
  expression: String,
  appreciationMessage: String,
  isPublic: Boolean,
  responses: {
    partnerId: String,
    partnerAnswers: [Question],
    strangerAnswers: [[Question]]
  },
  createdAt: Date,
  expiresAt: Date
}
```

## API Endpoints

### Analytics
- `GET /api/analytics` - Get visit statistics
- `POST /api/analytics/track` - Track visit with gender

### Session
- `POST /api/session/create` - Create new session
- `GET /api/session/[id]` - Get session details
- `POST /api/session/[id]/answer` - Submit answers

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Set up MongoDB Atlas**
   - Update MONGODB_URI with Atlas connection string
   - Whitelist Vercel IP addresses

### Other Platforms

Can also deploy to:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## Configuration

### Audio File
Place a background audio file at `/public/sounds/ambient.mp3` for the ambient sound feature.
```

### Email (Optional)
If using ZeptoMail for notifications:
1. Sign up at zeptomail.com
2. Get API token
3. Add to .env.local

## Customization

### Colors
Edit `app/globals.css` to change color scheme:
```css
:root {
  --primary: 345 75% 55%;    /* Main brand color */
  --secondary: 330 60% 65%;   /* Secondary color */
  /* ... other colors */
}
```

### Fonts
Current fonts (Playfair Display + Crimson Text) can be changed in `app/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');

body {
  font-family: 'Your Font', serif;
}
```

### Question Bank
Add more questions to `lib/questions.ts`:
```typescript
export const relationshipQuestions = [
  "Your new question here?",
  // ... existing questions
]
```

## Security Considerations

- Never commit `.env.local` to version control
- Use environment variables for all secrets
- Implement rate limiting for API endpoints
- Validate all user inputs
- Sanitize database queries
- Use HTTPS in production

## Support

For issues, questions, or contributions:
1. Open an issue on GitHub
2. Contact via email (if provided)
3. Submit pull requests

## License

[Add your license here]

## Acknowledgments

- TailwindCSS for styling
- Framer Motion for animations
- MongoDB for database
- Vercel for hosting