<template>
	<div v-if="game" class="h-full">
		<p class="text-center bg-slate-600 text-white border-0 border-black border-solid border-b-4 m-0 py-1" @dblclick="copySessionId">{{game.session}}</p>

		<div class="flex justify-center items-center h-[90%]">
			<Chess-Board v-bind="game" :whoStarts="game.onTurn" class="w-full aspect-[1] max-w-[78vh]"
				@requestPieceMove="doMove"
				@onSelect="setMovmentMetrix"
				ref="chessBoard" >
			</Chess-Board>
		</div>
		
		<footer class="absolute bottom-0 flex justify-between w-full border-2 border-black border-solid">
			<p class="bg-black text-white m-0 h-12 w-full">Black</p>
			<p class="bg-white text-black m-0 h-12 w-full">White</p>
		</footer>
	</div>
	<div class="flex items-center flex-col" v-else>
		<p class="font-bold text-center">It looks like this game has expired or does not exist!<br>Check your connection or try again later!</p>
		<div class="flex">
			<ion-button @click="$router.push('/')">Exit</ion-button>
			<ion-button @click="connect(this, $route.params.session)">Retry</ion-button>
		</div>
	</div>
</template>

<script>
import PromotionModal from "@/components/PromotionModal.vue";
import ChessBoard from "@/components/ChessBoard.vue";
import Axios from "axios";
import {alertController} from "@ionic/vue";

export default {
	components: {PromotionModal, ChessBoard},

	data() {
		return {
			// defaltPieces: [
			// 	[this.piece(0, "r"), this.piece(0, "n"), this.piece(0, "b"), this.piece(0, "q"), this.piece(0, "k"), this.piece(0, "b"), this.piece(0, "n"), this.piece(0, "r")],
			// 	[this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0), this.piece(0)],
			// 	[],
			// 	[],
			// 	[],
			// 	[],
			// 	[this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1), this.piece(1)],
			// 	[this.piece(1, "r"), this.piece(1, "n"), this.piece(1, "b"), this.piece(1, "q"), this.piece(1, "k"), this.piece(1, "b"), this.piece(1, "n"), this.piece(1, "r")]
			// ],

			promotions: [
				this.piece(0, "q"),
				this.piece(0, "r"),
				this.piece(0, "b"),
				this.piece(0, "n"),
			],
			game: null,
			ws: null
		}
	},

	mounted() {
		window.onfocus = ev => {
			if (!this.ws)
				this.connect(this, this.$route.params.session);
		}

		this.connect(this, this.$route.params.session);
	},

	unmounted() {
		window.onfocus = null;
		if (this.ws) {
			this.ws.close();
			this.game = this.ws = null;
		}
	},

	methods: {
		piece(color = 0, type = "p", sprite = null) {
			return {type, color, sprite: sprite ?? require("@/assets/textures/" + type + color + ".png")};
		},

		connect(self, session) {
			self.ws = new WebSocket(process.env.VUE_APP_API.replace(/https?/, "ws") + "game/" + session);

			self.ws.onopen = (event) => {
				console.log("Server connected." , event);
			}

			self.ws.onerror = (event) => {
				self.toast("Connection with server failed!", "danger");
				console.log(event);
			}

			self.ws.onmessage = async (event) => {
				const data = JSON.parse(event.data);
				if (data.type == "init") {
					const game = self.game = data.data;
					game.myColor = data.myColor;

					for (let x = 0; x < game.pieces.length; x++) {
						for (let y = 0; y < game.pieces[x].length; y++) {
							const piece = game.pieces[y][x];
							if (piece)
								piece.sprite = require("@/assets/textures/" + piece.type + piece.color + ".png");
						}
					}

					self.toast("You are " + (game.myColor > 1 ? "spectating!" : game.myColor ? "playing as white!" : "playing as black!"), "success", 950, {
						position: "middle",
						cssClass: "text-center"
					});
				}
				else if (data.type == "move") {
					const board = self.$refs.chessBoard, dt = data.data;

					board.select(dt.fromX, dt.fromY);
					const piece = board.movePieceIfCan(dt.toX, dt.toY);
					if (dt.promote)
						Object.assign(piece, self.piece(piece.color, dt.promote))
					if (dt.isStalemate || (dt.isCheck && !dt.canMove))
						self.endGame(dt.isCheck, dt.canMove, dt.isStalemate, board.onTurn);

					board.endTurn();
				}
			}

			self.ws.onclose = (event) => {
				if (self.game) {
					console.log("Server disconnected." , event);
					self.ws = self.game = null;
				}
			}
		},

		async endGame(isCheck, canMove, isStalemate, onMove) {
			const alert = await alertController.create({
				header: "GOOD GAME!",
				subHeader: isStalemate ? "This looks like a draw!" : (onMove == 0 ? "Black" : "White") + " has won!",
				// message: 'This is an alert!',
				buttons: ['OK'],
				mode: "md"
			});

			await alert.present();
		},

		async doMove(x, y, selected) {
			const data = {fromX: selected.pos.x, fromY: selected.pos.y, toX: x, toY: y}, board = this.$refs.chessBoard;
			if (selected.type == "p" && (y >= board.h - 1 || y <= 0))
				data.promote = await this.openPromotionModal();
			return await this.ws.response("move", data);
		},

		async setMovmentMetrix(x, y, selected) {
			const request = await this.ws.response("movmentMetrix", {x, y});
			return selected.movmentMetrix = request;
		},

		async openPromotionModal() {
			this.promotionModal = await this.modal(PromotionModal, {
				promotions: this.promotions
			});

			const { data } = await this.promotionModal.onDidDismiss();
			if (data?.piece?.type) {
				return data.piece.type;
			}
			return "q";
		},

		async copySessionId() {
			try {
				await navigator.clipboard.writeText(this.game.session);
				this.toast("Game id coppied!");
			} 
			catch (e) {
				console.error(e);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.flip {
	transform: scaleY(-1);

	img.block {
		transform: scaleY(-1);
	}
}
</style>