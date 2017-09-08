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
#grid-container {
    text-align: center;
    height: 100%;
}

#grid {
    width: 72vmin;
    height: 72vmin;
    margin: calc(14vmin - 36px) auto 14vmin;

    & .cell {
        display: inline-block;
        width: 8vmin;
        height: 8vmin;
        line-height: 8vmin;
        margin: 2vmin;
        font-size: 4vmin;
        text-align: center;

        &.highlighted {
            &.red {
                background: #ff1744;
            }

            &.orange {
                background: #ff5722;
            }

            &.blue {
                background: #1565c0;
            }

            &.yellow {
                background: #795548;
            }

            &.green {
                background: #388e3c;
            }

            &.purple {
                background: #8e24aa;
            }
        }

        &.transparent {
            background: none!important;
        }
    }
}
</style>
