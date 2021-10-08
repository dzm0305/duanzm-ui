// 入口文件
import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // 全局 css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App' // 根组件
import store from './store'
import router from './router'
import directive from './directive' //directive
import plugins from './plugins' // plugins

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

/**
 * 开发模式：npm run dev是前端自己开发用的
 * 生产模式：npm run build 打包之后给后端放在服务端上用的
 * Vue.config.productionTip = false 这行代码的意思 是阻止显示生产模式的消息。
 * 如果没有这行代码，或者设置为true，控制台就会多出这么一段代码。
 * You are running Vue in development mode.
 * Make sure to turn on production mode when deploying for production.
 * 大概意思就是：
 * 你运行的Vu是开发模式。为生产部署时，请确保启用生产模式。
 */
Vue.config.productionTip = false

//创建Vue根实例,
new Vue({
  el: '#app', // el告诉该实例要挂载的地方(即实例装载到index.html中的位置）.
  router,
  store,
  render: h => h(App) //通过 render 方法把 App根组件渲染到 #app 入口节点
})
