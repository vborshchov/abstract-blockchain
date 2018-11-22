<template>
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
                <template v-if="scope.row.transactions">
                    <el-popover trigger="click" placement="top" @show="handlePopoverShow(scope.row.transactions[0].from, scope.$index)">
                        <p>Wallet balance: {{ walletBalance }}</p>
                        <div slot="reference" class="name-wrapper address from">
                            {{ scope.row.transactions[0].from }}
                        </div>
                    </el-popover>
                </template>
                <template v-else>
                    <div slot="reference" class="name-wrapper address from">
                        ---
                    </div>
                </template>
            </template>
        </el-table-column>
        <el-table-column
            label="To">
            <template slot-scope="scope">
                <template v-if="scope.row.transactions">
                    <el-popover trigger="click" placement="top" @show="handlePopoverShow(scope.row.transactions[0].to, scope.$index)">
                        <p>Wallet balance: {{ walletBalance }}</p>
                        <div slot="reference" class="name-wrapper address from">
                            {{ scope.row.transactions[0].to }}
                        </div>
                    </el-popover>
                </template>
                <template v-else>
                    <div slot="reference" class="name-wrapper address from">
                        ---
                    </div>
                </template>
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
</template>

<script>
    export default {
        name: 'chain-table',
        props: {
            chain: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                walletBalance: 0,
            }
        },
        methods: {
            handlePopoverShow(address, index) {
                this.walletBalance = this.chain.getAddressBalance(address, index)
            },
        }
    }
</script>

<style>

</style>
