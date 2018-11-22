<template>
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
            <el-button :disabled="isMining" type="primary" @click="submitForm('transactionForm')">Send</el-button>
            <el-button @click="resetForm('transactionForm')">Reset</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import Transaction from "../models/Transaction";

    export default {
        name: "node",
        props: {
            chain: {
                type: Object,
                required: true
            },
            wallet: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                isMining: false,
                transactionForm: {
                    from: "",
                    to: "",
                    amount: 0
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
        methods: {
            submitForm(formName) {
                this.isMining = true
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let transaction = new Transaction(
                            JSON.parse(JSON.stringify(this.transactionForm))
                        );
                        transaction.sign(this.wallet).then(() => {
                                this.chain.mineAndAddBlock([transaction]).then(() => {
                                    this.isMining = false
                                })
                        }).catch (error => {
                            this.isMining = false
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
        }
    }
</script>

<style>

</style>
