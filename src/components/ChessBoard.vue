<template>
	<div class="grid grid-cols-8">
		<template v-for="(row, y) in h" :key="y">
			<div v-for="(col, x) in w" :key="x" class="relative aspect-[1]" :class="[
				{'hover:bg-slate-600': isOnMove(x, y)},
				{'bg-slate-600': get(x, y)?.isSelected}, 
				(x + y) % 2 ? 'black' : 'white'
			]" @click="onTileClicked(x, y)">
				<div v-if="canPieceMoveAt(x, y)" class="absolute w-[50%] h-[50%] top-1/4 left-1/4 rounded-full bg-slate-500 opacity-70"></div>
				<img :src="get(x, y)?.sprite" class="block">
				<!-- <p class="absolute top-1/4 left-1/4 text-cyan-400">[{{x}}, {{y}}]</p> -->
			</div>
		</template>
	</div>
</template>

<script>
export default {
	data() {
		return {
			selected: null,
			currentlyPlaying: 0
		}
	},

	props: {
		w: {
			type: Number,
			default: 8
		},
		h: {
			type: Number,
			default: 8
		},
		pieces: {
			type: Array,
			required: true
		},
		onTurn: {
			type: Number,
			default: 0
		},
		getOnMoveData: {
			type: Function
		},
		getMovmentMetrix: {
			type: Function
		}
	},
	
	mounted() {
		for (let x = 0; x < this.pieces.length; x++) {
			for (let y = 0; y < this.pieces[x].length; y++) {
				const piece = this.get(x, y);
				if (piece)
					piece.sprite = require("@/assets/textures/" + piece.type + piece.color + ".png");
			}
		}
		this.currentlyPlaying = this.onTurn;
	},

	methods: {
		async onTileClicked(x, y) {
			this.$emit('onTileClicked', x, y)

			//Move piece
			if (this.selected)
			{
				if (this.canPieceMoveAt(x, y)) {
					const data = await this.getOnMoveData(this.selected.fromPos.x, this.selected.fromPos.y, x, y);
					if (!data)
						return;

					this.put(this.selected.fromPos.x, this.selected.fromPos.y, null);
					this.put(x, y, this.selected);

					this.$emit('onPieceMove', x, y, this.selected)

					if (data.isStalemate || (data.isCheck && !data.canMove))
						this.$emit('onMate', data.isCheck, data.canMove, data.isStalemate, this.currentlyPlaying)
					
					this.endTurn();
					return this.deselect();
				}

				this.deselect();
			}

			//Select piece
			if (this.isOnMove(x, y))
			{
				const selected = this.select(x, y);
				selected.fromPos = {x, y};
				selected.movmentMetrix = await this.generateMovmentMetrix(selected, x, y);
			}
		},

		movePieceIfCan(toX, toY) {
			if (this.selected?.fromPos) {
				this.put(this.selected.fromPos.x, this.selected.fromPos.y, null);
				this.put(toX, toY, this.selected);
			}
		},

		endTurn() {
			for (let x = 0; x < this.pieces.length; x++) {
				for (let y = 0; y < this.pieces[x].length; y++) {
					const piece = this.get(x, y);
					if (piece)
						piece.movmentMetrix = null;
				}
			}
			this.currentlyPlaying ^= 1;
		},

		isOnMove(x, y) {
			return this.get(x, y)?.color == this.currentlyPlaying;
		},

		select(x, y) {
			this.selected = this.get(x, y);
			this.selected.isSelected = true;
			return this.selected;
		},

		deselect() {
			if (this.selected)
			{
				this.selected.isSelected = false;
				this.selected = null;
			}
		},

		async generateMovmentMetrix(piece, x, y) {
			if (piece.movmentMetrix)
				return piece.movmentMetrix;
			
			const data = await this.getMovmentMetrix(x, y);;
			return data;
		},

		canPieceMoveAt(x, y) {
			return this.selected?.isSelected && !this.isOnMove(x, y) && this.selected?.movmentMetrix?.[y]?.[x];
		},

		get(x, y) {
			return this.pieces?.[y]?.[x];
		},

		put(x, y, piece) {
			this.pieces[y][x] = piece;
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

.white {
	background: lightgray;
}

.black {
	background: #752d1e;
}
</style>