<template>
    <div class="flex flex-col gap-4 mt-40 mx-auto w-fit">
        <div class="flex flex-col gap-4">
            <div class="flex items-center gap-4">
                <button class="btn text-lg" @click="newGame">Новая игра</button>
                <DifficultSwitcher v-model="settings"/>
            </div>

            <InfoTable
                v-if="game"
                :game="<Game>game"
                :settings="settings"
            />
        </div>

        <canvas
            class="justify-self-center"
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
import {EMouseButton} from '@/enums/EMouseButton.ts';
import DifficultSettings from '@/game/DifficultSettings.ts';
import DifficultSwitcher from '@/components/game/DifficultSwitcher.vue';
import InfoTable from "@/components/game/InfoTable.vue";
import {EDefaultPreset} from '@/enums/EDefaultPreset.ts';

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

    const ctx = canvasEl.value.getContext('2d', {alpha: false});

    if (!ctx) {
        return;
    }

    game.value = new Game(settings.value, cellSize, ctx);
    game.value.init();
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
