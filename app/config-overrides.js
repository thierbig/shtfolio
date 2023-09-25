const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
  // ...other webpack configurations
  plugins: [
    new JavaScriptObfuscator({
      rotateStringArray: true
    }, [])
  ]
};
