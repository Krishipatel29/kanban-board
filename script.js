const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let draggedElement = null;

let taskData = {
    todo: [],
    progress: [],
    done: []
};

const columns = [todo, progress, done];


// ===============================
// UPDATE TASK COUNT
// ===============================

function updateTaskCount() {

    columns.forEach(column => {

        const count = column.querySelector(".count");

        count.innerText =
            column.querySelectorAll(".task").length;

    });

}


// ===============================
// SAVE TASK DATA TO LOCAL STORAGE
// ===============================

function saveTaskData() {

    taskData = {
        todo: [],
        progress: [],
        done: []
    };

    columns.forEach(column => {

        taskData[column.id] = Array.from(
            column.querySelectorAll(".task")
        ).map(task => {

            return {
                title: task.querySelector("h2").innerText,
                description: task.querySelector("p").innerText
            };

        });

    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(taskData)
    );

}


// ===============================
// ADD TASK FUNCTION
// ===============================

function addTask(title, description, column) {

    const task = document.createElement("div");

    task.classList.add("task");

    task.setAttribute("draggable", "true");

    task.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button>Delete</button>
    `;


    // Drag Start

    task.addEventListener("dragstart", () => {

        draggedElement = task;

    });


    // Drag

    task.addEventListener("drag", () => {

        console.log("dragging");

    });


    // Delete

    const deleteButton = task.querySelector("button");

    deleteButton.addEventListener("click", () => {

        task.remove();

        updateTaskCount();

        saveTaskData();

    });


    column.appendChild(task);

}


// ===============================
// LOAD TASKS FROM LOCAL STORAGE
// ===============================

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {

    const data = JSON.parse(savedTasks);

    for (const columnId in data) {

        const column = document.querySelector(`#${columnId}`);

        data[columnId].forEach(taskData => {

            addTask(
                taskData.title,
                taskData.description,
                column
            );

        });

    }

}


// ===============================
// INITIAL COUNT
// ===============================

updateTaskCount();


// ===============================
// DRAG & DROP
// ===============================

function addDragEventsOnColumn(column) {

    column.addEventListener("dragenter", (e) => {

        e.preventDefault();

        column.classList.add("hover-over");

    });


    column.addEventListener("dragleave", () => {

        column.classList.remove("hover-over");

    });


    column.addEventListener("dragover", (e) => {

        e.preventDefault();

    });


    column.addEventListener("drop", () => {

        column.appendChild(draggedElement);

        column.classList.remove("hover-over");

        saveTaskData();

        updateTaskCount();

    });

}


addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);


// ===============================
// MODAL OPEN / CLOSE
// ===============================

const toggleModalButton =
    document.querySelector("#toggle-modal");


toggleModalButton.addEventListener("click", () => {

    const modal =
        document.querySelector("#modal");

    modal.classList.toggle("active");

});


const modalbg =
    document.querySelector(".modal .bg");


modalbg.addEventListener("click", () => {

    const modal =
        document.querySelector("#modal");

    modal.classList.remove("active");

});


// ===============================
// ADD NEW TASK
// ===============================

const addTaskButton =
    document.querySelector("#add-task");


addTaskButton.addEventListener("click", () => {

    const taskTitleInput =
        document.querySelector("#task-title-input");

    const taskTitle =
        taskTitleInput.value;


    const taskDescriptionInput =
        document.querySelector("#task-description-input");

    const taskDescription =
        taskDescriptionInput.value;


    addTask(
        taskTitle,
        taskDescription,
        todo
    );


    // Save updated data

    saveTaskData();


    // Update count

    updateTaskCount();


    // Clear inputs

    taskTitleInput.value = "";

    taskDescriptionInput.value = "";


    // Close modal

    const modal =
        document.querySelector("#modal");

    modal.classList.remove("active");

});