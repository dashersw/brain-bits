<script>
export default {
    name: 'toggle',
    model: { prop: 'checked' },
    props: {
        label: '',
        checked: {
            type: Boolean,
            default: false
        },
    }
}
</script>

<template lang="jade">
label.toggle
    span.label {{label}}
    input(type="checkbox", :checked.prop="checked", @change="$emit('input', $event.target.checked)")
    span
</template>

<style lang="scss">
// modified from http://callmenick.com/post/css-toggle-switch-examples
.toggle {
    font-size: 0.4em;
    display: inline-block;
    vertical-align: middle;
    padding: 1vmin;
    line-height: 5em;

    & .label {
        float: left;
        font-size: 2.5em;
        cursor: pointer;
        padding-right: 1.5vmin;
    }

    & input {
        display: none;
    }

    & input+span {
        display: block;
        position: relative;
        float: right;
        cursor: pointer;
        outline: none;
        user-select: none;
        border-radius: 5em;
        transition: 0.4s;
        border: 0.5em solid #ddd;
        padding: .5em;
        width: 10em;
        height: 5em;
        background-color: #fff;
        border-radius: 5em;
        transition-duration: 0.35s;
        transition-property: border-color, background-color;
    }

    & input+span:after {
        display: block;
        position: absolute;
        content: "";
        top: 0.6em;
        width: 3em;
        height: 3em;
        background-color: #dddddd;
        border-radius: 3em;
        transition-duration: 0.35s;
        transition-property: transform, background-color;
    }

    & input:checked+span {
        border-color: #8ce196;
    }

    & input:checked+span:after {
        transform: translateX(5em);
        background-color: #8ce196;
    }
}
</style>
