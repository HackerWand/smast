<template>
  <Drawer title="修改密码" width="400" closable v-model="show">
    <Form ref="form" :model="formData" :rules="rules" :label-width="80">
      <FormItem label="旧密码" prop="password">
        <Input type="password" password v-model="formData.oldPassword" placeholder="请输入旧的登录密码"></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPassword">
        <Input type="password" password v-model="formData.newPassword" placeholder="请输入新密码"></Input>
      </FormItem>
      <FormItem label="确认密码" prop="newRePassword">
        <Input type="password" password v-model="formData.newRePassword" placeholder="请输入新密码"></Input>
      </FormItem>
    </Form>
    <Button @click="confirm" icon="md-checkmark-circle" long type="primary">确定</Button>
  </Drawer>
</template>

<script>
import useUserStore from '../../store/users'

export default {
  data () {
    return {
      show: false,
      formData: {
        oldPassword: null,
        newPassword: null,
        newRePassword: null
      },
      rules: {
        oldPassword: [
          { required: true, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, trigger: 'blur' }
        ],
        newRePassword: [
          { required: true, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入确认密码'))
              } else if (value !== this.formData.newPassword) {
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
  methods: {
    open () {
      this.show = true
    },
    confirm () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return this.$Message.error('请完整填写表单');
        }
        try {
          await this.$request('Users.changePwd', this.formData.oldPassword, this.formData.newPassword)
          this.$Message.success('修改成功')
          const userStore = useUserStore()
          userStore.logout()
          this.$router.replace({ path: '/login' })
        } catch (e) {
          console.error(e)
          this.$Modal.error({ title: '修改失败', content: e.message })
        }
      })
    }
  },
}
</script>