<script setup lang="ts">
import { onMounted, ref } from 'vue'

const el = ref<HTMLElement>(document.body)
const height = ref(0)

onMounted(() => {
    height.value = el.value.offsetHeight
})
</script>

<template>
    <div ref="el" class="title_bat_left h100 flex1 flex flex_fs">
        <img class="ml4" src="@/assets/layout/logo.png" :style="{ height: (height / 3) * 2 + 'px' }" />
    </div>
</template>
