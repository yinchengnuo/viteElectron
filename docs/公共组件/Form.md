**开发人员：尹成诺（210216946）**
**维护人员：尹成诺（210216946）**

## 功能概览

本项目中的 Form 组件提供了一种数据聚合方式用于处理表单数据。

实际上，本项目的 Form 组件的使用和 ant-design-vue 中的 a-form 非常像，因为 Form 组件就是基于 a-form 的封装，因此你可以在 Form 组件上使用任何 a-form 的配置属性和方法。

不同的是本项目中的 Form 将 a-form-item 上的属性劫持到了 Form 的子组件上，你可以在 Form 组件中嵌套 Form.Input、Form.Number、Form.Select、div 等任意元素作为 Form 子组件。

这些子元素就是表单项目，这些子元素的 props 将会映射到 a-form-item，因此你可以在 Form 子元素上使用任意 a-form-item 属性。同时一些封装好的 Form 子组件如 Form.Input 的 props 会映射到 a-input 组件上，因此我们可以在 Form 中使用 Form.Input 实现任何 ant-design-vue 可以实现的效果，其他组件如 Form.Number、Form.Select 类似。

一个简单的示例：

```vue
<script setup lang="ts">
import { reactive, onMounted } from 'vue'

const state = reactive({
    search: {
        name: '尹成诺',
        start: '2022-02-22 01:01:01'
    }
})

onMounted(() => {
    console.log(state.search) // { date: "2022-02-23", name: "尹成诺", start: "2022-02-22 01:01:01" }
})

const fruits = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
]
</script>

<template>
    <Form v-model="state.search" width="240px" :labelCol="{ style: { width: '80px' } }">
        <Form.Input name="name" label="姓名" placeholder="请输入姓名">
            <template #prefix> 🤓 </template>
            <template #suffix> 🤓 </template>
        </Form.Input>
        <Form.Select name="sex" label="性别" placeholder="请选择性别">
            <Form.SelectItem value="男">男</Form.SelectItem>
            <Form.SelectItem value="女">女</Form.SelectItem>
        </Form.Select>
        <Form.Range name="start,end" label="时间区间" width="480px" />
        <Form.Time name="time" label="时间" />
        <Form.Date name="date" label="日期" value="2022-02-23" />
        <Form.Month name="month" label="月份" />
        <Form.Radio name="weight" label="单选" button size="small" width="480px" :options="fruits">
            <template #itemBefore> <span style="color: red">前插槽</span> </template>
        </Form.Radio>
        <Form.Checkbox name="fruit" label="多选" width="480px" :options="fruits">
            <template #itemAfter> <span style="color: red">后插槽</span> </template>
        </Form.Checkbox>
        <div class="flex" width="480px" style="background: #cdcdcd">自定义内容</div>
    </Form>
</template>
```

效果如下：

![form](/img/form.jpg)

## 使用说明

### Form

Form 组件是包含 Form 子组件在内的一系列组件的统称，你可以使用 Form 组件快速构建表单组件。同时 Form 系列组件在基于 ant-design-vue 封装的基础上，拓展了大量插槽和参数，你可以使用 Form 组件组合出任何能用 ant-design-vue 实现的效果，不同的是 Form 使用更为方便，功能更为强大。Form 组件目前有以下子组件：

-   Form.Date
-   Form.Time
-   Form.Input
-   Form.Month
-   Form.Radio
-   Form.Range
-   Form.Select
-   Form.Checkbox
-   Form.SelectItem
-   Form.SelectTree
-   Form.InputNumber

使用时必须将 Form 子组件用于 Form 组件内部，同时 Form 子组件的 name 属性是必须的，否则会抛出错误。这个 name 属性会被作为字段名称映射到 Form 组件双向绑定的对象上。

在时间区间选择器中，name 属性可以为 "start, end" 或 ["start", "end"]

```vue
<template>
    <Form v-model="data" width="240px" :labelCol="{ style: { width: '80px' } }">
        <Form.Input name="name" label="姓名" placeholder="请输入姓名" />
        <Form.Range name="start,end" label="时间区间" />
    </Form>
</template>
```

