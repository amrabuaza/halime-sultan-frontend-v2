function emptyGA() {}
var mdnsGTM = {}
dataLayer = []

var gLanguage = 'EN'
var gPageType = 'CustomQuery'

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
  dimension41: '',
})
;(function (i, s, o, g, r, a, m) {
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

!(function (e, t, a, n, g) {
  ;(e[n] = e[n] || []),
    e[n].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  var m = t.getElementsByTagName(a)[0],
    r = t.createElement(a)
  ;(r.async = !0),
    (r.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-NZZ9DV'),
    m.parentNode.insertBefore(r, m)
})(window, document, 'script', 'dataLayer')

var userFavoriteProducts = []
var _gaqv = {}
var google_tag_params = {}

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
