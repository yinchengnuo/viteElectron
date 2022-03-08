<script setup lang="ts">
import { uuid, thousandthDot } from '@/utils'
import { nextTick, onMounted, onUnmounted, Ref, ref, useSlots, watch } from 'vue'

const props = defineProps<{
    data?: Array<any>;
    select?: Array<any>;
    page?: any;
    auto?: boolean;
    total?: string;
    pageSize?: string;
    current?: string;
    selectModifiers?: any;
}>()

const total = props.total || 'total'
const pageSize = props.pageSize || 'pageSize'
const current = props.current || 'current'

const emits = defineEmits(['update:page', 'page', 'update:select'])

const slots = (useSlots().default as any)() as Array<any>
const summaryData: Ref<any> = ref([])
const dotField = slots.filter((e) => e.props && e.props.dot !== undefined).map((e) => e.props.dataIndex)
const summaryField: Array<string> = slots.filter((e) => e.props && e.props.summary !== undefined).map((e) => e.props.dataIndex)
const data: Ref<Array<any>> = ref([])
const rowKey = ref('')
const refTable = ref()
const scroll = ref({
    x: '100%',
    y: 0,
    scrollToFirstRowOnChange: true
})

const makeSummary = () =>
    nextTick(() => {
        if (summaryField.length) {
            const table = refTable.value.$el.parentElement.getElementsByClassName('ant-table-body')[0]
            const summary = refTable.value.$el.getElementsByClassName('ant-table-footer')[0].getElementsByClassName('ant-table-body')[0]
            if (summary.offsetWidth - summary.children[0].offsetWidth) {
                summary.style.paddingBottom = '16px'
                table.onscroll = (e: any) => {
                    summary.scrollTo(e.target.scrollLeft, 0)
                }
                summary.onscroll = (e: any) => {
                    table.scrollTo(e.target.scrollLeft, table.scrollTop)
                }
            } else {
                summary.style.paddingBottom = '0px'
            }
        }
    })

watch(
    () => props.data,
    () => {
        data.value = (props.data || []).map((e: any) => ({
            ...e,
            ...dotField.reduce((_, field) => ({ ..._, [field]: thousandthDot(e[field]) }), {})
        }))
        rowKey.value = props.data?.at(0)?.id ? 'id' : '__uuid'
        if (rowKey.value === '__uuid') {
            data.value = (props.data || []).map((e: any) => ({
                ...e,
                __uuid: uuid()
            }))
        }
        if (summaryField.length) {
            summaryData.value = [
                (props.data || []).reduce(
                    (result: any, item: any) => {
                        return {
                            __uuid: uuid(),
                            [slots.map((e) => e.props)[0].dataIndex]: '合计',
                            ...summaryField.reduce((_, field) => ({ ..._, [field]: result[field] + Number(item[field]) }), {})
                        }
                    },
                    {
                        ...summaryField.reduce((_, field) => ({ ..._, [field]: 0 }), {})
                    }
                )
            ]
            summaryData.value[0] = {
                ...summaryData.value[0],
                ...dotField.reduce((_, field) => ({ ..._, [field]: thousandthDot(summaryData.value[0][field]) }), {})
            }
            makeSummary()
        }
    },
    {
        immediate: true
    }
)

onMounted(() => {
    if (!props.auto) {
        const el = refTable.value.$el.parentElement
        el.style.overflow = 'hidden'
        const observer = new ResizeObserver(async ([{ contentRect }]) => {
            await makeSummary()
            const pagination = el.getElementsByClassName('ant-table-pagination')[0]
            const footer = el.getElementsByClassName('ant-table-footer')[0]
            scroll.value.y =
                contentRect.height -
                el.getElementsByClassName('ant-table-thead')[0].offsetHeight -
                (pagination ? pagination.offsetHeight + 10 : 0) -
                (footer ? footer.offsetHeight : 0)
            nextTick(() => {
                el.getElementsByClassName('ant-table-body')[0].style.height = scroll.value.y + 'px'
            })
        })
        observer.observe(el, { box: 'border-box' })
        onUnmounted(() => {
            observer.unobserve(el)
        })
    }
})

