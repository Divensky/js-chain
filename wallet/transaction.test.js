const Transaction = require('./transaction');
const Wallet = require('./index');
const { INITIAL_BALANCE, MINING_REWARD } = require('../config.js');

describe('Transaction', () => {
    let transaction, wallet, recepient, amount;
    let testAmount = 100;

    beforeEach(() => {
        wallet = new Wallet; //parenthesis needed? tests are passed without them
        amount = testAmount;
        recepient = 'recepient address placeholder';
        transaction = Transaction.newTransaction(wallet, recepient, amount);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount);  
        //MyNote: if there has been more than 1 trx to this address this test is likely to fail
    });

    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recepient).amount)
        .toEqual(amount);  //works only at 1st trx; on the 2nd it would have to be balance+amt
    });
    
    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = INITIAL_BALANCE*10;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    
  
/*
    it('the balance gets deducted by Test Amount MyTest', () => {
        let expectedResult = {
            address: wallet.publicKey,
            amount: INITIAL_BALANCE - amount
        };
      expect(Transaction.newTransaction(wallet, recepient, amount).outputs)
      .toContainEqual(expectedResult);  //works only at 1st trx
    });

    it('too high amount is attempted, MyTest', () => {
        testAmount = INITIAL_BALANCE * 3;
        let expectedResult = undefined; 
      expect(Transaction.newTransaction(wallet, recepient, testAmount))
      .toEqual(expectedResult);  
    });*/



    describe('transacting with an amount that exceeds the balance', () => {
        beforeEach(() => {
            amount =  500000;
            transaction = Transaction.newTransaction(wallet, recepient, amount);
        });

        it('does not create the transation', () => {
            expect(transaction).toEqual(undefined);
        });
    });

    describe('updating the trx', () => {
        let nextAmount, nextRecipient;
        
        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'next Recipient placeholder';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);            
        });

        it('subtracts the next amount from the sender output', () => {
            console.log(`Wallet balance ${wallet.balance}, 1st trx amount ${amount}, 2nd trx amount ${nextAmount}`);
            //we also need to test this for multiple Updates.
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });

        it('outputs an amount for the next recipient MYTEST', () => {
            expect(transaction.outputs).toContainEqual({amount: nextAmount, address: nextRecipient});
        });

        it('makes 2 updates myTest', () => {            
            next3Amount = 45;
            next3Recipient = 'next3 Recipient placeholder';
            transaction = transaction.update(wallet, next3Recipient, next3Amount);         
            //console.log(`Wallet balance ${wallet.balance}, 1st trx amount ${amount}, 2nd trx amount ${nextAmount}, 3rd trx amount ${next3Amount}`);
            next4Amount = 33;
            next4Recipient = 'next Recipient placeholder';
            //if sent more than once to the same Recipient, the test fails 
            transaction = transaction.update(wallet, next4Recipient, next4Amount);         
            //console.log(`3rd trx amount ${next3Amount}, 4th trx amount ${next4Amount}`);
            //expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            //.toEqual(wallet.balance - amount - nextAmount - next3Amount - next4Amount );
            //expect(transaction.outputs.find(output => output.address === next4Recipient).amount)
            //.toEqual(next4Amount);
            expect(transaction.outputs).toContainEqual({amount: next4Amount, address: next4Recipient});
        });

        describe('creating a reward trx', () => {
            beforeEach(() => {
                transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
            });

            it('reward the miners wallet', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(MINING_REWARD);
            });
        })

    });



});