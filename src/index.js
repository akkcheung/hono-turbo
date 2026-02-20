import { Hono } from 'hono'
import { html } from 'hono/html'
import { serveStatic } from 'hono/bun'

import { stream } from 'hono/streaming'

const app = new Hono()

let tasks = [{ id:1, title:"Learn Hotwire Turbo"}]


const Layout = (content) => html` 
<!DOCTYPE html>
  <html lang="en" data-theme="light">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Pico + Turbo</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css">
      <!--
      <script type="module"> 
        import hotwiredturbo from 'https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.23/+esm'
      </script>
      -->
      <script type="module" src="/static/app.js"></script>
    </head>
    <body>
      <main class="container">
        ${content}
      </main>
    </body>
  </html>
`
// Serve files in the /public folder at the /static path
app.use('/static/*', serveStatic({ root: './public' }))

// --- ROUTES ---

// 1. Dashboard
app.get('/', (c) => {
  // return c.text('Hello Hono!')

  const taskRows = tasks.map(t => html`
    <tr>
      <td>${t.title}</td>
      <td>
        <a href="/tasks/${t.id}" class="outline" role="button" data-turbo-frame="task_details">View</a>
      </td>
    </tr>
  `)

  return c.html(Layout(html`
    <article>
      <header>Live Server Clock</header>
      <turbo-stream-source src="/sse/clock-stream"></turbo-stream-source>
      <h2>
        Current Time: <span id="current-time">Loading...</span>
      </h2>
    </article>

    <hgroup> 
      <h1>Task Manager</h1>
      <p>Built with Bun, Hono and Pico CSS stack</p>
    </hgroup>

    <turbo-frame id="task_details">
      <article>
        <small>Click "View" to see task specifics here.</small>
      </article>
    </turbo-frame>

    <figure>
      <table role="grid">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="task-list">
          ${taskRows}
        </tbody>
      </table>
    </figure>

    <footer>
      <form 
        action="/tasks" 
        method="POST" 
        data-controller="reset-form"
        data-action="turbo:submit-end->reset-form#clear"
        class="grid">

        <input type="text" name="title" placeholder="New task title..." required>
        <button type="submit">Add Task</button>
      </form>
    </footer>
  `))
})

// Static route first
app.get('/tasks/clear', (c) => {
  return c.html(html`
    <turbo-frame id="task_details">
      <article>
        <small>Click "View" to see task specifics here.</small>
      </article>
    </turbo-frame>
  `)
});

// 2. Task Detail (Turbo Frame Response)
app.get('/tasks/:id', (c) => {
  const id = c.req.param('id')
  const task = tasks.find(t => t.id === parseInt(id))

  c.header('Content-Type', 'text/html')

  const turboFrameResp = `
    <turbo-frame id="task_details">
      <article>
        <header>
          <strong>Task ID: ${id}</strong>
        </header>
        <p>${task?.title}</p>
        <footer style="text-align: right">
          <!-- <a href="/" class="secondary">Close</a> -->
          <a href="/tasks/clear" class="secondary">Close</a> 
        </footer>
      </article>
    </turbo-frame>
  `

  return c.body(turboFrameResp)
});

// 3. Add Task (Tubo Stream Response)
app.post('tasks', async (c) => {
  const body = await c.req.parseBody()
  const newTask = { id: Date.now(), title: body.title }

  console.log('newTask', newTask)

  tasks.push(newTask)

  c.header('Content-Type', 'text/vnd.turbo-stream.html')

  const turboStreamResponse =` 
    <turbo-stream action="append" target="task-list">
      <template>
        <tr>
          <td>${newTask.title}</td>
          <td><a href="/tasks/${newTask.id}" class="outline" role="button" data-turbo-frame="task_details">View</a></td>
        </tr>
      </template>
    </turbo-stream>
  `;

  return c.body(turboStreamResponse)
});

app.use('/sse/*', async (c, next) => {
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache');
  c.header('Connection', 'keep-alive');
  c.header('X-Accel-Buffering', 'no')
  await next();
});

app.get('/sse/clock-stream', (c) => {
  return stream(c, async (stream) => {
    while (true) {
      const now = new Date().toLocaleTimeString()

      const data = `
        <turbo-stream action="replace" target="current-time">
          <template>
            <span id="current-time">${now}</span>
          </template>
        </turbo-stream>
      `.replace(/\n/g, '') // Remove newlines for clean SSE data

      await stream.write('event: message\n')
      // await stream.write(`data: signals ${data}\n\n`) 
      await stream.write(`data: ${data}\n\n`) 
      await stream.sleep(1000); // Wait 1 second
    }
  })
})

// export default app

const port = parseInt(process.env.PORT || "3000")
export default { port, fetch: app.fetch }
