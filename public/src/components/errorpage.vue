<template>
<div class="error-page">
	<div class="error-page__message">
		<div class="error-page__text" v-if="!is404()">
			Щось пішло не так:(
		</div>
		<div class="error-page__text" v-if="is404()">
			404. Сторінку не знайдено :(
		</div>
		<div>
			<button class="button button_empty" v-on:click="goBack(-2)">Назад</button>
		</div>
	</div>
</div>
</template>

<script>
'use strict';

export default{
	methods:{
		goBack: function(i){
			this.$router.go(i);
		},
		is404: function(){
			return (this.$route.path === '/404');
		}
	}
}
</script>

<style>
.error-page{
	width: 100%;
	
	text-align: center;
}

.error-page__message{
	position: fixed;
	top: 40%;
	left: 30%;
}

.error-page__text{
	font-size: 60px;
	height: 100px;
}

.error-page__button{

}
</style>