<script>
import Grid from './components/grid';
import Matrix from './models/matrix';
import MatrixRunner from './models/matrix-runner';
import Controls from './components/controls.vue';
import SessionManager from './models/session-manager';

export default {
    name: 'app',
    created() {
        this.matrix = new Matrix();
        this.runner = new MatrixRunner(this.matrix);
        this.sessionManager = new SessionManager(this.runner);

        window.matrix = this.matrix;
        window.runner = this.runner;
        window.sm = this.sessionManager;
    },
    data() {
        return {
            matrix: this.matrix
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
        <grid v-bind:matrix="matrix" />
        <controls v-bind:sessionManager="sessionManager" />
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
