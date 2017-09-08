<script>
import Mousetrap from 'mousetrap';

function bindings() {
    return [
        [['command+o', 'ctrl+o'], this.toggleVisibility],
        [['command+s', 'ctrl+s'], this.start],
        [['command+d', 'ctrl+d'], this.stop],
        [['command+t', 'ctrl+t'], this.reset]
    ]
};

export default {
    name: 'controls',
    props: ['sessionManager'],
    created() {
        bindings.call(this).forEach(b => Mousetrap.bind.call(null, ...b));
    },
    methods: {
        start() { this.sessionManager.startSession(); },
        stop() { this.sessionManager.stopSession(); },
        reset() { this.sessionManager.resetSession(); },
        toggleVisibility() { this.visible = !this.visible; }
    },
    data() {
        return { visible: true };
    }
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
    cursor: pointer;
}
</style>
