<template>
    <div class="space-y-2">
        <Difficult v-model="settings"/>

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
import DifficultySettings, {EDefaultPreset} from '@/game/DifficultySettings.ts';
import Difficult from '@/components/game/Difficult.vue';

const canvasEl = ref<HTMLCanvasElement | null>(null);
const game = ref<Game | null>(null);

const cellSize = 25;

const settings = ref(new DifficultySettings(EDefaultPreset.professional));

const canvasAttrs = computed(() => ({
    width: settings.value.columnsCount * cellSize,
    height: settings.value.rowsCount * cellSize,
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

    game.value = new Game(settings.value, cellSize, context);
    game.value?.init();
}

function newGame() {
    game.value?.init();
}

onMounted(() => {
    init();
});
</script>
