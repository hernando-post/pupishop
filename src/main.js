import { createApp, h } from 'vue';
import { createPinia } from 'pinia';
import { ApolloClients } from '@vue/apollo-composable';
import App from './App.vue';
import client from './apollo';
import { nhost } from "@/lib/nhost";
import router from './router';
import { provide } from 'vue';
import './index.css';
import Vue3Lottie from 'vue3-lottie';

const pinia = createPinia();
const app = createApp({
  setup() {
    provide(ApolloClients, { default: client });
  },
  render: () => h(App)
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.protected)) {
    const isAuthenticated = await nhost.auth.isAuthenticatedAsync();
    if (!isAuthenticated) {
      return next('/login');
    }
  }
  next();
});

app.use(nhost);
app.use(router);
app.use(pinia);
app.use(Vue3Lottie); // ✅ Corregido
app.mount('#app');