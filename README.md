# Hono Turbo

A lightweight, modern task manager built with **Bun**, **Hono**, **Hotwire Turbo**, and **Pico CSS**. This project demonstrates how to create a highly interactive "Single Page App" feel using server-side rendering and Turbo Frames/Streams, without a heavy client-side framework.

## 🚀 Features

- **⚡ Bun Runtime**: Fast JavaScript runtime, package manager, and bundler.
- **🔥 Hono Web Framework**: Small, simple, and ultrafast web framework for the Edges.
- **🌀 Hotwire Turbo**: 
  - **Turbo Frames**: Update specific parts of the page (like task details) without a full reload.
  - **Turbo Streams**: Dynamically append new tasks to the list via server-side HTML fragments.
- **🎨 Pico CSS**: Minimalist CSS framework for a clean, semantic design.
- **🛠️ Zero Build Step**: Uses ESM modules directly from CDNs for a simplified development workflow.

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Backend**: [Hono](https://hono.dev/)
- **Frontend Enhancements**: [Hotwire Turbo](https://turbo.hotwired.dev/)
- **Styling**: [Pico CSS](https://picocss.com/)

## 🏁 Getting Started

### Prerequisites

You must have [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hono-turbo
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Running the Application

Start the development server with hot-reloading:

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

- `src/index.js`: The main application logic, including routes, HTML templates (using Hono's `html` literal), and Turbo Stream/Frame handling.
- `package.json`: Project configuration and dependencies.

## 📝 How it Works

1. **Turbo Frames**: When you click "View" on a task, the response is wrapped in a `<turbo-frame id="task_details">`. Turbo automatically replaces only the matching frame on the page, keeping the rest of the state intact.
2. **Turbo Streams**: When a new task is submitted, the server responds with a `<turbo-stream action="append" target="task-list">`. This tells Turbo to append the new HTML content to the list without refreshing the page.
3. **Pico CSS**: Provides immediate, beautiful styling based on standard HTML elements.

## 📄 License

MIT
