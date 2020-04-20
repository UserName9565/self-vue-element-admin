<!--  -->
<template>
  <div>
    <el-card class="mb20">
      <el-form :inline="true" size="small" label-width="130px" @submit.native.prevent @keyup.enter.native="doSearch(1)">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="form.userName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核状态">
              <el-select v-model="form.authStatus" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证号">
              <el-input v-model="form.idNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司">
              <el-input v-model="form.entName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="注册开始时间">
              <el-date-picker
                v-model="form.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册结束时间">
              <el-date-picker
                v-model="form.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8" class="btn-box ">
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="doSearch()">查询</el-button>
              <el-button type="primary" @click="doNew()">新增方案</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-table
        :data="agTable"
        :header-cell-style="{background:'#fff',color:'#5f95b7'}"
        border
        stripe
        size="small"
        style="width: 100%"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column align="center" prop="userName" label="用户名称" />
        <el-table-column align="center" prop="phone" width="130" label="手机号" />
        <el-table-column align="center" prop="idNumber" width="150" label="授权人身份证" />
        <!-- <el-table-column align="center" prop="userPhone" label="身份类型" /> -->
        <el-table-column align="left" width="150" prop="userIdTypeName" label="身份类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.userType==1||scope.row.userType==3" type="success">签字人</el-tag>
            <el-tag v-if="scope.row.userType==2||scope.row.userType==3">签章人</el-tag>

          </template>
        </el-table-column>
        <el-table-column align="center" width="150" prop="entName" label="关联企业" />
        <el-table-column align="center" width="150" :formatter="agUtil.YYMM" prop="regTime" label="注册时间" />
        <el-table-column align="center" prop="statusStr" label="认证资料" />
        <el-table-column align="center" prop="userIdTypeName" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.authStatus==1">待审核</el-tag>
            <el-tag v-if="scope.row.authStatus==2" type="success">已审核</el-tag>
            <el-tag v-if="scope.row.authStatus==3" type="danger">已驳回</el-tag>

          </template>
        </el-table-column>
        <el-table-column align="center" width="170" prop="authTime" :formatter="agUtil.YYMM" label="审核时间" />
        <el-table-column align="center" prop="authRemark" :width="imfo.userDefault1=='PORTAL20190000100'?'150px':'300px'" label="审批详情">
          <template slot-scope="scope">
            <el-button
              v-if="imfo.userDefault1=='PORTAL20190000100'"
              type="primary"
              size="mini"
              @click="doAuditDe(scope.row)"
            >
              审批详情
            </el-button>
            <span v-else> {{ scope.row.authRemark }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="180px" prop="departName" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="(imfo.userDefault1=='PORTAL20190000100'&&(scope.row.authStatus==1&&scope.row.authStatusOwn==1)||(imfo.userDefault1!='PORTAL20190000100'&&scope.row.authStatus==1))"
              type="primary"
              size="mini"
              @click="doEdit(scope.row,3)"
            >
              审核
            </el-button>
            <el-button
              v-else
              type="success"
              size="mini"
              @click="doEdit(scope.row,1)"
            >
              查看
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page.sync="form.pageNum"
          background
          layout="total,prev, pager, next,jumper"
          :total="pageTotal"
          :page-size="form.pageSize"
          @current-change="doSearch"
        />
      </div>
    </el-card>
    <view-win v-if="visible" ref="viewwin" @change="doSearch" />
    <el-dialog v-el-drag-dialog :visible.sync="visible2" title="审批详情">
      <el-table :data="pvData" border fit highlight-current-row :header-cell-style="{background:'#fff',color:'#5f95b7'}">
        <el-table-column prop="approvalUserId" label="审核人" />
        <el-table-column prop="authRemark" label="审核理由" />
        <el-table-column align="center" prop="userIdTypeName" label="审核状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.authStatus==1">待审核</el-tag>
            <el-tag v-if="scope.row.authStatus==2" type="success">已审核</el-tag>
            <el-tag v-if="scope.row.authStatus==3" type="danger">已驳回</el-tag>

          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible2 = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchFile, getAPPDetaile } from '@/api/authorizerAudit'
import { mapGetters } from 'vuex'
import ViewWin from './authorizerAuditWin/viewWin'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  components: { ViewWin },
  directives: { elDragDialog },
  data() {
    return {
      visible: false,
      visible2: false,
      options: [
        { key: '', value: '请选择...' },

        { key: '1', value: '待审核' },
        { key: '2', value: '审核通过' },
        { key: '3', value: '审核驳回' }
      ],
      pageTotal: 0,
      form: {
        pageNo: 1,
        pageSize: 10,
        endTime: '',
        phone: '',
        userName: '',
        authStatus: '',
        entName: '',
        idNumber: '',
        startTime: ''
      },
      agTable: [],
      pvData: []
    }
  },
  created() {
    this.doSearch()
  },
  computed: {
    ...mapGetters([
      'imfo'
    ])

  },
  methods: {
    doSearch(value) {
      value ? this.pageNo = value : value = this.pageNo
      fetchList(this.form).then(response => {
        const { data } = response
        this.agTable = data.rows
        this.pageTotal = data.total
      })
    },
    doAuditDe(data) {
      this.visible2 = true
      this.$nextTick(() => {
        getAPPDetaile(data.processinsId).then(response => {
          const { data } = response
          this.pvData = data.rows
        })
      })
    },
    doEdit(row, type) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.viewwin.init(
          row,
          type
        )
      })
    }
  }
}
</script>
 <style  scoped>
</style>
