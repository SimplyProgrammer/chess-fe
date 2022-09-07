<template>
	<div class="grid grid-cols-8">
		<template v-for="(col, x) in w" :key="x">
			<div v-for="(row, y) in h" :key="y" class="w-full h-full relative aspect-[1]" :class="[{'hover:bg-slate-600': isOnMove(x, y)}, {'bg-slate-600': getPieceAt(x, y)?.isSelected}, (x + y) % 2 ? 'black' : 'white']" @click="onTileClicked(x, y)">
				<div v-if="canPieceMoveAt(x, y)" class="absolute w-[50%] h-[50%] top-1/4 left-1/4 rounded-full bg-slate-500 opacity-70"></div>
				<img :src="getPieceAt(x, y)?.sprite">
				<p class="absolute top-1/4 left-1/4 text-cyan-400">[{{x}}, {{y}}]</p>
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
			type: Array
		}
	},
	
	mounted() {
		// console.log(this.pieces);
		// if (this.defaltPieces)
		// 	this.pieces = this.defaltPieces;
		console.log(this.pieces);
	},

	methods: {
		onTileClicked(x, y) {
			this.$emit('onTileClicked', x, y)

			//Move piece
			if (this.selected)
			{
				if (this.canPieceMoveAt(x, y)) {
					this.pieces[this.selected.fromPos.x][this.selected.fromPos.y] = null;
					this.pieces[x][y] = this.selected;

					this.$emit('onPieceMove', x, y, this.selected)

					this.currentlyPlaying ^= 1;
					return this.deselect();
				}

				this.deselect();
			}

			//Select piece
			if (this.isOnMove(x, y))
			{
				const selected = this.select(x, y);
				selected.fromPos = {x, y};
				selected.movmentMetrix = this.generateMovmentMetrix(selected);
			}
		},

		isOnMove(x, y) {
			return this.getPieceAt(x, y)?.color == this.currentlyPlaying;
		},

		select(x, y) {
			this.selected = this.getPieceAt(x, y);
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

		generateMovmentMetrix(piece) {
			if (piece.movmentMetrix)
				return piece.movmentMetrix;
			console.log(123);
			return [
				[],
				[],
				[null, true]
			];
		},

		canPieceMoveAt(x, y) {
			return this.selected?.isSelected && !this.isOnMove(x, y) && this.selected?.movmentMetrix?.[x]?.[y];
		},

		getPieceAt(x, y) {
			return this.pieces?.[x]?.[y];
		}
	}
}
</script>

<style lang="scss" scoped>
.white {
	background: lightgray;
}

.black {
	background: #752d1e;
}
</style>