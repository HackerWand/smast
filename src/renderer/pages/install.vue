<template>
  <div style="padding: 50px 20px;max-width: 600px;margin: 0 auto;">
    <Card title="软件初始化">
      <Form ref="form" :model="formData" :rules="rules" :label-width="80">
        <FormItem label="账号名称" prop="name">
          <Input v-model="formData.name" placeholder="请输入用于显示的账号名称"></Input>
        </FormItem>
        <FormItem label="单位名称" prop="orgName">
          <Input v-model="formData.orgName" placeholder="请输入你所处单位的名称"></Input>
        </FormItem>
        <FormItem label="登录账号" prop="username">
          <Input v-model="formData.username" placeholder="请输入登录账号"></Input>
        </FormItem>
        <FormItem label="登录密码" prop="password">
          <Input type="password" password v-model="formData.password" placeholder="请输入登录密码"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="repassword">
          <Input type="password" password v-model="formData.repassword" placeholder="请再次输入登录密码"></Input>
        </FormItem>
      </Form>
      <Button @click="confirm" icon="md-checkmark-circle" long type="primary">确定</Button>
    </Card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        name: null,
        orgName: null,
        username: null,
        password: null,
        repassword: null
      },
      rules: {
        name: [
          { required: true, trigger: 'blur' }
        ],
        orgName: [
          { required: true, trigger: 'blur' }
        ],
        username: [
          { required: true, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur' }
        ],
        repassword: [
          { required: true, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入确认密码'))
              } else if (value !== this.formData.password) {
                callback(new Error('两次输入的密码不匹配'))
              } else {
                callback()
              }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    activationCode () {
      return this.$route.query.code
    }
  },
  methods: {
    confirm () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return this.$Message.error('请完整填写表单');
        }
        try {
          await window.electron.request('App.init', {
            name: this.formData.name,
            orgName: this.formData.orgName,
            username: this.formData.username,
            password: this.formData.password,
            activationCode: this.activationCode
          })
          this.$Message.success('初始化完成')
          this.$router.replace({ path: '/login' })
        } catch (e) {
          console.error(e)
          this.$Modal.error({ title: '系统错误', content: e.message })
        }
      })
    }
  },
  mounted () {
    if (!this.activationCode) {
      this.$router.replace({ path: '/activation' })
    }
  }
}
</script>