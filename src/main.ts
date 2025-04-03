import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@/assets/css/main.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router'; // Import the router

const app = createApp(App);

// Add all solid icons to the library
library.add(fas);

// Register FontAwesome component globally
app.component('fa', FontAwesomeIcon);

app.use(createPinia());
app.use(router);
app.mount('#app');
