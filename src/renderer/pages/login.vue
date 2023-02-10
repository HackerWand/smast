<style lang="less" scoped>
  .login-page {
    position: fixed;
    width: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .remember {
    margin-bottom: 20px;
  }
</style>

<template>
  <div class="login-page">
    <Card title="用户登录">
      <Login @on-submit="handleSubmit">
        <UserName name="username" />
        <Password name="password" />
        <div class="remember">
          <Checkbox v-model="remember">记住登录</Checkbox>
        </div>
        <Submit :loading="loading" />
      </Login>
    </Card>
  </div>
</template>

<script>
import useUsersStore from '../store/users'
export default {
  data () {
    return {
      remember: true,
      loading: false
    }
  },
  methods: {
    async handleSubmit (valid, { username, password }) {
      if (valid) {
        try {
          this.loading = true
          const res = await window.electron.request('App.login', username, password)
          this.loading = false
          this.getInfo(res.token)
        } catch (e) {
          this.loading = false
          this.$Modal.error({ title: '登录失败', content: this.$msgPack(e.message) })
        }
      }
    },
    async getInfo (token) {
      if (!token) {
        token = localStorage.getItem('token')
      }
      if (!token) {
        token = this.$cookies.getItem('token')
      }
      if (token) {
        try {
          this.loading = true
          const info = await window.electron.request('Users.info?token=' + token)
          const store = useUsersStore()
          store.setInfo(info)
          store.setToken(token, this.remember)
          this.$Message.success('登录成功')
          this.loading = false
          this.$router.replace({ path: '/home' })
        } catch (e) {
          this.loading = false
          this.$Modal.error({ title: '自动登录失败', content: this.$msgPack(e.message) })
        }
      }
    }
  },
  mounted () {
    this.getInfo()
  }
}
</script>
