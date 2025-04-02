import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import './utils/rem'
import './style.css'
// import ImageGallery from './components/ImageGallery.vue'
import VideoPlayer from './components/VideoPlayer.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(Vant)
// app.component('ImageGallery', ImageGallery)
app.component('VideoPlayer', VideoPlayer)

app.mount('#app')
