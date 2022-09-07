import * as AllIcons from "ionicons/icons"; //Ion icons bs
import { modalController, toastController } from "@ionic/vue"; //modalController, toastController...

// Global utility
export default {
	methods: {
		assets(resourcesName) { //Get resource
			return require(process.env.VUE_APP_ORIG_ASSETS + resourcesName);
		},

		piece(color, name = "p", sprite = null) {
			return {name, color, sprite: sprite == null ? require("@/assets/textures/" + name + color + ".png") : sprite};
		}
	},

	data() {
		return {
			origAssets: process.env.VUE_APP_ORIG_ASSETS,

			//Utlity pre icony, nemusim zvlast importovat jak blb kazdu ikonu proste napisem napr :icon="icons.add"
			icons: new Proxy(Object.keys(AllIcons).reduce((map, elem) => {
				map[elem.toLowerCase()] = AllIcons[elem];
				return map;
			}, {}), {
				get: function(target, name) {
					var icon = target[name = name.toString().toLowerCase().replace("-", "")];
					if (icon)
						return icon;

					for (var key in target)
					{
						if (key.indexOf(name) > -1)
							return target[key];
					}
				}
			}),

			modalController: modalController,
			toastController: toastController,
		}
	}
}