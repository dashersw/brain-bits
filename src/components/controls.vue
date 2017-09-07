<script>
import MatrixRunner from '../models/matrix-runner';
import Mousetrap from 'mousetrap';

export default {
    name: 'controls',
    props: ['runner'],
    created: function() {
        Mousetrap.bind(['command+o', 'ctrl+o'], () => {
            this.visible = !this.visible;
        });

        Mousetrap.bind(['command+s', 'ctrl+s'], () => {
            this.runner.start();
        });

        Mousetrap.bind(['command+d', 'ctrl+d'], () => {
            this.runner.stop();
        });

        Mousetrap.bind(['command+t', 'ctrl+t'], () => {
            this.runner.reset();
        });
    },
    methods: {
        start: function() {
            this.runner.start();
        },
        stop: function() {
            this.runner.stop();
        },
        reset: function() {
            this.runner.reset();
        },
    },
    data: () => ({
        visible: true
    })
}
</script>

<template lang="jade">
#controls(v-bind:class="[visible ? 'visible' : '']")
    .button(@click="start()") Start
    .button(@click="stop()") Stop
    .button(@click="reset()") Reset
</template>

<style lang="scss">
#controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: center;
    transform: translate3d(0, 100%, 0);
    opacity: 0;
    transition: 0.3s all;
    padding: 1vmin;

        &.visible {
        transform: translate3d(0, 0, 0);
        opacity: 1;
    }
}

.button {
    display: inline-block;
    padding: 1vmin 1.5vmin;
    margin: 1vmin;
    font-size: 2vmin;
    border: 1px solid white;
    border-radius: 1vmin;
}
</style>
