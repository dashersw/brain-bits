<script>
import GridModel from '../models/grid';

export default {
    name: 'grid',
    data: () => ({
        grid: new GridModel()
    })
}
</script>

<template lang="jade">
    div#grid-container
        div#grid
            span(v-for="cell in grid.cells" v-bind:key="cell.letter")
                {{cell.letter}}
</template>

<style lang="scss">
    #grid-container {
        text-align: center;
    }

    #grid {
        width: 72vmin;
        height: 72vmin;
        margin: calc(14vmin - 40px) auto 14vmin;

        & span {
            display: inline-block;
            width: 12vmin;
            height: 12vmin;
            line-height: 12vmin;
            font-size: 6vmin;
            text-align: center;
        }
    }
</style>
