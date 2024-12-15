const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const loadingScreen = document.querySelector(".loading");
const apiKey = "675d6ade60a208ee1fde1ca1";
let allTodos = [];

getAllTodos();

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputElement.value.trim().length > 0) {
    addTodos();
  } else {
    toastr.error("Please enter a valid title", "Toastr App");
  }
});

async function addTodos() {
  showLoading();
  const todo = {
    title: inputElement.value,
    apiKey: apiKey,
  };

  const obj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  };

  const response = await fetch(`https://todos.routemisr.com/api/v1/todos`, obj);
  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      toastr.success("Added Successfully", "Toastr App");
      await getAllTodos();
      formElement.reset();
    }
  }
  hideLoading();
}

async function getAllTodos() {
  showLoading();
  const response = await fetch(
    `https://todos.routemisr.com/api/v1/todos/${apiKey}`
  );
  if (response.ok) {
    const data = await response.json();
    if (data.message === "success") {
      allTodos = data.todos;
      displayData();
    }
  }
  hideLoading();
}

function displayData() {
  let container = "";
  for (const element of allTodos) {
    container += `
        <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">
                <span onclick='markCompleted("${element._id}")' style="${
      element.completed ? "text-decoration: line-through;" : ""
    }" class="task_name">${element.title}</span>
                <div class="d-flex align-items-center gap-4">
                    ${
                      element.completed
                        ? '<span><i class="fa-regular fa-circle-check" style="color: #63E6BE;"></i></span> '
                        : ""
                    }
                    <span onclick="deleteTodo('${
                      element._id
                    }')" class="icon"><i class="fa-solid fa-trash-can"></i></span>
                </div>
        </li>
        `;
  }
  document.querySelector(".task_container").innerHTML = container;
  changeProgress();
}

async function deleteTodo(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      const todoData = {
        todoId: id,
      };

      const obj = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      };

      const response = await fetch(
        `https://todos.routemisr.com/api/v1/todos`,
        obj
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "Deleted!",
            text: "Your Todo has been deleted.",
            icon: "success",
          });

          await getAllTodos();
        }
      }
      hideLoading();
    }
  });
}

async function markCompleted(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you want to complete your Todos?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();
      const todoData = {
        todoId: id,
      };
      const obj = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      };
      const response = await fetch(
        `https://todos.routemisr.com/api/v1/todos`,
        obj
      );
      if (response.ok) {
        const data = await response.json();
        if (data.message === "success") {
          Swal.fire({
            title: "completed!",
            icon: "success",
          });
          await getAllTodos();
        }
      }
      hideLoading();
    }
  });
}

function showLoading() {
  loadingScreen.classList.remove("d-none");
}

function hideLoading() {
  loadingScreen.classList.add("d-none");
}

function changeProgress() {

    const completeTask = allTodos.filter((todo) => todo.completed).length;
    const totalTask = allTodos.length;
    document.getElementById("progress").style.width = `${(completeTask / totalTask) * 100}%`;

    const statusNumber = document.querySelectorAll(".status_number span");
    statusNumber[0].textContent = completeTask;
    statusNumber[1].textContent = totalTask;

}