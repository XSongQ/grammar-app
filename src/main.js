import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import unitTest from './components/unitTest.vue'
import vuetify from './plugins/vuetify' // 引入 Vuetify
import './assets/global.css' // 引入全局样式

const app = createApp(App)
app.use(vuetify) // 使用 Vuetify
app.mount('#app')
