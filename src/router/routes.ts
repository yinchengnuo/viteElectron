import { replaceNull } from '@/utils'
import { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = []

// 自动路由注册
const vues = Object.keys(import.meta.glob('/src/views/**/*.vue'))
    .filter((path) => replaceNull(path, ['.vue'], '/').at(-1) === replaceNull(path, ['.vue'], '/').at(-2))
    .sort((a, b) => b.split('/').length - a.split('/').length)
const TreeLevelLength = vues[0].split('/').length - 4
const TreeLevel: Array<Array<RouteRecordRaw>> = Array(TreeLevelLength).fill([])
for (let i = 0; i < TreeLevelLength; i++) {
    vues.forEach((vue) => {
        const names = replaceNull(vue, ['/src/views/', '.vue'], '/')
        names.length -= 1
        const path = `/${names.slice(0, i + 1).join('/')}`
        const route: RouteRecordRaw = {
            path,
            component: import.meta.glob('/src/views/**/*.vue')[`/src/views${path}/${names.slice(0, i + 1).at(-1)}.vue`]
        }
        if (!TreeLevel[i].find((route) => route.path === path)) {
            TreeLevel[i].push(route)
            if (i === 0) {
                routes.push(route)
            } else {
                const parent = TreeLevel[i - 1].find((route) => route.path === `/${names.slice(0, i).join('/')}`)
                if (parent?.children) {
                    parent.children.push(route)
                } else {
                    parent!.children = [route]
                }
            }
        }
    })
}

export default routes
