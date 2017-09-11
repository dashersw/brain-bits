# brain bits

This project implements a P300 online spelling mechanism for Emotiv headsets. It's completely written in Node.js, and the GUI is based on Electron and Vue.

![recording](https://user-images.githubusercontent.com/698308/30238993-e321ff48-9552-11e7-811e-cdd3f6487c8c.gif)

## Installation

Clone the source code:

    git clone git@github.com:dashersw/brain-bits.git

### External dependencies

This project depends on external libraries like `hidapi` and `mcrypt` for USB communication.
If you have both hidapi and mcrypt, you can skip this step.

Install external dependencies:

    brew install hidapi
    brew install mcrypt

### Project dependencies

Change to the directory:

    cd brain-bits

Install submodules:

    git submodule update --init --recursive

Finally:

    npm install

## Starting the app

Run `npm start` to start the application.

## Starting a training session

The keyboard shortcut `cmd + s` will start a pre-defined training session with the word `HELLO`.

## Controls

You can reveal the control panel with the keyboard shortcut `cmd + o`. The control panel lets you choose whether you want to run a training session or a live session, and specify the training message. You can also start / stop a session.
