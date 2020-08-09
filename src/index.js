const ffi = require("ffi-napi");
const ArrayType = require('ref-array-napi');

const getDLLPath = require('./services/registry');

const CharArray = ArrayType('char');
const FloatArray = ArrayType('float');
//const LongArray = ArrayType('long');



let vb;

function getBuffer(string) {
    const buffer = Buffer.alloc(string.length + 1);
    buffer.write(string);
    return buffer;
}

module.exports = {
    async init() {
        vb = ffi.Library(await getDLLPath(), {
            'VBVMR_Login': ['long', []],
            'VBVMR_Logout': ['long', []],
            'VBVMR_GetParameterFloat': ['long', [CharArray, FloatArray]],
            'VBVMR_SetParameterFloat': ['long', [CharArray, 'float']],
        });
        this.isInitialised = true;
    },
    login() {
        if (!this.isInitialised) {
            throw Error('You need to call and await the init function before calling other functions.');
        }
        if (this.isConnected) {
            return;
        }
        if (vb.VBVMR_Login() < 0) {
            throw Error('VoiceMeeter login failed.');
        }
        this.isConnected = true;
    },
    logout() {
        if (!this.isConnected) {
            throw Error('Can\'t logout. Already disconnected.');
        }
        const status = vb.VBVMR_Logout();
        if (status != 0) {
            throw Error('Logout error code: ' + status);
        }
    }
}