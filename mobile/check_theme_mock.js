const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === 'react-native' || id === 'react-native-svg') {
    return {
      View: 'View',
      Text: 'Text',
      default: {},
      StyleSheet: { create: x => x },
      Platform: { OS: 'ios' },
    };
  }
  return originalRequire.apply(this, arguments);
};

try {
  const nav = require('@react-navigation/native');
  console.log("ThemeProvider:", nav.ThemeProvider);
  console.log("DarkTheme:", nav.DarkTheme);
  console.log("DefaultTheme:", nav.DefaultTheme);
  console.log("NavigationContainer:", nav.NavigationContainer);
} catch (e) {
  console.error(e);
}
