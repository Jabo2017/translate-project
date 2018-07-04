<template>
	<div class="translateout" contenteditable="true">
		{{translateoutText}}
	</div>
</template>
<script>
	export default{
		name:'TranslateOut',
		data(){
			return{
				translateoutText:''
			}
		},
		watch: {
		    '$route' (to, from) {
		    	this.translateOut();
		    }
		},
		mounted(){
			//初始要触发执行一次
			this.$nextTick(function(){
				this.translateOut();
			})
		},
		methods:{
			translateOut(){
				let _this = this;
				this.$axios({
					method:'get',
					url:"https://translate.yandex.net/api/v1.5/tr.json/translate",
					params:{
						key:'trnsl.1.1.20170721T082515Z.54cf3dc583f679db.f4a96182281281d8b5dfe24b4e88298e2133f219',
						lang: this.$route.params.lang,
						text: this.$route.params.word
					},
				})
				.then(function(response){
					_this.translateoutText = response.data.text[0];
				})
				.catch(function(error){
					console.log(error)
				})

			}
		}
	}
</script>
<style scoped>
	.translateout{
		padding: 20px 0;
		outline: none;
		text-align: center;
		font-size: 24px;
	}
</style>