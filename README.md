# Personal Portfolio - Farhan Franaka

Modern, minimal, and futuristic personal portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## 🎨 Design Philosophy

This portfolio embraces a **Web3-inspired minimal futuristic aesthetic** with a clean, professional light mode design:

- **Base**: Pure white (#FFFFFF) with abundant white space
- **Accent**: Soft lilac (#8A63F6) for subtle highlights
- **Typography**: Inter font for modern, clean readability
- **Style**: Inspired by Notion, Linear.app, and Apple Developer
- **Effects**: Glass morphism, subtle shadows, and smooth micro-interactions

## ✨ Features

- 🎯 **Hero Section**: Bold introduction with clear CTAs
- 📖 **About Me**: Elegant storytelling section
- 💼 **Projects Showcase**: Minimal cards with hover effects
- 🏢 **Experience Timeline**: Clean work history with achievements
- 🛠️ **Tech Stack**: Organized technology display
- 📬 **Contact Section**: Simple and accessible contact options
- 🎭 **Smooth Animations**: Powered by Framer Motion
- 📱 **Fully Responsive**: Optimized for all devices

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Font**: Inter (Google Fonts)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles & Tailwind config
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/
│   ├── Navbar.tsx        # Floating navigation
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Projects.tsx      # Projects showcase
│   ├── Experience.tsx    # Work experience
│   ├── TechStack.tsx     # Technologies
│   ├── Contact.tsx       # Contact section
│   └── Footer.tsx        # Footer
└── lib/
    └── data.ts           # Content data
```

## 🎨 Customization

### Colors

Edit `src/app/globals.css` to change the color scheme:

```css
:root {
  --accent: #8a63f6; /* Change to your preferred accent color */
  --border: #e5e5e5; /* Adjust border colors */
}
```

### Content

Update your personal information in `src/lib/data.ts`:

- Projects
- Work experience
- Tech stack
- Social links

### Typography

Change font in `src/app/layout.tsx`:

```typescript
import { Inter } from "next/font/google";
// or use: Satoshi, Helvetica Neue, etc.
```

## 🌐 Deployment

Deploy easily to Vercel:

```bash
vercel deploy
```

Or any other hosting platform that supports Next.js.

## 📝 Content Guidelines

The website uses **elegant, professional copywriting**:

- Short, confident statements
- Focus on value and impact
- Professional but approachable tone
- Clean, scannable formatting

## 🎭 Animation Details

- **Scroll reveals**: Fade + 20px translate
- **Hover effects**: Scale + soft shadows
- **Focus rings**: Accent color with transparency
- **Smooth transitions**: 200-300ms duration

## 📄 License

MIT License - Feel free to use this template for your own portfolio!

## 🤝 Contributing

Suggestions and improvements are welcome! Feel free to open an issue or submit a pull request.

---

Built with ❤️ using Next.js and Tailwind CSS
