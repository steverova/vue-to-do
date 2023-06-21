<script setup>

import { ref, onMounted } from 'vue'
import { useToast } from "vue-toastification";
import openDatabase from './Database/IndexDB';
import { addTask, getTasks, deleteTask, updateStatusTask } from "./Database/services";
import Swal from 'sweetalert2'

const task = ref('');
const jsonTasks = ref([]);

const toast = useToast({
  position: 'bottom-center'
});

const deleteT = (id) => {

  Swal.fire({
    title: 'Are you sure \n to delete this task?',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    confirmButtonColor: "#f2433c",
    denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      deleteTask(id);
      get();
    }
  })
}

const updateStatus = (id, status) => {

  console.log(id);
  console.log(status)
  updateStatusTask(id, !status);
  // get();
}

const add = () => {

  const newTask = {
    task: task.value,
    status: false,
    date: formatDate()
  }

  addTask(newTask);
  get();
  task.value = "";

  toast.success("Task added successfully", {
    timeout: 2000
  });
}

const get = () => {
  getTasks((tasks) => {
    jsonTasks.value = tasks;
  });
}

function formatDate() {
  const date = new Date();
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', { month: '2-digit' });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return [year, month, day].join('-');
}

onMounted(() => {
  openDatabase();
  get();
})
</script>



<template>
  <div style="background-color: #242424" class="content p-3 min-vh-100">
    <div class="col-sm-8 col-md-8 col-lg-7 col-xxl-4 mx-auto shadow p-3 rounded rounded-3 bg-light">
      <div class="input-group mb-3 border border-5 rounded rounded-5">
        <input v-model="task" type="text" class="input-add-task form-control" placeholder="Add new Task..."
          aria-label="Recipient's username" aria-describedby="button-addon2" />
        <button @click="add" class="btn btn-primary btn-add-task" type="button" id="button-addon2">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>

      <ul class="border border-5 rounded rounded-5 nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="rounded rounded-5 nav-link active" id="pills-home-tab" data-bs-toggle="pill"
            data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
            All
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="rounded rounded-5 nav-link" id="pills-profile-tab" data-bs-toggle="pill"
            data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
            Pending
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="rounded rounded-5 nav-link" id="pills-contact-tab" data-bs-toggle="pill"
            data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">
            Complete
          </button>
        </li>
      </ul>
      <hr />

      <div class="tab-content" id="pills-tabContent">
        <div class="px-3" v-for="(item, index) in jsonTasks" v-bind:key="index">
          <div class="d-flex align-items-center border border-2 rounded rounded-3 p-2 mb-2 hover-effect">
            <div class="me-4">
              <input @click="updateStatus(item.id, item.status)" class="form-check-input" type="checkbox"
                v-model="item.status" id="myCheckbox" />
            </div>

            <div class="flex-grow-1 text-center me-3">
              <p class="text-start" :class="{ 'text-decoration-line-through': item.status }">
                {{ item.task }}
              </p>
            </div>
            <div class="ms-auto">

              <button @click="deleteT(item.id)" type="button" class="btn btn-danger btn-sm rounded-pill">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
          ...A
        </div>
        <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
          ...B
        </div>
        <div class="tab-pane fade" id="pills-disabled" role="tabpanel" aria-labelledby="pills-disabled-tab" tabindex="0">
          ...C
        </div>
      </div>
    </div>
  </div>
</template>
