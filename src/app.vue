<script>
import Grid from './components/grid';
import GridModel from './models/grid';
import MatrixRunner from './models/matrix-runner';
import Controls from './components/controls.vue';
import SessionManager from './models/session-manager';

export default {
    name: 'app',
    created: function() {
        this.grid = new GridModel();
        this.runner = new MatrixRunner(this.grid);
        this.sessionManager = new SessionManager(this.runner);

        window.grid = this.grid;
        window.runner = this.runner;
        window.sm = this.sessionManager;
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
