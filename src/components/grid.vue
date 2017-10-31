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
            .label {{cell.symbol}}
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
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 2vmin;

    & .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.3;

        &.highlighted {
            opacity: 1;

            &.red .label {
                background: $red;
                color: $red;
                box-shadow: inset 0 0 0 2px $red;
            }

            &.orange .label {
                background: $orange;
                color: $orange;
                box-shadow: inset 0 0 0 2px $orange;
            }

            &.blue .label {
                background: $blue;
                color: $blue;
                box-shadow: inset 0 0 0 2px $blue;
            }

            &.yellow .label {
                background: $yellow;
                color: $yellow;
                box-shadow: inset 0 0 0 2px $yellow;
            }

            &.green .label {
                background: $green;
                color: $green;
                box-shadow: inset 0 0 0 2px $green;
            }

            &.purple .label {
                background: $purple;
                color: $purple;
                box-shadow: inset 0 0 0 2px $purple;

            }
        }

        &.transparent {
            background: none!important;
        }

        & .label {
            height: 6vmin;
            width: 6vmin;
            line-height: 6vmin;
            font-size: 3vmin;
            color: white!important;
            border-radius: 50%;
            background: none !important;
            // box-shadow: inset 0 0 0 2px rgba(255,255,255,0.3);
            // box-shadow: none;
        }
    }
}
</style>
