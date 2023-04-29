const TransactionsPool = require('./transaction-pool');
const Transaction = require ('./transaction');
const Wallet = require ('./index');
const Blockchain = require('../blockchain');

describe ('TransactionsPool', () => {
    let tp, wallet, transaction, bc;

    beforeEach(() => {
        tp = new TransactionsPool();
        wallet = new Wallet();
        bc = new Blockchain();
        transaction = wallet.createTransaction('random addr', 30, bc, tp);
    });

    it('adds a trx to the pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });
    
    it('adds a trx to the pool MyTest', () => {
        expect(JSON.stringify(tp)).toContain(JSON.stringify(transaction));
    });

    it('updates a trx in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, '2nd addr', 40);
        tp.updateOrAddTrx(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
        .not.toEqual(oldTransaction);
    });

    it('clears trxs', () => {
        tp.clear();
        expect(tp.transactions).toEqual([]);
    });

    describe('mixing valid and corrupt trxs', () => {
        let validTransactions;

        beforeEach(() => {
            validTransactions = [...tp.transactions];
            for (let i=0; i<3; i++) {
                wallet = new Wallet;
                transaction = wallet.createTransaction('rand1', 30, bc, tp);
                if (i%2==0) {
                    transaction.input.amount = 99999;
                } else {
                    validTransactions.push(transaction);
                }
            };
        });

        it('shows a difference between valid and corrupt trxs', () => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
        });

        it('grabs valid trx', () => {
            expect(tp.validTransaction()).toEqual(validTransactions);
        })
    });

});