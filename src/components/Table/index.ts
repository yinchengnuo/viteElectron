import { App } from 'vue'
import Table from './Table.vue'

export default {
    install: (app: App) => {
        app.component('Table', Table)
        app.component('Table.Column', { template: '<a-table-column />' })
        app.component('Table.ColumnGroup', { template: '<a-table-column-group />' })
    }
}
