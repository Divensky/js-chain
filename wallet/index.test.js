const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
    let wallet, tp, bc;

    beforeEach(() => {
        wallet = new Wallet;
        tp = new TransactionPool;
        bc = new Blockchain;
    });

    describe('creating a transaction', () => {
       let transaction, sendAmount, recipient;

       beforeEach(() => {
        sendAmount = 100;
        recipient = 'random addr';
        transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
       });

       describe('doing the same trx', () => {
        beforeEach(() => {
            wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        it('doubles the `sendAmount` subtracted from the wallet balance', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - sendAmount * 2);
        });

        it('clones the `sendAmount` output for the recipient', () => {
            expect(transaction.outputs.filter(output => output.address === recipient)
            .map(output => output.amount))
            .toEqual([sendAmount, sendAmount]);
        });
       });


    });

    describe('calculating a balance', () => {
        let addBalance, repeatAdd, senderWallet;

        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            for (let i=0; i<repeatAdd; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
              
            bc.addBlock(tp.transactions);
        });
      
        it('calculates the balance for blockchain trx matching the recipient', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });

        it('calculates the balance for blockchain trx matching the sender', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });

        describe('and the recipient conducts a trx', () => {
            let subtractBalance, recipientBalance;

            beforeEach(() => {
                tp.clear;
                subtractBalance = 60;
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
                bc.addBlock(tp.transactions);
            });

            describe('and the sender sends another trx to the recipient', () => {
                beforeEach(() => {
                    tp.clear();
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });

                it('calculates the recipient balance only since most recent trx', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });

        });
        

    });

});