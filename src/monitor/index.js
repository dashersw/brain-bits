const d3 = require('d3');

import Emotiv from './models/emotiv/emotiv';
import { channels } from './models/emotiv/constants';

const n = 2048;
const random = d3.randomNormal(7500, 8000);
const data = d3.range(n).map(random);

const svg = d3.select('svg');
const margin = {
    top: 20, right: 20, bottom: 20, left: 40,
};
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const x = d3.scaleLinear()
    .domain([0, n - 1])
    .range([0, width]);

const y = d3.scaleLinear()
    .domain([7500, 8000])
    .range([height, 0]);

const line = d3.line()
    .x((d, i) => x(i))
    .y((d, i) => y(d));

const channelPaths = channels.map((channel, i) => {
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const data = [];

    g.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

    g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0,${y(0)})`)
        .call(d3.axisBottom(x));

    g.append('g')
        .attr('class', 'axis axis--y')
        .call(d3.axisLeft(y));

    g.append('g')
        .attr('clip-path', 'url(#clip)')
        .append('path')
        .datum(data)
        .attr('class', 'line')
        .transition()
        .duration(10)
        .ease(d3.easeLinear)
        .on('start', function t() { tick.call(this, data, channel, i); });

    return [g, data];
});

const emotiv = new Emotiv();
window.ee = emotiv;

const buffer = {};
const cq = {};

ee.buffer = buffer;
ee.cq = cq;

channels.forEach(c => buffer[c] = []);
channels.forEach(c => cq[c] = []);

emotiv.start();
emotiv.on('data', (d) => {
    channels.forEach((c) => {
        buffer[c] = buffer[c] || [];
        cq[c] = d.cq[c];
        buffer[c].push(d.levels[c]);
    });
});

function tick(data, channel, i) {
    const bufferCopy = buffer[channel].slice();
    const bufferToPush = bufferCopy.map(b => b);

    buffer[channel].length = 0;

    data.push(...bufferToPush);

    // Redraw the line.
    d3.select(this)
        .attr('d', line)
        .attr('transform', null);

    // Slide it to the left.
    d3.active(this)
        .attr('transform', `translate(${x(-1)},0)`)
        .transition()
        .duration(100)
        .on('start', function t() { tick.call(this, data, channel, i); });

    // Pop the old data point off the front.
    let len = data.length - 2048;
    if (len <= 0) return;
    while (--len) data.shift();
    // Push a new data point onto the back.
}
