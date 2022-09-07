import * as AllIcons from "ionicons/icons"; //Ion icons bs
import { modalController, toastController } from "@ionic/vue"; //modalController, toastController...

// Global utility
export default {
	methods: {
		assets(resourcesName) { //Get resource
			return require(process.env.VUE_APP_ORIG_ASSETS + resourcesName);
		}
	},

	data() {
		return {
			origAssets: process.env.VUE_APP_ORIG_ASSETS,

			async modal(modalComponent, componentProps = {}) {
				if (await this.modalController.getTop())
					return {
						onDidDismiss: () => {
							return {};
						}
					};
	
				const modal = await this.modalController.create({
					component: modalComponent,
					breakpoints: [0, 1],
					initialBreakpoint: 1,
					componentProps: componentProps
				});
				modal.present();
	
				return modal;
			},
	
			async toast(message, color = "success", duration = 2500) {
				const toast = await this.toastController.create({
					color: color,
					message: message,
					duration: duration,
				});
				toast.present();
				toast.onclick = () => toast.dismiss();
	
				return toast;
			},

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