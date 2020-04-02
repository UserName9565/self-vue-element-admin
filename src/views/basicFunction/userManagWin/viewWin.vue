<!--  -->
<template>
  <el-dialog
    top="4vh"
    title="查看"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      ref="agForm"
      :model="model"

      :disabled="disabled"
      label-position="left"
      label-width="130px"
      style="width: 400px; margin-left:50px;"
    >
      <el-form-item label="用户姓名" prop="type">
        <el-select v-model="model.type" class="filter-item" placeholder="Please select">
          <el-option
            v-for="item in calendarTypeOptions"
            :key="item.key"
            label="item.display_name"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登陆账号" prop="timestamp">
        <el-date-picker v-model="model.timestamp" type="datetime" placeholder="Please pick a date" />
      </el-form-item>
      <el-form-item label="用户手机号" prop="title">
        <el-input v-model="model.title" />
      </el-form-item>
      <el-form-item label="用户邮箱">
        <el-select v-model="model.status" class="filter-item" placeholder="Please select">
          <el-option v-for="item in statusOptions" :key="item" label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户证件类型" />
      <el-form-item label="用户证件号">
        <el-input v-model="model.title1" />
      </el-form-item>
      <el-form-item label="用户证件号">
        <el-input v-model="model.title2" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dialogStatus==='create'?createData():updateData()"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      visible: false,
      disabled: false,
      model: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      }
    }
  },
  created() {},

  methods: {
    init(id) {
      this.visible = true
      if (self.$refs.agForm) {
        self.$refs.agForm.resetFields()
      }
    },
    doSave() {

    }
  }
}
</script>
<style  scoped>
</style>
