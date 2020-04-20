<!--  -->
<template>
  <div>
    <el-card class="mb20">
      <a id="download1" ref="download1" style="display:none" :href="downloadUrl">下载</a>
      <OBJECT id="AgObj1" ref="AgObj1" name="AgObj1" class="dpn" classid="clsid:238DB585-669E-4BE9-9B79-64643470A8BE" codebase="AgUsbKeyTool.ocx" style="HEIGHT: 0px;WIDTH:0px" />

      <el-form :inline="true" size="small" label-width="130px" @submit.native.prevent @keyup.enter.native="doSearch(1)">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="手机号">
              <el-input v-model="form.phone" />
            </el-form-item>
          </el-col>

          <!-- <el-col :span="8">
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
          </el-col> -->
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
        <!-- <el-table-column type="selection" width="40" /> -->
        <el-table-column align="center" width="180" prop="userName" label="订单信息">
          <template slot-scope="scope" template>
            <div>U.key第二代新型移动电子证书</div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="phone" width="130" label="手机号" /> -->
        <el-table-column align="center" :formatter="agUtil.YYMM" prop="updateTime" width="150" label="订单时间" />
        <!-- <el-table-column align="center" prop="userPhone" label="身份类型" /> -->
        <el-table-column align="center" width="150" prop="addressee" label="授权人信息" />
        <el-table-column align="center" width="150" prop="phone" label="手机号" />
        <el-table-column align="center" prop="授权范围" label="认证资料">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.orderType==1?'签字人':'盖章人' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="userIdTypeName" label=" 电子印章">
          <template slot-scope="scope">
            <img
              style="width: 30px; height: 30px;cursor:pointer"
              :src="'data:image/jpeg;base64,'+scope.row.sealInfo.image"
              fit="fit"
              @click="imgOk(scope.row)"
            >
            <!-- :preview-src-list='["data:image/jpeg;base64,"+scope.row.sealInfo.image]' -->
          </template>
        </el-table-column>

        <el-table-column align="center" prop="authRemark" width="150px" label="印章状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.sealInfo.status==5" type="success">已完成</el-tag>
            <el-tag v-if="scope.row.sealInfo.status==10" type="success">已激活</el-tag>
            <el-tag v-if="scope.row.sealInfo.status==1" type="success">可灌章</el-tag>
            <el-tag v-if="scope.row.sealInfo.status==3" type="danger">修改中</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="170" prop="" label=" 绑定Ukey序列号">
          <template slot-scope="scope">
            <div v-if="scope.row.ukeyInfo">{{ scope.row.ukeyInfo.keyId }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="" width="220px" label="寄送地址">
          <template slot-scope="scope">
            <div>{{ scope.row.province+ scope.row.city+scope.row.county+" "+scope.row.address }}</div>
          </template>
        </el-table-column>
        <el-table-column align="left" width="250px" prop="departName" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="downLoad(scope.row)">
              下载证书
            </el-button>
            <el-button type="text" size="mini" @click="doKey(scope.row)">
              灌章
            </el-button>
            <el-button type="text" size="mini" @click="bindUkey(scope.row)">
              绑定Ukey
            </el-button>
            <el-button v-if="scope.row.sealInfo.status&&scope.row.ukeyInfo" type="text" size="mini" @click="dofilished(scope.row)">
              完成
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
    <el-dialog v-el-drag-dialog :visible.sync="visible2" title="绑定Ukey">
      <el-form
        ref="agForm"
        :model="model2"
        label-position="left"
        label-width="130px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item label="ukeyId" prop="keyId" verify>
          <el-input v-model="model2.keyId" />
        </el-form-item>
        <el-form-item label="证书ID" prop="certId" verify>
          <el-input v-model="model2.certId" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible2 = false">取消</el-button>
        <el-button
          type="primary"
          @click="goIrrigate()"
        >确定</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog :visible.sync="visible3" title="" width="500px">
      <el-form
        ref="agForm3"
        :model="model3"
        label-position="left"
        label-width="80px"
      >
        <div class="tac">
          <img
            :src="nowSrc"
            fit="fit"
          >
        </div>
        <el-form-item label="修改意见" prop="remark" verify>
          <el-input v-model="model3.remark" type="textarea" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible3 = false">取消</el-button>
        <el-button
          type="danger"
          @click="doImgOk()"
        >驳回</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog :visible.sync="visible4" title="灌章" width="80%">

      <el-col :span="12">
        <div class="tac mr-10">用户印章信息</div>
        <el-form
          ref="agForm4"
          :model="model4"
          label-position="left"
          label-width="110px"
          :disabled="true"
          style=" margin-left:20px;"
        >

          <el-form-item label="用户Id" prop="uid">
            <el-input v-model="model4.uid" />
          </el-form-item>
          <el-form-item label="组织机构Id" prop="entId">
            <el-input v-model="model4.entId" />
          </el-form-item>
          <el-form-item label="keyId" prop="keyId">
            <el-input v-model="model4.keyId" />
          </el-form-item>
          <el-form-item label="印章Id" prop="sealId">
            <el-input v-model="model4.sealId" />
          </el-form-item>
        </el-form>
        <div class="tac">
          <img :src="ukeyImg1" alt="" style="min-height:110px;cursor:pointer">
        </div>
      </el-col>
      <el-col :span="12">
        <div class="tac mr-10">ukey印章信息</div>
        <el-form
          ref="agForm5"
          :model="model5"
          label-position="left"
          label-width="110px"
          style="margin-left:20px;"
        >

          <el-form-item label="用户Id" prop="userId" verify>
            <el-input v-model="model5.userId" />
          </el-form-item>
          <el-form-item label="组织机构Id" prop="orgId" verify>
            <el-input v-model="model5.orgId" />
          </el-form-item>
          <el-form-item label="keyId" prop="keyId" verify>
            <el-input v-model="model5.keyId" />
          </el-form-item>
          <el-form-item label="印章Id" prop="sealId" verify>
            <el-input v-model="model5.sealId" />
          </el-form-item>
        </el-form>
        <div class="tac">
          <img :src="ukeyImg2" alt="" style="min-height:110px;cursor:pointer">
        </div>
      </el-col>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visible4 = false">取消</el-button>
        <el-button
          type="primary"
          @click="goIrrigate()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, checkCertFile, getCertFile, fetchgetCert, fillFinish, fetchFill, backSeal, fetchById } from '@/api/irrigationUkey'
import { mapGetters } from 'vuex'
import ViewWin from './irrigationUkeyWin/viewWin'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  components: { ViewWin },
  directives: { elDragDialog },
  data() {
    return {
      visible: false,
      visible2: false,
      visible3: false,
      visible4: false,
      downloadUrl: null,
      ukeyImg1: '',
      ukeyImg2: '',
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
        phone: '',
        authStatus: ''

      },
      model2: {
        certId: '',
        keyId: ''
      },
      model3: {
        remark: ''
      },
      model4: {

      },
      model5: {

      },
      getModel: {
        type: '',
        orderId: ''
      },
      nowSrc: '',
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
    downLoad(row) { // 下载证书
      var obj = {
        uid: row.uid,
        type: row.orderType
      }
      checkCertFile(obj).then(response => {
        const data = response
        if (data.code == 200) {
          this.downloadUrl = getCertFile('?uid=' + row.uid + '&type=' + row.orderType)
          this.$nextTick(() => {
            this.$refs.download1.click()
          })
        }
      })
    },
    bindUkey(row) { // 展示绑定ukey
      this.visible2 = true
      var ret = this.$refs.AgObj1.AgGetUsbKeyInfoEx(3)

      this.$nextTick(() => {
        this.$refs.agForm.resetFields()
        this.model2 = {
          certId: row.orderId,
          keyId: ret,
          keyType: row.orderType
        }
      })
    },
    goBindUkey() { // 确定绑定ukey
      this.$refs['agForm'].validate(valid => {
        if (valid) {
          fetchFill(this.model2).then(response => {
            const { data } = response
            this.visible2 = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          })
        } else {
          return false
        }
      })
    },
    doAuditDe(data) { // 审核图章
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
    },
    dofilished(row) { // 最终完成
      this.$confirm('是否确定完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var obj = {
          sealId: row.sealInfo.sealId,
          keyId: row.ukeyInfo.keyId
        }
        fillFinish(obj).then(response => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.doSearch()
        })
      }).catch(() => {

      })
    },
    imgOk(row) { // 查看印章
      this.visible3 = true
      this.nowSrc = 'data:image/jpeg;base64,' + row.sealInfo.image
      this.model3.remark = row.sealInfo.remark

      this.$nextTick(() => {
        this.$refs.agForm3.resetFields()
        this.model3.status = 2
        this.model3.sealId = row.sealInfo.sealId
      })
    },
    doImgOk() { // 审核印章
      this.$refs['agForm3'].validate(valid => {
        if (valid) {
          backSeal(this.model3).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.visible3 = false
            this.doSearch()
          })
        } else {
          return false
        }
      })
    },
    doKey(row) { // 展示灌key页面数据
      this.getModel = {
        type: row.orderType,
        orderId: row.orderId
      }
      this.visible4 = true
      this.$nextTick(() => {
        var num = this.$refs.AgObj1.AgGetSealNum()

        if (num > 0) {
          var ret = JSON.parse(AgObj1.AgGetUsbKeyInfoEx(0))

          console.log(ret, 11111)
          this.model5 = {
            'orgId': ret.orgId,
            'keyId': ret.serial,
            'userId': ret.userId,
            'sealId': ret.seal[0].sealId
          }
          this.ukeyImg2 = 'data:image/png;base64,' + ret.seal[0].image
        }
        this.getKeyByid()
      })
    },
    getKeyByid() {
      fetchById(this.getModel).then(response => { // 数据库的数据
        const { data } = response
        var obj = data.sealInfos[0]
        obj.uid = data.uid
        this.model4 = obj
        this.ukeyImg1 = 'data:image/png;base64,' + obj.filePath
      })
      return false
    },
    goIrrigate() { // 实际灌章
      var strUnitID = this.model4.entId
      // 用户ID
      var strUserID = this.model4.uid
      // 印章ID
      var strSealID = this.model4.sealId
      var strSealData = this.model4.filePath
      // $('.yulan1').attr("src",'data:image/png;base64,'+strSealData)
      var ret = null
      ret = this.$refs.AgObj1.AgWriteSealToUsbKeyEx(strUnitID, strUserID, strSealID, strSealData)
      const goKey = () => {
        var ret = JSON.parse(AgObj1.AgGetUsbKeyInfoEx(0))
        var obj = {
          keyType: this.getModel.type,
          keyId: ret.serial,
          uid: this.model4.uid,
          sealId: this.model4.sealId
        }
        fetchFill(obj).then(response => {
          const { data } = response
          this.visible4 = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      }
      if (ret == 0) {
        goKey()
      } else {
        this.$message.error('灌章失败，请初始化ukey')
      }
    }
  }
}
</script>
 <style>
 .el-image-viewer__close{
   color:#fff
 }
</style>
