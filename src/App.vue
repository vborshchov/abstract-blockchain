<template>
    <el-container id="app">
        <el-header height="unset">
            <h2>Your Wallet:</h2>
            <el-input
                :value="myWalletPublicKey"
                ref="myWallet"
                @focus="selectText">
            </el-input>
        </el-header>
        <el-main>
            <p v-for="(wallet, index) in wallets" :key="index" class="wallet">
                Wallet : {{wallet.getPublic('hex')}}
            </p>
            <p class="difficulty">Difficulty: {{chain.difficulty}}</p>
            <client-node
                :wallet="myWallet"
                :chain="chain"
                @mine="onMine">
            </client-node>
            <chain-table :chain="chain"></chain-table>
        </el-main>
    </el-container>
</template>

<script>
import Chain from "./models/Chain";
import EC from "elliptic/lib/elliptic/ec";
import Node from './components/Node';
import ChainTable from './components/ChainTable';

const ec = new EC("secp256k1");

export default {
    name: "app",
    data() {
        return {
            myWallet: {},
            wallets: [],
            chain: new Chain(),
        }
    },
    components: {
        "client-node": Node,
        ChainTable
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
        selectText() {
            this.$refs.myWallet.select();
        },
        onMine() {

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

    .el-container {
        width: 80%;
        margin: 0 auto;
    }

    .el-header {
        background-color: #E9EEF3;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
    }

    .difficulty {
        text-align: right;
    }

    .name-wrapper {
        width: 100%;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .address {
        cursor: pointer;
    }

    .wallet {
        word-break: break-all;
    }
</style>
