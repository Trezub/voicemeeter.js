const Registry = require('winreg');
module.exports = async function getDLLPath() {
    const regKey = new Registry({
        hive: Registry.HKLM,
        key: '\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VB:Voicemeeter {17359A74-1236-5467}'
    });
    return new Promise(resolve => {
        regKey.values((err, items) => {
        const unistallerPath = items.find(i => i.name === 'UninstallString').value;
        const fileNameIndex = unistallerPath.lastIndexOf('\\')
        resolve(unistallerPath.slice(0, fileNameIndex) + '\\VoicemeeterRemote64.dll');
        });
    });
}