<script>
import Fili from 'fili';

import Emotiv from '../models/emotiv/emotiv';
import { channels } from '../models/emotiv/constants';

const d3 = require('d3');

export default {
    created() {
        this.buffer = {};
        this.cq = {};
        this.emotiv = new Emotiv();
    },
    methods: {
        listener(d) {
            channels.forEach((c, i) => {
                this.buffer[c] = this.buffer[c] || [];
                this.cq[c] = d.cq[c];
                this.buffer[c].push(d.levels[c]);
            });
        }
    },
    mounted() {
        const buffer = this.buffer;
        const cq = this.cq;

        const n = 1024;
        const random = d3.randomNormal(7500, 8000);
        const data = d3.range(n).map(random);

        const svg = d3.select(this.$refs.chart);
        const margin = {
            top: 20, right: 20, bottom: 20, left: 40,
        };
        const width = +window.innerWidth - margin.left - margin.right;
        const height = +window.innerHeight - margin.top - margin.bottom;

        const x = d3.scaleLinear()
            .domain([0, n - 1])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([-1000, 8000])
            .range([height, 0]);

        const line = d3.line()
            .x((d, i) => x(i))
            .y((d, i) => y(d));

        channels.forEach((channel, i) => {
            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
            const data = [];

            g.append('defs').append('clipPath')
                .attr('id', 'clip')
                .append('rect')
                .attr('width', width)
                .attr('height', height);

            if (i == 0) {
                g.append('g')
                    .attr('class', 'axis axis--x')
                    .attr('transform', `translate(0,${y(0)})`)
                    .call(d3.axisBottom(x));
            }

            if (i == 0) {
                g.append('g')
                    .attr('class', 'axis axis--y')
                    .call(d3.axisLeft(y));
            }

            g.append('g')
                .attr('clip-path', 'url(#clip)')
                .append('path')
                .datum(data)
                .attr('class', `line line-${i}`)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .on('start', function t() { tick.call(this, data, channel, i); });

            return [g, data];
        });

        channels.forEach(c => buffer[c] = []);
        channels.forEach(c => cq[c] = []);

        const iirCalculator = new Fili.CalcCascades();

        const highpassFilters = channels.map(c => new Fili.IirFilter(iirCalculator.highpass({
            order: 1,
            characteristic: 'butterworth',
            Fs: 128,
            Fc: 1,
        })));

        const lowpassFilters = channels.map(c => new Fili.IirFilter(iirCalculator.lowpass({
            order: 1,
            characteristic: 'butterworth',
            Fs: 128,
            Fc: 32,
        })));

        const filter = (filterIndex, data) => highpassFilters[filterIndex].multiStep(lowpassFilters[filterIndex].multiStep(data));

        this.emotiv.start();
        this.emotiv.on('data', this.listener);

        const selectionCache = new Map();

        function tick(data, channel, i) {
            let bufferToPush = buffer[channel];

            if (bufferToPush.length) {
                bufferToPush = filter(i, bufferToPush).map(v => v + i * 500 + 500);
            }

            buffer[channel].length = 0;

            data.push(...bufferToPush);

            if (!selectionCache.get(this)) {
                selectionCache.set(this, d3.select(this));
            }

            // Redraw the line.
            selectionCache.get(this)
                .attr('d', line)
                .attr('transform', null);

            const len = data.length - n;
            data.splice(0, len + 1);

            this.timeout = setTimeout(() => {
                tick.call(this, data, channel, i);
            }, 100);
        }
    },
    beforeDestroy() {
        clearTimeout(this.timeout);
        this.emotiv.removeListener('data', this.listener);
    }
}
</script>

<template lang="jade">
    #chart-container
        svg(ref="chart" width="100%" height="100%")

</template>

<style lang="scss">

#chart-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    padding: 40px 0;
    background: white;
    z-index: 2;
}

.line {
    fill: none;
    stroke: red;
    stroke-width: 1px;
    transition: .1s all;
    transform: translate3d(0,0,0)
}

.line-0 {
    stroke: tomato;
}

.line-1 {
    stroke: #080F0F;
}

.line-2 {
    stroke: #A4BAB7;
}

.line-3 {
    stroke: #19535F;
}

.line-4 {
    stroke: #BEA57D;
}

.line-5 {
    stroke: #A52422;
}

.line-7 {
    stroke: #A2708A;
}

.line-8 {
    stroke: #E6AF2E;
}

.line-9 {
    stroke: #A3320B;
}

.line-10 {
    stroke: #0B7A75;
}

.line-11 {
    stroke: #19535F;
}

.line-12 {
    stroke: #F35B04;
}

.line-13 {
    stroke: #3D348B;
}

</style>

