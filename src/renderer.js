import { createApp } from "vue";
import store from './renderer/store'
import router from "./renderer/router";
import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'
import App from "./renderer/App.vue";
import cookies from './renderer/lib/cookies'
import useUserStore from './renderer/store/users'

const app = createApp(App);

app.config.globalProperties.$msgPack = (msg) => msg.replace("Error invoking remote method 'request': Error: ", '')
app.config.globalProperties.$cookies = cookies
app.config.globalProperties.$request = (path, ...args) => {
  const store = useUserStore()
  path = path + '?token=' + store.token
  return window.electron.request(path, ...args)
}
app.use(store).use(router).use(ViewUIPlus);

app.mount("#app");