const selectedRowKeys: Ref<Array<string>> = ref([])

// 表格数据变化
const change = (pagination: any) => {
    selectedRowKeys.value = []
    emits('page', { [current]: pagination.current, [pageSize]: pagination.pageSize, [total]: props.page.total })
    emits('update:page', { [current]: pagination.current, [pageSize]: pagination.pageSize, [total]: props.page.total })
}

const key = ref(true)
const onChange = (keys: Array<string>) => {
    selectedRowKeys.value = keys
    key.value = false
    nextTick(() => {
        key.value = true
    })
    const selectModifiers = Object.keys(props.selectModifiers || {})
    let emitsData: Array<any> = []
    if (selectModifiers.length) {
        if (selectModifiers.length === 1) {
            emitsData = (props.data || []).filter((e) => keys.includes(e[rowKey.value])).map((e) => e[selectModifiers[0]])
        } else {
            emitsData = (props.data || [])
                .filter((e) => keys.includes(e[rowKey.value]))
                .map((e) => ({ ...selectModifiers.reduce((result, item) => ({ ...result, [item]: e[item] }), {}) }))
        }
    } else {
        emitsData = (props.data || []).filter((e) => keys.includes(e[rowKey.value]))
    }
    emits('update:select', emitsData)
}

const defaultPageSizeOptions = ['50', '100', '200', '500', '999']
const pageSizeOptions = defaultPageSizeOptions.includes(props?.page[pageSize].toString())
    ? defaultPageSizeOptions
    : [...defaultPageSizeOptions, props?.page[pageSize].toString()].sort((a: string, b: string) => Number(a) - Number(b))
</script>

<template>
    <a-table
        ref="refTable"
        class="table"
        size="small"
        :rowKey="rowKey"
        bordered
        :scroll="scroll"
        :dataSource="data"
        :pagination="props.page ? {
            pageSizeOptions,
            showSizeChanger: true,
            showQuickJumper: true,
            hideOnSinglePage: false,
            total: props.page[total],
            current: props.page[current],
            pageSize: props.page[pageSize] ,
            defaultPageSize: props.page[pageSize],
            showTotal: (total: number) => `共${total}条`,
        } : false"
        :rowSelection="props.data && props.select && key ? { onChange, selectedRowKeys } : undefined"
        @change="change"
        v-bind="$attrs"
    >
        <slot />
        <template v-if="summaryField.length" #footer>
            <a-table
                rowKey="__uuid"
                :showHeader="false"
                :scroll="{ x: '100%' }"
                :pagination="false"
                size="small"
                :dataSource="summaryData"
                :rowSelection="props.select ? {} : undefined"
            >
                <template v-for="(item, name, index) in ($slots.default as any)()" :key="index">
                    <component :is="item" />
                </template>
            </a-table>
        </template>
    </a-table>
</template>

<style lang="scss" scoped>
.table {
    width: 100%;

    :deep(.ant-table-body) {
        overflow: overlay !important;
        //自动移滚动条样式
        &::-webkit-scrollbar {
            width: 16px;
            height: 16px;
            &:horizontal {
                display: none;
            }
        }
        &::-webkit-scrollbar-thumb {
            background-color: #cdcdcd;
        }
        &::-webkit-scrollbar-track {
            background-color: #efefef;
        }
    }

    :deep(.ant-table-footer) {
        padding: 0;
        .ant-table-body {
            &::-webkit-scrollbar {
                &:horizontal {
                    display: block;
                }
            }
            .ant-table-selection-column {
                > span {
                    display: none;
                }
            }
        }
    }
    :deep(.ant-table-pagination) {
        float: left;
        margin: 8px 0 0;
    }
}
</style>
