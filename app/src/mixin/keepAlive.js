export const mixin = {
	computed: {
		keepAliveList () {
			return this.$store.getters.keepAliveList
		}
	},
	
	beforeRouteEnter(to, from, next) {
		console.log(this.$route.meta.keepAlive)
		if (to.meta.rank > from.meta.rank) {
			console.log('前进到本页')
		} else {
			console.log('返回到本页')
			from.meta.keepAlive = false
		}
		next();
	},
	
	beforeRouteLeave(to, from, next) {
		if (to.meta.rank > from.meta.rank) {
			console.log('前进到下一页')
		} else {
			console.log('返回到下一页')
			to.meta.keepAlive = false
		}
		next();
	}
}