你可以在 Form 子组件上使用 a-form-item 和当前子组件类型对应的 ant-design-vue 组件可以使用的任何属性。如：Form.Input 可以使用 a-form-item 和 a-input 的任何属性。其余子组件同理。

除了能够直接使用 a-form 的属性外，Form 新增了几个额外参与用于高度自定义表单组件：

### 配置

| 参数      | 说明                                                            | 类型    | 默认值 |
| --------- | --------------------------------------------------------------- | ------- | ------ |
| hideRight | 是否显示右侧按钮区域                                            | boolean | false  |
| width     | 表单项宽（此属性也存在于 Form 子组件上，会覆盖 Form 配置）      | string  | 300px  |
| spaceX    | 表单项右间距 （此属性也存在于 Form 子组件上，会覆盖 Form 配置） | string  | 8px    |
| spaceY    | 表单项下间距 （此属性也存在于 Form 子组件上，会覆盖 Form 配置） | string  | 8px    |

### 事件

| 参数  | 说明         |
| ----- | ------------ |
| query | 点击查询按钮 |
| reset | 点击重置按钮 |

### 方法

参考 [ant-design-vue 文档](https://2x.antdv.com/components/form-cn#API)。示例：

```vue
<script lang="ts" setup>
const refForm = ref()

const reset = () => {
    refForm.value.resetFields()
}
</script>
<template>
    <Form ref="refForm" v-model="data" width="240px" :labelCol="{ style: { width: '80px' } }">
        <Form.Input name="name" label="姓名" placeholder="请输入姓名" />
        <Form.Range name="start,end" label="时间区间" />
    </Form>
</template>
```

### 插槽

Form 及子组件提供了大量插槽用于自定义表单结构，分别是：

-   Form
    -   header
    -   footer
    -   rightTop
    -   buttonLeft
    -   buttonCenter
    -   buttonRight
    -   rightBottom
-   FormItem
    -   itemBefore
    -   itemAfter

这里有一张示意图，清晰的展现了 Form 组件和插槽的位置和作用：

![Form](/img/form.png)

### v-model

使用 Form 组件时，只需要使用 v-model 状态绑定一个 reactive 对象即可。Form 会根据根据内部的 Form 子组件 name 属性及 Form 子组件对应的表单数据变动，将 name 和 表单值实时映射到绑定的 reactive 对象。

既然实现了 v-model 双向数据绑定，那么就表示不仅是表单数据变动会映射到绑定的 reactive 对象上，reactive 对象上的变动也会实时映射到表单上。

实现了双向数据绑定的 Form 组件未某个字段设置默认值十分简单，只需要在初始化 reactive 对象时给制定字段指定值即可。不仅如此，你也可以通过 Form 子组件的 value 属性为字段设置默认值。Form 组件内部会将 value + name 映射到 reactive 对象上。 **但是此时想要获取这个字段的值需要等到 nextTIck。** 在 vue 业务组件里，这个时机通常是组件挂载之后。

### 默认值填充

Form 组件默认不对绑定的字段默认值进行处理。如：

```vue
<script lang="ts" setup>
const data = ref({})

onMounted(() => {
    console.log(data.value) // 打印： { name: "尹成诺" }
})
</script>
<template>
    <Form v-model="data" width="240px" :labelCol="{ style: { width: '80px' } }">
        <Form.Input name="name" label="姓名" value="尹成诺" placeholder="请输入姓名" />
        <Form.Range name="start,end" label="时间区间" />
        <Form.InputNumber name="age" label="年龄" />
    </Form>
</template>
```

Form 提供了 fill 修饰符用于用空字符串为字段填充默认值：

```vue
<script lang="ts" setup>
const data = ref({})

onMounted(() => {
    console.log(data.value) // 打印： { name: "尹成诺", start: "", end: "", age: "" }
})
</script>
<template>
    <Form v-model.fill="data" width="240px" :labelCol="{ style: { width: '80px' } }">
        <Form.Input name="name" label="姓名" value="尹成诺" placeholder="请输入姓名" />
        <Form.Range name="start,end" label="时间区间" />
        <Form.InputNumber name="age" label="年龄" />
    </Form>
</template>
```

你也可以在 Form 子组件上使用 fill 属性指定默认填充值：

```vue
<script lang="ts" setup>
const data = ref({})

onMounted(() => {
    console.log(data.value) // 打印： { name: "尹成诺", start: "", end: "", age: 18 }
})
</script>
<template>
    <Form v-model.fill="data" width="240px" :labelCol="{ style: { width: '80px' } }">
        <Form.Input name="name" label="姓名" value="尹成诺" placeholder="请输入姓名" />
        <Form.Range name="start,end" label="时间区间" />
        <Form.InputNumber name="age" :fill="18" label="年龄" />
    </Form>
</template>
```

**需要注意的是，Form 子组件上 fill 属性的值不能为 undefined。fill 仅当 value 不存在时生效且作用和 value 一致。**

**综上，强烈建议在 onMounted 函数执行之后再对绑定的 reactive 对象进行取值处理。**

### Form.Input

[文档](https://2x.antdv.com/components/input-cn#API)

### Form.InputNumber

[文档](https://2x.antdv.com/components/input-number-cn#API)

InputNumber 默认不显示右侧数字加减控制器，使用 showHandler 属性可显示。

### Form.Select

Form.Select 可以使用 Form.SelectItem 作为子组件渲染下拉选择框，其表现和在 a-select 中使用 a-select-option 行为一致。

```vue
<template>
    <Form.Select name="sex" label="性别" placeholder="请选择性别">
        <Form.SelectItem value="男">男</Form.SelectItem>
        <Form.SelectItem value="女">女</Form.SelectItem>
    </Form.Select>
</template>
```

实际上，这里更推荐使用 options 和 makeEnum 的方式使用 Form.Select：

```vue
<script lang="ts" setup>
const arr = ref([
    { name: '高级', code: '3' },
    { name: '中级', code: '2' },
    { name: '初级', code: '1' }
])
</script>
<template>
    <Form.Select name="level" label="级别" placeholder="请选择级别" :options="makeEnum(arr, 'name', 'code')" />
    {{ makeEnum(arr).value('高级') }}
    <!-- 3 -->
    {{ makeEnum(arr).label('1') }}
    <!-- 初级 -->
</template>
```

[文档](https://2x.antdv.com/components/input-number-cn#API)

### Form.SelectTree

目前默认和 cascader 组件保持一致，即 value 为数组。后期可根据实际情况将 value 绑定为 字符串值。

[文档](https://2x.antdv.com/components/cascader-cn#API)

### Form.Radio

同样推荐使用 makeEnum 处理数据。

From.Radio 默认以单选框的形式展示，设置 button 可以按钮的形式展示。

[文档](https://2x.antdv.com/components/radio-cn#API)

### Form.Checkbox

目前默认和 checkbox 组件保持一致，即 value 为数组。后期可根据实际情况将 value 绑定为 字符串值。

[文档](https://2x.antdv.com/components/checkbox-cn#API)

### Form.Time

默认使用 hh:mm:ss 格式化时间。

[文档](https://2x.antdv.com/components/time-picker-cn#API)

### Form.Date

默认使用 YYYY-MM-DD 格式化时间。

[文档](https://2x.antdv.com/components/date-picker-cn#API)

### Form.Month

默认使用 YYYY-MM 格式化时间。

[文档](https://2x.antdv.com/components/date-picker-cn#API)

### Form.Range

默认使用 YYYY-MM-DD hh:mm:ss 格式化时间。

[文档](https://2x.antdv.com/components/date-picker-cn#API)

## 注意事项

-   如果出现组件无法实现的场景，请联系维护人员
-   Form. 开头的 Form 子组件只能在 Form 内部使用
-   Form 双向绑定的数据必须在 onMounted 之后才能使用，否则可能会出现异常
