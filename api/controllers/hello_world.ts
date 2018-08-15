'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
const util = require('util');
module.exports = {
  hello: hello
};

function hello(req, res) {
    let name = req.swagger.params.name.value || 'stranger';
    let hello = util.format('Hello, %s!', name);
    res.json(hello);
}