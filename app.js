#! /usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
class BankAccount {
    accountNumber;
    owner;
    balance;
    constructor(accountNumber, owner, balance = 0) {
        this.accountNumber = accountNumber;
        this.owner = owner;
        this.balance = balance;
    }
    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log(chalk.greenBright.bold(`💰 ${amount} deposited. New balance: ${this.balance}`));
        }
    }
    withdraw(amount) {
        if (amount > 0 && amount <= this.balance) {
            this.balance -= amount;
            console.log(chalk.greenBright.bold(`💸 ${amount} withdrawn. New balance: ${this.balance}`));
        }
        else {
            console.log(chalk.redBright.bold('❌ Withdrawal amount is invalid or exceeds balance.'));
        }
    }
    getBalance() {
        return this.balance;
    }
}
class SavingsAccount extends BankAccount {
    interestRate;
    constructor(accountNumber, owner, balance, interestRate) {
        super(accountNumber, owner, balance);
        this.interestRate = interestRate;
    }
    addInterest() {
        const interest = this.getBalance() * (this.interestRate / 100);
        this.deposit(interest);
        console.log(chalk.blueBright.italic(`📈 Interest added. New balance: ${this.getBalance()}`));
    }
}
async function main() {
    console.log(gradient.rainbow.multiline(figlet.textSync('Bank CLI', { horizontalLayout: 'full' })));
    const accounts = {};
    while (true) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: chalk.bgCyanBright.bold('🏦 What would you like to do?'),
            choices: [
                chalk.cyan('🆕 Create Account'),
                chalk.yellow('💰 Deposit'),
                chalk.magenta('💸 Withdraw'),
                chalk.blue('📈 Add Interest'),
                chalk.green('💼 Check Balance'),
                chalk.red('🚪 Exit')
            ]
        });
        console.log(chalk.cyanBright('\n=========================\n'));
        if (action === chalk.red('🚪 Exit')) {
            console.log(chalk.yellowBright.bold.underline('👋 Goodbye!'));
            break;
        }
        if (action === chalk.cyan('🆕 Create Account')) {
            const { type, accountNumber, owner, balance, interestRate } = await inquirer.prompt([
                { type: 'list', name: 'type', message: 'Account type:', choices: ['Bank Account', 'Savings Account'] },
                { type: 'input', name: 'accountNumber', message: 'Account number:' },
                { type: 'input', name: 'owner', message: 'Owner name:' },
                { type: 'number', name: 'balance', message: 'Initial balance:', default: 0 },
                { type: 'number', name: 'interestRate', message: 'Interest rate (for Savings Account):', when: (answers) => answers.type === 'Savings Account', default: 0 }
            ]);
            if (type === 'Bank Account') {
                accounts[accountNumber] = new BankAccount(accountNumber, owner, balance);
            }
            else {
                accounts[accountNumber] = new SavingsAccount(accountNumber, owner, balance, interestRate);
            }
            console.log(chalk.greenBright.bold('✅ Account created successfully.'));
        }
        if (action === chalk.yellow('💰 Deposit') || action === chalk.magenta('💸 Withdraw')) {
            const { accountNumber, amount } = await inquirer.prompt([
                { type: 'input', name: 'accountNumber', message: 'Account number:' },
                { type: 'number', name: 'amount', message: 'Amount:' }
            ]);
            const account = accounts[accountNumber];
            if (!account) {
                console.log(chalk.redBright.bold('❌ Account not found.'));
                continue;
            }
            if (action === chalk.yellow('💰 Deposit')) {
                account.deposit(amount);
            }
            else {
                account.withdraw(amount);
            }
        }
        if (action === chalk.blue('📈 Add Interest')) {
            const { accountNumber } = await inquirer.prompt([
                { type: 'input', name: 'accountNumber', message: 'Account number:' }
            ]);
            const account = accounts[accountNumber];
            if (!(account instanceof SavingsAccount)) {
                console.log(chalk.redBright.bold('❌ This is not a savings account.'));
                continue;
            }
            account.addInterest();
        }
        if (action === chalk.green('💼 Check Balance')) {
            const { accountNumber } = await inquirer.prompt([
                { type: 'input', name: 'accountNumber', message: 'Account number:' }
            ]);
            const account = accounts[accountNumber];
            if (!account) {
                console.log(chalk.redBright.bold('❌ Account not found.'));
                continue;
            }
            console.log(chalk.blueBright.underline(`💼 Balance: ${account.getBalance()}`));
        }
        console.log(chalk.cyanBright('\n=========================\n'));
    }
}
main();
