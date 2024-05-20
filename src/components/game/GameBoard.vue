<template>
    <div class="space-y-2">
        <DifficultSettingsComponent v-model="settings"/>

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
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import Game from '@/game/Game.ts';
import {EMouseButton} from '@/enums/mouse-button.ts';
import DifficultSettings, {EDefaultPreset} from '@/game/DifficultSettings.ts';
import DifficultSettingsComponent from '@/components/game/DifficultSettingsComponent.vue';

const canvasEl = ref<HTMLCanvasElement | null>(null);
const game = ref<Game | null>(null);

const cellSize = 30;

const settings = ref(new DifficultSettings(EDefaultPreset.professional));

const canvasAttrs = computed(() => ({
    width: settings.value.columnsCount * cellSize,
    height: settings.value.rowsCount * cellSize,
}));

let leftClickCoords: [number, number] | null = null;

function onMouseDown(event: MouseEvent) {
    if (event.button === EMouseButton.left) {
        // Клик по полю происходит в mouseup
        leftClickCoords = [event.offsetX, event.offsetY];
        game.value?.onLeftDown(...leftClickCoords);

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

// Новая игра при изменении настроек сложности
watch(settings, () => {
    nextTick(init);
}, {deep: true});

function init() {
    if (!canvasEl.value) {
        return;
    }

    const ctx = canvasEl.value?.getContext('2d', {alpha: false});

    if (!ctx) {
        return;
    }

    game.value = new Game(settings.value, cellSize, ctx);
    game.value?.init();
}

function newGame() {
    game.value?.init();
}

onMounted(() => {
    init();

    window.addEventListener('mouseup', () => {
        game.value?.onLeftUp();
    });
});
</script>
