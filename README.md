# Smart Notes - AI-Powered Note Taking App

A modern, AI-enhanced note-taking application built with Next.js 14, Appwrite, and Google Generative AI. Features real-time editing, AI-powered enhancements, and offline-first architecture.

## ✨ Features

- 📝 **Rich Markdown Editor** - Write notes with full markdown support
- 🤖 **AI-Powered Enhancements** - Get AI suggestions and improvements
- 🔐 **Secure Authentication** - Built with Appwrite authentication
- 📱 **PWA Support** - Works offline and installable on devices
- 🌙 **Dark/Light Theme** - Beautiful UI with theme switching
- 📊 **Dashboard** - Organize and manage your notes efficiently
- 🔄 **Real-time Sync** - Automatic synchronization across devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Appwrite account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smart-notes.git
   cd smart-notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
   NEXT_PUBLIC_APPWRITE_BUCKET_ID=your-bucket-id

   # Collection IDs
   NEXT_PUBLIC_USERS_COLLECTION_ID=users
   NEXT_PUBLIC_NOTES_COLLECTION_ID=notes
   NEXT_PUBLIC_VERSIONS_COLLECTION_ID=versions
   NEXT_PUBLIC_AI_ENHANCEMENTS_COLLECTION_ID=ai_enhancements

   # Google AI
   GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Appwrite (Database, Authentication, Storage)
- **AI**: Google Generative AI
- **State Management**: Zustand
- **PWA**: next-pwa
- **Editor**: React SimpleMDE

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── editor/            # Note editor components
│   ├── landing/           # Landing page components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions
│   ├── ai.ts              # AI integration
│   ├── appwrite.ts        # Appwrite configuration
│   ├── auth.ts            # Authentication utilities
│   └── notes.ts           # Notes management
└── types/                 # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📖 Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io) for the backend infrastructure
- [Google AI](https://ai.google.dev) for AI capabilities
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Radix UI](https://www.radix-ui.com) for accessible components