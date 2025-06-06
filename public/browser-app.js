const tasksDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const taskDescriptionDOM = document.querySelector('.task-textarea'); // Fixed selector
const formAlertDOM = document.querySelector('.form-alert');

// Load tasks from /api/tasks
const showTasks = async () => {
  loadingDOM.style.visibility = 'visible';
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/tasks');

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }

    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name, description } = task;
        return `<div class="single-task ${completed && 'task-completed'}">
          <h5><span><i class="far fa-check-circle"></i></span>${name} - ${description || 'No description'}</h5>
          <div class="task-links">
            <!-- edit link -->
            <a href="task.html?id=${taskID}" class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
            <!-- delete btn -->
            <button type="button" class="delete-btn" data-id="${taskID}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
      })
      .join('');

    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = 'hidden';
};

showTasks();

// Delete task
tasksDOM.addEventListener('click', async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    try {
      await axios.delete(`/api/tasks/${id}`);
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = 'hidden';
});

// Handle form submission
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = taskInputDOM.value.trim();
  const description = taskDescriptionDOM.value.trim();

  if (!name) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Task name is required!';
    formAlertDOM.classList.remove('text-success');
    return;
  }

  try {
    await axios.post('/api/tasks', { name, description });
    showTasks();
    taskInputDOM.value = '';
    taskDescriptionDOM.value = '';
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Success! Task added.';
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error! Could not add task.';
    formAlertDOM.classList.remove('text-success');
  }

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
  }, 3000);
});
