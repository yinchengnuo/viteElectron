import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store, { key } from '@/store'
import Form from '@/components/Form/index'
import Table from '@/components/Table/index'
import RouteNest from '@/components/RouteNest/RouteNest.vue'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

app.config.globalProperties.window = window
app.config.globalProperties.log = console.log

app.component('RouteNest', RouteNest)

app.use(store, key).use(router).use(Antd).use(Form).use(Table).mount('#app')
