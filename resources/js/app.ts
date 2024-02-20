import 'vue-final-modal/style.css';
import '../css/app.css';
import {createRouter, createWebHistory} from 'vue-router';
import {createPinia} from 'pinia';
import {createVfm} from 'vue-final-modal';
import {createApp} from 'vue';
import routes from '@/helper/routes.ts';
import App from '@/App.vue';

const rootElement = document.querySelector('#app') as HTMLElement;

const propsString = rootElement.dataset.props;
const props = propsString ? JSON.parse(propsString) : null;
rootElement.removeAttribute('data-props');

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const pinia = createPinia();
const vfm = createVfm();
const app = createApp(App, props);

app.use(router);
app.use(pinia);
app.use(vfm);

app.mount(rootElement);
