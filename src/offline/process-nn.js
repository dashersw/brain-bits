const {
    getSessionFromRecording, splitSessionIntoTrainingAndTest, train, classify,
} = require('../lib/methods');

const channelsMap = {
    F3: 1,
    F4: 1,
    FC5: 1,
    FC6: 1,
    F7: 1,
    F8: 1,
    P7: 1,
    P8: 1,
    O1: 1,
    O2: 1,
    T7: 1,
    T8: 1,
    AF3: 1,
    AF4: 1,
};
const channels = Object.keys(channelsMap).filter(c => channelsMap[c]);

process.env.RECORD = '../../sessions/2017.09.26_00.48.10';
// process.env.MODEL = '../../nn-models/leaky-relu-0.01-128|256-Sun Sep 17 2017 14:35:12 GMT+0200 (CEST)';
// process.env.MODEL = '../../nn-models/leaky-relu-0.01-128|256-Sun Sep 17 2017 14:54:34 GMT+0200 (CEST)';
// process.env.MODEL = '../../nn-models/0.01-448|224|1-2017.09.17_20.20.26';
// process.env.MODEL = '../../nn-models/0.01-448|224|1-2017.09.18_00.07.11';

if (!process.env.RECORD) {
    console.log('no recording file given.');
    process.exit();
}

const recording = require(process.env.RECORD);

function work(channels) {
    const session = getSessionFromRecording(recording, channels);

    const { training, test } = splitSessionIntoTrainingAndTest(session, 0.5);

    const net = train(training, channels, process.env.MODEL);

    classify(net, test);

    console.log('done');
}

work(channels);

// const channelCombinations = _.times(30, (n) => {
//     const ch = _.sampleSize(channels, 8);
//     console.log(ch);

//     work(ch);
// });
