/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'

export default createVuetify({
  theme: {
    defaultTheme: 'dark',
  },
  components: {
    VCalendar,
  },
})
