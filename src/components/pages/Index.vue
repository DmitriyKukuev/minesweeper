<template>
    <BaseLayout>
        <GameGrid/>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/layouts/BaseLayout.vue';
import GameGrid from '@/components/game/GameBoard.vue';
import {invoke} from '@tauri-apps/api';
import {onMounted} from "vue";

onMounted(async () => {
    // пример использования tauri-api
    // @ts-ignore
    if (import.meta.env.TAURI_PLATFORM == 'windows') {
        const response = await invoke('example', {name: 'world'});
        console.log(response);
    }
});
</script>
