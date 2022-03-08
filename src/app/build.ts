import fs from 'fs'
import path from 'path'
import Docker from 'dockerode'
import { Stream } from 'stream'
import { rmrf } from './src/utils'
import { zip } from 'zip-a-folder'
import { build, Platform } from 'electron-builder'
import { execSync, spawnSync } from 'child_process'

const PRODUCTION = 'http://10.30.26.59:10389/'
const DEVELOPMENT = 'http://10.106.215.92:30000/'

// package.json
const Package = JSON.parse(fs.readFileSync(path.resolve('./package.json')).toString())
// 安装包名称
let productName = `${Package.build.productName}_${Package.version}.${Package.VERSION}`
// 环境
const Mode = process.argv[2].replace('--mode=', '')
// web 版本注入
process.env.VERSION = Package.VERSION

// 主进程代码注入
const INDEXPATH = path.resolve('./dist/index.js')
const INDEXCODE = fs.readFileSync(INDEXPATH).toString()
if (Mode === 'development') {
    Package.build.appId += '.test'
    productName = `测试环境${productName}`
    Package.build.productName = `测试环境${Package.build.productName}`
    Package.build.publish.url = DEVELOPMENT // electron-builder 自动更新地址注入
    const VERSION = `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`
    fs.writeFileSync(INDEXPATH, `'${VERSION}';process.env.VERSION='${VERSION}';process.env.URL='${DEVELOPMENT}';` + INDEXCODE)
}
if (Mode === 'production') {
    Package.build.publish.url = PRODUCTION // electron-builder 自动更新地址注入
    fs.writeFileSync(INDEXPATH, `'${Package.VERSION}';process.env.VERSION='${Package.VERSION}';process.env.URL='${PRODUCTION}';` + INDEXCODE)
}

// 删除 build 目录
rmrf(path.resolve('./build'))

// linux 打包 windows，用于 Jenkins
if (process.platform === 'linux') {
    // 使用 docker 打包
    const docker = new Docker()
    // 拉取镜像
    docker.pull('electronuserland/builder:wine', (_err: Error, stream: Stream) => {
        // 拉取过程输出
        stream.pipe(process.stdout)
        // 监听拉取进度
        docker.modem.followProgress(stream, () => {
            // 拉取完成启动容器
            docker
                .createContainer({
                    Image: 'electronuserland/builder:wine',
                    Env: [
                        `VERSION=${Package.VERSION}`,
                        `ELECTRON_MIRROR=${process.env.npm_config_electron_mirror}`,
                        `ELECTRON_BUILDER_BINARIES_MIRROR=${process.env.npm_config_electron_builder_binaries_mirror}`
                    ],
                    Cmd: ['sh', '-c', 'node_modules/.bin/electron-builder -w'],
                    HostConfig: {
                        AutoRemove: true,
                        // eslint-disable-next-line no-template-curly-in-string
                        Binds: [`${path.resolve('./')}:/project`]
                    }
                })
                .then((container) => {
                    // 监听 docker 事件
                    docker.getEvents({ filters: { type: ['container'] } }, (_, stream) => {
                        stream &&
                            stream.on('data', async (event) => {
                                try {
                                    event = JSON.parse(event.toString())
                                } catch (error) {}
                                // 当打包镜像打包完成退出
                                if (event.from === 'electronuserland/builder:wine' && event.Action === 'destroy') {
                                    // 恢复修改的 package.json
                                    execSync('git reset --hard')
                                    // 压缩 dist 目录
                                    await zip(path.resolve('./dist'), path.resolve('./dist.zip'))
                                    execSync('mv dist.zip dist')
                                    // 构建开发文档
                                    spawnSync('vitepress build docs && mkdir dist/docs && mv docs/.vitepress/dist/* dist/docs', { shell: true, stdio: 'inherit' })
                                    // 将 build 中的 windows 资源移动到 dist
                                    execSync('mv build/latest.yml dist')
                                    execSync(`mv build/${productName}.exe dist`)
                                    // 去除安装包版本号用于固定下载地址下载
                                    execSync(`cp dist/${productName}.exe dist/${Package.build.productName}.exe`)
                                    // 将 mac/production|development 中的资源移动到 dist
                                    execSync(`cp mac/${Mode}/* dist`)
                                    // 去除安装包版本号用于固定下载地址下载
                                    execSync(`cp dist/${productName}.dmg dist/${Package.build.productName}.dmg`)
                                    // 退出进程
                                    process.exit()
                                }
                            })
                    })
                    // 设置 docker 输出方式
                    container.attach({ stream: true, stdout: true }).then((stream) => {
                        // 将 docker 输出到当前进程
                        stream.pipe(process.stdout)
                        // 执行容器
                        container.start()
                        // 设置 electron-builder 更新地址
                        fs.writeFileSync(path.resolve('./package.json'), JSON.stringify(Package))
                    })
                })
        })
    })
} else {
    Promise.all([
        // 只有 mac 系统才能构建 mac 包
        process.platform === 'darwin' &&
            build({
                config: Package.build,
                targets: Platform.MAC.createTarget()
            }),
        build({
            config: Package.build,
            targets: Platform.WINDOWS.createTarget()
        })
    ]).then(() => {
        if (process.platform === 'darwin') {
            // mac 平台的一些操作，将打包后的 mac 平台资源移动到 mac/production|development 文件夹
            execSync(`rm -rf ${path.resolve(`./mac/${Mode}`)}`)
            execSync(`mkdir -p ${path.resolve(`./mac/${Mode}`)}`)
            execSync(`mv ${path.resolve(`./build/${productName}.dmg`)} ${path.resolve(`./mac/${Mode}/`)}`)
            execSync(`mv ${path.resolve(`./build/${productName}.zip`)} ${path.resolve(`./mac/${Mode}/`)}`)
            execSync(`mv ${path.resolve('./build/latest-mac.yml')} ${path.resolve(`./mac/${Mode}/`)}`)
        }
    })
}
