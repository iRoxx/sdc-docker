/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var sprintf = require('sprintf').sprintf;


/**
 * Given a duration in seconds, return a human-friendly string.
 */

function humanDuration(seconds) {
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var weeks = days / 7;
    var months = days / 30;
    var years = days / 365;

    if (seconds < 1) {
        return 'Less than a second';
    } else if (seconds < 60) {
        return sprintf('%d seconds', seconds);
    } else if (Math.floor(minutes) === 1) {
        return 'About a minute';
    } else if (minutes < 60) {
        return sprintf('%d minutes', minutes);
    } else if (Math.floor(hours) === 1) {
        return 'About an hour';
    } else if (hours < 48) {
        return sprintf('%d hours', hours);
    } else if (weeks < 2) {
        return sprintf('%d days', days);
    } else if (months < 3) {
        return sprintf('%d weeks', weeks);
    } else if (years < 2) {
        return sprintf('%d months', months);
    }

    return sprintf('%0.6f years', years);
}

var STREAM_TYPES = {
    stdin: 0,
    stdout: 1,
    stderr: 2
};

/**
 * Write to docker-raw compatible streams
 */
function writeToDockerRawStream(type, stream, data) {
    var streamType = STREAM_TYPES[type];
    var messageSize = data.length;
    var message = new Buffer(8 + messageSize);

    message.writeUInt8(streamType, 0);
    message[1] = 0;
    message[2] = 0;
    message[3] = 0;
    message.writeUInt32BE(messageSize, 4);
    message.write(data.toString(), 8);
    stream.write(message);
}


module.exports = {
    humanDuration: humanDuration,
    writeToDockerRawStream: writeToDockerRawStream
};
