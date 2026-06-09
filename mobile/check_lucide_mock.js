// Mock react-native before requiring lucide-react-native
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === 'react-native' || id === 'react-native-svg') {
    return {
      // Mock any SVG elements or standard React Native exports if needed
      View: 'View',
      Text: 'Text',
      default: {},
      Svg: 'Svg',
      Path: 'Path',
    };
  }
  return originalRequire.apply(this, arguments);
};

try {
  const lucide = require('lucide-react-native');
  const iconsToCheck = [
    'Search', 'MapPin', 'Plus', 'Calculator', 'Star', 'AlertTriangle', 
    'ShoppingCart', 'User', 'Building2', 'Trash2', 'Minus', 'ArrowRight', 
    'ShieldCheck', 'ClipboardList', 'LogOut', 'CheckCircle', 'Clock'
  ];

  console.log("Checking Lucide Icons at Runtime:");
  iconsToCheck.forEach(icon => {
    console.log(`${icon}: ${lucide[icon] ? 'OK' : 'UNDEFINED'}`);
  });
} catch (e) {
  console.error(e);
}
