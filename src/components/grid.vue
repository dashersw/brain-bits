<script>
export default {
    name: 'grid',
    props: ['matrix'],
}
</script>

<template lang="jade">
#grid-container
    #grid
        .cell(v-for="cell in matrix.cells" v-bind:key="cell.symbol" v-bind:class="[{ highlighted: cell.highlighted}, cell.highlighted && cell.color]")
            {{cell.symbol}}
</template>

<style lang="scss">

$red: #ff1744;
$orange: #ff5722;
$blue: #1565c0;
$yellow: #795548;
$green: #388e3c;
$purple: #8e24aa;

#grid-container {
    text-align: center;
    height: 100%;
}

#grid {
    width: 90vw;
    height: 96vh;
    margin: calc(1vh - 20px) auto;

    & .cell {
        display: inline-block;
        width: 5vw;
        height: 6vh;
        line-height: 6vh;
        margin: 5vh 5vw;
        font-size: 4vh;
        text-align: center;
        opacity: 0.3;

        &.highlighted {
            opacity: 1;
            background: none!important;
            color: white!important;

            &.red {
                background: $red;
                color: $red;
            }

            &.orange {
                background: $orange;
                color: $orange;
            }

            &.blue {
                background: $blue;
                color: $blue;
            }

            &.yellow {
                background: $yellow;
                color: $yellow;
            }

            &.green {
                background: $green;
                color: $green;
            }

            &.purple {
                background: $purple;
                color: $purple;
            }
        }

        &.transparent {
            background: none!important;
        }
    }
}
</style>
