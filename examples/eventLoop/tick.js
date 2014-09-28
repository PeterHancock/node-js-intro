function main() {
    process.stdout.write('enter main\n');
    process.nextTick(function(){
        process.stdout.write('done something...\n');
    })
    console.log('return from main');
}

main();
