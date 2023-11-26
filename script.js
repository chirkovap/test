window.addEventListener('load', () => {
    const form = document.querySelector('#new-task-form'); // Форма для добавления задачи
    const input = document.querySelector("#new-task-input"); // Поле ввода для задачи
    const list_el = document.querySelector("#tasks"); // Список задач
    const selectPriority = document.querySelector("#priority-select"); // Выбор приоритета
    let tasks = []; // Массив для хранения задач

    const priorityMapping = {
        low: 'Низкий',
        medium: 'Средний',
        high: 'Высокий'
    };

    // Проверяем наличие задач в локальном хранилище
    if (localStorage.getItem('tasks')) {
        // Получаем задачи из локального хранилища и парсим JSON
        tasks = JSON.parse(localStorage.getItem('tasks'));
        // Перебираем каждую задачу и добавляем ее в DOM
        tasks.forEach(({ task, priority, status }) => {
            addTaskToDOM({ task, priority, status });
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = input.value; // Текст задачи
        const priority = selectPriority.value; // Выбранный приоритет

        // Проверка: убеждаемся, что задача не пуста
        if (!task) {
            alert("Добавьте задачу");
            return;
        }

        // Добавляем новую задачу в массив задач
        tasks.push({ task, priority, status: "Активно" });
        // Сохраняем обновленные задачи в локальном хранилище
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskToDOM({ task, priority, status: "Активно" });

        // Очищаем поле ввода после добавления задачи
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
        task_delete_el.innerHTML = "Удалить";
        task_delete_el.addEventListener('click', () => {
            const index = tasks.findIndex(t => t.task === task && t.priority === priority);
            if (index !== -1) {
                const result = confirm('Вы уверены, что хотите удалить эту задачу?');
                if (result) {
                    tasks.splice(index, 1);
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    task_el.remove();
                }
            }
        });


        const task_edit_el = document.createElement("button");
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Изменить";

        task_edit_el.addEventListener('click', (event) => {
            event.stopPropagation();

            task_input_el.removeAttribute("readonly");
            task_input_el.focus();
        });

        task_input_el.addEventListener('blur', () => {
            task_input_el.setAttribute("readonly", "readonly");
            const taskIndex = Array.from(list_el.children).indexOf(task_el);
            if (taskIndex !== -1) {
                tasks[taskIndex].task = task_input_el.value;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        });

        task_actions_el.append(task_delete_el, task_edit_el);
        task_el.append(task_actions_el);
        list_el.append(task_el);

        const priorityEl = document.createElement("span");
        priorityEl.classList.add("priority");
        priorityEl.classList.add("priority-" + priority);
        priorityEl.textContent = `Приоритет: ${priorityMapping[priority] || priority}`;

        const statusEl = document.createElement("span");
        statusEl.classList.add("status");
        task_el.classList.add(status.toLowerCase());

        const spaceEl = document.createTextNode(' ');

        const statusSelect = document.createElement("select");
        statusSelect.classList.add("status-select");

        const statusOptions = [
            { text: "Активно", value: "active" },
            { text: "Завершено", value: "completed" },
            { text: "Отменено", value: "cancelled" }
        ];

        statusOptions.forEach((option, index) => {
            const optionEl = document.createElement("option");
            optionEl.value = option.value;
            optionEl.textContent = option.text;
            statusSelect.appendChild(optionEl);
        });
        const defaultStatus = "active"; // Установите значение по умолчанию, если status не соответствует ни одному из вариантов
        statusSelect.value = status || defaultStatus;

        statusSelect.addEventListener('change', (e) => { 
            const newStatus = e.target.value

            const index = tasks.findIndex(t => t.task === task && t.priority === priority);
            if (index !== -1) {
               tasks[index].status = newStatus;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }

            task_el.classList.remove("active", "completed", "cancelled");
            task_el.classList.add(newStatus);
        });


        task_content_el.appendChild(priorityEl);
        task_content_el.appendChild(spaceEl);
        task_content_el.appendChild(statusEl);
        task_content_el.appendChild(statusSelect); 
    }
});