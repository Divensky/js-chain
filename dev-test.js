const Wallet = require('./wallet');
const wallet = new Wallet;
console.log(wallet.toString());


/* test version 2
const Blockchain = require('./blockchain');

const bc = new Blockchain();
let myBlock;

for (let i=0; i<10; i++) {
    myBlock = bc.addBlock(`dev-test block ${i}`);
    console.log(myBlock.toString());
}
*/


//test version 1
//const Block = require('./block');

//const block = new Block('foo', 'bar', 'zoo', 'baz');
//console.log(block.toString());
//console.log(Block.genesis().toString());

/*const fooBlock = Block.mineBlock(Block.genesis(), 'foo');
console.log(fooBlock.toString());
*/