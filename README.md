# SiteGPT - AI-Powered Customer Service Chatbot Platform

![SiteGPT](https://img.shields.io/badge/SiteGPT-AI%20Chatbot-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

Make AI your expert customer service agent. SiteGPT is a production-ready AI chatbot platform that lets you create personalized chatbots trained on your website content.

## Features

### 🤖 Core Chatbot Features
- **Custom Training Data**: Train your chatbot on website URLs, raw text, or uploaded documents
- **GPT-4.1 & GPT-4.1-mini Support**: Choose between speed (mini) or accuracy (standard)
- **Multi-language Support**: Ready for 95+ languages
- **Smart Responses**: Context-aware responses based on your training data
- **Quick Prompts**: Pre-configured conversation starters for users

### 🎨 Customization
- **Brand Matching**: Customize colors, logo, and appearance
- **Welcome Messages**: Set personalized greeting messages
- **Theme Configuration**: Match your brand identity
- **Flexible Positioning**: Bottom-right or custom positioning

### 🔧 Management & Analytics
- **Dashboard**: Manage multiple chatbots from one place
- **Chat History**: Review all conversations
- **Training Management**: Add, edit, and remove training data
- **Analytics**: Track conversations and performance
- **Lead Generation**: Capture visitor information

### 🚀 Deployment & Integration
- **Embeddable Widget**: Simple script tag integration
- **API Access**: Full REST API for programmatic control
- **Easy Setup**: 3 steps to deployment
- **Production Ready**: Built with Next.js 15 and modern best practices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4.1 & GPT-4.1-mini
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- OpenAI API key

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sitegpt
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sitegpt?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key-here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WIDGET_URL="http://localhost:3000"
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Set Up the Database

Run Prisma migrations to create the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Usage Guide

### Creating Your First Chatbot

1. **Sign Up**: Create an account at `/register`
2. **Create Chatbot**: Click "Create Chatbot" in the dashboard
3. **Add Training Data**:
   - Enter a website URL to scrape
   - Upload files
   - Or paste raw text content
4. **Customize**: Set welcome message, colors, and quick prompts
5. **Embed**: Copy the embed code and add it to your website

### Embedding the Widget

Add this code to any website:

```html
<!-- SiteGPT Widget -->
<script>
  window.sitegptConfig = {
    chatbotId: "your-chatbot-id",
    apiUrl: "https://your-domain.com"
  };
</script>
<script src="https://your-domain.com/widget.js" defer></script>
<!-- End SiteGPT Widget -->
```

### API Endpoints

#### Authentication
- `POST /api/register` - Register new user
- `POST /api/auth/signin` - Sign in

#### Chatbots
- `GET /api/chatbots` - List all chatbots
- `POST /api/chatbots` - Create chatbot
- `GET /api/chatbots/[id]` - Get chatbot details
- `PATCH /api/chatbots/[id]` - Update chatbot
- `DELETE /api/chatbots/[id]` - Delete chatbot

#### Training Data
- `POST /api/training` - Add training data
- `DELETE /api/training?id=[id]` - Delete training data

#### Chat
- `POST /api/chat` - Send message and get response

#### Widget
- `GET /api/widget/[id]` - Get widget configuration

## Project Structure

```
sitegpt/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Dashboard routes
│   │   └── dashboard/
│   │       └── chatbots/[id]/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── chatbots/
│   │   ├── chat/
│   │   ├── training/
│   │   └── widget/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── components/              # React components
│   └── dashboard/
├── lib/                     # Utility functions
│   ├── auth.ts
│   ├── openai.ts
│   ├── prisma.ts
│   ├── scraper.ts
│   └── utils.ts
├── prisma/                  # Database schema
│   └── schema.prisma
├── public/                  # Static files
│   └── widget.js           # Embeddable widget
├── types/                   # TypeScript types
└── .env                     # Environment variables
```

## Database Schema

The application uses the following main models:

- **User**: User accounts
- **Chatbot**: Chatbot configurations
- **TrainingData**: Training content (URLs, text, files)
- **Conversation**: Chat conversations
- **Message**: Individual chat messages
- **Lead**: Captured lead information

## Customization

### Changing the Primary Color

Update the theme in `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    // Your custom color palette
  },
}
```

### Adding More AI Models

Edit `lib/openai.ts` to add support for additional OpenAI models or other AI providers.

### Custom Widget Styling

Modify `public/widget.js` to customize the widget appearance and behavior.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Database Setup (Production)

For production, use a managed PostgreSQL service:

- **Vercel Postgres**
- **Supabase**
- **Railway**
- **Neon**
- **PlanetScale** (with MySQL adapter)

Update your `DATABASE_URL` in Vercel environment variables.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your app URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Yes |
| `NEXT_PUBLIC_WIDGET_URL` | Widget URL | Yes |

## Development

### Running Prisma Studio

To view and edit your database:

```bash
npx prisma studio
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check your `DATABASE_URL` format
- Run `npx prisma db push` to sync the schema

### OpenAI API Errors

- Verify your `OPENAI_API_KEY` is correct
- Check your OpenAI account has available credits
- Ensure you're using supported model names

### Widget Not Loading

- Check the `NEXT_PUBLIC_WIDGET_URL` is correct
- Ensure CORS is properly configured
- Verify the chatbot ID exists

## Roadmap

- [ ] File upload support (PDF, DOCX, etc.)
- [ ] Advanced analytics dashboard
- [ ] Email summaries
- [ ] Integration with Slack, Discord, etc.
- [ ] A/B testing for responses
- [ ] Conversation ratings
- [ ] Export chat history
- [ ] Multi-user support for teams
- [ ] Webhooks for events
- [ ] Advanced lead capture forms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For questions or issues:
- Create an issue on GitHub
- Email: support@sitegpt.ai

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)

---

**SiteGPT** - Make AI your expert customer service agent 🤖
