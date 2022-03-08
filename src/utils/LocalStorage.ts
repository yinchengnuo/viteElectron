import localforage from 'localforage'

const LocalForage = localforage.createInstance({
    name: 'XXXX后台管理系统'
})

const LocalStorage = {
    async get (key: string) {
        return await LocalForage.getItem(key)
    },
    async set (key: string, value: unknown) {
        return await LocalForage.setItem(key, value)
    },
    async remove (key: string) {
        return await LocalForage.removeItem(key)
    },
    async clear () {
        return await LocalForage.clear()
    }
}

export default LocalStorage
