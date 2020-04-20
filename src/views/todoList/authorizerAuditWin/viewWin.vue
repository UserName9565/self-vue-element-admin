<!--  -->
<template>
  <el-dialog
    top="3vh"
    width="80%"
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-card>
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="6">
            <p>授权人姓名：<span v-html="model.userName" /></p>
            <p>手机号：<span v-html="model.phone" /></p>
            <p>身份类型：<span><el-tag v-if="model.userType==1||model.userType==3">签字人</el-tag><el-tag v-if="model.userType==2||model.userType==3">签章人</el-tag></span></p>
            <p>法人姓名：<span v-html="model.legalRepresentative" /></p>
          </el-col>
          <el-col :span="8">
            <p>授权人身份证：<span v-html="model.idNumber" /></p>
            <p>关联企业：<span v-html="model.entName" /></p>
            <p>法人身份证号：<span v-html="model.legalCardNumber" /></p>
            <p>备注：<span v-html="model.remark" /></p>
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="model.authRemark"
              type="textarea"
              :rows="2"
              :autosize="{ minRows: 4, maxRows: 4}"
              style="height:200px"
              placeholder="理由"
              :disabled="viewType==1"
            />
          </el-col>
          <el-col :span="24" class="tar">
            <el-button @click="visible = false">关闭</el-button>
            <el-button
              v-if="viewType==3"
              type="primary"
              @click="doAppove(2)"
            >通过</el-button>
            <el-button
              v-if="viewType==3"
              type="danger"
              @click="doAppove(3)"
            >驳回</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div slot="header" class="clearfix">
        <span>安全信息</span>
      </div>
      <div>
        <el-row :gutter="10">
          <viewer :images="srcList">
            <el-col v-for="src in srcList" :span="6" class="agImags">
              <p style="text-align:center">{{ src.title }}</p>
              <img :key="src.src" :src="src.src" :title="src.title">
            </el-col>
          </viewer>

        </el-row>
      </div>
    </el-card>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
      <el-button
        v-if="viewType==3"
        type="primary"
        @click="doAppove(2)"
      >通过</el-button>
      <el-button
        type="danger"
        v-if="viewType==3"
        @click="doAppove(3)"
      >驳回</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import { fetchById, fetchAudit, fetchFile } from '@/api/authorizerAudit'
export default {
  components: {},
  data() {
    return {
      visible: false,
      viewType: 0,
      disabled: false,
      id: null,
      model: {
        remark: '',
        authRemark: '',
        userName: '',
        phone: '',
        userType: '',
        legalRepresentative: '',
        idNumber: '',
        entName: '',
        legalCardNumber: ''
      },
      srcs: {

      },
      srcList: []
    }
  },
  created() {},

  methods: {
    init(data, type) {
      this.srcList = []
      this.srcs = {}
      this.model = data
      const arr = [
        { title: '企业授权函', value: 'authLetterPath' },
        { title: '营业执照', value: 'blImagePath' },
        { title: '身份证人像面', value: 'idCardImagea' },
        { title: '身份证国徽面', value: 'idCardImageb' }
      ]
      arr.forEach(index => {
        var obj = {}
        obj.src = fetchFile(data[index.value])
        obj.title = index.title
        //  this.srcs[index] = fetchFile(data[index])
        this.srcList.push(obj)
      })

      this.viewType = type
      this.visible = true
    },
    doSave() {

    },
    doAppove(type) {
      // var obj =  publicFun.inputParam(sonTemp);
      // obj.authStatus = tagType;
      // obj.uid = nowData.uid;
      // obj.processinsId = nowData.processinsId
      // obj.taskId = nowData.taskId
      if (type == 3) {
        if (!this.model.authRemark) {
          this.$message({
            message: '驳回需要填写理由',
            type: 'warning'
          })
          return false
        }
      }
      const model = this.model
      var obj = {
        authRemark: model.authRemark
      }
      obj.authStatus = type
      obj.uid = model.uid
      obj.processinsId = model.processinsId
      obj.taskId = model.taskId
      fetchAudit(obj).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$emit('change')
        this.visible = false
      })
    }
  }
}
</script>
<style  scoped>
 .agImags img{
   width:100%;
   height:auto;
 }
</style>
