import {RouteRecordRaw} from 'vue-router';
import Index from '@/components/pages/Index.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: Index,
        name: 'index',
    },
];

export default routes;
