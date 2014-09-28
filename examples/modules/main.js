var myModule = require('./my-module');
myModule();
try {
console.log(myModuleLocalVar);
} catch (e) {
	//NOP
}
console.log(myModuleGlobalVar);
console.dir(global.myModuleGlobalVar);
