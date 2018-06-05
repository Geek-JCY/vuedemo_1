<template>
    <div class="shopcart" v-cloak>
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{'highlight': totalCount>0}">
                        <i class="icon-shopping_cart" :class="{'highlight': totalCount>0}"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                </div>
                <div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
                <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class="content-right">
                <div class="pay" :class="payClass">
                    {{payDesc}}
                </div>
            </div>
        </div>
        <div class="ball-container">
            <transition name="drop" @before-enter="beforeDrop" @enter="droping" @after-enter="afterDrop">
                <div v-show="ball.show" class="ball" >
                    <div class="inner inner-hook"></div>
                </div>
            </transition>
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="food in selectFoods">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import cartcontrol from '../../components/cartcontrol/cartcontrol';
    import { eventHub } from '../../eventHub';

    export default {
        props: {
            selectFoods: {
                type: Array,
                default() {
                    return [{
                        price: 0,
                        count: 0
                    }];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                ball: { show: false },
                fold: true
            };
        },
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                  return 'not-enough';
                } else {
                  return 'enough';
                }
            },
            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return false;
                }
                let show = !this.fold;
                if (show) {
                    this.$nextTick(() => {
                        // better scroll
                        if (!this.scroll) {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        } else {
                            this.scroll.refresh();
                        }
                    });
                }
                return show;
            }
        },
        methods: {
            // ---- 抛物线小球 实现
            drop(el) {
              // console.log('el===>', el);
              let rect = el.getBoundingClientRect();
              // console.log('rect.left===>', rect.left);
              // console.log('rect.top===>', rect.top);
              this.ball.positionPoint = { 'top': rect.top, 'left': rect.left };
              this.ball.show = true;
            },
            beforeDrop(el) {
              // console.log('beforeDrop===>', 'beforeDrop');
              // console.log('el=====>', el);
              // console.log(this.ball.positionPoint);
              let x = this.ball.positionPoint.left - 32;
              let y = -(window.innerHeight - this.ball.positionPoint.top - 22);
              el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
              el.style.transform = `translate3d(0, ${y}px, 0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
              inner.style.transform = `translate3d(${x}px, 0, 0)`;
            },
            droping(el) {
                // console.log('droping===>', 'droping');
                /* eslint-disable no-unused-vars */
              setTimeout(function () {
                    el.style.webkitTransform = 'translate3d(0,0,0)';
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                }, 10);
            },
            afterDrop(el) {
                // console.log('afterDrop===>', 'afterDrop');
                this.ball.show = false;
            },
            // ---- 购物车详情
            toggleList() {
                if (!this.totalCount) {
                    return;
                }
                this.fold = !this.fold;
                // 分发 mask.toggle 事件
               eventHub.$emit('mask.toggle', this.fold);
            },
            hideList() {
                this.fold = true;
            },
            empty() {
                this.selectFoods.forEach((food) => {
                    food.count = 0;
                });
                this.$nextTick(() => {
                    // 分发 mask.toggle 事件
                    eventHub.$emit('mask.toggle', this.fold);
                });
            }
        },
        components: {
            cartcontrol
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
     @import "../../common/stylus/mixin"
    
    [v-cloak] 
        display: none

    .shopcart
        position: fixed
        left: 0
        bottom: 0
        z-index: 50
        width: 100%
        height: 48px
        .content
            display: flex
            background: #141d27
            font-size: 0
            color: rgba(255, 255, 255, 0.4)
            .content-left
                flex: 1
                .logo-wrapper
                    display: inline-block
                    vertical-align: top
                    position: relative
                    top: -10px
                    margin: 0 12px
                    padding: 6px
                    width: 56px
                    height: 56px
                    box-sizing: border-box
                    border-radius: 50%
                    background: #141d27
                    .logo
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        text-align: center
                        background: #2b343c
                        &.highlight
                            background: rgb(0, 160, 220)
                        .icon-shopping_cart
                            line-height: 44px
                            font-size: 24px
                            &.highlight
                                color: #fff
                    .num
                        position: absolute
                        top: 0
                        right: 0
                        width: 24px
                        height: 16px
                        line-height: 16px
                        text-align: center
                        border-radius: 16px
                        font-size: 9px
                        font-weight: 700
                        color: #fff
                        background: rgb(240, 20, 20)
                        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)

                .price
                    display: inline-block
                    vertical-align: top
                    margin-top: 12px
                    line-height: 24px
                    padding-right: 12px
                    box-sizing: border-box
                    border-right: 1px solid rgba(255, 255, 255, 0.1)
                    font-size: 16px
                    font-weight: 700
                    &.highlight
                        color: #fff
                        
                .desc
                    display: inline-block
                    vertical-align: top
                    margin: 12px 0 0 12px
                    line-height: 24px
                    font-size: 10px
                       
            .content-right
                flex: 0 0 105px
                width: 105px
                .pay
                    line-height: 48px
                    text-align: center
                    font-size: 12px
                    font-weight: 700
                    &.not-enough
                        background: #2b333b
                    &.enough
                        background: #00b43c
                        color: #fff
        
        .ball-container
            .ball
                position: fixed
                left: 32px
                bottom: 22px
                z-index: 200
                &.drop-enter-active
                    transition: all 0.5s cubic-bezier(.25,-0.89,.86,.38)
                    .inner
                        position: relative
                        width: 16px
                        height: 16px
                        border-radius: 100%
                        background: rgb(0, 160, 220)
                        transition: all 0.5s linear
        
        .shopcart-list
            position: absolute
            top: 0
            left: 0
            width: 100%
            transform: translate3d(0, -100%, 0)
            z-index: -1
            &.fold-enter, &.fold-leave-to
                transform: translate3d(0, 0, 0)
            &.fold-enter-active, &.fold-leave-active
                transition: all 0.5s 
            &.fold-enter-to
                transform: translate3d(0, - 100%, 0)

            .list-header
                height: 40px
                line-height: 40px
                padding: 0 18px
                background: #f3f5f7
                border-none()
                .title
                    float: left
                    font-size: 14px
                    color: rgb(7, 17, 27)
                .empty
                    float: right
                    font-size: 12px
                    color: rgb(0, 160, 220)
            
            .list-content
                padding: 0 18px
                max-height: 217px
                overflow: hidden
                background: #fff
                .food
                    position: relative
                    padding: 12px 0
                    box-sizing: border-box
                    t-border-1px(rgba(7, 17, 27, 0.1))
                    &:first-of-type
                        border-none()
                    .name
                        line-height: 24px
                        font-size: 14px
                        color: rgb(7, 17, 27)
                    .price
                        position: absolute
                        right: 90px
                        bottom: 12px
                        line-height: 24px
                        font-size: 14px
                        font-weight: 700
                        color: rgb(240, 20, 20)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 6px

</style>
