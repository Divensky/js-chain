const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
  let bc;
  let bc2;

  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();    
  });

  it('Blockchain starts with  Genesis block', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block', () => {
    const data = 'test added block';
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });

 
  it('if isValidChain all fine', () => {
    bc2.addBlock('test chain validation');
    
    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it('if incorrect Genesis block', () => {
    bc2.chain[0].data = 'Bad data';

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('if incorrect hash', () => {
    bc2.addBlock('Zoo');
    bc2.chain[bc2.chain.length-1].hash = 'Bad data';

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  })
  
  it('if incorrect data', () => {
    bc2.addBlock('Koo');
    bc2.chain[bc2.chain.length-1].data = 'Not Koo';

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  })

  it('replaces the chain with a valid chain', () => {
    bc2.addBlock('replaces the chain with a valid chain');
    bc.replaceChain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });

  it('does not replace the chain with <= length', () => {
    bc.addBlock('does not replace the shorter chain test');
    bc.replaceChain(bc2.chain);

    expect(bc.chain).not.toEqual(bc2.chain);
  });

});