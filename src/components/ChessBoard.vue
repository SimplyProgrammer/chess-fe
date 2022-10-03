<template>
	<div class="grid grid-cols-8">
		<template v-for="(row, y) in h" :key="y">
			<div v-for="(col, x) in w" :key="x" class="relative aspect-[1]" :class="[
				{'hover:bg-slate-600': isOnMove(x, y)},
				{'bg-slate-600': get(x, y)?.isSelected}, 
				(x + y) % 2 ? 'black' : 'white'
			]" :style="getMark(x, y)" @click="onTileClicked(x, y)" @drop.prevent="dropPiece(x, y)" @dragenter.prevent @dragover.prevent>
				<div v-if="canPieceMoveAt(x, y)" class="absolute w-[50%] h-[50%] top-1/4 left-1/4 rounded-full bg-slate-500 opacity-70"></div>
				<img :src="get(x, y)?.sprite" @dragstart="dragPiece(x, y)" :draggable="draggable && isOnMove(x, y)" class="block z-10">
				<!-- <p class="absolute top-1/4 left-1/4 text-cyan-400">[{{x}}, {{y}}]</p> -->
			</div>
		</template>
	</div>
</template>

<script>
export default {
	data() {
		return {
			markedTiles: [],
			selected: null,
			onTurn: 0,
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
		whoStarts: {
			type: Number,
			default: 0
		},
		myColor: {
			type: Number,
			default: null
		},
		draggable: {
			type: Boolean,
			default: true
		}
	},
	
	mounted() {
		this.onTurn = this.whoStarts;

		this.markedTiles = new Array(this.h);
		for (var i = 0; i < this.h; i++)
			this.markedTiles[i] = new Array(this.w);
	},

	methods: {
		dropPiece(x, y) {
			if (this.draggable)
				this.onTileClicked(x, y);
		},

		dragPiece(x, y) {
			if (this.draggable && this.isOnMove(x, y)) {
				this.select(x, y);
			}
		},

		onTileClicked(x, y) {
			this.$emit('onTileClicked', x, y)

			// //Move piece
			if (this.selected) {
				if (this.canPieceMoveAt(x, y)) {
					return this.$emit('requestPieceMove', x, y, this.selected);
				}

				this.deselect();
			}

			// //Select piece
			if (this.isOnMove(x, y)) {
				this.select(x, y);
			}
		},

		movePieceIfCan(toX, toY) {
			if (this.selected?.pos) {
				// const selectedSprite = document.getElementById(toX + "," + toY);
				// console.log(selectedSprite);
				// selectedSprite.style.setProperty('top', '150px', 'important');

				const selected = this.selected;
				this.put(selected.pos.x, selected.pos.y);
				this.put(toX, toY, selected);
				// this.lastMove = {fromX: this.selected.pos.x, fromY: this.selected.pos.y, toX, toY}
				return this.selected;
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

			this.onTurn ^= 1;
			this.deselect();
		},

		isOnMove(x, y) {
			return this.get(x, y)?.color == this.onTurn && (this.myColor == null || this.myColor == this.onTurn);
		},

		select(x, y) {
			this.selected = this.get(x, y);
			this.selected.pos = {x, y};
			this.selected.isSelected = true;
			this.$emit("onSelect", x, y, this.selected);
			return this.selected;
		},

		deselect() {
			if (this.selected) {
				this.selected.isSelected = false;
				this.selected = null;
			}
		},

		canPieceMoveAt(x, y) {
			return this.selected?.isSelected && !this.isOnMove(x, y) && this.selected?.movmentMetrix?.[y]?.[x];
		},

		getMark(x, y) {
			const mark = this.markedTiles?.[y]?.[x];
			if (mark) {
				return {
					"box-shadow": `inset ${mark.offsetX ?? 0}px ${mark.offsetY ?? 0}px  ${mark.smooth ?? 6}px ${mark.spread ?? 2}px ${mark.color ?? "limegreen"}`
				}
			}
			return undefined;
		},

		setMark(x, y, mark) {
			this.markedTiles[y][x] = mark;
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
.white {
	background: lightgray;
}

.black {
	background: #752d1e;
}
</style>