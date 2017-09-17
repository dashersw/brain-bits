<script>
export default {
    props: ['symbol'],
    created: function() {
        this.$watch('symbol', function(val = '') {
            const s = this.$refs.sizer;
            let fontSize = 40;

            s.innerText = val;

            s.style.fontSize = `${fontSize}vmin`;

            while (s.getBoundingClientRect().width > this.$el.getBoundingClientRect().width) {
                s.style.fontSize = `${--fontSize}vmin`;
            }

            this.$el.style.fontSize = `${fontSize}vmin`;
        })
    }
}
</script>

<template lang="jade">
    .display(v-show="symbol != null")
        span(ref="container") {{symbol}}
        .sizer(ref="sizer")
</template>

<style lang="scss">
.display {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: black;
    text-align: center;
    line-height: 100vh;
    font-size: 40vmin;
    background: black;
    z-index: 1;
    overflow: scroll;

    & .sizer {
        position: absolute;
        top: 200vh;
        left: 200vw;
    }
}
</style>

