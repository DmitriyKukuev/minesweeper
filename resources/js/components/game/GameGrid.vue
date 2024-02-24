<template>
    <div>
        <canvas v-bind="canvasAttrs" ref="canvasEl"/>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import Game from '@/game/Game.ts';

const canvasEl = ref<HTMLCanvasElement|null>(null);

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

function init() {
    if (!canvasEl.value) {
        return;
    }

    const context = canvasEl.value?.getContext('2d', {alpha: false});

    if (!context) {
        return;
    }

    const game = new Game(settings.columns, settings.rows, settings.cellSize, context);
    console.log(game); //todo remove
    game.start();
}

onMounted(() => {
    init();
});
</script>
