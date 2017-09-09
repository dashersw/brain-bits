<script>
export default {
    props: ['symbol']
}
</script>

<template lang="jade">
    .display(v-show="symbol != null") {{symbol}}
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
}
</style>

