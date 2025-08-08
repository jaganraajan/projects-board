# Projects Board

A full-stack Kanban-style project management board built with [Next.js](https://nextjs.org) and a [Ruby on Rails](https://rubyonrails.org) backend.

## Features

- User authentication and multi-tenant support
- Create, edit, move, and delete tasks across columns (Todo, In Progress, Done)
- Responsive UI with light/dark mode support
- Due dates and company branding
- Backend API for tasks and users

## Tech Stack

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** Ruby on Rails (API mode), hosted on [Render](https://render.com)
- **Authentication:** JWT-based, multi-tenant
- **Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Frontend

1. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

2. Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend

- The backend Rails API is hosted on Render. See `/api` endpoints in your frontend code for integration.
- To run locally, clone the backend repo, install dependencies, and start the Rails server.

## Configuration

- API endpoint is set via `NEXT_PUBLIC_TENANT_SERVER_API_URL` in your `.env.local` file.
- Update authentication and company settings in `auth-context.tsx`.

## Editing

- Edit the main page in `app/page.tsx`. The page auto-updates as you edit.
- UI components are in [board](http://_vscodecontentref_/0).

## Fonts

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font).

## License

MIT