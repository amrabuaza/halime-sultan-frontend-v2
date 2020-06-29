var _spef = _spef || []
_spef.push(['enableLinkTracking'])
_spef.push(['trackPageView'])
;(function () {
  var u = '//trck.spoteffects.net/analytics/'
  _spef.push(['setTrackerUrl', u + 'piwik.php'])
  _spef.push(['setSiteId', 187])
  var d = document,
    g = d.createElement('script'),
    s = d.getElementsByTagName('script')[0]
  g.type = 'text/javascript'
  g.defer = true
  g.async = true
  g.src = u + 'spef.min.js'
  s.parentNode.insertBefore(g, s)
})()

window.ptag_params = {
  zone: 'homepage',
  customerId: '',
  siteType: 'd',
  m_md5: '',
}
;(function (win, doc) {
  var script = doc.createElement('script')
  script.async = true
  script.src =
    ('https:' == document.location.protocol ? 'https:' : 'http:') +
    '//ads5.admatic.com.tr/showad/px/rt/pixel/js/94/index'
  var s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(script, s)
})(this, document)

window.insider_object = { page: { type: 'Homepage' }, user: [] }(function (
  w,
  d,
  t,
  r,
  u,
) {
  var f, n, i
  ;(w[u] = w[u] || []),
    (f = function () {
      var o = { ti: '5117470' }
      ;(o.q = w[u]), (w[u] = new UET(o)), w[u].push('pageLoad')
    }),
    (n = d.createElement(t)),
    (n.src = r),
    (n.async = 1),
    (n.onload = n.onreadystatechange = function () {
      var s = this.readyState
      ;(s && s !== 'loaded' && s !== 'complete') ||
        (f(), (n.onload = n.onreadystatechange = null))
    }),
    (i = d.getElementsByTagName(t)[0]),
    i.parentNode.insertBefore(n, i)
})(window, document, 'script', 'bat.js', 'uetq')

for (var i = 0 in ((LocalStorageBasketItems = localStorage.getItem(
  'basketItems',
)),
(objItem = JSON.parse(LocalStorageBasketItems)),
(LocalStorageBasketItemsArray = []),
(LocalStorageBasketItemsJson = ''),
objItem))
  0 !== objItem[i].sep_urun_fiyati &&
    ((LocalStorageBasketItem = {}),
    (LocalStorageBasketItem.item = objItem[i].product_id),
    (LocalStorageBasketItem.price = objItem[i].sep_urun_fiyati),
    (LocalStorageBasketItem.quantity = 1),
    LocalStorageBasketItemsArray.push(LocalStorageBasketItem))
ScarabQueue.push(['cart', LocalStorageBasketItemsArray]),
  ScarabQueue.push(['go'])

'function' == typeof Object.assign &&
  ((function (e, t) {
    if (!document.getElementById(t)) {
      var c = document.createElement('script')
      ;(c.id = t),
        (c.src = e + '.scarabresearch.com/js/1A40778FCDCD3012/scarab-v2.js')
      var r = document.getElementsByTagName('script')[0]
      r.parentNode.insertBefore(c, r)
    }
  })(
    'https:' == document.location.protocol
      ? 'https://recommender'
      : 'http://cdn',
    'scarab-js-api',
  ),
  (function (e, t) {
    if (!document.getElementById(t)) {
      var c = document.createElement('script')
      ;(c.id = t),
        (c.src = e + '.scarabresearch.com/js/1661A78728104ABB/scarab-v2.js')
      var r = document.getElementsByTagName('script')[0]
      r.parentNode.insertBefore(c, r)
    }
  })(
    'https:' == document.location.protocol
      ? 'https://recommender'
      : 'http://cdn',
    'scarab-js-api',
  ))

var criteo_p = '23976'
var criteo_user = ''
!(function (e) {
  if (!window.pintrk) {
    window.pintrk = function () {
      window.pintrk.queue.push(Array.prototype.slice.call(arguments))
    }
    var t = window.pintrk
    ;(t.queue = []), (t.version = '3.0')
    var i = document.createElement('script')
    ;(i.async = !0), (i.src = 'ct/core.js')
    var n = document.getElementsByTagName('script')[0]
    n.parentNode.insertBefore(i, n)
  }
})(),
  pintrk('load', '2612414352751', { em: '' }),
  pintrk('page'),
  pintrk('track', 'pagevisit')

var google_tag_params = {}
var userFavoriteProducts = []
var gLanguage = 'EN'
var gPageType = 'Home'
var spGermany = false
var spEngland = false
var userLoginWith = ''
var userRegisterWith = ''
var spHasOrder = false
var spCountryCode = 'US'
var language = 'en'
var currency = 'USD'
var currencyUpper = 'USD'
var ctype = ''
var loggedIn = false
var disableAutoLogin = false
var btnTextOk = 'OK'
var combineAlertChoice = 'Choose Size'
var transSearchText = 'Search'
var transMyAccountText = 'My Account'
var customerGroupKey = 'QWYT'
var shipmentCountryId = '38'
var shipmentCountryZoneId = '2'
var eightDigitsCountryId = '38'
var akamaiKey = '?ck=38-en-USD-qwyt-seditor:desc'
var akamaiParameter = '&ck=38-en-USD-qwyt-seditor:desc'
var maximizedSiteCache = 0
var isPercentDiscountCampaign = false
var percentDiscountText = 'Exclusive for Today'
var isBuy1Get1Campaign = false
var showCargoPopupCampaign = false
var buy1Get1Text = 'Buy 1 Get +1 FREE'
var noStockVariantText =
  'Since we are out of stock for this product, no more additions for it can be made to the basket.'
var isBrandBadge = false
var isLoggedin = 'F'
var transDay = 'Day'
var transDays = 'Days'
var transHour = 'H'
var transHours = 'Hrs'
var transMinute = 'Min'
var transSecond = 'Sec'

dataLayer.push({
  dimension1: 'Visitor',
  dimension4: 'No',
  dimension9: 'EN',
  dimension10: 'USD',
  dimension11: 'US',
  dimension35: 'EN',
  dimension36: 'USD',
  dimension2: 'ZONE 2',
  dimension83: 'Yes',
})(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r
  ;(i[r] =
    i[r] ||
    function () {
      ;(i[r].q = i[r].q || []).push(arguments)
    }),
    (i[r].l = 1 * new Date())
  ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
  a.async = 1
  a.src = g
  m.parentNode.insertBefore(a, m)
})(
  window,
  document,
  'script',
  'https://www.google-analytics.com/analytics.js',
  'ga',
)
ga('create', 'UA-24842230-3', 'auto', { allowLinker: true })
ga('require', 'GTM-TXB6SSW')

var gLanguage = 'EN'
var gPageType = 'Home'

window.criteo_q = window.criteo_q || []
window.criteo_q.push(
  {
    event: 'setAccount',
    account: 23976,
  },
  { event: 'setHashedEmail', email: '' },
  {
    event: 'setSiteType',
    type: 'd',
  },
  { event: 'viewHome', user_segment: '3' },
)
var google_tag_params = {
  pagetype: 'Home',
  ecomm_pagetype: 'Home',
  plang: 'en',
  abc: ['0'],
}
var ScarabQueue = ScarabQueue || []
if (typeof updateBasketPopup === 'function') {
  updateBasketPopup()
}

