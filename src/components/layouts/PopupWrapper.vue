<template>
    <VueFinalModal
        :class="['wrapper', {'right': right}]"
        :content-class="['content', {'right': right}]"
        overlay-transition="vfm-fade"
        :content-transition="right ? 'vfm-slide-right' : 'vfm-fade'"
        @before-close="beforeClose"
    >
        <div class="flex items-center justify-between gap-10">
            <slot name="title"/>
            <button @click="close" class="ml-auto">
                <XMarkIcon class="w-8 h-8"/>
            </button>
        </div>

        <div>
            <slot/>
        </div>
    </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';
import {XMarkIcon} from '@heroicons/vue/24/outline';

const props = defineProps<{
    right?: boolean,
    beforeClose?: () => void,
}>();

const emit = defineEmits(['close']);

function close() {
    emit('close');
}
</script>

<style lang="postcss">
.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrapper.right {
    align-items: stretch;
    justify-content: flex-end;
}

.content {
    display: flex;
    flex-direction: column;
    gap: theme('gap.4');
    padding: theme('padding.4');
    width: theme('width.96');
    border-radius: theme('borderRadius.DEFAULT');
    border-color: theme('borderColor.gray.100');
    background: theme('backgroundColor.white');
    overflow: auto;
}

.content.right {
    width: theme('width.full');
    border-radius: 0;
}

@screen md {
    .content.right {
        width: theme('width.2/3');
    }
}

@screen lg {
    .content.right {
        width: theme('width.1/2');
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
}

</style>
