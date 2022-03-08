<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

const router = useRouter()

interface FormData {
    username: string;
    passwword: string;
}

const refForm = ref()
const Store = useStore()
const formState = reactive<FormData>({
    username: '尹成诺',
    passwword: '123455'
})

// 点击登录
const login = () => {
    refForm.value.validate().then(() => {
        router.replace('/首页')
        Store.commit('userinfo/GOT_USERINFO', formState)
        sessionStorage.setItem('userinfo', JSON.stringify({ ...formState }))
    })
}
</script>

<template>
    <div class="h100 flex">
        <a-card>
            <a-form ref="refForm" :model="formState" hideRequiredMark>
                <a-form-item label="用户名" :labelCol="{ span: 6 }" :rules="[{ required: true, message: '请输入用户名' }]">
                    <a-input v-model:value.trim="formState.username" placeholder="input placeholder" />
                </a-form-item>
                <a-form-item label="密码" :labelCol="{ span: 6 }" :rules="[{ required: true, message: '请输入密码' }]">
                    <a-input v-model:value.trim="formState.passwword" placeholder="input placeholder" />
                </a-form-item>
                <a-button class="w100" type="primary" @click="login">登录</a-button>
            </a-form>
        </a-card>
    </div>
</template>

<style lang="scss" scoped></style>
