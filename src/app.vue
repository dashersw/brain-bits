<script>
import Controls from './components/controls.vue';
import Grid from './components/grid';
import Display from './components/display';
import Matrix from './models/matrix/matrix';
import MatrixRunner from './models/matrix/matrix-runner';
import SessionManager from './models/session/session-manager';

export default {
    name: 'app',
    created() {
        this.matrix = new Matrix();
        this.sessionManager = new SessionManager(this.matrix);

        window.matrix = this.matrix;
        window.runner = this.sessionManager.runner;
        window.sm = this.sessionManager;
    },
    data() {
        return {
            matrix: this.matrix,
            sessionManager: this.sessionManager
        }
    },
    components: { Grid, Controls, Display }
}
</script>

<template lang="jade">
#app
    display(:symbol="sessionManager.display")
    grid(:matrix="matrix")
    controls(:sessionManager="sessionManager")

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
