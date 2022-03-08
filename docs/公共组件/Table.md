**开发人员：尹成诺（210216946）**
**维护人员：尹成诺（210216946）**

## 功能概览

Table 组件用于快速开发常规表格。

不同于 Form 的灵活，Table 组件不建议使用过多配置项目以实现 antdesignvue a-table 可以实现的效果。实际上，Table 并不能保证能够实现任意 a-table 可以实现的效果。但是你可以在使用 Table 组件时仅需要很少的参数或者无需参数就能够实现 a-table 中实现起来很复杂的地方或解决了 a-table 的一些槽点，包括但不仅限于：

-   自动根据父元素（窗口尺寸）调整 scroll.y
-   封装好的分页处理
-   封装好的多选处理
-   一个参数实现合计功能
-   数据处理
-   ...

一个简单的示例：

```vue
<script setup lang="ts">
const state = reactive({
    page: {
        total: 11111,
        current: 1,
        pageSize: 50
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
</script>

<template>
        <div style="height: 500px">
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
```

效果如下：

![table](/img/table.jpg)

## 使用说明

### data

Table 组件封装自 a-table template 风格 API。你只需要在 template 中定义好表格每一列的属性，最后将数据传入 data 即可。Table 组件有两个字组件分别是：Table.Column、Table.ColumnGroup，用法参考：a-table-column、a-table-column-group

### rowKey

Table 组件默认会使用数据中的 id 字段作为 a-table 的 rowKey。如果数据中不存在 id 字段，则会自动生成 \_\_uuid 字段作为 rowKey。

### auto

Table 默认会根据父元素的高度计算自身的纵向可滚动高度用于适应用户缩放操纵，内部使用 ResizeObserver 实现。因此默认使用 Table 组件时 Table 的父元素高度必须是固定的，设置 height 或者 flex: 1 等方式。如果你不需要 Table 根据父元素的高度自动计算纵向滚动距离，设计 Table 上的 auto 属性即可。此时 Table 组件不会出现纵向滚动条，高度由数据撑开。

### dot

为 Table.Column 设置 dot 属性则当前列的数字会被千分位分割。

### summary

为需要的 Table.Column 设置 summary 属性，则表哥底部会生成【合计】行，数据为设置 summary 的表格数据字段相加。

### page

Table 组件集成了分页功能，只需要绑定一个 v-model:page 对象即可。示例见上方。

page 对象默认字段为 total、current、pageSize。如果你希望使用自定义字段，在 Table 组件设置 total、current、pageSize 即可：

```vue
<script setup lang="ts">
const state = reactive({
    page: {
        total: 11111,
        aaa: 1,
        bbb: 50
    }
})

watch(
    () => state.page,
    (n) => console.log(n) // 分页变化打印 {aaa: 2, bbb: 25, total: 11111}
)
</script>

<template>
        <div style="height: 500px">
            <Table v-model:page="state.page" v-model:select.name.age="state.select" v-model:data="data" current="aaa" pageSize="bbb">
            <!-- ... -->
            </Table>
        </div>
    </div>
</template>
```

指定每页可以显示多少条默认为：['50', '100', '200', '500', '999']

如果 page 对象的 pageSize 不存在于上面的数组中，Table 组件会自动添加

Table 组件分页便会会触发 @page 事件。

当不使用 v-model:page 时，表格没有分页功能。

### select

Table 组件集成了多选功能，只需要绑定一个 v-model:select 对象即可。示例见上方。

v-model:select 支持不限数量的修饰符。

当 v-model:select 没有修饰符时，select 对象绑定 Array \<Object\> Object 为原始数据
当 v-model:select 有一个修饰符时，select 对象绑定 Array \<string\> string 为修饰符对应的字段的值
当 v-model:select 有多个个修饰符时，select 对象绑定 Array \<Object\> Object 为修饰符存在的字段对应的值

示例：

```vue
<script setup lang="ts">
const data = [
    { id: 1, age: 18, height: 123 },
    { id: 2, age: 18, height: 456 },
]

const select1 = [] // 当全选时，select1 为 [{ id: 1, age: 18, height: 123 } { id: 2, age: 18, height: 456 }]
const select2 = [] // 当全选时，select2 为 [1, 2]
const select3 = [] // 当全选时，select3 为 [{ id: 1, age: 18 } { id: 2, age: 18 }]
</script>

<template>
        <div style="height: 500px">
            <Table v-model:select="select1" v-model:data="data">
            <!-- ... -->
            </Table>
        </div>
         <div style="height: 500px">
            <Table v-model:select.id="select2" v-model:data="data">
            <!-- ... -->
            </Table>
        </div>
         <div style="height: 500px">
            <Table v-model:select.id.age="select3" v-model:data="data">
            <!-- ... -->
            </Table>
        </div>
    </div>
</template>
```

当不使用 v-model:select 时，表格没有多选功能。

## 注意事项

-   如果出现组件无法实现的场景，请联系维护人员
-   Table. 开头的 Table 子组件只能在 Table 内部使用
