import VueColorpicker from 'vue-pop-colorpicker'
import vColor from './vColor.vue'

Vue.use(VueColorpicker)

vColor.install = function(Vue){
	Vue.component(vColor.name,vColor)
}

export default {
	vColor
}
