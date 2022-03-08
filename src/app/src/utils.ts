import fs from 'fs'
import IPC from '@/ipc'
import path from 'path'
import axios from 'axios'
import unzipper from 'unzipper'
import { app, BrowserWindow, shell } from 'electron'
import { ChildProcess, exec, spawn } from 'child_process'
import { NotificationArgsProps, IconType } from 'ant-design-vue/lib/notification'

axios.defaults.baseURL = process.env.URL

/**
 * @description: 在渲染进程显示消息提示
 * @param {IconType} type
 * @param {string} message
 * @param {string} description
 * @param {UnRequired<NotificationArgsProps>} config 参数类型参考 ant-design-vue notification（不能传递函数类型配置）
 * @return {void}
 */
type UnRequired<T> = { [P in keyof T]+?: T[P] };
export function notice (window: BrowserWindow, type: IconType, message: string, description: string, config?: UnRequired<NotificationArgsProps>) {
    shell.beep()
    window.webContents.send(
        IPC.NOTICE,
        Object.assign(
            {
                type,
                message,
                description
            },
            config || {}
        )
    )
    console.log('\x1b[32m', `${message}: ${description}`)
}

/**
 * @description: 删除文件夹
 * @param {string} 文件夹路径
 * @return {Promise}
 */
export function rmrf (dirname: string) {
    return new Promise((resolve) => {
        if (process.platform === 'darwin' || process.platform === 'linux') {
            exec(`rm -r ${dirname}`).once('close', resolve)
        }
        if (process.platform === 'win32') {
            exec(`rd/s/q ${dirname}`).once('close', resolve)
        }
    })
}

/**
 * @description: 执行终端命令
 * @param {string} shell
 * @return {void}
 */
export function command (shell: string) {
    return process.platform === 'win32'
        ? spawn('cmd', ['/d /s /c', ...shell.split(' ')], {
            stdio: 'inherit',
            windowsHide: true
        })
        : spawn(shell, {
            shell: true,
            stdio: 'inherit'
        })
}

/**
 * @description: 杀死进程
 * @param {child} ChildProcess
 * @return {void}
 */
export function kill (child: ChildProcess) {
    if (process.platform === 'win32') {
        exec(`taskkill /T /F /pid ${child.pid}`)
    } else {
        child.kill('SIGINT')
    }
}

/**
 * @description: 重启应用
 * @param {undefined}
 * @return {void}
 */
export function relaunch () {
    app.relaunch()
    app.quit()
}

/**
 * @description: 获取 web 版本信息
 * @param {string} 当前主进程代码
 * @return {Promise<{
 *  oldAppCode: string 当前主进程代码
 *  newAppCode: string 从远程加载的主进程代码
 *  newWebVersion: boolean 是否有新版本
 * }>}
 */
export function isNewWebVersion (oldAppCode: string): Promise<{
    oldAppCode: string; // 当前主进程代码
    newAppCode?: string; // 新版主进程代码
    isNewWebVersion: boolean; // 是否有新版本
}> {
    return new Promise((resolve, reject) => {
        axios
            .get('/index.js', { timeout: 2333 })
            .then(({ data }) => {
                // 主进程代码下载成功，对比版本号
                if (data.match(/(?<=^')\d+.\d+.\d+(?=';)/)[0] === (oldAppCode.match(/(?<=^')\d+.\d+.\d+(?=';)/) || '')[0]) {
                    resolve({
                        oldAppCode,
                        isNewWebVersion: false
                    })
                } else {
                    // 如果有新版本
                    resolve({
                        oldAppCode,
                        newAppCode: data,
                        isNewWebVersion: true
                    })
                }
            })
            .catch(reject)
    })
}

/**
 * @description: 下载远程 web 静态资源并替换本地
 * @param {undefined}
 * @return {void}
 */
export function loadWebStatic () {
    axios
        .get('/dist.zip', { responseType: 'stream' })
        .then(({ data }) => {
            data.pipe(fs.createWriteStream(path.join(__dirname, '../dist.zip')))
            data.on('close', () => {
                rmrf(__dirname).then(() => {
                    fs.createReadStream(path.join(__dirname, '../dist.zip'))
                        .pipe(unzipper.Extract({ path: path.join(__dirname, '../dist') }))
                        .on('close', () => {
                            fs.unlinkSync(path.join(__dirname, '../dist.zip'))
                        })
                })
            })
        })
        .catch(() => {
            // 下载失败，恢复主进程代码
            fs.writeFileSync(path.join(__dirname, '/index.js'), fs.readFileSync(path.join(__dirname, '/_index.js')).toString())
            fs.unlinkSync(path.join(__dirname, '/_index.js'))
        })
}
