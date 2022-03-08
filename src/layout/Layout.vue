<script setup lang="ts">
import { useStore } from '@/store'
import TitleBar from './components/TitleBar/TitleBar.vue'

const Store = useStore()
</script>

<template>
    <div class="layout h100 oh flexc">
        <TitleBar />
        <div class="w100 flex1">
            <router-view v-slot="{ Component }">
                <transition :name="Store.state.app.loginTransitionName" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>
