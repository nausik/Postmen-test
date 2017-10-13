<template>
<div class="card" :class="additionalClass" v-on:click="openMovie">
    <div class="card-image">
        <img :src="data.poster_small" class="card-image__image" alt="Small poster">
        <div class="card-image__info card-info">
            <div class="card-info__price">
                ЦІНУ ЗНИЖЕНО
            </div>
            <div class="card-info__technologies">
                {{displayTechnologies()}}
            </div>
        </div>
        <div class="card__circles circles">
            <div class="cicles__circle cicles__circle_black">12+</div>
            <div class="cicles__circle cicles__circle_gray">2D</div>
            <div class="cicles__circle cicles__circle_gray">3D</div>
        </div>
        <div class="card__flag flag">
        <img src='~!svg-url-loader?noquotes!img/heart.svg' alt="heart" class="flag__heart">
        </div>
    </div>
    <div class="card__name">{{this.data.name}}</div>
    <div class="card__language">мовою оригіналу</div>
    <div class="card__enddate">до {{formattedDate()}}</div>
</div>
</template>

<script>
'use strict';

import Moment from 'moment';
import Utils from 'js/utils.js';

export default {
    methods: {
        formattedDate: function(date){
            return Moment(this.data.end_date).format('DD.MM.YYYY');
        },
        openMovie: function(){
            this.$router.push(`/films/${this.data.id}`)
        },
        displayTechnologies: function(){
            let technologies_array = Utils.pluck(this.data.Technologies, 'name');

            return technologies_array.join(" | ");
        }
    },
    props: ['data', 'additionalClass']
}
</script>

<style lang="scss">
.card {
    width: 186px;
    box-shadow: 0px 2px 6px 0 rgba(120, 120, 120, 0.2);
    padding: 13px;
    box-sizing: border-box;
    vertical-align:top;
    cursor: pointer;
}

.card-image__info {
    position: absolute;
    bottom: -30px;
}

.card-info__price{
    background-color: #21db3b;
    text-align: center;
    height: 30px;
    width: 160px;
    font-size: 12px;
    line-height: 30px;
    font-weight: 600;
}

.card-info__technologies{
    height: 30px;
    width: 160px; 
    font-size: 10px;
    line-height: 30px;
    font-weight: 600;
    background-color: #f0f0f0;
    text-align: center;
}

.card__flag{
    position: absolute;
    top: -2px;
    left: 10px;
    background-image: url('~img/flag.svg');
    width: 25px;
    background-size: cover;
    background-repeat: no-repeat;
    height: 35px;
    background-position: center center;
    line-height: 27px;
}

.flag__heart{
    width: 14px;
    height: 14px;
    position: absolute;
    top: 5px;
    left: 7px;
    cursor: pointer;
}

.card__name {
    font-weight: 600;
    letter-spacing: 0.3px;
    color: #0e0e0e;
    margin-top: 40px;
    text-overflow: ellipsis;
}
.card__language {
    font-weight: 300;
    letter-spacing: 0.3px;
    color: #0e0e0e;
    margin-top: 6px;
}
.card__enddate {
    font-weight: 600;
    letter-spacing: 0.3px;
    color: rgba(0, 0, 0, 0.64);
    margin-top: 15px;
}
.card-image {
    position: relative;
}
.card-image__image {
    width: 160px;
}

.circles {
    position: absolute;
    right: 11px;
    top: 11px;
}

.circles .cicles__circle:not(:first-of-type) {
    margin-top: 5px;
}

.circles .cicles__circle {
    width: 30px;
    height: 30px;
    color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-weight: 600;
}
.circles .cicles__circle_gray {
    background-color: #818181;
}
.circles .cicles__circle_black {
    background-color: #000;
}
</style>