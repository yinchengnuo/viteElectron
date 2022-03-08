<script setup lang="ts">
import { reactive, onMounted, computed, watch } from 'vue'

const state = reactive({
    search: {
        name: '尹成诺',
        start: '2022-02-22 01:01:01'
    },
    page: {
        total: 11111,
        current: 1,
        pageSize: 25
    },
    select: []
})

const data = computed(() =>
    [...Array(11111)]
        .map((_, i) => ({
            key: i,
            id: (i + 1).toString(),
            name: 'John Brown',
            age: i + 1,
            street: 'Lake Park',
            building: 'C',
            number: 2035,
            companyAddress: 'Lake Street 42',
            companyName: 'SoftLake Co',
            gender: 'M'
        }))
        .slice((state.page.current - 1) * state.page.pageSize, state.page.current * state.page.pageSize)
)

const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
]

onMounted(() => {
    console.log(state.search, 'state.search')
})

watch(
    () => state.search,
    (n) => console.log(n)
)

watch(
    () => state.select,
    (n) => console.log(n)
)

watch(
    () => state.page,
    (n) => console.log(n)
)
</script>

<template>
    <div class="h100 flexc" style="box-sizing: border-box; padding: 8px">
        <Form v-model.fill="state.search" width="250px" :labelCol="{ style: { width: '80px' } }">
            <template #header><h4 class="flex" style="background: #dedede; color: red">#header</h4></template>
            <template #footer><h4 class="flex" style="background: #dedede; color: red; margin: 0">#footer</h4></template>
            <template #rightTop><h4 class="flex" style="background: #dedede; color: red">#rightTop</h4></template>
            <template #buttonLeft><h4 class="flex" style="background: #dedede; color: red">#buttonLeft</h4></template>
            <template #buttonCenter><h4 class="flex" style="background: #dedede; color: red">#buttonCenter</h4></template>
            <template #buttonRight><h4 class="flex" style="background: #dedede; color: red">#buttonRight</h4></template>
            <template #rightBottom
                ><h4 class="flexc" style="background: #dedede; color: red">
                    #rightBottom
                    <pre style="color: #000; font-size: 8px; line-height: 1">{{ JSON.stringify({ ...state.search }, null, 4) }}</pre>
                </h4></template
            >
            <Form.Input name="name" label="姓名" placeholder="请输入姓名">
                <template #prefix> #prefix </template>
                <template #suffix> #suffix </template>
            </Form.Input>
            <Form.Select
                name="sex"
                label="性别"
                placeholder="请选择性别"
                :options="[
                    { label: '男', value: '男' },
                    { label: '女', value: '女' },
                ]"
            >
                <template #suffixIcon>#suffixIcon</template>
            </Form.Select>
            <Form.InputNumber name="height" label="身高" placeholder="请输入身高" />
            <Form.Radio name="fruit1" label="水果1" width="500px" :options="options">
                <template #itemAfter> <span style="color: red">#itemAfter</span> </template>
            </Form.Radio>
            <Form.Radio name="fruit2" label="水果2" button size="small" width="500px" :options="options">
                <template #itemBefore> <span style="color: red">#itemBefore</span> </template>
            </Form.Radio>
            <Form.Checkbox name="fruit3" label="水果3" width="500px" :options="options">
                <template #itemBefore> <span style="color: red">#itemBefore</span> </template>
            </Form.Checkbox>
            <div style="background: #cdcdcd">自定义内容1</div>
            <Form.Time name="time" label="时间" />
            <Form.Date name="date" label="日期" value="2022-02-23" />
            <Form.Month name="month" label="月份" />
            <Form.Range name="start,end" label="时间区间" width="500px">
                <template #itemAfter> <span style="color: red">#itemAfter</span> </template>
            </Form.Range>
            <Form.SelectTree
                name="address"
                label="地址"
                placeholder="请选择地址"
                :options="[{ value: 'zhejiang', label: 'Zhejiang', children: [{ value: 'hangzhou', label: 'Hangzhou', children: [{ value: 'xihu', label: 'West Lake' }] }] }]"
            />
            <div class="flex" width="500px" style="background: #cdcdcd">自定义内容2</div>
        </Form>

        <div class="w100 flex1 mt8">
            <Table v-model:page="state.page" v-model:select.name.age="state.select" v-model:data="data">
                <Table.Column width="200px" dataIndex="name" title="name" />
                <Table.Column width="200px" dataIndex="age" title="age" summary />
                <Table.Column width="200px" dataIndex="street" title="street" />
                <Table.Column width="200px" dataIndex="building" title="building" />
                <Table.Column width="200px" dataIndex="number" title="number" dot summary />
                <Table.Column width="200px" dataIndex="companyName" title="companyName" />
                <Table.Column width="200px" dataIndex="gender" title="gender" />
                <Table.Column width="200px" dataIndex="companyAddress" title="companyAddress" />
            </Table>
        </div>
    </div>
</template>
