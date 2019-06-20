const rollup = require('rollup');
const config = require('./config');

const {
    input,
    plugins,
    output
} = config;

const inputOptions = {
    input,
    plugins
};

output.forEach(eachOutputOptions=>{
    eachOutputOptions.file = eachOutputOptions.file.replace('.js', '.min.js');
    build(eachOutputOptions);
});


async function build(outputOptions) {
    const bundle = await rollup.rollup(inputOptions);

    // console.log(bundle.imports); // an array of external dependencies
    // console.log(bundle.exports); // an array of names exported by the entry point
    // console.log(bundle.modules); // an array of module objects
    const {
        code,
        map
    } = await bundle.generate(outputOptions);

    await bundle.write(outputOptions);
}