<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
defineProps<{
    showHandler?: boolean | string;
}>()

const emits = defineEmits(['_props'])

const refItem = ref()

onMounted(() => {
    watch(refItem.value.$props, () => {
        emits('_props')
    })
})
</script>

<template>
    <a-input-number ref="refItem" v-bind="$attrs" :class="{ handler: !showHandler }" class="flex1">
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-input-number>
</template>

<script lang="ts">
export default {
    name: 'FormInputNumber'
}
</script>

<style lang="scss" scoped>
.handler {
    :deep(.ant-input-number-handler-wrap) {
        display: none;
    }
}
</style>
