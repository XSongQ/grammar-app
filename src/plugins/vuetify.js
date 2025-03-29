import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css' // 引入图标库

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // 默认主题
  },
})