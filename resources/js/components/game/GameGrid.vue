<template>
    <div>
        <canvas v-bind="canvasAttrs" ref="canvasEl" @click="onCanvasClick"/>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import Game from '@/game/Game.ts';

const canvasEl = ref<HTMLCanvasElement|null>(null);
const game = ref<Game|null>(null);

// todo
const settings = {
    columns: 20,
    rows: 15,
    cellSize: 25,
}

const canvasAttrs = computed(() => ({
    width: settings.columns * settings.cellSize,
    height: settings.rows * settings.cellSize,
}));

function onCanvasClick(event: MouseEvent) {
    game.value?.updateByCoords(event.offsetX, event.offsetY);
}

function init() {
    if (!canvasEl.value) {
        return;
    }

    const context = canvasEl.value?.getContext('2d', {alpha: false});

    if (!context) {
        return;
    }

    game.value = new Game(settings.columns, settings.rows, settings.cellSize, context);
    game.value?.start();
}

onMounted(() => {
    init();
});
</script>
