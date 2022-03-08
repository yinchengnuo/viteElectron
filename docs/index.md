## 开发须知

#### 开发前务必请认真阅读本文档。

## 技术选型

-   构建工具：vite
-   前端工具：esbuild
-   开发框架：electron
-   UI 库：ant-design-vue
-   代码格式：prettier + eslint
-   代码规范：eslint + standard
-   前端框架：vue3 + vue-router + vuex
-   GIT 规范：husky + lint-staged + commitlint
-   打包更新：electron-builder + electron-updater

## 项目架构

![项目架构](/img/framework.png)

## 项目结构

```
├── .husky // git 钩子
├── .npmrc // npm 配置
├── .vscode // vscode 配置
├── docs // 开发文档
├── index.js // 项目入口文件
├── mac // mac 安装包目录
├── src // 源代码目录
│   ├── App.vue // 入口组件
│   ├── api // 接口目录
│   ├── app // 主进程
│   │   ├── build.ts // 打包脚本
│   │   ├── index.ts // 主进程入口
│   │   └── src // 主进程代码
│   ├── assets // 图片
│   ├── components // 公共组件
│   ├── ipc // ipc 通信枚举事件
│   ├── layout // 布局
│   ├── main.ts // 项目入口
│   ├── router // 路由
│   ├── store // 全局状态管理
│   ├── style // 公共样式
│   ├── utils // 工具方法
│   └── views // 业务页面组件
│   └── pages // 公共页面组件
├── vite.config.ts // vite 配置
```

## 技术亮点

-   无感自动更新
-   前端路由自动注册
-   完全脚本化终端命令执行
-   本地开发和打包同时进行
-   打包脚本多平台运行构建
-   测试环境&正是环境产出一致
-   工具链层面实现了代码风格、git 提交规范统一
-   nodejs 驱动 docker 实现 linux 打包 windows
-   集成了 vitepress、vue-devtools、inspect 等 vue 生态插件

## 开发约定

-   除 src 和 docs 目录，其余文件更改需经负责人
-   本地存储使用 utils/LocalStorage
-   ipc 枚举对象的 key value 保持一致并使用下划线分割的大驼峰
-   常规组件名称使用大驼峰且放置于名称一致的文件夹中
-   前端路由名称和路由组件文件名称路径使用中文
-   路由组件名称和父文件夹名称保持一致并按照路由嵌套结构存放于 views 目录
-   当路由组件存在子路由时，需此路由组件固定使用 RouteNest 组件
-   纯函数工具方法在 utils/index.ts 中声明导出
-   封装类工具对象单独创建 ts 文件默认导出且文件名称为大驼峰

## 注意事项

-   ipc 枚举对象的 key value 不一致会抛出错误
-   禁止使用 localStorage 做持久化存储，应使用 utils/LocalStorage 方法封装的 indexeddb
-   禁止使用 cookie，打包后的前端静态资源会被 electron 主进程通过 file 协议引入导致 cookie 失效
-   vuex useStore 方法必须从 @/store 导入
-   发版时 package.json 中 version 和 VERSION 不能同时更改
