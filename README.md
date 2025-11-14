# China Coast Community Website Redesign

A modern, responsive website redesign for the China Coast Community (CCC), built with React, TypeScript, and Sanity CMS.

## Overview

This project is a complete redesign of the China Coast Community website, featuring a modern UI, improved user experience, and a content management system powered by Sanity. The website showcases community services, events, updates, testimonials, and provides ways for community members to get involved through volunteering and donations.

## Features

-   **Modern, Responsive Design**: Built with Tailwind CSS and shadcn/ui components
-   **Content Management**: Sanity CMS integration for easy content updates
-   **Performance Optimized**: Code splitting, lazy loading, and optimized asset delivery
-   **Accessible**: Built with accessibility best practices
-   **SEO Friendly**: Optimized for search engines

## Tech Stack

-   **Frontend Framework**: React 18 with TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **UI Components**: shadcn/ui (Radix UI primitives)
-   **Routing**: React Router v6
-   **CMS**: Sanity
-   **State Management**: TanStack Query (React Query)
-   **Form Handling**: React Hook Form with Zod validation

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Feature-specific components
├── pages/              # Page components
├── lib/                # Utilities and configurations
│   ├── sanity.ts       # Sanity client setup
│   └── utils.ts        # Helper functions
└── hooks/              # Custom React hooks
```

## Getting Started

### Prerequisites

-   Node.js 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd CCC-redesign
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Sanity configuration:

```
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run build:dev` - Build in development mode
-   `npm run preview` - Preview production build
-   `npm run lint` - Run ESLint

## Sanity CMS

The project uses Sanity as a headless CMS for managing content. Content types include:

-   **Events**: Community events and activities
-   **Updates**: News, announcements, and stories
-   **Reports**: Annual reports and impact studies
-   **Testimonials**: Community member testimonials
-   **Team Members**: Staff and board member profiles
-   **Partners**: Partner organizations
-   **Case Studies**: Success stories and program outcomes
-   **Resources**: Downloadable documents and forms
-   **FAQs**: Frequently asked questions
-   **Galleries**: Photo galleries
-   **Press Releases**: Media releases

## Pages

-   `/` - Homepage
-   `/about` - About the organization
-   `/community` - Community information
-   `/events` - Events listing and details
-   `/updates` - News and updates
-   `/reports` - Annual reports and publications
-   `/volunteer` - Volunteer information and signup
-   `/support/donate` - Donation page
-   `/contact` - Contact information
-   `/future` - Future plans and vision
-   `/waitlist` - Waitlist signup
-   `/privacy` - Privacy policy

## Development

The project uses:

-   **TypeScript** for type safety
-   **ESLint** for code quality
-   **Tailwind CSS** for styling
-   **React Router** for client-side routing
-   **React Query** for data fetching and caching

## Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## License

[Add your license information here]

## Contact

For questions or support, please contact [your contact information]
