<script setup lang="ts">
import TabBar from './components/TabBar/TabBar.vue'
import MenuBar from './components/MenuBar/MenuBar.vue'
</script>

<template>
    <div class="viewBar h100 flexc">
        <MenuBar />
        <TabBar />
        <div class="w100 flex1" style="position: relative">
            <div class="w100 h100" style="position: absolute; top: 0; left: 0">
                <router-view v-slot="{ Component }">
                    <transition name="view" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>
