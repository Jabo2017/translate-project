<template>
	<div class="translate">
		<form @submit="translateSubmit">
			<textarea v-model="textToTranslate"></textarea>
			
			<select id="">
				<option value="en">English</option>
			</select>

			<router-link tag="input" type="submit" value="翻译" to="/translated" ></router-link>

			<router-view />
		</form>
	</div>
</template>
<script>
	export default{
		name:'Translate',
		data(){
			return{
				textToTranslate:''
			}
		},
		methods:{
			translateSubmit(e){
				this.$axios({
					method:'get',
					url:'https://translate.yandex.net/api/v1.5/tr.json/translate',
					data:{
						key:'trnsl.1.1.20170721T082515Z.54cf3dc583f679db.f4a96182281281d8b5dfe24b4e88298e2133f219',
						lang:'en',
						text:'test'
					},
					timeout: 2000,
				})
				.then(function(response){
					console.log(response)
				})
				.catch(function(error){
					console.log(error)
				})

				e.preventDefault();
			}
		}
	}
</script>
<style scoped>
	form{
		margin:auto;
		max-width: 900px;
	}

	textarea{
		width: 100%;
		height: 150px;
		margin: 20px 0;
	}
</style>