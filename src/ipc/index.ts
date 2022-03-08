const IPC = {
    /*
        消息相关
    */
    NOTICE: 'NOTICE',
    RELAUNCH: 'RELAUNCH',
    IS_PACKAGED: 'IS_PACKAGED',
    CONSOLE_LOG: 'CONSOLE_LOG',

    /*
        app 相关
     */
    // 最小化
    APP_MINI: 'APP_MINI',
    // 退出应用
    APP_QUIT: 'APP_QUIT',
    // 测试打包
    BUILD_DEV: 'BUILD_DEV',
    // 正式打包
    BUILD_PRO: 'BUILD_PRO',
    // 打开 devtools
    OPEN_DEV_TOOLS: 'OPEN_DEV_TOOLS',
    // 打开 vuetools
    OPEN_VUE_DEV_TOOLS: 'OPEN_VUE_DEV_TOOLS',

    /*
        打印机相关
    */
    // 获取打印机列表
    GET_PRINTER_LIST: 'GET_PRINTER_LIST',

    /*
        检查更新相关
    */
    // 开始检查更新
    CHECK_UPDATA: 'CHECK_UPDATA',
    // 检查到新 WEB 版本
    CHECKED_NEW_WEB: 'CHECKED_NEW_WEB',
    // 更新下载完毕
    UPDATA_DOWNLOADED: 'UPDATA_DOWNLOADED',
    // 更新下载完毕但用户取消安装
    UPDATA_DOWNLOADED_NOT_INSTALLED: 'UPDATA_DOWNLOADED_NOT_INSTALLED',
    // 更新下载完毕但用户取消安装后关闭强制更新
    UPDATA_DOWNLOADED_QUIT_INSTALL: 'UPDATA_DOWNLOADED_QUIT_INSTALL',
    // 立即更新
    UPDATA_QUITANDINSTALL: 'UPDATA_QUITANDINSTALL'
}

const IPCList = Object.entries(IPC) as Array<Array<string>>
for (let i = 0; i < IPCList.length; i++) {
    if (IPCList[i][0] !== IPCList[i][1]) {
        throw new Error(`IPC 枚举对象存在 Key Value 不一致：${IPCList[i][0]}: ${IPCList[i][1]}`)
    }
}

export default IPC
