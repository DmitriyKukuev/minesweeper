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
                {{ key }}: {{ value }}
            </div>
        </div>

        <div class="flex gap-2">
            <button class="btn" @click="newGame">new game</button>
        </div>

        <div>realMinesCount: {{ game?.realMinesCount ?? 0 }}</div>
        <div>playTime: {{ game?.getTimer.toString() ?? 0 }}</div>

        <canvas
            v-bind="canvasAttrs"
            ref="canvasEl"
            @mousedown.prevent="onMouseDown"
            @mouseup.prevent="onMouseUp"
            @contextmenu.prevent
        />
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import Game from '@/game/Game.ts';
import {EMouseButton} from '@/enums/mouse-button.ts';

const canvasEl = ref<HTMLCanvasElement | null>(null);
const game = ref<Game | null>(null);

// todo класс с настройками игры
const settings = {
    columns: 10,
    rows: 10,
    minesCount: 10,
    cellSize: 25,
}

const canvasAttrs = computed(() => ({
    width: settings.columns * settings.cellSize,
    height: settings.rows * settings.cellSize,
}));

let leftClickCoords: [number, number] | null = null;

function onMouseDown(event: MouseEvent) {
    if (event.button === EMouseButton.left) {
        // Клик по полю происходит в mouseup
        leftClickCoords = [event.offsetX, event.offsetY];

        return;
    }

    if (event.button === EMouseButton.right) {
        game.value?.onRightClick(event.offsetX, event.offsetY);

        return;
    }
}

function onMouseUp(event: MouseEvent) {
    if (
        event.button === EMouseButton.left
        && leftClickCoords != null
    ) {
        game.value?.onLeftClick(...leftClickCoords);
        leftClickCoords = null;
    }
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

function newGame() {
    game.value?.init();
}

onMounted(() => {
    init();
});
</script>
