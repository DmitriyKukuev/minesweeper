import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {TUser} from '@/types/TUser.ts';

export const useUserStore = defineStore('user', () => {
    const user = ref<TUser|null>(null);

    function setUser(value: TUser): void {
        user.value = value;
    }

    function resetUser(): void {
        user.value = null;
    }

    const isAuth = computed(() => {
        return Boolean(user.value);
    });

    return {
        user,
        setUser,
        resetUser,
        isAuth,
    }
})
