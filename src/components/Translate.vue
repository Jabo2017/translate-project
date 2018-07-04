<template>
	<div class="translate">
		<div class="box">
			<textarea v-model="textToTranslate"></textarea>
			
			<select id="" v-model="lang">
				<option v-for="item in translateLang" :value="item.lang">{{item.value}}</option>
			</select>

			<!-- <router-link tag="input" type="button" value="翻译" :to="'/translated/'+textToTranslate"></router-link> -->
			
			<a href="javascript:;" @click="translateSubmit">翻译</a>

			<router-view />

		</div>
	</div>
</template>
<script>
	export default{
		name:'Translate',
		data(){
			return{
				textToTranslate:'',
				lang:'en',
				translateLang:[
					{lang:'en',value:'English'},
					{lang:'ru',value:'Russian'},
					{lang:'ko',value:'Korean'},
					{lang:'ja',value:'Janpenese'},
				]
			}
		},
		mounted(){
			this.textToTranslate = this.$route.params.word;
			if(!this.$route.params.lang){
				this.lang = 'en';
			}else{
				this.lang = this.$route.params.lang;
			}
		},
		methods:{
			translateSubmit(e){
				if (this.textToTranslate == "") {
					alert("请输入要翻译的内容!");
					this.$router.push("/");
				}else{
					this.$router.push({name:'Translated', params:{word:this.textToTranslate,lang:this.lang}});
				}

				e.preventDefault();
			}
		}
	}
</script>
<style scoped>
	.box{
		margin:auto;
		max-width: 900px;
	}

	textarea{
		width: 100%;
		height: 150px;
		margin: 20px 0;
	}
</style>