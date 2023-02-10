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
      <h2>激活码生成</h2>

      <div style="margin: 20px 0;">
        <Input v-model="machineCode" placeholder="请输入设备码" @on-enter="active">
          <template #prepend>
            <span>设备码</span>
          </template>
        </Input>
        <Button icon="md-code-working" style="margin-top: 10px;" long type="primary" @click="active">生成激活码</Button>
      </div>

      <h3 v-if="activationCode" style="margin: 20px 0;display: flex;align-items: center;justify-content: center;">激活码: <span style="color: #ed4014;">{{activationCode}}</span> <Button type="text" icon="md-copy" @click="copy"></Button></h3>

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
export default {
  data () {
    return {
      activationCode: null,
      machineCode: null
    }
  },
  methods: {
    async active () {
      if (!this.machineCode) {
        return this.$Modal.error({ title: '请输入设备码' })
      }
      try {
        this.activationCode = await window.electron.request('App.generateActivationCode', this.machineCode)
        this.$Message.success('激活码已生成')
      } catch (e) {
        return this.$Modal.error({ title: '生成失败', content: e.message })
      }
    },
    copy () {
      this.$Copy({ text: this.activationCode })
    }
  },
  mounted () {
  }
}
</script>