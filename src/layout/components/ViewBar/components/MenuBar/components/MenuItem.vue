<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router'
defineProps<{ menu: RouteRecordRaw }>()
</script>

<template>
    <a-sub-menu>
        <template #title>{{ menu.path.split("/").at(-1) }}</template>
        <template v-for="item in menu.children" :key="item.path">
            <template v-if="item.children">
                <MenuItem :menu="item" />
            </template>
            <template v-else>
                <a-menu-item :key="item.path">
                    {{ item.path.split("/").at(-1) }}
                </a-menu-item>
            </template>
        </template>
    </a-sub-menu>
</template>
