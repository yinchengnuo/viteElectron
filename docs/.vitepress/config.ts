import { defineConfig } from 'vitepress'

export default defineConfig({
    lang: 'ZH',
    title: 'XXXX后台管理系统前端开发文档',
    base: '/docs/',
    vite: {
        cacheDir: '../node_modules/.docs'
    },
    themeConfig: {
        logo: 'img/logo.png',
        nav: [
            { text: '首页', link: '/' },
            { text: '更新记录', link: '/更新记录/更新记录', activeMatch: '^/更新记录/' },
            { text: '构建发版', link: '/构建发版/构建发版', activeMatch: '^/构建发版/' },
            { text: '布局路由', link: '/布局路由/布局路由', activeMatch: '^/布局路由/' },
            { text: '工具方法', link: '/工具方法/开发调试', activeMatch: '^/工具方法/' },
            { text: '公共组件', link: '/公共组件/Form', activeMatch: '^/公共组件/' },
            { text: '业务组件', link: '/业务组件/系统管理/系统管理', activeMatch: '^/业务组件/' }
        ],
        sidebar: {
            '/公共组件/': [
                {
                    text: 'Form',
                    link: '/公共组件/Form'
                },
                {
                    text: 'Table',
                    link: '/公共组件/Table'
                }
            ],
            '/工具方法/': [
                {
                    text: '开发调试',
                    link: '/工具方法/开发调试'
                },
                {
                    text: '公共方法',
                    link: '/工具方法/公共方法'
                },
                {
                    text: '功能封装',
                    link: '/工具方法/功能封装'
                }
            ],
            '/业务组件/': [
                {
                    text: '系统管理',
                    link: '/业务组件/系统管理/系统管理',
                    children: [
                        {
                            text: '用户管理',
                            link: '/业务组件/系统管理/用户管理'
                        },
                        {
                            text: '角色管理',
                            link: '/业务组件/系统管理/角色管理'
                        },
                        {
                            text: '菜单管理',
                            link: '/业务组件/系统管理/菜单管理'
                        }
                    ]
                }
            ]
        }
    }
})
