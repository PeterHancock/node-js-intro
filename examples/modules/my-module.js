console.log('my-module load time');
module.exports = function() {
	console.log('my-module function called');
};

var myModuleLocalVar = 1;

myModuleGlobalVar = 2;