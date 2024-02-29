<template>
    <div class="space-y-2">
        <div>
            <div class="todo">
                todo сделать изменение и вывод настроек
            </div>

            <div class="font-bold">
                Настройки
            </div>

            <div
                v-for="(value, key) in settings"
                :key="key"
            >
                {{key}}: {{value}}
            </div>
        </div>

        <button class="btn" @click="start">new game</button>

        <div>realMinesCount: {{ game?.realMinesCount ?? 0 }}</div>

        <canvas v-bind="canvasAttrs" ref="canvasEl" @click="onCanvasClick"/>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import Game from '@/game/Game.ts';

const canvasEl = ref<HTMLCanvasElement|null>(null);
const game = ref<Game|null>(null);

// todo класс с настройками игры
const settings = {
    columns: 30,
    rows: 16,
    mineCount: 99,
    cellSize: 25,
}

const canvasAttrs = computed(() => ({
    width: settings.columns * settings.cellSize,
    height: settings.rows * settings.cellSize,
}));

function onCanvasClick(event: MouseEvent) {
    game.value?.onClick(event.offsetX, event.offsetY);
}

function start() {
    game.value?.init();
}

function init() {
    if (!canvasEl.value) {
        return;
    }

    const context = canvasEl.value?.getContext('2d', {alpha: false});

    if (!context) {
        return;
    }

    game.value = new Game(settings, context);
    game.value?.init();
}

onMounted(() => {
    init();
});
</script>
