<!--  -->
<template>
  <div>
    <el-card class="mb20">
      <el-form :inline="true" @submit.native.prevent @keyup.enter.native="doSearch(1)">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input v-model="form.workName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="form.userState" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
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
      <el-table
        :data="agTable"
        :header-cell-style="{background:'#e0f3ff',color:'#5f95b7'}"
        border
        stripe
        size="small"
        style="width: 100%"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column align="center" prop="userName" label="用户名称" />
        <el-table-column align="center" prop="departName" label="用户所属机构" />
        <el-table-column align="center" prop="userEmail" label="用户EMAIL" />
        <el-table-column align="center" prop="userPhone" label="用户手机号码" />
        <el-table-column align="center" prop="userIdTypeName" label="用户证件类型" />
        <el-table-column align="center" prop="createDate" label="创建用户时间" />
        <el-table-column align="center" prop="userStateName" label="用户状态" />
        <el-table-column align="center" prop="departName" label="操作">
          <template slot-scope="scope">
            <!-- v-if="scope.row.userState==0" -->
            <el-button
              :type="scope.row.userState==0?'danger':'primary'"
              :disabled="scope.row.account=='admin'"
              size="mini"
              @click="(scope.row.userState==0)?doStart(scope.row,1):doStart(scope.row,0)"
            >
              {{ (scope.row.userState==0)?"禁用":'启用' }}
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="(scope.row.account=='admin')?doEdit(scope.row,1):doEdit(scope.row,2)"
            >
              {{ (scope.row.account=='admin')?"查看":'编辑' }}
            </el-button>
            <!-- <el-button
              v-else
              @click="doEdit(scope.row,-1)"
              type="primary"
              size="mini"
            >查看</el-button> -->
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
  </div>
</template>

<script>
import { fetchList, fetchSelect, updateState } from '@/api/userManage'
import ViewWin from './userManagWin/viewWin'
export default {
  components: { ViewWin },
  data() {
    return {
      visible: false,
      options: [],
      pageTotal: 0,
      form: {
        pageNo: 1,
        pageSize: 10,
        workName: '',
        userState: 0
      },
      agTable: []
    }
  },
  created() {
    // this.doSearch()
    this.selecte()
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
    selecte() {
      fetchSelect({}).then(response => {
        this.options = response.data
        this.doSearch()
      })
    },
    doStart(data, status) {
      let obj = {}
      obj = {
        userId: data.userId,
        state: status
      }
      let msg = ''
      if (status == 0) {
        msg = '确认要启用选中的数据吗？'
      } else {
        msg = '确认要停用选中的数据吗？'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateState(obj).then(response => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.doSearch()
        })
      }).catch(() => {

      })
    },
    doEdit(row, type) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.viewwin.init(
          row.userId,
          type
        )
        // this.$refs.addList.yTitle(row.approvalcode);
      })
    }
  }
}
</script>
 <style  scoped>
</style>
