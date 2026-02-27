// Simple To-Do App core logic
// ------------------------------------------------------------
// Constants & Data structures
const STORAGE_KEY = "simple_todo_tasks";

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

/** @type {Task[]} */
let tasks = [];
/** @type {"all"|"active"|"completed"} */
let currentFilter = "all";

// ------------------------------------------------------------
// Persistence
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    tasks = [];
    return;
  }
  try {
    const parsed = JSON.parse(raw);
    // Ensure we get proper Task instances (plain objects are fine for our use)
    tasks = parsed.map((obj) => new Task(obj.id, obj.text, obj.completed));
  } catch (e) {
    console.error("Failed to parse tasks from localStorage", e);
    tasks = [];
  }
}

function saveTasks() {
  try {
    const data = JSON.stringify(tasks);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (e) {
    console.error("Failed to save tasks to localStorage", e);
  }
}

// ------------------------------------------------------------
// Rendering
function renderTasks(filter = currentFilter) {
  const listEl = document.getElementById("task-list");
  if (!listEl) return;
  listEl.innerHTML = ""; // clear existing items

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true; // "all"
  });

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");
    li.dataset.id = task.id;

    // Checkbox toggle
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "toggle-checkbox";
    checkbox.checked = task.completed;
    li.appendChild(checkbox);

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;
    li.appendChild(span);

    // Action buttons container
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.title = "Edit task";
    editBtn.innerHTML = "✏️"; // simple pencil emoji
    actions.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Delete task";
    deleteBtn.innerHTML = "🗑️"; // trash can emoji
    actions.appendChild(deleteBtn);

    li.appendChild(actions);
    listEl.appendChild(li);
  });
}

// ------------------------------------------------------------
// CRUD Operations
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const id = Date.now() + Math.random(); // ensure uniqueness even rapid adds
  const newTask = new Task(id, trimmed);
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function editTask(id, newText) {
  const task = tasks.find((t) => t.id == id);
  if (!task) return;
  const trimmed = newText.trim();
  if (!trimmed) return; // ignore empty edits
  task.text = trimmed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id == id);
  if (index === -1) return;
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  const task = tasks.find((t) => t.id == id);
  if (!task) return;
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function setFilter(filter) {
  if (!["all", "active", "completed"].includes(filter)) return;
  currentFilter = filter;
  // Update UI of filter buttons
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    const btnFilter = btn.dataset.filter;
    const selected = btnFilter === filter;
    btn.classList.toggle('selected', selected);
    btn.setAttribute('aria-pressed', selected);
  });
  renderTasks();
}

function clearCompleted() {
  const before = tasks.length;
  tasks = tasks.filter((t) => !t.completed);
  if (tasks.length !== before) {
    saveTasks();
    renderTasks();
  }
}

// ------------------------------------------------------------
// Event Binding
function bindEvents() {
  // Add new task via Enter key
  const input = document.getElementById("new-task-input");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addTask(input.value);
        input.value = "";
      }
    });
  }

  // Delegate actions inside the task list
  const list = document.getElementById("task-list");
  if (list) {
    list.addEventListener("click", (e) => {
      const li = e.target.closest("li.task-item");
      if (!li) return;
      const id = li.dataset.id;

      // Toggle checkbox
      if (e.target.matches('.toggle-checkbox')) {
        toggleComplete(id);
        return;
      }

      // Edit button
      if (e.target.matches('.edit-btn')) {
        const newText = prompt("Edit task", li.querySelector('span').textContent);
        if (newText !== null) {
          editTask(id, newText);
        }
        return;
      }

      // Delete button
      if (e.target.matches('.delete-btn')) {
        if (confirm("Delete this task?")) {
          deleteTask(id);
        }
        return;
      }
    });
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      setFilter(filter);
    });
  });

  // Clear completed button
  const clearBtn = document.getElementById('clear-completed');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearCompleted();
    });
  }
}

// ------------------------------------------------------------
// Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderTasks();
  bindEvents();
});

// ------------------------------------------------------------
// Expose for testing / external usage
window.todoApp = {
  STORAGE_KEY,
  Task,
  tasks,
  loadTasks,
  saveTasks,
  renderTasks,
  addTask,
  editTask,
  deleteTask,
  toggleComplete,
  setFilter,
  clearCompleted,
};
