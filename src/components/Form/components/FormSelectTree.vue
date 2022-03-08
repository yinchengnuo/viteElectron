<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
const emits = defineEmits(['_props'])

const refItem = ref()

onMounted(() => {
    watch(refItem.value.$props, () => {
        emits('_props')
    })
})
</script>

<template>
    <a-cascader ref="refItem" v-bind="$attrs" class="flex1">
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-cascader>
</template>

<script lang="ts">
export default {
    name: 'FormSelectTree'
}
</script>
