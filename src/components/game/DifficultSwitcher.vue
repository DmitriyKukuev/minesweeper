<template>
    <div class="flex relative">
        <div class="btn text-lg" @click="toggle">
            Сложность
            <ChevronRightIcon class="w-6 transition-transform" :class="{'rotate-180': isOpen}"/>
        </div>

        <div class="flex gap-2 absolute left-full ml-3" v-if="isOpen">
            <button
                class="btn bg-green-600 text-lg"
                v-for="(preset, key) in defaultPresets"
                :key="key"
                @click="setPreset(key)"
            >
                {{ preset.name }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import DifficultSettings, {defaultPresets, EDefaultPreset} from '@/game/DifficultSettings.ts';
import {ChevronRightIcon} from '@heroicons/vue/16/solid';
import {ref} from "vue";

const isOpen = ref(false);
const settings = defineModel<DifficultSettings>({required: true});

function setPreset(preset: string): void {
    settings.value.setPreset(<EDefaultPreset>preset);
    isOpen.value = false;
}

function toggle(): void {
    isOpen.value = !isOpen.value;
}
</script>
