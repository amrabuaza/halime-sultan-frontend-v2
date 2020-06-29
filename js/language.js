var dictionary = {
  greet: {
    en: 'Hello',
    ar: 'Salut',
  },
  change_lang: {
    en: 'Help & Support',
    ar: ' المساعده والدعم',
  },
}
var langs = ['en', 'ar']
var current_lang_index = 0
var current_lang = langs[current_lang_index]

window.change_lang = function () {
  current_lang_index = ++current_lang_index % 2
  current_lang = langs[current_lang_index]
  translate()
}

function translate() {
  $('[data-translate]').each(function () {
    var key = $(this).data('translate')
    $(this).html(dictionary[key][current_lang] || 'N/A')
  })
}

translate()

// <button  onclick="change_lang()">Change Language</button>
