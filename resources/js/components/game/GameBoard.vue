<template>
    <div>
        <canvas v-bind="canvasAttrs" ref="canvasEl"/>
    </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

const canvasEl = ref<HTMLCanvasElement|null>(null);

// todo
const canvasWidth = 600;
const canvasHeight = 500;

const canvasAttrs = computed(() => ({
    width: canvasWidth,
    height: canvasHeight,
}));

const square = {
    width: 25,
    height: 25,
}

const settings = {
    columns: 10,
    rows: 10,
}

function init() {
    if (
        !canvasEl.value
        || !canvasEl.value?.getContext
    ) {
        return;
    }

    const context = canvasEl.value!.getContext('2d', {alpha: false});

    context.fillStyle = "rgba(154,154,250,0.5)";
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // const rectangle = new Path2D();
    // rectangle.rect(0, 0, square.width, square.height);

    context.fillStyle = 'rgba(15,211,161,0.5)';

    for (let i = 0; i < settings.rows; i++) {
        let x = i * square.width

        for (let j = 0; j < settings.columns; j++) {
            let y = j * square.height;
            context.strokeRect(x, y, square.width, square.height);
        }
    }
}

onMounted(() => {
    init();
});
</script>
