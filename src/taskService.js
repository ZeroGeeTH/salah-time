class TaskService {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  addTask(title, description) {
    const task = { id: this.nextId++, title, description };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.tasks.splice(idx, 1);
      return true;
    }
    return false;
  }

  getAllTasks() {
    return this.tasks.slice();
  }
}

module.exports = TaskService;
