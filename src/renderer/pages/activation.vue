<style lang="less" scoped>
  h2, h3 {
    text-align: center;
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 500px;
    margin: 0 auto;
    border-radius: 5px;
    border: 1px solid #EEE;
    padding: 20px;
    background-color: #FFF;
  }
</style>

<template>
  <div style="padding: 50px 0;">
    <div class="content">
      <h2>欢迎使用 - 请先激活软件</h2>
      <h3 style="margin: 20px 0;display: flex;align-items: center;justify-content: center;">设备码: <span style="color: #ed4014;">{{machineCode}}</span> <Button type="text" icon="md-copy" @click="copy"></Button></h3>

      <div style="margin: 20px 0;">
        <Input v-model="activationCode" @on-enter="active">
          <template #prepend>
            <span>激活码</span>
          </template>
        </Input>
        <Button icon="md-code-working" style="margin-top: 10px;" long type="primary" @click="active">激活使用</Button>
      </div>
      <Alert show-icon>
          激活说明
          <template #desc>
            <div>1. 请将上方32位设备码发给软件管理方</div>
            <div>2. 在上方输入框中输入由软件管理方提供的激活码</div>
          </template>
      </Alert>
      <Alert show-icon type="warning">
          注意事项
          <template #desc>
            <div>1. 激活码和设备码一一绑定，无法重复使用，更换电脑或者电脑硬件，激活将会失效</div>
            <div>2. 激活后需要设置账号和密码，忘记密码将无法找回和使用软件</div>
          </template>
      </Alert>
    </div>
  </div>
</template>

<script>
import useConfigsStore from '../store/configs'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export default {
  setup () {
    const configsStore = useConfigsStore()
    const { machineCode } = storeToRefs(configsStore)
    return {
      machineCode,
      activationCode: ref(''),
      setConfig: useConfigsStore.set
    }
  },
  methods: {
    async active () {
      if (!this.activationCode) {
        return this.$Modal.error({ title: '请输入激活码' })
      }
      try {
        const res = await window.electron.request('App.checkActivationCode', this.activationCode)
        if (!res) {
          throw new Error('激活码不匹配，请使用正确的激活码')
        }
        this.$router.replace({ path: '/install', query: { code: this.activationCode } })
      } catch (e) {
        this.$Modal.error({ title: '激活失败', content: e.message })
      }
    },
    copy () {
      this.$Copy({ text: this.machineCode })
    }
  },
  mounted () {
    if (!this.machineCode) {
      this.$router.replace({ path: '/' })
    }
  }
}
</script>