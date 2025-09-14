# O-Sto E-commerce Frontend

[![Live Demo](https://img.shields.io/badge/live-demo-brightgreen)](https://osto-fullstack.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Modern e-commerce frontend built with Next.js, TypeScript, and Tailwind CSS. This is the frontend application for the O-Sto e-commerce platform.

## 🚀 Live Demo

Check out the live demo: [https://osto-fullstack.vercel.app/](https://osto-fullstack.vercel.app/)

## ✨ Features

- Server-side rendering (SSR) for optimal performance
- Responsive design that works on all devices
- Type-safe development with TypeScript
- Modern UI components with Tailwind CSS
- Seamless integration with the Go backend API
- Optimized for SEO

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Linting**: ESLint + Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
fullstack-osto/
├── app/                 # App router pages and layouts
├── components/          # Reusable React components
├── contexts/            # React context providers
├── public/              # Static files
├── styles/              # Global styles and Tailwind config
└── types/               # TypeScript type definitions
```

## 📦 Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `lint` - Run ESLint
- `format` - Format code with Prettier

## 🔧 Environment Variables

Create a `.env.local` file and add the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
# Add other environment variables here
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn how to use Tailwind CSS.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
