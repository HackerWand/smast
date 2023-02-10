<style lang="less">
.layout-logo {
  color: #FFF;
  font-weight: 800;
  padding: 0 20px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #5b6270;
  border-radius: 3px;
}
.ivu-layout-header {
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 0;
  .header-left {
    padding-left: 20px;
    display: flex;
    align-items: center;
  }
  .header-right {
    padding-right: 20px;
    display: flex;
    align-items: center;
    .user-name {
      color: rgba(255,255,255,.7);
      margin-left: 10px;
    }
  }
}
.ivu-layout.root {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <Layout class="root">
    <Header>
      <div class="header-left">
        <div class="layout-logo">单机模版</div>
        <Menu mode="horizontal" theme="dark" :active-name="menu.top" @on-select="onTopMenuChange">
          <MenuItem :name="item.name" v-for="item in views" :key="item.name">
            {{item.title}}
          </MenuItem>
        </Menu>
      </div>
      <div class="header-right">
        <Space size="large" wrap>
          <Dropdown @on-click="userMenuClick">
            <div style="cursor: pointer;">
              <Avatar icon="ios-person" />
              <span class="user-name" v-if="userInfo">{{userInfo.name}}</span>
            </div>
            <template #list>
              <DropdownMenu>
                <DropdownItem name="password"><Icon type="md-unlock" />修改密码</DropdownItem>
                <DropdownItem name="logout"><Icon type="md-log-in" />退出登录</DropdownItem>
              </DropdownMenu>
            </template>
          </Dropdown>
        </Space>
      </div>
    </Header>
    <Layout style="flex: 1;height: 0;">
      <Sider v-if="leftMenus.length" hide-trigger :style="{ background: '#fff', overflow: 'auto' }">
        <Menu active-name="1-2" theme="light" width="auto" :open-names="['1']">
          <Submenu name="1">
            <template #title>
              <Icon type="ios-navigate"></Icon>
              Item 1
            </template>
            <MenuItem name="1-1">Option 1</MenuItem>
            <MenuItem name="1-2">Option 2</MenuItem>
            <MenuItem name="1-3">Option 3</MenuItem>
          </Submenu>
          <Submenu name="2">
            <template #title>
              <Icon type="ios-keypad"></Icon>
              Item 2
            </template>
            <MenuItem name="2-1">Option 1</MenuItem>
            <MenuItem name="2-2">Option 2</MenuItem>
          </Submenu>
          <Submenu name="3">
            <template #title>
              <Icon type="ios-analytics"></Icon>
              Item 3
            </template>
            <MenuItem name="3-1">Option 1</MenuItem>
            <MenuItem name="3-2">Option 2</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout :style="{ overflow: 'auto' }">
        <router-view />
      </Layout>
    </Layout>
  </Layout>
  <ChangePwd ref="password" />
</template>
<script>
import views from '../router/views'
import useUserStore from '../store/users'
import ChangePwd from '../components/users/pwd.vue'
const userStore  = useUserStore()

export default {
  components: { ChangePwd },
  data () {
    return {
      views,
      menu: {
        top: null
      }
    }
  },
  computed: {
    userInfo () {
      return userStore.info
    },
    leftMenus () {
      if (this.menu.top) {
        return this.views.find(v => v.name === this.menu.top).children || []
      } else {
        return []
      }
    }
  },
  methods: {
    onTopMenuChange (name) {
      const view = this.views.find(v => v.name === name)
      this.menu.top = name
      this.$router.push({ name: view.name })
    },
    async userMenuClick (name) {
      if (name === 'password') {
        this.$refs.password.open()
      } else if (name === 'logout') {
        try {
          await this.$request('App.logout')
        } catch (e) {
          this.$Modal.error({ title: '注销异常', content: this.$msgPack(e.message) })
        }
        userStore.logout()
        this.$router.replace({ path: '/login' })
      }
    }
  },
  mounted () {
    if (!this.userInfo) {
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>
