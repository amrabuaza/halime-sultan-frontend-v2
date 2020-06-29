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
var customerGroupKey = 'LMNB'
var shipmentCountryId = '38'
var shipmentCountryZoneId = '2'
var eightDigitsCountryId = '38'
var akamaiKey = '?ck=38-en-USD-lmnb-seditor:desc'
var akamaiParameter = '&ck=38-en-USD-lmnb-seditor:desc'
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

!(function (e) {
  if (!window.pintrk) {
    window.pintrk = function () {
      window.pintrk.queue.push(Array.prototype.slice.call(arguments))
    }
    var t = window.pintrk
    ;(t.queue = []), (t.version = '3.0')
    var i = document.createElement('script')
    ;(i.async = !0), (i.src = '../../../ct/core.js')
    var n = document.getElementsByTagName('script')[0]
    n.parentNode.insertBefore(i, n)
  }
})(),
  pintrk('load', '2612414352751', { em: '' }),
  pintrk('page'),
  pintrk('track', 'pagevisit')

var criteo_p = '23976'
var criteo_user = ''
if (typeof updateBasketPopup === 'function') {
  updateBasketPopup()
}
var ScarabQueue = ScarabQueue || []
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

window.insider_object = { page: { type: 'login' }, user: [] }(function (
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
})(window, document, 'script', '../../../bat.js', 'uetq')

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

var transOK = 'OK'
var transInvalidPhone = 'Invalid phone number!'
var transEmptyEmail = 'Please enter your email address.'
var transInvalidEmail = 'Please enter a valid email address.'
var transEmptyPassword = 'Please enter your password.'
var transEmptyFields = 'Some fields are empty!'
var transTermCheckInvalid = 'Please, accept the Terms of Use and Privacy'
var transFacebookLoginError = 'Connection to Facebook Failed'
var transForgotSuccess = 'Your Password Successfully Reset'
if (
  getURLParameter('showRegister') != 'true' &&
  typeof language !== 'undefined' &&
  typeof shipmentCountryId !== 'undefined'
) {
  isMembershipLoginEvent = true
}

var telCountryCode = 'Jordan'
var gLanguage = 'EN'
var gPageType = 'Home'
