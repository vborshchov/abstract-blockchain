<template>
    <div>
        <h2>Your Wallet:</h2>
        <el-form
                label-position="right"
                :rules="rules"
                ref="transactionForm"
                label-width="200px"
                :model="transactionForm"
                class="form-inline">
            <el-form-item label="From address" prop="from">
                <el-input disabled v-model="transactionForm.from" placeholder="from walet address"></el-input>
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
                <el-button :disabled="isMining" type="primary" @click="submitForm('transactionForm')">Send</el-button>
                <el-button @click="resetForm('transactionForm')">Reset</el-button>
            </el-form-item>
        </el-form>
        <el-form
                label-position="right"
                ref="connectForm"
                label-width="200px"
                :model="connectForm"
                class="form-inline">
            <el-form-item label="From address" prop="from">
                <el-input
                    type="textarea"
                    :rows="2" v-model="connectForm.incoming">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitConnectForm('connectForm')">Connect</el-button>
                <el-button @click="resetForm('connectForm')">Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import Transaction from "../models/Transaction";
    import Node from '../models/Node'
    import Peer from 'simple-peer'

    export default {
        name: "node",
        props: {
            chain: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                peer: {},
                node: {},
                isMining: false,
                transactionForm: {
                    from: "",
                    to: "",
                    amount: 0
                },
                connectForm: {
                    incoming: "",
                },
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
            }
        },
        created() {
            this.node = new Node(this.chain)
            this.transactionForm.from = this.node.publicKey()
            this.initPeer()
        },
        methods: {
            initPeer() {
                this.peer = new Peer({ initiator: location.hash === '#1', trickle: false })

                this.peer.on('error', this.onPeerError)
                this.peer.on('signal', this.onPeerSignal)
                // this.peer.signal('hey!')
                this.peer.on('connect', this.onPeerConnect)
                this.peer.on('data', this.onPeerData)
            },
            onPeerError(err) {
                console.log('peer error', err)  // eslint-disable-line no-console
            },
            onPeerSignal(data) {
                console.log('SIGNAL', JSON.stringify(data))  // eslint-disable-line no-console
            },
            onPeerConnect() {
                console.log('CONNECT')  // eslint-disable-line no-console
            },
            onPeerData(data) {
                console.log('data: ' + data)  // eslint-disable-line no-console
                let transaction = new Transaction(
                    JSON.parse(data)
                );
                this.isMining = true
                this.node.chain.mineAndAddBlock([transaction]).then(blocks => {
                    console.log('blocks', blocks) // eslint-disable-line no-console
                    this.isMining = false
                })
            },
            submitForm(formName) {
                this.isMining = true
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let transaction = new Transaction(
                            JSON.parse(JSON.stringify(this.transactionForm))
                        );
                        transaction.sign(this.node.wallet()).then(() => {
                            this.peer.send(JSON.stringify(transaction))
                            this.node.chain.mineAndAddBlock([transaction]).then(blocks => {
                                console.log('blocks', blocks) // eslint-disable-line no-console
                                this.isMining = false
                            })
                        }).catch (error => {
                            console.log('submit', error) // eslint-disable-line no-console
                            this.isMining = false
                            this.$message.error(error)
                        });
                    } else {
                        console.log("error submit!!"); // eslint-disable-line no-console
                        return false;
                    }
                })
            },
            submitConnectForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.peer.signal(JSON.parse(this.connectForm.incoming))
                    } else {
                        console.log("error submit!!"); // eslint-disable-line no-console
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>

<style>

</style>
