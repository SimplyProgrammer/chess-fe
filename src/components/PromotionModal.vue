<template>
	<ion-content>
		<ion-header>
			<ion-toolbar>
				<ion-title>Promotion!</ion-title>
			</ion-toolbar>
		</ion-header>
		<div class="grid grid-cols-2 gap-8 p-5">
			<img class="w-full hover:shadow-lg transition" v-for="piece in promotions" :key="piece" :src="piece.sprite" @click="promote(piece)">
		</div>
	</ion-content>
</template>

<script>
import { modalController } from "@ionic/vue";

export default {
	props: {
		promotions: {
			type: Array
		}
	},

	data() {
		return {

		}
	},

	methods: {
		promote(piece) {
			return modalController.dismiss({
				piece
			});
		}
	}
}
</script>

<style lang="scss" scoped>

</style>