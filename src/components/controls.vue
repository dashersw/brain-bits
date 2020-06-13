<script>
import Mousetrap from 'mousetrap';
import Toggle from './toggle';
import Session from '../models/session/session';

function bindings() {
    return [
        [['command+o', 'ctrl+o'], this.toggleVisibility],
        [['command+s', 'ctrl+s'], this.start],
        [['command+e', 'ctrl+e'], this.saveSession],
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
        start() { this.sessionManager.startSession(this.sessionMode, this.message); this.visible = false; },
        reset() { this.sessionManager.resetSession(); this.visible = false; },
        saveSession() { this.sessionManager.saveSession(this.sessionManager.session) },
        toggleVisibility() { this.visible = !this.visible; },
    },
    data() {
        return {
            visible: false,
            trainingMode: false,
            message: 'XBL81EAGSO'
        };
    },
    computed: {
        sessionMode() {
            return this.trainingMode ? Session.Mode.TRAINING : Session.Mode.LIVE;
        }
    },
    components: { Toggle }
}
</script>

<template lang="jade">
#controls(v-bind:class="[visible ? 'visible' : '']")
    form(v-on:submit.prevent="")
        h1 Controls
        fieldset
            toggle(v-model="trainingMode", label="Training Mode")
            input.message(v-show="trainingMode", :value="message.toUpperCase()", @input="message = $event.target.value.toUpperCase()", placeholder="training message")
        fieldset
            span Session
            .button(@click="start()") Start
            .button(@click="reset()") Reset

</template>

<style lang="scss">
#controls {
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60vmin;
    padding: 15vmin;
    border-radius: 1vmin;
    text-align: center;
    transform: translate3d(-50%, -50%, 0) scale(1.1);
    opacity: 0;
    transition: transform 0.3s, opacity 0.6s;
    padding: 3vmin;
    font-size: 3vmin;
    z-index: 2;
    pointer-events: none;

    &:before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.9);
        transform: scale(2);
    }

    fieldset {
        border: none;
        border-top: 1px solid #666;
    }

    &.visible {
        transform: translate3d(-50%, -50%, 0) scale(1);
        opacity: 1;
        pointer-events: auto;
    }

    .toggle {
        padding-bottom: 0;
    }
}

.button {
    display: inline-block;
    padding: 1vmin 1.5vmin;
    margin: 1vmin 0 1vmin 1vmin;
    border: 1px solid white;
    border-radius: 1vmin;
    cursor: pointer;
}

.button:hover {
    background: rgba(255, 255, 255, 0.1);
}

.button:active {
    background: rgba(255, 255, 255, 0.3);
}
</style>
