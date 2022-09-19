<template>
	<h1>Sorry but this is not the page you are looking for!</h1>
	<div v-if="Math.random() > 0.92">
		<img src="https://lh3.googleusercontent.com/jq1i1nFKtLmxQI70ss58AfAwZi0Ef44ie62bthVndVBeHrPL04Ea46560tm-Pdki7phe=w300">
		<p>Please accept this dinosaur instead!</p>
	</div>
</template>

<style scoped>
* {
	text-align: center;
}

img {
	margin: auto;
}
</style>