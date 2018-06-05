<template>
    <div class="ratingselect">
        <div class="rating-type b-border-1px">
            <span @click="select(2, $event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="select(0, $event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1, $event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div class="switch" :class="{'on':onlyContent}">
            <span @click="toggleContent" class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import { eventHub } from '../../eventHub';

    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

    export default {
        props: {
            fromComponent: {
                type: String,
                default: 'ratings'
            },
            ratings: {
                type: Array,
                default() {
                    return [];
                }
            },
            selectType: {
                type: Number,
                default: ALL
            },
            onlyContent: {
                type: Boolean,
                default: false
            },
            desc: {
                type: Object,
                default() {
                    return {
                        all: '全部',
                        positive: '满意',
                        negative: '不满意'
                    };
                }
            }
        },
        // data() {
        //     return {
        //     }
        // },
        computed: {
            positives() {
                return this.ratings.filter((rating) => {
                    return rating.rateType === POSITIVE;
                });
            },
            negatives() {
                return this.ratings.filter((rating) => {
                    return rating.rateType === NEGATIVE;
                });
            }
        },
        methods: {
            select(type, event) {
                if (!event._constructed) {
                    return false;
                }
                /*
                this.selectType = type
                 注：这是错误的写法， 子组件 不能直接改变 父组件传递过来的值(即 props 中的值)，
                    想要实现 双线数据绑定的效果 可用 data 或 computed 属性，详细 参考官网
                    2.3+的版本，也可以用 .sync 的方式，用法：详见 官网 .sync 部分
                 */
                // 点击时 触发 selectType update 事件
                this.$emit('update:selectType', type);

                // 分发 refresh.scroll 事件，让评论列表的高度 刷新
                eventHub.$emit('refresh.scroll', this.fromComponent);
            },
            toggleContent(event) {
                if (!event._constructed) {
                    return;
                }
                // 点击时 触发 onlyContent update 事件
                this.$emit('update:onlyContent', !this.onlyContent);

                // 分发 refresh.scroll 事件， 让评论列表的高度 刷新
                eventHub.$emit('refresh.scroll');
            }
        }
    };
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import '../../common/stylus/mixin.styl';

    .ratingselect
        .rating-type
            padding: 18px 0
            margin: 0 18px
            b-border-1px(rgba(7, 17, 27, 0.1))
            font-size: 0
            .block
                display: inline-block
                padding: 8px 12px
                margin-right: 8px
                line-height: 16px
                border-radius: 2px
                font-size: 12px
                color: rgb(77, 85, 93)
                &.active
                    color: rgb(255, 255, 255)
                .count
                    margin-left: 2px
                    font-size: 8px
                &.positive
                    background: rgba(0, 160, 220, 0.2)
                    &.active
                        background: rgb(0, 160, 220)
                &.negative
                    background: rgba(77, 85, 93, 0.2)
                    &.active
                        background: rgb(77, 85, 93)
        .switch
            padding: 12px 18px
            line-height: 24px
            border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            color: rgb(147, 153, 159)
            font-size: 0
            &.on
                .icon-check_circle
                    color: #00c850
            .icon-check_circle
                display: inline-block
                vertical-align: top
                margin-right: 4px
                font-size: 24px
            .text
                display: inline-block
                vertical-align: top
                font-size: 12px
                                
                    
                
</style>