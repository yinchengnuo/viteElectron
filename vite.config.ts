import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import { replaceNull } from './src/utils'

export default defineConfig({
    publicDir: false, // 不使用 public 目录
    plugins: [
        vue(),
        Inspect(),
        {
            name: '',
            enforce: 'pre',
            // 自动为路由组件注入 name，用于 keep-alive
            transform (code, id) {
                // views 目录下的 vue 文件
                if (id.startsWith(path.join(__dirname, '/src/views/').replace(/\\/g, '/')) && path.extname(id) === '.vue') {
                    // 根据计算文件路径获取页面前端路由地址
                    const names = replaceNull(id, [`/${path.basename(id)}`, path.join(__dirname, '/src/views').replace(/\\/g, '/')], '/')
                    // 文件名和父文件夹名称一样的 .vue 文件会被自动注入 name 属性，name 值为路由路径
                    if (names.at(-1) === path.basename(id, '.vue')) {
                        code += `
                        <script lang="ts">
                            export default {
                                name: '${names.join('/')}'
                            }
                        </script>`
                    }
                }
                return code
            },
            // devServer 启动后通知父进程运行 electron
            configureServer (server) {
                server.httpServer.on('listening', () => {
                    process.send && process.send('')
                })
            }
        }
    ],
    base: './',
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    server: {
        strictPort: true // 若端口已被占用则会直接退出，而不是尝试下一个可用端口
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false
            }
        }
    },
    build: {
        brotliSize: false,
        chunkSizeWarningLimit: 2048
    }
})
