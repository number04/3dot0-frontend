import Vue from 'vue'

import * as components from '@/components'

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
})