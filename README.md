# Flauntr Web — Next.js

## Stack
- Next.js 14
- Tailwind CSS
- Framer Motion (animations)
- Formspree (form submissions → your inbox + dashboard)

## Setup in 5 minutes

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Formspree (for waitlist form submissions)
1. Go to https://formspree.io
2. Create a free account
3. Click "New Form" → give it a name (e.g. "Flauntr Waitlist")
4. Copy your form ID (looks like: xyzabcde)
5. Open `components/WaitlistForm.jsx`
6. Replace `YOUR_FORMSPREE_ID` with your actual ID:
   ```
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xyzabcde'
   ```
7. Formspree sends submissions to your email AND stores them in a dashboard
8. You can also connect it to Google Sheets via Formspree integrations

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 4. Deploy to Vercel (free, takes 2 minutes)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com
3. Click "New Project" → Import your GitHub repo
4. Click Deploy — Vercel auto-detects Next.js
5. Your site is live at yourproject.vercel.app

## File Structure
```
flauntr-web/
├── pages/
│   ├── _app.jsx          # App wrapper
│   ├── _document.jsx     # HTML head
│   └── index.jsx         # Main landing page
├── components/
│   ├── Cursor.jsx        # Custom gold cursor
│   ├── Sparkle.jsx       # Brand mark SVG
│   ├── Nav.jsx           # Navigation
│   ├── Marquee.jsx       # Scrolling ticker
│   ├── PhoneMockup.jsx   # Phone screen components
│   ├── WaitlistForm.jsx  # Form with Formspree
│   └── Footer.jsx        # Footer
├── styles/
│   └── globals.css       # Global styles + Tailwind
├── package.json
├── tailwind.config.js
├── next.config.js
└── postcss.config.js
```

## Adding pages later
- `/pages/about.jsx` → flauntr.com/about
- `/pages/blog/index.jsx` → flauntr.com/blog
- `/pages/blog/[slug].jsx` → flauntr.com/blog/post-name

## Colour Palette
- Black: #09090b
- Gold: #C9A84C
- Gold Light: #E2C97E
- Gold Pale: #F5EDD8
