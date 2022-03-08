<script lang="ts" setup></script>

<template>
    <a-select-option v-bind="$attrs" class="flex1">
        <template v-for="(item, name, index) in $slots" :key="index">
            <component :is="item" />
        </template>
    </a-select-option>
</template>

<script lang="ts">
export default {
    name: 'FormSelectItem'
}
</script>
