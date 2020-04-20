import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/order/find.do',
    method: 'post',
    data
  })
}
export function fetchById(data) {
  return request({
    url: '/sealInfo/findByOrderId.do',
    method: 'post',
    data
  })
}
export function fetchFill(data) {
  return request({
    url: '/fillUKey/fill.do',
    method: 'post',
    data
  })
}

export function fillFinish(id) {
  return request({
    url: '/fillUKey/fillFinish.do',
    method: 'post',
    data: {
      processinsId: id
    }
  })
}
export function fetchgetCert(data) {
  return request({
    url: '/order/findCertByOrderId.do',
    method: 'post',
    data
  })
}
export function getCertFile(url) {
  return process.env.VUE_APP_BASE_API + '/sealInfo/getCertFile.do' + url
  // return request({
  //   url: '/sealInfo/getCertFile.do',
  //   method: 'post',
  //   data
  // })
}
export function checkCertFile(data) {
  return request({
    url: '/sealInfo/checkCertFile.do',
    method: 'get',
    params: data
  })
}
export function backSeal(data) {
  return request({
    url: '/sealInfo/sealReject',
    method: 'post',
    data
  })
}
