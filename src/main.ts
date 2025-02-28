import { createApp } from 'vue';
import '@/assets/css/main.css';
import App from './App.vue';
import router from './router'; // Import the router

const app = createApp(App);
app.use(router); // Use the router in the app
app.mount('#app');
