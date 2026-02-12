# ClockWise ⏳

ClockWise is a modern, aesthetic workday tracker designed to help you maintain a healthy work-life balance. It calculates your optimal logout time based on an 8 hour 35 minute schedule (standard 8h shift + 35m break) and tracks your history locally.

![ClockWise App](https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop)

## ✨ Features

- **Smart Calculation**: Automatically calculates logout time based on an 8h 35m workday.
- **Glassmorphic UI**: A beautiful, modern interface featuring glassmorphism and smooth animations.
- **Local History**: Your data stays on your device. We use `localStorage` to keep a history of your login/logout times.
- **Responsive**: Works perfectly on desktop and mobile.
- **Privacy Focused**: No servers, no tracking, no data collection.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 Deployment

### Deploy to Vercel

The easiest way to deploy this app is using Vercel.

1.  Push this code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Go to [Vercel](https://vercel.com/) and create a **New Project**.
3.  Import your repository.
4.  Vercel will automatically detect the **Vite** framework.
5.  Click **Deploy**.

### Manual Setup

To run this project locally:

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## 📝 License

MIT
