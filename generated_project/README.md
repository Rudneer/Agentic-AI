# Simple To-Do App

A lightweight, vanilla‑JavaScript to‑do list that runs entirely in the browser. It supports adding, editing, deleting, filtering, and clearing completed tasks, with persistence via `localStorage`.

---

## Features

- **Add tasks** – type a description and press **Enter**.
- **Edit tasks** – click the ✏️ button to modify the text.
- **Delete tasks** – click the 🗑️ button (confirmation required).
- **Toggle completion** – click the checkbox next to a task.
- **Filter view** – switch between **All**, **Active**, and **Completed** tasks.
- **Clear completed** – remove all completed tasks with a single click.
- **Persistent storage** – tasks are saved in `localStorage` and restored on page load.
- **Responsive UI** – simple CSS ensures the app works on desktop and mobile.

---

## Tech Stack

- **HTML5** – structure and markup (`index.html`).
- **CSS3** – styling (`styles.css`).
- **JavaScript (ES6)** – core logic (`app.js`).
- **Browser `localStorage`** – client‑side persistence.

---

## Setup

1. Clone or download the repository.
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari).

That's it – no build step, server, or package manager required.

---

## Usage

| Action | How to do it |
|--------|--------------|
| **Add** | Type a task into the input field at the top and press **Enter**. |
| **Edit** | Click the ✏️ button on a task, edit the text in the prompt, and confirm. |
| **Delete** | Click the 🗑️ button on a task and confirm the deletion. |
| **Toggle completion** | Click the checkbox next to a task. |
| **Filter** | Click the **All**, **Active**, or **Completed** buttons at the bottom. |
| **Clear completed** | Click the **Clear Completed** button to remove all completed tasks. |

---

## Architecture

### HTML (`index.html`)
- Contains the static layout: an input for new tasks, an unordered list (`#task-list`) where tasks are rendered, filter buttons, and a clear‑completed button.
- Minimal markup; most UI elements are generated dynamically by JavaScript.

### CSS (`styles.css`)
- Provides a clean, responsive design.
- Uses class names like `.task-item`, `.completed`, `.filter-btn`, and `.selected` which are toggled by JavaScript to reflect state.

### JavaScript (`app.js`)
- **Data model** – `Task` class defines a task object (`id`, `text`, `completed`).
- **State** – `tasks` array holds all tasks; `currentFilter` tracks the active filter.
- **Persistence** – `loadTasks()`/`saveTasks()` read/write JSON to `localStorage` under the key `simple_todo_tasks`.
- **Rendering** – `renderTasks()` rebuilds the task list based on the current filter.
- **CRUD operations** – functions `addTask`, `editTask`, `deleteTask`, `toggleComplete`, `clearCompleted` manipulate `tasks` and then persist/render.
- **Event binding** – `bindEvents()` wires UI interactions (keypress, clicks) to the appropriate functions.
- **Initialization** – on `DOMContentLoaded`, tasks are loaded, rendered, and events are attached.
- **Export for testing** – the `window.todoApp` object exposes core functions and data.

---

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make your changes, ensuring the app still works by opening `index.html`.
4. Submit a pull request with a clear description of what you added or fixed.

Please keep the code style consistent with the existing files (ES6 syntax, descriptive variable names, and comments where appropriate).

---

## License

This project is licensed under the MIT License – see the `LICENSE` file for details.

---

## Quick Start Code Snippet

```bash
# Open the app in a browser (no server needed)
open index.html   # macOS
# or
start index.html  # Windows
# or simply double‑click the file in your file explorer.
```

### Example: `Task` class definition (from `app.js`)

```javascript
class Task {
  /**
   * @param {number|string} id - Unique identifier for the task
   * @param {string} text - Task description
   * @param {boolean} [completed=false] - Completion status
   */
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}
```

---

**File purposes**
- `index.html` – static markup and container elements.
- `styles.css` – visual styling and responsive layout.
- `app.js` – core application logic, data handling, UI updates, and persistence.
