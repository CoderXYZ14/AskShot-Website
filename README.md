# AskShot Website

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that serves as the backend for the AskShot Chrome extension. It provides an API endpoint that integrates with the Anthropic Claude Vision API to analyze screenshots and answer questions about them.

## Getting Started

### Environment Setup

1. Create a `.env.local` file in the root directory based on `.env.local.example`
2. Add your Anthropic API key to the `.env.local` file:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Running the Development Server

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The API endpoint will be available at `http://localhost:3000/api/analyze`.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## API Endpoints

### POST /api/analyze

Analyzes a screenshot using the Anthropic Claude Vision API.

**Request Body:**

```json
{
  "screenshot": "base64_encoded_image_data",
  "question": "What does this screenshot show?"
}
```

**Response:**

```json
{
  "answer": "AI-generated response about the screenshot"
}
```

## Learn More

- [Anthropic Claude Vision API Documentation](https://docs.anthropic.com/claude/docs/vision-api)
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
