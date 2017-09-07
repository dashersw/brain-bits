<script>
import Grid from './components/grid';
import GridModel from './models/grid';
import MatrixRunner from './models/matrix-runner';
import Controls from './components/controls.vue';

export default {
    name: 'app',
    created: function() {
        this.grid = new GridModel();
        this.runner = new MatrixRunner(this.grid);

        window.grid = this.grid;
        window.runner = this.runner;
    },
    data: function() {
        return {
            grid: this.grid
        }
    },
    components: {
        Grid,
        Controls
    }
}
</script>

<template>
    <div id="app">
        <grid v-bind:grid="grid" />
        <controls v-bind:runner="runner" />
    </div>
</template>

<style lang="scss">
#app {
    height: calc(100% - 36px);
    width: 100%;
    top: 36px;
    left: 0;
    position: absolute;
}
</style>
