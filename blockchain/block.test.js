const Block = require('./block');


describe('Block', () => {
    let data, last, block;

    beforeEach(() => {
        data = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data);
    });

    it('sets the `data` to match the input', () => {
        expect(block.data).toEqual(data);
    });
    
    it('sets the `lastHash` to match the hash of the last block', () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });

    it('Generates a Hash matching the Difficulty', () => {
        expect(block.hash.substring(0, block.difficulty))
        .toEqual('0'.repeat(block.difficulty));
        //console.log(Date.now(), block.toString());
    });
      
    it('Lowers the Difficulty in slowly mined block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp+600000))
        .toEqual(block.difficulty > 1 ? block.difficulty - 1 : 1);
        console.log(`difficulty at low test: ${block.difficulty}`);
    });
  
    it('Raises the Difficulty in rapidly mined block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp-600000))
        .toEqual(block.difficulty+1);
        console.log(`difficulty at rapid test: ${block.difficulty}`);
    });
  

});

