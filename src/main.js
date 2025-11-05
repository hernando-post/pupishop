import { createApp, h } from 'vue';
import { createPinia } from 'pinia';
import { ApolloClients } from '@vue/apollo-composable';
import App from './App.vue';
import client from './apollo';
import { nhost } from "@/lib/nhost" // Asegúrate de importar nhost correctamente
import router from './router'; // Asegúrate de importar router correctamente
import { provide } from 'vue'
import './index.css'; // Asegúrate de tener TailwindCSS configurado
import Vue3Lottie from 'vue3-lottie'
//import 'vue3-lottie/dist/style.css'

const pinia = createPinia();
const app = createApp({
  setup() {
    provide(ApolloClients, {
      default: client
    });
  },
  render: () => h(App)
});

app.use(nhost)
app.use(router)
app.use(pinia)
app.use(Vue3Lottie)
app.mount('#app')

