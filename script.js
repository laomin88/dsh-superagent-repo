const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const status = document.querySelector('#status');
const storageKey = 'simple-todo-tasks';
let tasks = [];

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(saved)) {
    tasks = saved.filter(task => task && typeof task.text === 'string' && typeof task.done === 'boolean');
  }
} catch {
  status.textContent = '无法读取已保存的任务。';
}

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(tasks));
    status.textContent = '';
  } catch {
    status.textContent = '无法保存任务，刷新页面后可能丢失。';
  }
}

function render() {
  list.replaceChildren();
  emptyState.hidden = tasks.length > 0;
  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.classList.toggle('completed', task.done);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    const label = document.createElement('label');
    label.textContent = task.text;
    const id = `task-${index}`;
    checkbox.id = id;
    label.htmlFor = id;
    checkbox.addEventListener('change', () => {
      task.done = checkbox.checked;
      item.classList.toggle('completed', task.done);
      save();
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '删除';
    remove.setAttribute('aria-label', `删除任务：${task.text}`);
    remove.addEventListener('click', () => {
      tasks.splice(index, 1);
      save();
      render();
      input.focus();
    });
    item.append(checkbox, label, remove);
    list.append(item);
  });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.value = '';
    input.focus();
    return;
  }
  tasks.push({ text, done: false });
  save();
  render();
  input.value = '';
  input.focus();
});

render();
