import IPC from '@/ipc'
import { Modal, ModalFuncProps } from 'ant-design-vue'

export default {
    /**
     * @description: 初始化更新
     * @param {undefined}
     * @return {void}
     */
    init () {
        // 检查到新 WEB 版本
        require('electron').ipcRenderer.on(IPC.CHECKED_NEW_WEB, () => {
            Modal.confirm({
                centered: true,
                title: () => '应用更新',
                content: '新版本已经准备就绪，重启应用即可更新',
                okText: () => '重启应用更新',
                cancelText: '稍后自行重启',
                onOk () {
                    require('electron').ipcRenderer.invoke(IPC.RELAUNCH)
                }
            })
        })

        // 更新下载完毕
        require('electron').ipcRenderer.on(IPC.UPDATA_DOWNLOADED, () => {
            Modal.confirm({
                centered: true,
                title: () => '应用更新',
                content: '新版本已经准备就绪，是否现在更新',
                onOk () {
                    require('electron').ipcRenderer.invoke(IPC.UPDATA_QUITANDINSTALL)
                },
                onCancel () {
                    require('electron').ipcRenderer.invoke(IPC.UPDATA_DOWNLOADED_NOT_INSTALLED)
                }
            })
        })

        // 强制更新安装
        require('electron').ipcRenderer.on(IPC.UPDATA_DOWNLOADED_QUIT_INSTALL, () => {
            let counter = 5
            const config: ModalFuncProps = {
                centered: true,
                title: () => '应用更新',
                content: '新版本已经准备就绪，即将开始安装，请勿关闭电脑',
                okText: `${counter}S后开始安装`,
                onOk () {
                    require('electron').ipcRenderer.invoke(IPC.UPDATA_QUITANDINSTALL)
                }
            }
            const info = Modal.info(config)
            const timer = setInterval(() => {
                counter--
                info.update({
                    ...config,
                    okText: `${counter}S后开始安装`
                })
                if (counter === 0) {
                    require('electron').ipcRenderer.invoke(IPC.UPDATA_QUITANDINSTALL)
                    clearInterval(timer)
                }
            }, 1000)
        })
    },
    /**
     * @description: 初始化更新
     * @param {boolean} 是否是用户手动触发
     * @return {void}
     */
    check (hand: boolean) {
        require('electron').ipcRenderer.invoke(IPC.CHECK_UPDATA, hand)
    }
}
