import './assets/styles.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Echarts from "vue-echarts"
import * as echarts from "echarts"
import 'echarts/theme/dark'

const app = createApp(App)

app.use(router)
app.component("v-chart", Echarts)
app.config.globalProperties.$echarts = echarts

app.mount('#app')
