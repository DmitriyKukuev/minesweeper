<template>
    <div class="rounded border-2 border-gray-400 max-w-60 text-lg">
        <div class="border-b-2 border-gray-400 py-0.5 px-1 text-center">
            {{ settings.name }} {{ settings.columnsCount }}x{{ settings.rowsCount }}
        </div>

        <div class="grid grid-cols-2">
            <div class="border-r-2 border-gray-400 text-right py-0.5 px-1">
                {{ settings.minesCount }}
            </div>

            <div class="py-0.5 px-1">
                {{ game.getTimer.toString() }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Game from "@/game/Game.ts";
    import DifficultSettings from "@/game/DifficultSettings.ts";

    const props = defineProps<{
        game: Game;
        settings: DifficultSettings;
    }>();
</script>