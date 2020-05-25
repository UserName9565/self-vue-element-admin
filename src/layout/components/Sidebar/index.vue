<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#1a2634"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subPermission">
                    <el-submenu :index="item.url" :key="item.permisssionId">
                        <template slot="title">

                            <!-- <i :class="item.icon"></i> -->
                            <i class="iconfont" v-html="item.rel"></i>
                         
                            <span slot="title">{{ item.permisssionName }}</span>
                        </template>
                        <template v-for="subItem in item.subPermission">
                            <el-submenu v-if="subItem.subPermission" :index="subItem.url" :key="subItem.permisssionId">
                                <template slot="title">{{ subItem.permisssionName }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subPermission" :key="i" :index="threeItem.url">
                                    {{ threeItem.permisssionName }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.url" :key="subItem.permisssionId">
                                {{ subItem.permisssionName }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.url" :key="item.permisssionId">
                        <i :class="item.icon"></i><span slot="title">{{ item.permisssionName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { fetchList } from '@/api/menu'
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  data(){
    return {
            collapse: false,
            items1: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    name: '系统首页'
                },
                {
                    icon: 'el-icon-lx-cascades',
                    index: 'table',
                    name: '基础表格'
                },
                {
                    icon: 'el-icon-lx-copy',
                    index: 'tabs',
                    name: 'tab选项卡'
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    name: '表单相关',
                    subs: [
                        {
                            index: 'form',
                            name: '基本表单'
                        },
                        {
                            index: '3-2',
                            name: '三级菜单',
                            subs: [
                                {
                                    index: 'editor',
                                    name: '富文本编辑器'
                                },
                                {
                                    index: 'markdown',
                                    name: 'markdown编辑器'
                                }
                            ]
                        },
                        {
                            index: 'upload',
                            name: '文件上传'
                        }
                    ]
                },
                {
                    icon: 'el-icon-lx-emoji',
                    index: 'icon',
                    name: '自定义图标'
                },
                {
                    icon: 'el-icon-lx-favor',
                    index: 'charts',
                    name: 'schart图表'
                },
                {
                    icon: 'el-icon-rank',
                    index: 'drag',
                    name: '拖拽列表'
                },
                {
                    icon: 'el-icon-lx-warn',
                    index: '6',
                    name: '错误处理',
                    subs: [
                        {
                            index: 'permission',
                            name: '权限测试'
                        },
                        {
                            index: '404',
                            name: '404页面'
                        }
                    ]
                }
            ],
            items: []
        }
  },
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    onRoutes() {
        return this.$route.path.replace('/', '')
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods:{
    doSearch() {
      fetchList({
        userId:this.$store.getters.imfo.userId
      }).then(response => {
        const { data } = response
        // this.menuCard(data.roles[1].permsExt);
        this.items = data.roles[1].permsExt
      })
    },
    menuCard(menu, id) {
            var arr = []
            var menuNew = menu.filter(item => {
                if (!item.url) {
                    item.url = item.id
                }
                try {
                    if (item.properties) {
                        item.properties = JSON.parse(item.properties)
                    }
                } catch (error) {}
                return item.parentId == id
            })
            menuNew.forEach(item => {
                var pA = haveSon(item)
                if (pA.length > 0) {
                    item.subs = pA

                    arr.push(item)
                }
            })

            function haveSon(item) {
                var newSon = menu.filter(o => {
                    return o.parentId == item.id
                })
                if (newSon.length > 0) {
                    newSon.forEach(b => {
                        var pA = haveGSon(b)
                        if (pA.length > 0) {
                            b.subs = pA
                        }
                    })
                }
                return newSon
            }
            function haveGSon(item) {
                var newSon = menu.filter(o => {
                    return o.parentId == item.id
                })
                return newSon
            }
            this.items = arr //.concat(this.items1);
            this.items.sort(this.displayOrder)
            this.items.forEach(el => {
                el.subs.sort(this.displayOrder)
            });

        },
        displayOrder(a, b) {
            if (a.displayOrder === b.displayOrder) {
                return a.id - b.id
            } else {
                return a.displayOrder - b.displayOrder
            }
        }
  },
  mounted(){
    this.doSearch();
  }
}
</script>
