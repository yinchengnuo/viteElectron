<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
const props = defineProps<{
    button?: boolean | string;
    options?: Array<{
        label: string;
        value: string;
    }>;
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
    <a-radio-group ref="refItem" v-bind="$attrs" class="flex1">
        <template v-for="(item, index) in props.options || []" :key="index">
            <a-radio-button v-if="props.button" :value="item.value">{{ item.label }}</a-radio-button>
            <a-radio v-else :value="item.value">{{ item.label }}</a-radio>
        </template>
    </a-radio-group>
</template>

<script lang="ts">
export default {
    name: 'FormRadio'
}
</script>
