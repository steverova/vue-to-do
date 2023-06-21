import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const app = createApp(App)

app.use(VueSweetalert2);
app.use(router)
app.use(Toast);

app.mount('#app')
