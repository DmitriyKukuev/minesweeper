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
    const response = await invoke('example', {name: 'world'});
    console.log(response);
});
</script>
