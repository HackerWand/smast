<style scoped lang="less">
  .loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p {
      margin-top: 10px;
    }
  }
</style>

<template>
  <div v-if="status.loading" class="loading">
    <Icon type="ios-loading" class="ivu-anim-loop" size="70" />
    <p>初始化中，请稍等...</p>
  </div>
  <template v-else-if="result.show">
    <Result v-if="result.type === 'error'" type="error" :title="result.title">
      <template #desc>{{result.message}}</template>
      <template #actions>
        <Button @click="init" type="primary">重试</Button>
      </template>
    </Result>
  </template>
</template>

<script>
import useConfigsStore from '../store/configs'

export default {
  data() {
    return {
      status: {
        loading: false
      },
      result: {
        show: false,
        type: 'sync',
        title: null,
        message: null
      }
    }
  },
  methods: {
    async getMachineCode () {
      this.machineCode = await window.electron.request('App.getMachineCode')
    },
    async init () {
      const configStore = useConfigsStore()
      this.result.show = false
      try {
        this.status.loading = true
        await window.electron.db.sync({ alter: true })
        this.$Message.success('数据库同步完成')
        await configStore.load()
        if (!configStore.machineCode) {
          await configStore.init()
          this.$Message.success('数据初始化完成')
        }
        this.status.loading = false
        if (!configStore.activationCode) {
          return this.$router.push({ path: '/activation' })
        }
        this.$router.replace({ path: '/login' })
      } catch (e) {
        this.status.loading = false
        this.result.show = true
        this.result.type = 'error'
        this.result.title = '系统错误'
        this.result.message = e.message
      }
    }
  },
  mounted() {
    this.init()
  },
}
</script>