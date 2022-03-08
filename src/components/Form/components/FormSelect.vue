<script setup lang="ts">
import { onMounted, useSlots, ref, watch } from 'vue'

const slots = useSlots()
const slotsNames = Object.entries(slots)
    .filter((e) => e[0] !== 'default')
    .map((e) => ({ name: e[0], slot: e[1] }))
const slotsDefauut = slots.default ? (slots.default as any)() : []

const emits = defineEmits(['_props'])

const refItem = ref()

onMounted(() => {
    watch(refItem.value.$props, () => {
        emits('_props')
    })
})
</script>

<template>
    <a-select ref="refItem" v-bind="$attrs" class="flex1">
        <template v-for="(item, index) in slotsNames" :key="index" #[item.name]>
            <component :is="item.slot" />
        </template>
        <template v-for="(item, index) in slotsDefauut" :key="index">
            <component :is="item" />
        </template>
    </a-select>
</template>

<script lang="ts">
export default {
    name: 'FormSelect'
}
</script>
