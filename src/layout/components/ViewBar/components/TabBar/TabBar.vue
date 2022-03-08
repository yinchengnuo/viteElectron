<script setup lang="ts">
import { useStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'

const Store = useStore()
const Route = useRoute()
const Router = useRouter()

const activeKey = computed({
    get () {
        return Route.path
    },
    set (path: string) {
        Router.replace(path)
    }
})
</script>

<template>
    <div class="tab_bar w100">
        <a-tabs v-model:activeKey="activeKey" hideAdd size="small" type="editable-card" @edit="(path: String) => Store.commit('tab/DEL_TAB', { path })">
            <a-tab-pane v-for="item in Store.state.tab" :key="item.path" :tab="item.path.split('/').at(-1)" />
            <template #tabBarExtraContent>
                <a-dropdown>
                    <a-button>
                        <template #icon><DownOutlined /></template>
                    </a-button>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item @click="Store.commit('tab/DEL_TAB', { path: activeKey })">关闭</a-menu-item>
                            <a-menu-item @click="Store.commit('tab/DEL_OTHER')">关闭其他 </a-menu-item>
                            <a-menu-item @click="Store.commit('tab/DEL_ALL')">关闭全部</a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </template>
        </a-tabs>
    </div>
</template>

<style lang="scss" scoped>
.tab_bar {
    :deep(.ant-tabs-bar) {
        margin-bottom: 0 !important;
    }
}
</style>
