
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
        // Создаем элементы задачи
        const task_el = document.createElement("div");
        task_el.classList.add("task");
        task_el.classList.add(priority);
        task_el.classList.add("active");

        const task_content_el = document.createElement("div");
        task_content_el.classList.add("content");

        task_el.append(task_content_el); // Добавляем блок с содержимым к задаче

        const task_input_el = document.createElement("input"); // Создаем поле ввода для текста задачи
        task_input_el.classList.add("text"); // Добавляем класс для стилизации
        task_input_el.type = "text"; // Устанавливаем тип поля
        task_input_el.value = task; // Устанавливаем текст задачи
        task_input_el.setAttribute("readonly", "readonly"); // Делаем поле только для чтения

        task_content_el.append(task_input_el);

        const task_actions_el = document.createElement("div"); // Создаем блок для действий с задачей
        task_actions_el.classList.add("actions"); // Добавляем класс для стилизации

        const task_delete_el = document.createElement("button"); // Создаем кнопку для удаления задачи
        task_delete_el.classList.add("delete"); // Добавляем класс для стилизации
        task_delete_el.innerHTML = "Удалить"; // Устанавливаем текст кнопки

        // Добавляем обработчик для удаления задачи при клике на кнопку
        task_delete_el.addEventListener('click', () => {
            const index = tasks.findIndex(t => t.task === task && t.priority === priority);
            if (index !== -1) {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                task_el.remove();
            }
        });

        const task_edit_el = document.createElement("button"); // Создаем кнопку для редактирования задачи
        task_edit_el.classList.add("edit");
        task_edit_el.innerHTML = "Изменить";

        task_edit_el.addEventListener('click', (event) => {
            event.stopPropagation(); // Остановить распространение события клика

            task_input_el.removeAttribute("readonly");
            task_input_el.focus();
        });

        task_input_el.addEventListener('blur', () => {
            task_input_el.setAttribute("readonly", "readonly");
            const index = tasks.findIndex(t => t.task === task && t.priority === priority);
            if (index !== -1) {
                tasks[index].task = task_input_el.value;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        });

        task_actions_el.append(task_delete_el, task_edit_el); // Добавляем кнопки действий к блоку с действиями
        task_el.append(task_actions_el);
        list_el.append(task_el);

        const priorityEl = document.createElement("span"); // Создаем элемент для отображения приоритета
        priorityEl.classList.add("priority"); // Добавляем класс для стилизации
        priorityEl.classList.add("priority-" + priority);
        priorityEl.textContent = `Приоритет: ${priorityMapping[priority] || priority}`;

        const statusEl = document.createElement("span"); // Создаем элемент для отображения статуса задачи
        statusEl.classList.add("status");
        statusEl.textContent = status;

        const spaceEl = document.createTextNode(' '); // Чисто пробел между статусом и приоритетом)))

        // Добавляем элементы приоритета и статуса к содержимому задачи
        task_content_el.appendChild(priorityEl);
        task_content_el.appendChild(spaceEl);
        task_content_el.appendChild(statusEl);

        // Изменение статуса задачи при клике на нее
        task_el.addEventListener('click', () => {
            if (statusEl.textContent === 'Активно') {
                statusEl.textContent = 'Завершено';
                task_el.classList.remove('active');
                task_el.classList.add('completed');
            } else if (statusEl.textContent === 'Завершено') {
                statusEl.textContent = 'Отменено';
                task_el.classList.remove('completed');
                task_el.classList.add('cancelled');
            } else if (statusEl.textContent === 'Отменено') {
                statusEl.textContent = 'Активно';
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
