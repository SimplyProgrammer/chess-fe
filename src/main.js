import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { IonicVue } from "@ionic/vue";

/* Ionic bullshit for css */
import "@ionic/vue/css/core.css";
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

import "./assets/css/variables.css";
import "./assets/css/styles.scss";
import './assets/tailwind.css'

import * as IonComponents from "@ionic/vue"; //Ionic components

import "swiper/swiper-bundle.min.css" //swiper css
// import { Swiper, SwiperSlide } from "swiper/vue/swiper-vue.js";
// import SwiperCore, { Pagination, Scrollbar } from "swiper"; //import swiper core and plugins
// SwiperCore.use([Pagination, Scrollbar]); //declare two plugins

// import "@vaadin/vaadin";

import GlobalMixins from "./globals.js";

//Axios defaults
import https from "https";
import Axios from "axios";
Axios.defaults.timeout = 3000;
Axios.defaults.httpsAgent = new https.Agent({
	rejectUnauthorized: false,
});

const app = createApp(App).use(IonicVue).use(router).mixin(GlobalMixins);

router.isReady().then(() => {
	app.mount("#app");
});

Object.keys(IonComponents).forEach(key => {
	if (/^Ion[A-Z].+$/.test(key)) {
		app.component(key, IonComponents[key]);
	}
});

// app.component("swiper", Swiper);
// app.component("swiper-slide", SwiperSlide);
