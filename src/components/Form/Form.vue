<script setup lang="ts">
import { useSlots, ref, reactive, watch, nextTick, onMounted } from 'vue'

// 子组件
const Components = import.meta.globEager('./components/*.vue')
// 处理名称用于 component 组件使用
Object.entries(Components).forEach(([key, value]) => {
    Components[key.replaceAll('./components/', '').replaceAll('.vue', '')] = value
    delete Components[key]
})

const props = defineProps<{
    modelValue?: any;
    modelModifiers?: any;
    hideRight?: boolean;
    width?: string;
    spaceX?: string;
    spaceY?: string;
}>()

const emits = defineEmits(['update:modelValue', 'query', 'reset'])

let lock = false

// 表单项宽
const width = props.width || '300px'
// 表单项右间距
const spaceX = props.spaceX || '8px'
// 表单项下间距
const spaceY = props.spaceY || '8px'

// 表单数据
const model: any = reactive({})

// form 实例
const refForm = ref()
// 暴露 form 实例方法
const Expose = {}
defineExpose(Expose)
onMounted(() => {
    Object.assign(Expose, refForm.value)
})

// 插槽对象
const slots: any = useSlots()
// 插槽子组件
const slotsFormItem = (): Array<any> => (slots.default as any)().filter((e: any) => Components[e.type.name])

// 判断是否存在 name 为空的 form 子组件
if (slotsFormItem().find((e: any) => !e.props?.name)) {
    throw new Error(slots.find((e: any) => Components[e.type.name] && !e.props?.name).type.name + ' 组件 name 属性不存在')
}

const fillValue = (itemProps: any, value: any): string | undefined => {
    if (props.modelModifiers?.fill) {
        if (value === undefined) {
            if (itemProps.fill === undefined) {
                return ''
            } else {
                return itemProps.fill
            }
        }
    }
    return value
}

const setValue = (byProps: boolean) => {
    !lock &&
        slotsFormItem().forEach((e) => {
            if (e.type.name === 'FormRange') {
                const range = e.props.name.toString().split(',')
                if (range.length !== 2) {
                    throw new Error('FormRange 组件 name 属性长度不为 2')
                }
                model[range.join()] = [fillValue(e.props, props.modelValue[range[0]]), fillValue(e.props, props.modelValue[range[1]])]
                return
            }
            if (e.type.name === 'FormCheckbox' || e.type.name === 'FormSelectTree') {
                if (byProps) {
                    model[e.props.name] = (e.props.value === undefined ? props.modelValue[e.props.name] : e.props.value) || undefined
                } else {
                    model[e.props.name] = (props.modelValue[e.props.name] === undefined ? e.props.value : props.modelValue[e.props.name]) || undefined
                }
                return
            }
            if (byProps) {
                model[e.props.name] = e.props.value === undefined ? fillValue(e.props, props.modelValue[e.props.name]) : fillValue(e.props, e.props.value)
            } else {
                model[e.props.name] = props.modelValue[e.props.name] === undefined ? fillValue(e.props, e.props.value) : fillValue(e.props, props.modelValue[e.props.name])
            }
        })
}

// 根据 form 子组件类型给定默认值
watch(props.modelValue, setValue, {
    immediate: true
})

// 字段值变化监听
watch(
    model,
    () => {
        lock = true
        nextTick(() => {
            lock = false
        })
        emits(
            'update:modelValue',
            Object.entries(model).reduce((result: any, item: any) => {
                if (slotsFormItem().find((e) => e.props?.name === item[0]).type.name === 'FormRange') {
                    const range = item[0].split(',')
                    if (item[1][0] !== undefined) {
                        result[range[0]] = item[1][0]
                    }
                    if (item[1][1] !== undefined) {
                        result[range[1]] = item[1][1]
                    }
                    return result
                }
                if (item[1] !== undefined) {
                    result[item[0]] = item[1]
                }
                return result
            }, {})
        )
    },
    {
        deep: true,
        immediate: true
    }
)

// 重置
const reset = () => {
    refForm.value.resetFields()
}
</script>

<template>
    <div class="w100 form">
        <slot name="header" />
        <div class="body flex flex_c_fs">
            <a-form ref="refForm" v-bind="$attrs" class="flex1" :model="model" layout="inline">
                <template v-for="(item, index) in ($slots.default as any)()" :key="index">
                    <a-form-item
                        v-if="!item.type.toString().startsWith('Symbol')"
                        v-bind="item.props"
                        :style="{ width: item.props?.width || width, paddingRight: item.props?.spaceX || spaceX, paddingBottom: item.props?.spaceY || spaceY }"
                    >
                        <div class="w100 flex">
                            <component v-if="item?.children?.itemBefore" :is="item.children.itemBefore" />
                            <component v-model:value="model[item.props?.name as string]" :is="item" @_props="setValue(true)" />
                            <component v-if="item?.children?.itemAfter" :is="item.children.itemAfter" />
                        </div>
                    </a-form-item>
                </template>
            </a-form>
            <div v-if="!Boolean(props.hideRight)" class="right">
                <slot name="rightTop" />
                <div class="buttons flex">
                    <slot name="buttonLeft" />
                    <a-button type="primary" @click="$emit('query')">查询</a-button>
                    <slot name="buttonCenter" />
                    <a-button @click="reset">重置</a-button>
                    <slot name="buttonRight" />
                </div>
                <slot name="rightBottom" />
            </div>
        </div>
        <slot name="footer" />
    </div>
</template>

<style lang="scss" scoped>
.form {
    position: relative;
    box-sizing: border-box;
    background: rgb(239, 239, 239, 0.6);
    .body {
        :deep(.ant-form-item) {
            margin: 0;
            box-sizing: border-box;
        }
        .buttons {
            :not(:first-child) {
                margin-left: 8px;
            }
        }
    }
}
</style>
