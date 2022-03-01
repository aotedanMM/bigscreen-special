<template>
    <el-form  label-width="80px" :model="formLabelAlign">
        <el-form-item label="用户名">
            <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input show-password v-model="formLabelAlign.password"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-button @click="onReset">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script lang="ts">
import { loginServer } from '@/api/installServer';
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'Login',
})
export default class Login extends Vue {
    private formLabelAlign: any = {
        name : '',
        password : '',
    };

    private onSubmit() {
        const parma = {
            password: this.formLabelAlign.password,
            username: this.formLabelAlign.name,
        };
        loginServer.login(parma).then((data: any) => {
            sessionStorage.setItem('token' , JSON.stringify(data));
            this.$router.push('choose');
        });
    }

    private onReset() {
        this.formLabelAlign = {
            name : '',
            password : '',
        };
    }
}
</script>