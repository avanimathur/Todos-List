const taskIDDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const taskDescriptionDOM = document.querySelector('.task-edit-description'); // Ensure this exists in task.html
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

let tempName, tempDescription;

const showTask = async () => {
  try {
    const { data: { task } } = await axios.get(`/api/tasks/${id}`);
    const { _id: taskID, completed, name, description } = task;

    taskIDDOM.textContent = taskID;
    taskNameDOM.value = name;
    taskDescriptionDOM.value = description || ''; 
    taskCompletedDOM.checked = completed;

    tempName = name;
    tempDescription = description;
  } catch (error) {
    console.error("Error loading task:", error);
  }
};

showTask();

editFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  editBtnDOM.textContent = 'Saving...';

  try {
    const updatedTask = {
      name: taskNameDOM.value.trim(),
      description: taskDescriptionDOM.value.trim(),
      completed: taskCompletedDOM.checked,
    };

    if (!updatedTask.name) {
      formAlertDOM.style.display = 'block';
      formAlertDOM.textContent = 'Task name is required!';
      formAlertDOM.classList.remove('text-success');
      editBtnDOM.textContent = 'Edit';
      return;
    }

    const { data: { task } } = await axios.patch(`/api/tasks/${id}`, updatedTask);

    taskIDDOM.textContent = task._id;
    taskNameDOM.value = task.name;
    taskDescriptionDOM.value = task.description || '';
    taskCompletedDOM.checked = task.completed;

    tempName = task.name;
    tempDescription = task.description;

    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `Success! Task updated.`;
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    console.error("Error updating task:", error);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `Error! Could not update task.`;
    formAlertDOM.classList.remove('text-success');
  }

  editBtnDOM.textContent = 'Edit';
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
  }, 3000);
});
