<script setup lang="ts">
import { useStore } from '@/store'
const Store = useStore()
</script>

<template>
    <router-view v-slot="{ Component }">
        <keep-alive :include="Store.getters['app/alives']">
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>
