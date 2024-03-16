<template>
    <div>
        <div class="font-bold">
            Сложность игры
        </div>

        <div class="flex gap-2">
            <button
                class="btn bg-green-600"
                v-for="preset in defaultPresetKeys"
                :key="preset"
                @click="setPreset(preset)"
            >
                {{ preset }}
            </button>
        </div>

        <div
            v-for="(value, key) in settings"
            :key="key"
        >
            {{ key }}: {{ value }}
        </div>
    </div>
</template>

<script setup lang="ts">
import DifficultSettings, {EDefaultPreset} from '@/game/DifficultSettings.ts';
import {computed} from 'vue';

const settings = defineModel<DifficultSettings>({required: true});

const defaultPresetKeys = computed(() => {
    return Object.keys(EDefaultPreset);
});

function setPreset(preset: string) {
    settings.value.setPreset(<EDefaultPreset>preset);
}
</script>
