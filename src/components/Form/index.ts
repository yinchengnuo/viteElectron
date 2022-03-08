import { App } from 'vue'
import Form from './Form.vue'

const Components = import.meta.globEager('./components/*.vue')

export default {
    install: (app: App) => {
        app.component('Form', Form)
        Object.entries(Components).forEach(([key, value]) => {
            app.component(key.replaceAll('./components/', '').replaceAll('.vue', '').replace('Form', 'Form.'), value.default)
        })
    }
}
