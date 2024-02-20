<template>
    <BaseLayout>
        <div class="container">
            Hello world!

            <div class="btn">
                <button @click="examplePopup">
                    example error popup
                </button>
            </div>
        </div>
    </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/components/layouts/BaseLayout.vue';
import {show} from '@/helper/popup.ts';

function examplePopup() {
    show('error')
}
</script>
