exports.toggleSilent = () => ({ type: 'TOGGLE_SILENT' });

exports.toggleEnabled = () => ({ type: 'TOGGLE_ENABLED' });

exports.toggleOpenAtLogin = () => ({ type: 'TOGGLE_OPEN_AT_LOGIN' });

exports.updateInterval = interval => ({ type: 'UPDATE_INTERVAL', interval });

exports.updateCategory = category => ({ type: 'UPDATE_CATEGORY', category });