# AdTrack Dashboard

A simple web dashboard to track and analyze advertising spend and performance metrics across different platforms.

## Features

- Manual entry of daily ad spending data
- Track metrics per platform (Facebook Ads, Google Ads, etc.)
- Calculate Cost per Lead (CPL) and Cost per FTD
- View daily, monthly, and overall performance metrics
- Clean and intuitive user interface

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Database**: MongoDB
- **ORM**: Prisma
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and create a new project

3. Import your GitHub repository

4. Configure the following environment variables in Vercel:
   - `DATABASE_URL`: Your MongoDB connection string

5. Deploy!

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/lib` - Utility functions and shared code
- `/prisma` - Database schema and migrations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 