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
    <a-checkbox-group ref="refItem" v-bind="$attrs" class="flex1" />
</template>

<script lang="ts">
export default {
    name: 'FormCheckbox'
}
</script>
