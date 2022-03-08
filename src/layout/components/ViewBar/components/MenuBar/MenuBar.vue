<script setup lang="ts">
import { useRoute } from 'vue-router'
import routes from '@/router/routes'
import MenuItem from './components/MenuItem.vue'

const Route = useRoute()
</script>

<template>
    <div class="menu_bar w100">
        <a-menu :selectedKeys="[Route.path]" mode="horizontal" @select="({ key }: { key: string }) => $router.replace(key)">
            <template v-for="item in routes" :key="item.path">
                <template v-if="item.children && item.children.length">
                    <MenuItem :menu="item" />
                </template>
                <template v-else>
                    <a-menu-item :key="item.path">
                        {{ item.path.split("/").at(-1) }}
                    </a-menu-item>
                </template>
            </template>
            <a-menu-item key="/401"> 401 </a-menu-item>
            <a-menu-item key="/404"> 404 </a-menu-item>
        </a-menu>
    </div>
</template>
