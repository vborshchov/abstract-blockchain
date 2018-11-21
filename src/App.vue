<template>
  <div id="app">
        <h2>Your Wallet:</h2>
        <el-input
            :value="myWalletPublicKey"
            ref="myWallet"
            @focus="selectText">
        </el-input>
        <p v-for="(wallet, index) in wallets" :key="index">
            Wallet : {{wallet.getPublic('hex')}}
        </p>
    <p class="difficulty">Difficulty: {{chain.difficulty}}</p>
    <el-form
            label-position="right"
            :rules="rules"
            ref="transactionForm"
            label-width="200px"
            :model="transactionForm"
            class="form-inline">
        <el-form-item label="From address" prop="from">
            <el-input v-model="transactionForm.from" placeholder="from walet address"></el-input>
        </el-form-item>
        <el-form-item label="To address" prop="to">
            <el-input v-model="transactionForm.to" placeholder="to walet address"></el-input>
        </el-form-item>
        <el-form-item label="Amount" prop="amount">
            <el-input-number
                v-model="transactionForm.amount"
                :min="0"
                :step="0.1">
            </el-input-number>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('transactionForm')">Send</el-button>
            <el-button @click="resetForm('transactionForm')">Reset</el-button>
        </el-form-item>
    </el-form>
    <el-table
            :data="chain.blocks"
            :default-sort = "{prop: 'date', order: 'descending'}"
            style="width: 100%">
        <el-table-column
            sortable
            label="Date">
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                    {{ new Date(scope.row.timestamp).toGMTString() }}
                </div>
            </template>
        </el-table-column>
        <el-table-column
            label="From">
            <template slot-scope="scope">
                <el-popover trigger="click" placement="top">
                    <p>Transactions: {{ scope.row.transactions }}</p>
                    <p>Previous hash: {{scope.row.previousHash}}</p>
                    <p>Hash: {{scope.row.hash}}</p>
                    <div slot="reference" class="name-wrapper">
                        {{ scope.row.transactions ? scope.row.transactions[0].from : '---' }}
                    </div>
                </el-popover>
            </template>
        </el-table-column>
        <el-table-column
            label="To">
            <template slot-scope="scope">
                <el-popover trigger="click" placement="top">
                    <p>Transactions: {{ scope.row.transactions }}</p>
                    <p>Previous hash: {{scope.row.previousHash}}</p>
                    <p>Hash: {{scope.row.hash}}</p>
                    <div slot="reference" class="name-wrapper">
                        {{ scope.row.transactions ? scope.row.transactions[0].to : '---' }}
                    </div>
                </el-popover>
            </template>
        </el-table-column>
        <el-table-column
            label="Amount">
            <template slot-scope="scope">
                <div slot="reference" class="name-wrapper">
                    {{ scope.row.transactions ? scope.row.transactions[0].amount : '---' }}
                </div>
            </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Chain from "./models/Chain";
import Transaction from "./models/Transaction";
import EC from "elliptic/lib/elliptic/ec";

const ec = new EC("secp256k1");

export default {
    name: "app",
    data() {
        return {
            transactionForm: {
                from: "",
                to: "",
                amount: 0
            },
            myWallet: {},
            wallets: [],
            chain: new Chain(),
            rules: {
                from: [
                    { required: true, message: "Please input From address", trigger: "blur" }
                ],
                to: [
                    { required: true, message: "Please input To address", trigger: "blur" }
                ],
                amount: [
                    { required: true, message: "Please input Amount", trigger: "change" }
                ]
            }
        };
    },
    computed: {
        myWalletPublicKey() {
            return this.myWallet.getPublic('hex')
        }
    },
    created() {
        this.myWallet = ec.genKeyPair()
        this.generateWallet();
        this.generateWallet();
    },
    methods: {
        generateWallet() {
            const keyPair = ec.genKeyPair()
            this.wallets.push(keyPair);
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let transaction = new Transaction(
                        JSON.parse(JSON.stringify(this.transactionForm))
                    );
                    transaction.sign(this.myWallet).then(() => {
                        this.chain.mineAndAddBlock([transaction]);
                    }).catch (error => {
                        this.$message.error(error)
                    });
                } else {
                    console.log("error submit!!"); // eslint-disable-line no-console
                    return false;
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        selectText() {
            this.$refs.myWallet.select();
        }
    }
};
</script>

<style>
    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }

    .difficulty {
        text-align: right;
    }
</style>
