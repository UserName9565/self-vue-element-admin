import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/authorizedPerson/find.do',
    method: 'post',
    data
  })
}
export function fetchById(data) {
  return request({
    url: '/authorizedPerson/findById.do',
    method: 'post',
    data
  })
}
export function fetchAudit(data) {
  return request({
    url: '/authorizedPerson/audit.do',
    method: 'post',
    data
  })
}
export function fetchFile(url) {
  return process.env.VUE_APP_BASE_API + '/authorizedPerson/file/' + url
}
export function getAPPDetaile(id) {
  return request({
    url: '/authorizedPerson/findApproveHis.do',
    method: 'post',
    data: {
      processinsId: id
    }
  })
}

