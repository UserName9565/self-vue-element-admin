import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/user/toSelect.do',
    method: 'post',
    data
  })
}
export function fetchSelect(data) {
  return request({
    url: '/user/getUserState.do',
    method: 'post',
    data
  })
}
export function updateState(data) { // 停用 启用
  return request({
    url: '/user/updateState.do',
    method: 'post',
    data
  })
}
export function fetchById(id) {
  return request({
    url: '/user/selectWithUserId.do',
    method: 'post',
    params: { id }
  })
}

