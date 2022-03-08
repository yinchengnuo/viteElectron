<script lang="ts" setup>
import moment from 'moment'
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
    <a-range-picker
        ref="refItem"
        :showTime="{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
        }"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        v-bind="$attrs"
        class="flex1"
    >
        <template v-for="(item, name, index) in $slots" :key="index" #[name]>
            <component :is="item" />
        </template>
    </a-range-picker>
</template>

<script lang="ts">
export default {
    name: 'FormRange'
}
</script>
