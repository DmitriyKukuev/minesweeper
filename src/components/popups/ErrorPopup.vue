<template>
    <PopupWrapper>
        <template #title>
            <h2 class="font-semibold text-xl">
                {{ title }}
            </h2>
        </template>

        <div class="flex gap-4">
            <XCircleIcon class="w-16 h-16 text-red-700 inline-block flex-shrink-0"/>
            <span>{{ message }}</span>
        </div>
    </PopupWrapper>
</template>

<script setup lang="ts">
import PopupWrapper from '@/components/layouts/PopupWrapper.vue';
import {XCircleIcon} from '@heroicons/vue/24/solid';

const props = withDefaults(defineProps<{
    title?: string,
    message?: string,
}>(), {
    title: 'Ошибка',
    message: 'Произошла непредвиденная ошибка',
});
</script>
