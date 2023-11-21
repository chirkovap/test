window.addEventListener('load', () => {
    const form = document.querySelector('#new-task-form');
    const input = document.querySelector("#new-task-input");
    const list_el = document.querySelector("#tasks");
    const selectPriority = document.querySelector("#priority-select");
    let tasks = [];

    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks.forEach(({ task, priority, status }) => {
            addTaskToDOM({ task, priority, status });
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = input.value;
        const priority = selectPriority.value;

        if (!task) {
            alert("Добавьте задачу");
            return;
        }

        tasks.push({ task, priority, status: "Status: Active" });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskToDOM({ task, priority, status: "Status: Active" });

        input.value = "";
    });

    function addTaskToDOM({ task, priority, status }) {
        const task_el = document.createElement("div");
        task_el.classList.add("task");
        task_el.classList.add(priority);
        task_el.classList.add("active");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.append(task_content_el);

        const task_input_el = document.createElement("input");
        task_input_el.classList.add("text");
        task_input_el.type = "text";
        task_input_el.value = task;
        task_input_el.setAttribute("readonly", "readonly");

        task_content_el.append(task_input_el);

        const task_actions_el = document.createElement("div");
        task_actions_el.classList.add("actions");

        const task_delete_el = document.createElement("button");
        task_delete_el.classList.add("delete");
        task_delete_el.innerHTML = "Delete";

        task_delete_el.addEventListener('click', () => {
            const index = tasks.findIndex(t => t.task === task && t.priority === priority);
            if (index !== -1) {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                task_el.remove();
            }
        });

        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Edit";

        task_edit_el.addEventListener('click', () => {
            task_input_el.removeAttribute("readonly");
            task_input_el.focus();

            task_input_el.addEventListener('blur', () => {
                task_input_el.setAttribute("readonly", "readonly");
                const index = tasks.findIndex(t => t.task === task && t.priority === priority);
                if (index !== -1) {
                    tasks[index].task = task_input_el.value;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                }
            });
        });

        task_actions_el.append(task_delete_el, task_edit_el);
        task_el.append(task_actions_el);
        list_el.append(task_el);

        const priorityEl = document.createElement("span");
        priorityEl.classList.add("priority");
        priorityEl.classList.add("priority-" + priority); // Добавляем класс приоритета
        priorityEl.textContent = `Priority: ${priority}`;

        const statusEl = document.createElement("span");
        statusEl.classList.add("status");
        statusEl.textContent = status;

        const spaceEl = document.createTextNode(' ');

        task_content_el.appendChild(priorityEl);
        task_content_el.appendChild(spaceEl);
        task_content_el.appendChild(statusEl);

        task_el.addEventListener('click', () => {
            if (statusEl.textContent === 'Status: Active') {
                statusEl.textContent = 'Status: Completed';
                task_el.classList.remove('active');
                task_el.classList.add('completed');
            } else if (statusEl.textContent === 'Status: Completed') {
                statusEl.textContent = 'Status: Cancelled';
                task_el.classList.remove('completed');
                task_el.classList.add('cancelled');
            } else if (statusEl.textContent === 'Status: Cancelled') {
                statusEl.textContent = 'Status: Active';
                task_el.classList.remove('cancelled');
                task_el.classList.add('active');
            }

            const index = tasks.findIndex(t => t.task === task && t.priority === priority);
            if (index !== -1) {
                tasks[index].status = statusEl.textContent;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        });
    }
});
