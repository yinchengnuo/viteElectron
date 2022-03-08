const fs = require('fs')
const path = require('path')
const { fork, execSync, spawn } = require('child_process')

// 执行命令行
const command = (shell, stdio) => {
    const child =
        process.platform === 'win32'
            ? spawn('cmd', ['/d /s /c', ...shell.split(' ')], {
                stdio: stdio || 'inherit'
            })
            : spawn(shell, {
                shell: true,
                stdio: stdio || 'inherit'
            })
    if (stdio === 'pipe') {
        child.stdout.pipe(process.stdout)
    }
    return child
}

// 杀死进程
const kill = (child) => {
    if (process.platform === 'win32') {
        execSync(`taskkill /T /F /pid ${child.pid}`)
    } else {
        child.kill('SIGINT')
    }
}

// 编辑 ts
const esbuild = (optioin = {}, production) =>
    require('esbuild').build({
        minify: true, // 压缩代码
        bundle: true, // 打包模块
        format: 'cjs', // 输出为 common JS
        platform: 'node', // 平台 node
        outdir: './dist', // 输出到 dist 文件夹
        plugins: [
            require('esbuild-node-externals').nodeExternalsPlugin(), // 不将第三方库打包进主进程代码
            {
                name: 'production',
                setup (build) {
                    build.onLoad({ filter: /\.ts$/ }, (file) => {
                        // 打包时不打包代码中的开发调试部分，可使主进程代码体积减少约 3 KB
                        if (file.path === path.join(__dirname, '/src/app/index.ts') && production) {
                            return {
                                contents: fs.readFileSync(file.path).toString().replace('dev(window)', '')
                            }
                        }
                    })
                }
            }
        ],
        entryPoints: ['src/app/index.ts'], // 编译入口文件
        ...optioin
    })

// 打包
const build = (mode = '--mode=production') => {
    // 先执行 vite 打包
    command(`vite build ${mode}`).on('exit', () => {
        Promise.all([
            esbuild({}, true), // 编译主进程代码
            esbuild( // 编译打包脚本
                {
                    outdir: './build', // 输出到 build 文件夹
                    entryPoints: ['src/app/build.ts'] // 打包脚本源码
                },
                true
            )
        ]).then(() => {
            // 使用打包脚本打包安装包
            command(`node build/build.js ${mode}`)
        })
    })
}

// yarn dev
if (process.env.npm_lifecycle_event === 'dev') {
    // 当存在第三个参数 --mode=development|production，表示执行了开发调试/测试/正式打包
    if (process.argv[2]) {
        build(process.argv[2])
    } else {
        // 启动开发文档服务
        command('vitepress dev docs --host --port=4000 --strictPort')
        // 开发环境 electron 进程
        let electron
        Promise.all([
            // 编译主进程代码
            esbuild({
                // 监听主进程代码变动
                watch: {
                    // 当主进程代码变动
                    onRebuild (error) {
                        if (error) {
                            console.error(error)
                        } else {
                            // kill 开发环境 electron
                            if (electron) {
                                kill(electron)
                                electron = undefined
                            }
                            // 启动开发环境 electron
                            electron = command('electron .', 'pipe')
                        }
                    }
                }
            }),
            // 启动 vite 开发服务并监听 vite 服务启动消息
            new Promise((resolve) => {
                fork('node_modules/vite/dist/node/cli.js', ['--host'], { stdio: 'inherit' }).once('message', resolve) // vite 服务启动成功
            })
        ]).then(() => {
            // 启动开发环境 electron
            electron = command('electron .', 'pipe')
        })
    }
}

// yarn build
if (process.env.npm_lifecycle_event === 'build') {
    if (process.env.npm_config_user_agent.startsWith('npm')) {
        build(process.env.npm_config_mode ? `--mode=${process.env.npm_config_mode}` : process.env.npm_config_mode)
    }
    if (process.env.npm_config_user_agent.startsWith('yarn')) {
        build(process.argv[2])
    }
}
