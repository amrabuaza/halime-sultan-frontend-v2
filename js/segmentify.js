/* Last Update: Wed, 29 Apr 2020 07:45:09 GMT */
/* Modanisa ENGLISH - USD [Modanisa US] */
/* Decimal Seperator . */
/* Do not load Segmentify more than one to prevent potential error occurrence */
if (window['SegmentifyTrackingObject']) {
  throw new Error("Segmentify is already loaded!");
}

var segNamespace = "Segmentify";

window['SegmentifyTrackingObject'] = segNamespace;

window[segNamespace] = window[segNamespace] || function () {
  (window[segNamespace].q = window[segNamespace].q || []).push(arguments);
};
var coreInit = setInterval(function () {
  if (window.hasOwnProperty("currencyUpper") || window.hasOwnProperty("segCurrency")) {
    var modanisaCurrency = ""
    if (window.hasOwnProperty("segCurrency")) {
      modanisaCurrency = segCurrency;
    } else {
      modanisaCurrency = currencyUpper;
    }
    var segLangCurrencyHandler = function () {
      var result = {
        "language": "EN",
        "currency": modanisaCurrency
      };

      if (document.getElementsByTagName("html").length) {
        var currentLang = document.getElementsByTagName("html")[0].getAttribute("lang").toLowerCase();
        if (currentLang === "en") {
          result.language = "EN";
        } else if (currentLang === "tr") {
          result.language = "TR";
        } else if (currentLang === "ar") {
          result.language = "AR";
        }
      }
      return result;
    };

    window[segNamespace].config = {
      segmentifyApiUrl: '//dcetr9.segmentify.com/',
      domain: '.modanisa.com',
      currency: segLangCurrencyHandler().currency,
      language: segLangCurrencyHandler().language,
      categoryHierarchy: true,
      jq: window.jQuery,
      disableNextPage: true
    };

    Segmentify('apikey', '6e6bea5c-236b-484e-b13b-ffefa765b81d');
    clearInterval(coreInit);
    waitSegmentifyAndjQuery();
    
  }
}, 300);

function waitSegmentifyAndjQuery() {
  if (window["_SgmntfY_"] && window["jQuery"]) {
    window.segJquery = window["jQuery"];

    segJquery(document).ready(function () {
      SegmentifyIntegration(window.segJquery).init();
    });
  } else {
    setTimeout(waitSegmentifyAndjQuery, 100);
  }
}

var SegmentifyIntegration = function (jQuery) {
  var segmentifyEvents = {
    viewPage: function (category, subCategory, params) {
      /* console.log("Pageview Event is going", category, subCategory, params); */
      Segmentify('view:page', {
        'category': category,
        'subCategory': subCategory,
        'params': params
      });
    },
    viewProduct: function (productObj) {
      /* console.log("Product View Event is going", productObj); */
      Segmentify('view:product', productObj);
    },
    checkoutBasket: function (basketObj) {
      /* console.log("Checkout Basket event is going", basketObj); */
      Segmentify('checkout:basket', basketObj);
    },
    checkoutPurchase: function (purchaseObj) {
      /* console.log("Checkout Purchase event is going", purchaseObj); */
      Segmentify('checkout:purchase', purchaseObj);
    },
    basketAdd: function (basketObj) {
      /* console.log("Basket Add Event is going", basketObj); */
      Segmentify('basket:add', basketObj);
    },
    basketRemove: function (basketObj) {
      /* console.log("Basket Remove Event is going", basketObj); */
      Segmentify('basket:remove', basketObj);
    },
    basketClear: function (basketObj) {
      /* console.log("Basket Clear Event is going", basketObj); */
      Segmentify('basket:clear', basketObj);
    },
    userUpdate: function (userObj) {
      /* console.log("User Update Event is going", userObj); */
      Segmentify('user:update', userObj);
    },
    userSignup: function (signupObj) {
      /* console.log("User Sign-up Event is going", signupObj); */
      Segmentify('user:signup', signupObj);
    },
    userId: function (id) {
      /* console.log("User ID is going to be changed", id); */
      Segmentify('userid', id);
    },
    custom: function (customObj) {
      /* console.log("Custom Event is going", customObj); */
      Segmentify('event:custom', customObj);
    }
  };
  var BannerifyIntegration = function (jQuery) {
    var bannerifyEvents = {
      impression: function (impressionObj) {
        /* console.log("Impression Event is going", impressionObj); */
        Segmentify('banner:impression', impressionObj)
      },
      click: function (clickObj) {
        /* console.log("Click Event is going", clickObj); */
        Segmentify('banner:click', clickObj)
      },
      update: function (updateObj) {
        /* console.log("Update Event is going", updateObj); */
        Segmentify('banner:update', updateObj)
      },
      groupView: function (viewObj) {
        /* console.log("Group View Event is going", viewObj); */
        Segmentify('bannergroup:view', viewObj)
      },
      groupDetail: function (detailObj) {
        /* console.log("Group Detail Event is going", detailObj); */
        Segmentify('bannergroup:detail', detailObj)
      }
    };

    var helperFunctions = {
      "propertiesHasValue": function (target, exceptions) {
        // check javascript object if it's properties has any value (all of them)
        // get all member in the target object
        for (var member in target) {
          // check if member value is not null or not defined
          if (!target.hasOwnProperty(member) || (!target[member] && (exceptions || []).indexOf(member) < 0)) {
            // return false means at least one member has no value
            // so all members of the object have no value, maybe some
            return false;
          }
        }

        // return true means all members of the object have a value
        return true;
      },
      "isScrolledIntoView": function (element) {
        // if the given element is shown in the browser (should meet some required conditions described below)
        // conditions:
        // 1. element top offset can be equal or greater to browser inner window top offset
        // 2. element middle offset can be equal or smaller to browser inner window bottom offset
        try {
          var $element = jQuery(element);
          var $window = jQuery(window);

          var documentTopOffset = $window.scrollTop();
          var documentBottomOffset = documentTopOffset + Math.min(document.body.clientHeight, $window.height());

          var elementTopOffset = $element.offset().top;
          var elementMiddleOffset = elementTopOffset + Math.floor($element.height() / 2);

          return ((elementMiddleOffset <= documentBottomOffset) && (elementTopOffset >= documentTopOffset));
        } catch (err) {
          // if any error occur, put it into a global variable
          window.bannerifyErr = err;

          // if any error occurs return false (means: object not scrolled into view)
          return false;
        }
      },
      "makeUrlAbsolute": function (url) {
        // prepare banner's urls. sometimes they have relative paths (anchor link or image source path) however we need to make it complete
        // by adding path origin as prefix front of the given url and return the output
        var prefix = document.location.origin;

        // if url is not valid or empty return empty string or url type is not string
        // return empty string
        if (typeof url != "string" || !url) return "";

        // check if banner url is relative (if it has two slahes "//" it is not relative it just has not protocol prefix)
        // but acceptable
        if (url.indexOf("/") == 0 && url.indexOf("//") < 0) {
          return (prefix + url);
        } else if (url.indexOf("//") == 0) {
          return (document.location.protocol + url);
        } else if (url.indexOf("/") != 0 && url.indexOf("//") != 0 && url.indexOf(prefix) < 0 && url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
          return (prefix + "/" + url);
        } else {
          // url is valid return it
          return url;
        }
      },
      "sendBannerImpression": function (params, optCheck) {
        try {
          // impression event sender to Segmentify with some parameters
          var $this = this;

          if (!$this.propertiesHasValue(params)) return;

          var optional_checker = true;

          if (typeof optCheck == "function" && optCheck) optional_checker = optCheck();

          // set a timer which will run after 250ms
          setTimeout(function () {
            // if the banner is appeared in the window and visible send impression event to Segmentify
            if ($this.isScrolledIntoView(jQuery(params.banner)) &&
              jQuery(params.banner).css("display") != "none" &&
              jQuery(params.banner).css("opacity") != 0 &&
              jQuery(params.banner).css("visibility") != "hidden" &&
              optional_checker) {
              // send impression event
              bannerifyEvents.impression({
                "group": params.bannerGroup,
                "order": params.bannerOrder,
                "title": params.bannerTitle
              });
            } else {
              // do it again for the specific slider until the impression is sent
              $this.sendBannerImpression(params, optCheck);
            }
          }, 250);
        } catch (err) {
          // if any error occur, put it into a global variable
          window.bannerifyErr = err;
        }
      },
      "sendBannerClick": function (params) {
        try {
          // click event sender to Segmentify with some parameters
          var $this = this;

          if (!$this.propertiesHasValue(params)) return;

          var banner = jQuery(params.bannerAnchor);

          // if the banner is appeared in the window and visible send impression event to Segmentify
          banner.on('click', function () {
            if (jQuery(".coin-slider #cs-buttons-coin-slider a").eq((params.bannerOrder - 1)).hasClass("cs-active")) {
              bannerifyEvents.click({
                "url": $this.makeUrlAbsolute(params.bannerUrl),
                "group": params.bannerGroup,
                "order": params.bannerOrder,
                "title": params.bannerTitle
              });
            } else if (jQuery(params.bannerAnchor).parents().eq(0).attr('id') !== "coin-slider") {
              bannerifyEvents.click({
                "url": $this.makeUrlAbsolute(params.bannerUrl),
                "group": params.bannerGroup,
                "order": params.bannerOrder,
                "title": params.bannerTitle
              });
            }
          });
        } catch (err) {
          // if any error occur, put it into a global variable
          window.bannerifyErr = err;
        }
      },
      "bannerRelationship": function (value, type) {
        try {
          // first of all, the function checks landed page url if it matches with a clicked banner url
          // if parameters are valid, it sends banner:update event to make a relationship for the banner
          // value: must be a text
          // type: this identifies the banner type and can be -> label, product, category or brand
          setTimeout(function () {
            // check if value and type are valid
            // otherwise exit function
            if (!value || !type) return;

            // check if Segmentify object is loaded successfully
            if (window["_SgmntfY_"]) {
              // get all clicked bannerify list from Segmentify
              var bannerifies = window["_SgmntfY_"]._getClickedBanners();

              for (var i = 0; i < bannerifies.length; i++) {
                var bannerifyProps = window["_SgmntfY_"]._split(bannerifies[i], ":", 4);

                // if clicked banner url equals the current url, so it is which we are looking for
                if (bannerifyProps[3] == document.URL) {
                  var data = {
                    "group": bannerifyProps[1],
                    "title": bannerifyProps[0],
                    "order": parseInt(bannerifyProps[2])
                  };

                  // if it is a known type banner, make a relationship between banner and product by id/category/label or brand
                  if (type.toLowerCase() == "product") {
                    data["productId"] = value;
                  } else if (type.toLowerCase() == "category") {
                    data["category"] = value;
                  } else if (type.toLowerCase() == "label") {
                    data["label"] = value;
                  } else if (type.toLowerCase() == "brand") {
                    data["brand"] = value;
                  }

                  // send banner:update to make aware Segmentify about the relationship
                  bannerifyEvents.update(data);
                }
              }
            } else {
              this.bannerRelationship(value, type);
            }
          }, 150);
        } catch (err) {
          // if any error occur, put it into a global variable
          window.bannerifyErr = err;
        }
      }
    };

    var exec = function (params, optCheck) {
      // try to send click by binding click event of the banner
      helperFunctions.sendBannerClick(params);

      // try to send impression
      helperFunctions.sendBannerImpression(params, optCheck);
    };

    return {
      "executer": exec,
      "groupView": bannerifyEvents.groupView,
      "relationship": helperFunctions.bannerRelationship,
      "urlAbsoluter": helperFunctions.makeUrlAbsolute,
      "click": helperFunctions.sendBannerClick,
      "impression": helperFunctions.sendBannerImpression
    };
  };

  window.isElemVisible = function ($elem) {

    if (_SgmntfY_._exists($elem)) {
      var $window = _SgmntfY_._getJq()(window);

      var docViewTop = window.scrollY;
      var docViewBottom = docViewTop + window.innerHeight;

      if ($elem instanceof HTMLElement) {
        $elem = _SgmntfY_._getJq()($elem);
      } else if ($elem instanceof HTMLCollection) {
        $elem = _SgmntfY_._getJq()($elem[0]);
      }
      var elemTop = $elem.offset().top;
      var elemBottom = elemTop + 100; // seeing 100 pixels of element is enough for us

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    } else {
      return false;
    }

  };

  function segBannerifyHandler(container, slider_selector, group_name) {
    var bannerify = BannerifyIntegration(jQuery);
    var bannerContainer = container
    var bannerItems = slider_selector
    var bannerifies = {
      "group": group_name,
      "banners": []
    };

    jQuery(bannerItems).each(function (i, item) {
      var currentItem = item;
      var bannerItem = jQuery(currentItem).eq(0);
      var bannerAnchor = jQuery('#coin-slider .cs-coin-slider');
      var bannerImage = jQuery(bannerItem).find("img").attr("src");


      var myself = {
        "title": jQuery(currentItem).find("img").attr("alt"),
        "order": (i + 1),
        "image": bannerImage,
        "urls": [jQuery(bannerItem.context).attr("href").replace('https:', "")]
      };

      var params = {
        "banner": currentItem,
        "bannerAnchor": bannerAnchor,
        "bannerGroup": bannerifies.group,
        "bannerOrder": myself.order,
        "bannerUrl": myself.urls[0] || "",
        "bannerTitle": myself.title
      };

      bannerifies.banners.push(myself);

      bannerify.executer(params, function () {
        if (jQuery(".coin-slider #cs-buttons-coin-slider a").eq(i).hasClass("cs-active")) {
          return true;
        }
        return false;
      });
    });

    if (bannerifies.banners.length > 0) {
      bannerify.groupView(bannerifies);
    }
  }

  function segTileBannerifyHandler(container, slider_selector, group_name) {
    try {
      var sliderContainer = jQuery(container);

      if (!sliderContainer.length || !container) {
        return;
      }

      var sliders = sliderContainer.find(slider_selector);
      var bannerify = BannerifyIntegration(jQuery);

      var bannerifies = {
        "group": group_name,
        "banners": []
      };

      jQuery.each(sliders, function (i, item) {
        var slider = jQuery(item);
        var sliderImage = slider.find("img");
        var sliderItem = slider;
        if (sliderImage.attr("src").indexOf("lazy-load")>=0) {
          imageLast = sliderImage.attr("data-original");
        }else{
          imageLast =  sliderImage.attr("src");
        }
        var myself = {
          "title": slider.find("div").attr("data-promo-name") || "",
          "order": (i + 1),
          "image": imageLast,
          "urls": [jQuery(sliderItem).attr('href').replace('https:', '')]
        };


        // handle banner click event to send banner click to Segmentify
        var params = {
          "banner": slider,
          "bannerAnchor": sliderItem,
          "bannerGroup": group_name,
          "bannerOrder": myself.order,
          "bannerUrl": myself.urls[0] || "",
          "bannerTitle": myself.title
        };

        myself.title && bannerifies["banners"].push(myself);

        bannerify.executer(params);
      });

      if (bannerifies.banners.length > 0) {
        bannerify.groupView(bannerifies);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function segMobileBannerifyHandler(container, slider_selector, group_name) {
    try {
      var sliderContainer = jQuery(container);

      if (!sliderContainer.length || !container) {
        return;
      }

      var sliders = sliderContainer.find(slider_selector);
      var bannerify = BannerifyIntegration(jQuery);
      var bannerifies = {
        "group": group_name,
        "banners": []
      };


      jQuery.each(sliders, function (index, item) {
        var slider = jQuery(item);
        var sliderItem = slider.find("a").first();
        var sliderImage = slider.find("a img").first();

        var url = jQuery(sliderItem).attr("href").replace('https:', "");
        if (url.indexOf('modanisa.com') < 0) {
          url = "modanisa.com" + url;
        }
        var myself = {
          "title": jQuery(sliderItem).attr("data-ec-banner-name"),
          "order": (index + 1),
          "image": sliderImage.attr("src").replace('https:', ''),
          "urls": [url]
        };

        // handle banner click event to send banner click to Segmentify
        var params = {
          "banner": slider,
          "bannerAnchor": sliderItem,
          "bannerGroup": group_name,
          "bannerOrder": myself.order,
          "bannerUrl": myself.urls[0] || "",
          "bannerTitle": myself.title
        };

        bannerifies.banners.push(myself);

        bannerify.executer(params, function () {
          var currentItem = slider;
          if (sliders.length === 1 || jQuery(currentItem).hasClass("active")) {
            return true;
          }
          return false;
        });
      });

      if (bannerifies.banners.length > 0) {
        bannerify.groupView(bannerifies);
      }
    } catch (e) {}
  }

  function segMobileTileBannerifyHandler(container, slider_selector, group_name) {
    try {
      var sliderContainer = jQuery(container);

      if (!sliderContainer.length || !container) {
        return;
      }

      var sliders = sliderContainer.find(slider_selector);
      var bannerify = BannerifyIntegration(jQuery);

      var bannerifies = {
        "group": group_name,
        "banners": []
      };

      jQuery.each(sliders, function (index, item) {
        var slider = jQuery(item);
        var sliderImage = slider.find("a img").first();
        var sliderItem = slider.find("a").first();

        var myself = {
          "title": jQuery(sliderItem).attr("data-ec-banner-name"),
          "order": (index + 1),
          "image": sliderImage.attr("src").replace('https:', ''),
          "urls": [jQuery(sliderItem).attr('href').replace('https:', '')]
        };

        // handle banner click event to send banner click to Segmentify
        var params = {
          "banner": slider,
          "bannerAnchor": sliderItem,
          "bannerGroup": group_name,
          "bannerOrder": myself.order,
          "bannerUrl": myself.urls[0] || "",
          "bannerTitle": myself.title
        };

        bannerifies["banners"].push(myself);

        bannerify.executer(params);
      });

      if (bannerifies.banners.length > 0) {
        bannerify.groupView(bannerifies);
      }
    } catch (err) {
      window.bannerifyErr = err;
    }
  }
  var helperFunctions = {
    "setCookie": function (cname, cvalue, exdays) {
      window["_SgmntfY_"]._storePersistentData(cname, cvalue, exdays, false);
    },
    "getCookie": function (cname) {
      return window["_SgmntfY_"]._getPersistentData(cname, false);
    },
    "getQueryParameter": function (pname, url) {
      return window["_SgmntfY_"]._getQueryParameter(pname, url);
    },
    "setProtocol": function (url) {
      return url.replace("http:", "").replace("https:", "");
    },
    "priceFormatter": function (price, separators, currency_symbol) {
      try {
        var temp = (price || "").toString();

        if (temp) {
          // remove all unwanted characters if it is not a number
          var allowedChars = "0123456789.,";

          for (var i = 0; i < price.length; i++) {
            if (allowedChars.indexOf(price[i]) < 0) {
              temp = temp.replace(price[i], "");
            }
          }

          // remove redundant decimal separators
          var occurences = temp.match(/\./g);

          if (
            occurences &&
            Array.isArray(occurences) &&
            occurences.length > 1
          ) {
            for (var i = 0; i < occurences.length - 1; i++) {
              temp = temp.replace(".", "");
            }
          }

          // if separators provided, replace them
          if (
            separators &&
            Array.isArray(separators) &&
            separators.length === 2
          ) {
            var regexPattern = "";
            var regex = null;

            if (separators[1]) {
              regexPattern = "\\" + separators[1];
              regex = new RegExp(regexPattern, "g");

              temp = temp.replace(regex, "");
            }

            if (separators[0]) {
              regexPattern = "\\" + separators[0];
              regex = new RegExp(regexPattern, "g");

              temp = temp.replace(regex, separators[1]);
            }
          }

          // if currency symbol is valid and has a string value, replace it
          if (currency_symbol && typeof currency_symbol === "string") {
            temp = temp.replace(currency_symbol, "");
          }

          // cast the price to float
          temp = parseFloat(
            temp
            .toString()
            .trim()
            .replace(/\s/g, "")
          ).toFixed(2);

          return temp;
        }

        // if given parameters are not valid, return zero
        return 0;
      } catch (err) {
        // if any error occurs, return zero
        return 0;
      }
    },
    "getParameterByName": function (name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
  };

  try {
    if (window.hasOwnProperty("orientation") === false) {
      helperFunctions["languageConf"] = {
        "currency": jQuery("#lang").text().split("-")[1].trim(),
        "lang": jQuery("#lang").text().split("-")[0].trim()
      }
    } else if (window.hasOwnProperty("orientation") === true) {
      helperFunctions["languageConf"] = {
        "currency": jQuery("body").data("currency"),
        "lang": jQuery("body").data("shipment-country-code")
      }
    }
  } catch (e) {}

  var pageVariables = {
    category: "",
    subCategory: "",
    params: {}
  };

  var findPageType = function () {
    try {
      var pageType = {
        "category": "",
        "subCategory": ""
      };

      if (typeof google_tag_params !== "undefined" && typeof google_tag_params["pagetype"] !== "undefined") {
        pageType.category = google_tag_params["pagetype"];
        if (typeof google_tag_params["pcat"] !== "undefined") {
          pageType.subCategory = google_tag_params["pcat"];
        }
      } else if (typeof gPageType !== "undefined") {
        pageType.category = gPageType;
      }

      if (pageType.category === "Home") {
        pageVariables.category = "Home Page";
        return;
      }

      if (pageType.category === "Category") {
        pageVariables.category = "Category Page";
        if (window.hasOwnProperty("orientation") === false) {
          var categories = [];
          jQuery(".breadcrumb a:not(:first)").each(function () {
            categories.push(jQuery(this).text());
          });
          pageVariables.subCategory = categories.join(" > ") || jQuery("#page-name-span").text().trim();
        } else {
          pageVariables.subCategory = window.segCategoryInfo.join(" > ");
        }
        return;
      }
      if (document.location.href.indexOf("shtml") >= 0) {
        pageVariables.category = "Brand Page";
        pageVariables.params = {
          'brand': window.hasOwnProperty("orientation") === false ? jQuery("#page-name-span").text() : jQuery("h1.listingPage-headerSection").text().trim()
        };
        return;
      }
      if (document.location.href.indexOf("membership/account/favorite-products/") > 0 ) {
        pageVariables.category = "Favorite Page";
        pageVariables.params.productId= jQuery("#my-favorites-page .box:first .delete").attr("data-product-id");
        return;
      }
    
      if (pageType.category === "CategoryTag") {
        pageVariables.category = "Category Page";
        if (window.hasOwnProperty("orientation") === false) {
          var categories = [];
          jQuery(".breadcrumb a:not(:first)").each(function () {
            categories.push(jQuery(this).text());
          });
          pageVariables.subCategory = categories.join(" > ") || jQuery("#page-name-span").text().trim();
        } else {
          pageVariables.subCategory = window.segCategoryInfo.join(" > ");
        }
        return;
      }

      if (pageType.category === "Landing") {
        pageVariables.category = "Landing Page";
        //TODO
        pageVariables.subCategory = "";
        return;
      }

      if (pageType.category === "Product") {
        pageVariables.category = "Product Page";
        pageVariables.subCategory = "";
        
        return;
      }

      if (pageType.category === "Basket") {
        pageVariables.category = "Basket Page";
        return;
      }

      if (pageType.category === "Search") {
        pageVariables.category = "Search Page";
        if (jQuery("#no-product-found").length) {
          pageVariables.category = "Empty Search Page";
        }
        return;
      }

      //Mobile empty search page
      if (jQuery(".emptyListingContent").length && window.hasOwnProperty("orientation") === true) {
        pageVariables.category = "Empty Search Page";
        return;
      }

      if (jQuery(".p404-page").length || jQuery(".errorPage-container").length) {
        pageVariables.category = "404 Page";
        return;
      }

      if (pageType.category === "Purchase") {
        pageVariables.category = "Checkout Success Page";
        return;
      }

      pageVariables.category = "Unknown Page";
    } catch (err) {
      window.segErr = err;
    }
  };

  var triggerPageFunction = function (category) {
    try {
      if (category && pageFunctions.hasOwnProperty(category)) {
        pageFunctions[category]();
      }

      pageFunctions["All Pages"]();
    } catch (err) {
      window.segErr = err;
    }
  };

  var init = function () {
    findPageType();
    triggerPageFunction(pageVariables.category);
    /*if ((helperFunctions.languageConf.currency === "USD" && helperFunctions.languageConf.lang === "ENGLISH") || (helperFunctions.languageConf.currency === "USD" && helperFunctions.languageConf.lang === "US")) {
      triggerPageFunction(pageVariables.category);
    }*/
  };

  var pageFunctions = {
    "All Pages": function () {
      segmentifyEvents.viewPage(pageVariables.category, pageVariables.subCategory, pageVariables.params);
      try {
        window.jQuery(document).ajaxComplete(function (event, xhr, settings) {
          // Basket Add Operations
          if (settings && settings.url && settings.url.indexOf("basket_add.php") >= 0 && xhr.status == 200) {
            var queryString = "&" + settings.data;
            var productId = helperFunctions.getParameterByName("product_id", queryString);

            Segmentify("basket:add", {
              "productId": productId || "",
              "quantity": "1",
              "nextPage": false
            });
          }

          if (settings && settings.url && settings.url.indexOf("/basket/add") >= 0 && xhr.status == 200) {
            if (typeof google_tag_params !== "undefined" && typeof google_tag_params.pagetype !== "undefined" && google_tag_params.pagetype === "Product") {
              var queryString = "&" + settings.data;
              var productId = google_tag_params.prodid[0];

              Segmentify("basket:add", {
                "productId": productId || "",
                "quantity": "1",
                "nextPage": false
              });
            }
          }
        });
      } catch (e) {}
    },
    "Home Page": function () {
      var bannerWaiter = setTimeout(function () {
        var bannerContainer = jQuery(".coin-slider");
        var bannerItems = bannerContainer.find("#coin-slider #heroSliderCounter a");
        segBannerifyHandler(bannerContainer, bannerItems, "Homepage Banner");

        //Desktop Tile Bannerify
        bannerContainer = jQuery('.puane_countdown');
        bannerItems = ".last.slider-right";
        segTileBannerifyHandler(bannerContainer, bannerItems, "Homepage Tile 1");

        bannerContainer = jQuery('#main .wrapper');
        bannerItems = ".slider-bottom";
        segTileBannerifyHandler(bannerContainer, bannerItems, "Homepage Tile 2");

        bannerContainer = jQuery('.homepage-banners.clearfix');
        bannerItems = "a";
        segTileBannerifyHandler(bannerContainer, bannerItems, "Homepage Tile 3");

        //Mobile Bannerify
        bannerContainer = jQuery('.homepageBanner + .owl-carousel');
        bannerItems = ".owl-item:not(.cloned)";
        segMobileBannerifyHandler(bannerContainer, bannerItems, "Mobile Homepage Banner 1");

        bannerContainer = jQuery('.homepageMenuTree + .owl-carousel');
        bannerItems = ".owl-item:not(.cloned)";
        segMobileBannerifyHandler(bannerContainer, bannerItems, "Mobile Homepage Banner 2");

        bannerContainer = jQuery('.categorySlider-container .owl-carousel');
        bannerItems = ".owl-item:not(.cloned)";
        segMobileBannerifyHandler(bannerContainer, bannerItems, "Mobile Homepage Banner 3");

        bannerContainer = jQuery('.titledSlider-container .titledSlider-imgWrapper.owl-carousel:eq(0)');
        bannerItems = ".owl-item:not(.cloned)";
        segMobileBannerifyHandler(bannerContainer, bannerItems, "Mobile Homepage Banner 4");

        bannerContainer = jQuery('.homepageSeperator + .titledSlider-container .titledSlider-imgWrapper.owl-carousel:eq(0)');
        bannerItems = ".owl-item:not(.cloned)";
        segMobileBannerifyHandler(bannerContainer, bannerItems, "Mobile Homepage Banner 5");

        bannerContainer = jQuery('.homepageSeperator + .titledSlider-container .titledSlider-imgWrapper.owl-carousel:eq(1)');
        bannerItems = ".owl-item:not(.cloned)";
        segMobileBannerifyHandler(bannerContainer, bannerItems, "Mobile Homepage Banner 6");

        //Mobile Tile Bannerify
        bannerContainer = jQuery('#homepageTab-content-homepage');
        bannerItems = '.homepageBanner';
        segMobileTileBannerifyHandler(bannerContainer, bannerItems, "Mobile Homepage Tile");
      }, 600);
    },
    "Category Page": function () {
      var bannerify = BannerifyIntegration(jQuery);
      bannerify.relationship(pageVariables.subCategory, "category");
    },
    "Product Page": function () {
      try {
        var a = setTimeout(function () {
          var productObj = {};
          if(window.hasOwnProperty("google_tag_params") && google_tag_params.prodid !==undefined){
          var productTemp = google_tag_params;
          var categoryTemp = [];
          if (window.hasOwnProperty("orientation") === false) {
            // Gather information about the product
            productObj["brand"] = productTemp["pbrand"][0] || "";
            productObj["title"] = productTemp["pname"][0];
            productObj["productId"] = productTemp["prodid"][0];
            productObj["image"] = jQuery(".detail_l .gallery_l a").eq(0).find("img").attr("src") !== undefined ? helperFunctions.setProtocol(jQuery(".detail_l .gallery_l a").eq(0).find("img").attr("src")) : "";
            productObj["price"] = helperFunctions.priceFormatter(jQuery(".productPriceInfo-mainPrice bdi[itemprop=price]:first").text(), [",", ""], helperFunctions.languageConf.currency);
            if (jQuery("#other-color-products-container a").length > 1) { //if variants exists
              var colors = jQuery("#other-color-products-container").find("a");
                  productObj["groupId"] = jQuery("#other-color-products-container").attr("data-brand-id") + jQuery("#other-color-products-container").attr("data-provider-code");
            }

            if (helperFunctions.priceFormatter(jQuery(".brand-badge span").text(), "TL") !== 0) {
              var specialPrice = helperFunctions.priceFormatter(jQuery(".brand-badge span").text());
            }

            if(helperFunctions.languageConf &&  helperFunctions.languageConf.currency){

              productObj["oldPrice"] = helperFunctions.priceFormatter(jQuery(".productPriceInfo-alternatePrice bdi:first").text(), [",", ""], helperFunctions.languageConf.currency) || "";
            var tmpPrice = helperFunctions.priceFormatter(jQuery(".detail_r .price-container span[itemprop='price']").text(), [], helperFunctions.languageConf.currency);
            if (!productObj["oldPrice"] && productObj["price"] !== tmpPrice) {
              productObj["oldPrice"] = tmpPrice
            }

          }
            productObj["inStock"] = jQuery("span[itemprop='availability']").attr("content") === "in_stock" ? true : false;
            productObj["productUrl"] = document.URL !== undefined ? helperFunctions.setProtocol(document.URL) : "";
            productObj["labels"] = [];
            productObj["noUpdate"] = ["image","price","oldPrice","category"];

            productObj["params"] = {
              "psize": productTemp["psize"][0] || "",
              //"plang": productTemp["plang"][0] || "",
              'specialPrice': specialPrice
            };

            if (jQuery("#other-color-products-container").length) {
              productObj["colors"] = [jQuery("#other-color-products-container").data("color")];
            }

            for (var i = 0; i < jQuery("#breadcrumb-bar a").length; i++) {
              categoryTemp.push(jQuery("#breadcrumb-bar a").eq(i).text());
            }
            categoryTemp.shift();

            productObj["category"] = "";
            productObj["categories"] = categoryTemp;

            for (var i = 0; i < jQuery(".tag-container .seo-tag").length; i++) {
              productObj["labels"].push(jQuery(".tag-container .seo-tag").eq(i).text());
            }

          } else {
            // Gather information about the product
            productObj["productId"] = productTemp["prodid"][0];
            productObj["noUpdate"] = true;
          }
          if (parseFloat(productObj["price"]) > parseFloat(productObj["oldPrice"]) || parseFloat(productObj["oldPrice"]) === 0 || (parseFloat(productObj["oldPrice"]) === parseFloat(productObj["price"]))) {
            delete productObj["oldPrice"];
          }
          // Send product view event
          segmentifyEvents.viewProduct(productObj);

          var bannerify = BannerifyIntegration(jQuery);
          bannerify.relationship(productObj["productId"], "product");
         } }, 300);
      } catch (e) {}
    },
    "Search Page": function () {},
    "404 Page": function () {},
    "Basket Page": function () {
      try {
        var basketAmount = "";
        var basketProducts = [];
        var giftProducts = ["213143"];

        if (window.hasOwnProperty("orientation") === false) {
          basketProducts = window.segBasketObject.products;
          basketAmount = window.segBasketObject.total;
          /*  basketAmount = helperFunctions.priceFormatter(jQuery(".receipt .total strong").text(), [",", "."], helperFunctions.languageConf.currency);
  
            for (var i = 0; i < LocalStorageBasketItemsArray.length; i++) {
              basketProducts.push({
                'productId': LocalStorageBasketItemsArray[i].item.toString(),
                'quantity': LocalStorageBasketItemsArray[i].quantity.toString(),
                'price': LocalStorageBasketItemsArray[i].price.toString()
              });
            }
            */
        } else if (window.hasOwnProperty("orientation") === true && window.hasOwnProperty("google_tag_params")) {
          basketAmount = helperFunctions.priceFormatter(jQuery(".basketPageFixedFooter-priceValue").text().replace(",", "."));
         
          var productTemp = google_tag_params;


          for (var i = 0; i < productTemp["prodid"].length; i++) {
            if (giftProducts.indexOf(productTemp["prodid"][i]) < 0 && parseFloat(productTemp["pvalue"][i]) > 0) {
              var quantity = jQuery(".basketProducts .basketProducts-item").eq(i).find(".basketProducts-itemQuantityTextNumber").text().trim();
              if (quantity === "") {
                quantity = "1";
              }
              basketProducts.push({
                'productId': productTemp["prodid"][i],
                'quantity': quantity,
                'price': productTemp["pvalue"][i]
              });
            }
          }
        } else {
          basketAmount = "";
        }
        // Put basket event information into a variable
        var basketInfo = {
          "totalPrice": basketAmount,
          "productList": basketProducts
        };

        // Send checkout basket event
        segmentifyEvents.checkoutBasket(basketInfo);
      } catch (e) {}
    },
    "Checkout Success Page": function () {
      try {
        if (typeof segBasketObject !== "undefined") {
          var basketObj = window.segBasketObject;
          var orderNo = basketObj["orderId"];
          var products = basketObj["products"];
          var purchaseAmount = basketObj["total"];
          var purchaseProducts = [];
          for (var i = 0; i < products.length; i++) {
            purchaseProducts.push({
              'productId': products[i].productId,
              'quantity': products[i].quantity,
              'price': helperFunctions.priceFormatter(products[i].price)
            });
          }
          var purchaseInfo = {
            "orderNo": orderNo,
            "totalPrice": purchaseAmount,
            "productList": purchaseProducts
          };
        }
      } catch (err) {
        window.segErr = err;
      }
      // Send checkout purchase event
      segmentifyEvents.checkoutPurchase(purchaseInfo);
    }

  };

  return {
    init: init,
    events: segmentifyEvents,
    helpers: helperFunctions
  };
};

// Call Wait Function at the bottom of tne script

/* DateTime: 2020-03-04, 15:46:02 */
function initializeMustache(Y){var t=Object.prototype.toString,b=Array.isArray||function(e){return"[object Array]"===t.call(e)};function m(e){return"function"==typeof e}function E(e){return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function o(e,t){return null!=e&&"object"==typeof e&&t in e}var a=RegExp.prototype.test;var r=/\S/;function I(e){return t=r,n=e,!a.call(t,n);var t,n}var n={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};var O=/\s*/,C=/\s+/,w=/\s*=/,A=/\s*\}/,T=/#|\^|\/|>|\{|&|=|!/;function i(e,t){if(!e)return[];var n,a,r,i=[],s=[],o=[],c=!1,m=!1;function _(){if(c&&!m)for(;o.length;)delete s[o.pop()];else o=[];m=c=!1}function g(e){if("string"==typeof e&&(e=e.split(C,2)),!b(e)||2!==e.length)throw new Error("Invalid tags: "+e);n=new RegExp(E(e[0])+"\\s*"),a=new RegExp("\\s*"+E(e[1])),r=new RegExp("\\s*"+E("}"+e[1]))}g(t||Y.tags);for(var d,f,l,u,p,S,v=new L(e);!v.eos();){if(d=v.pos,l=v.scanUntil(n))for(var y=0,h=l.length;y<h;++y)I(u=l.charAt(y))?o.push(s.length):m=!0,s.push(["text",u,d,d+1]),d+=1,"\n"===u&&_();if(!v.scan(n))break;if(c=!0,f=v.scan(T)||"name",v.scan(O),"="===f?(l=v.scanUntil(w),v.scan(w),v.scanUntil(a)):"{"===f?(l=v.scanUntil(r),v.scan(A),v.scanUntil(a),f="&"):l=v.scanUntil(a),!v.scan(a))throw new Error("Unclosed tag at "+v.pos);if(p=[f,l,d,v.pos],s.push(p),"#"===f||"^"===f)i.push(p);else if("/"===f){if(!(S=i.pop()))throw new Error('Unopened section "'+l+'" at '+d);if(S[1]!==l)throw new Error('Unclosed section "'+S[1]+'" at '+d)}else"name"===f||"{"===f||"&"===f?m=!0:"="===f&&g(l)}if(S=i.pop())throw new Error('Unclosed section "'+S[1]+'" at '+v.pos);return function(e){for(var t,n=[],a=n,r=[],i=0,s=e.length;i<s;++i)switch((t=e[i])[0]){case"#":case"^":a.push(t),r.push(t),a=t[4]=[];break;case"/":r.pop()[5]=t[2],a=0<r.length?r[r.length-1][4]:n;break;default:a.push(t)}return n}(function(e){for(var t,n,a=[],r=0,i=e.length;r<i;++r)(t=e[r])&&("text"===t[0]&&n&&"text"===n[0]?(n[1]+=t[1],n[3]=t[3]):(a.push(t),n=t));return a}(s))}function L(e){this.string=e,this.tail=e,this.pos=0}function s(e,t){this.view=e,this.cache={".":this.view},this.parent=t}function e(){this.cache={}}L.prototype.eos=function(){return""===this.tail},L.prototype.scan=function(e){var t=this.tail.match(e);if(!t||0!==t.index)return"";var n=t[0];return this.tail=this.tail.substring(n.length),this.pos+=n.length,n},L.prototype.scanUntil=function(e){var t,n=this.tail.search(e);switch(n){case-1:t=this.tail,this.tail="";break;case 0:t="";break;default:t=this.tail.substring(0,n),this.tail=this.tail.substring(n)}return this.pos+=t.length,t},s.prototype.push=function(e){return new s(e,this)},s.prototype.lookup=function(e){var t,n=this.cache;if(n.hasOwnProperty(e))t=n[e];else{for(var a,r,i=this,s=!1;i;){if(0<e.indexOf("."))for(t=i.view,a=e.split("."),r=0;null!=t&&r<a.length;)r===a.length-1&&(s=o(t,a[r])),t=t[a[r++]];else t=i.view[e],s=o(i.view,e);if(s)break;i=i.parent}n[e]=t}return m(t)&&(t=t.call(this.view)),t},e.prototype.clearCache=function(){this.cache={}},e.prototype.parse=function(e,t){var n=this.cache,a=n[e];return null==a&&(a=n[e]=i(e,t)),a},e.prototype.render=function(e,t,n){var a=this.parse(e),r=t instanceof s?t:new s(t);return this.renderTokens(a,r,n,e)},e.prototype.renderTokens=function(e,t,n,a){for(var r,i,s,o="",c=0,m=e.length;c<m;++c)s=void 0,"#"===(i=(r=e[c])[0])?s=this.renderSection(r,t,n,a):"^"===i?s=this.renderInverted(r,t,n,a):">"===i?s=this.renderPartial(r,t,n,a):"&"===i?s=this.unescapedValue(r,t):"name"===i?s=this.escapedValue(r,t):"text"===i&&(s=this.rawValue(r)),void 0!==s&&(o+=s);return o},e.prototype.renderSection=function(e,t,n,a){var r=this,i="",s=t.lookup(e[1]);if(s){if(b(s))for(var o=0,c=s.length;o<c;++o)i+=this.renderTokens(e[4],t.push(s[o]),n,a);else if("object"==typeof s||"string"==typeof s||"number"==typeof s)i+=this.renderTokens(e[4],t.push(s),n,a);else if(m(s)){if("string"!=typeof a)throw new Error("Cannot use higher-order sections without the original template");null!=(s=s.call(t.view,a.slice(e[3],e[5]),function(e){return r.render(e,t,n)}))&&(i+=s)}else i+=this.renderTokens(e[4],t,n,a);return i}},e.prototype.renderInverted=function(e,t,n,a){var r=t.lookup(e[1]);if(!r||b(r)&&0===r.length)return this.renderTokens(e[4],t,n,a)},e.prototype.renderPartial=function(e,t,n){if(n){var a=m(n)?n(e[1]):n[e[1]];return null!=a?this.renderTokens(this.parse(a),t,n,a):void 0}},e.prototype.unescapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return n},e.prototype.escapedValue=function(e,t){var n=t.lookup(e[1]);if(null!=n)return Y.escape(n)},e.prototype.rawValue=function(e){return e[1]},Y.name="mustache.js",Y.version="2.2.1",Y.tags=["{{","}}"];var c=new e;Y.clearCache=function(){return c.clearCache()},Y.parse=function(e,t){return c.parse(e,t)},Y.render=function(e,t,n){if("string"!=typeof e)throw new TypeError('Invalid template! Template should be a "string" but "'+(b(a=e)?"array":typeof a)+'" was given as the first argument for mustache#render(template, view, partials)');var a;return c.render(e,t,n)},Y.to_html=function(e,t,n,a){var r=Y.render(e,t,n);if(!m(a))return r;a(r)},Y.escape=function(e){return String(e).replace(/[&<>"'`=\/]/g,function(e){return n[e]})},Y.Scanner=L,Y.Context=s,Y.Writer=e}!function(e){function s(n){function e(e){var t=n.match(e);return t&&1<t.length&&t[1]||""}function t(e){var t=n.match(e);return t&&1<t.length&&t[2]||""}var a,r=e(/(ipod|iphone|ipad)/i).toLowerCase(),i=!/like android/i.test(n)&&/android/i.test(n),s=/nexus\s*[0-6]\s*/i.test(n),o=!s&&/nexus\s*[0-9]+/i.test(n),c=/CrOS/.test(n),m=/silk/i.test(n),_=/sailfish/i.test(n),g=/tizen/i.test(n),d=/(web|hpw)os/i.test(n),f=/windows phone/i.test(n),l=(/SamsungBrowser/i.test(n),!f&&/windows/i.test(n)),u=!r&&!m&&/macintosh/i.test(n),p=!i&&!_&&!g&&!d&&/linux/i.test(n),S=t(/edg([ea]|ios)\/(\d+(\.\d+)?)/i),v=e(/version\/(\d+(\.\d+)?)/i),y=/tablet/i.test(n)&&!/tablet pc/i.test(n),h=!y&&/[^-]mobi/i.test(n),Y=/xbox/i.test(n);/opera/i.test(n)?a={name:"Opera",opera:I,version:v||e(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)}:/opr\/|opios/i.test(n)?a={name:"Opera",opera:I,version:e(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i)||v}:/SamsungBrowser/i.test(n)?a={name:"Samsung Internet for Android",samsungBrowser:I,version:v||e(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)}:/coast/i.test(n)?a={name:"Opera Coast",coast:I,version:v||e(/(?:coast)[\s\/](\d+(\.\d+)?)/i)}:/yabrowser/i.test(n)?a={name:"Yandex Browser",yandexbrowser:I,version:v||e(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)}:/ucbrowser/i.test(n)?a={name:"UC Browser",ucbrowser:I,version:e(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)}:/mxios/i.test(n)?a={name:"Maxthon",maxthon:I,version:e(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)}:/epiphany/i.test(n)?a={name:"Epiphany",epiphany:I,version:e(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)}:/puffin/i.test(n)?a={name:"Puffin",puffin:I,version:e(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)}:/sleipnir/i.test(n)?a={name:"Sleipnir",sleipnir:I,version:e(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)}:/k-meleon/i.test(n)?a={name:"K-Meleon",kMeleon:I,version:e(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)}:f?(a={name:"Windows Phone",osname:"Windows Phone",windowsphone:I},S?(a.msedge=I,a.version=S):(a.msie=I,a.version=e(/iemobile\/(\d+(\.\d+)?)/i))):/msie|trident/i.test(n)?a={name:"Internet Explorer",msie:I,version:e(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:c?a={name:"Chrome",osname:"Chrome OS",chromeos:I,chromeBook:I,chrome:I,version:e(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:/edg([ea]|ios)/i.test(n)?a={name:"Microsoft Edge",msedge:I,version:S}:/vivaldi/i.test(n)?a={name:"Vivaldi",vivaldi:I,version:e(/vivaldi\/(\d+(\.\d+)?)/i)||v}:_?a={name:"Sailfish",osname:"Sailfish OS",sailfish:I,version:e(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(n)?a={name:"SeaMonkey",seamonkey:I,version:e(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel|fxios/i.test(n)?(a={name:"Firefox",firefox:I,version:e(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(n)&&(a.firefoxos=I,a.osname="Firefox OS")):m?a={name:"Amazon Silk",silk:I,version:e(/silk\/(\d+(\.\d+)?)/i)}:/phantom/i.test(n)?a={name:"PhantomJS",phantom:I,version:e(/phantomjs\/(\d+(\.\d+)?)/i)}:/slimerjs/i.test(n)?a={name:"SlimerJS",slimer:I,version:e(/slimerjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(n)||/rim\stablet/i.test(n)?a={name:"BlackBerry",osname:"BlackBerry OS",blackberry:I,version:v||e(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:d?(a={name:"WebOS",osname:"WebOS",webos:I,version:v||e(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},/touchpad\//i.test(n)&&(a.touchpad=I)):/bada/i.test(n)?a={name:"Bada",osname:"Bada",bada:I,version:e(/dolfin\/(\d+(\.\d+)?)/i)}:g?a={name:"Tizen",osname:"Tizen",tizen:I,version:e(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||v}:/qupzilla/i.test(n)?a={name:"QupZilla",qupzilla:I,version:e(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i)||v}:/chromium/i.test(n)?a={name:"Chromium",chromium:I,version:e(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i)||v}:/chrome|crios|crmo/i.test(n)?a={name:"Chrome",chrome:I,version:e(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:i?a={name:"Android",version:v}:/safari|applewebkit/i.test(n)?(a={name:"Safari",safari:I},v&&(a.version=v)):r?(a={name:"iphone"==r?"iPhone":"ipad"==r?"iPad":"iPod"},v&&(a.version=v)):a=/googlebot/i.test(n)?{name:"Googlebot",googlebot:I,version:e(/googlebot\/(\d+(\.\d+))/i)||v}:{name:e(/^(.*)\/(.*) /),version:t(/^(.*)\/(.*) /)},!a.msedge&&/(apple)?webkit/i.test(n)?(/(apple)?webkit\/537\.36/i.test(n)?(a.name=a.name||"Blink",a.blink=I):(a.name=a.name||"Webkit",a.webkit=I),!a.version&&v&&(a.version=v)):!a.opera&&/gecko\//i.test(n)&&(a.name=a.name||"Gecko",a.gecko=I,a.version=a.version||e(/gecko\/(\d+(\.\d+)?)/i)),a.windowsphone||!i&&!a.silk?!a.windowsphone&&r?(a[r]=I,a.ios=I,a.osname="iOS"):u?(a.mac=I,a.osname="macOS"):Y?(a.xbox=I,a.osname="Xbox"):l?(a.windows=I,a.osname="Windows"):p&&(a.linux=I,a.osname="Linux"):(a.android=I,a.osname="Android");var b="";a.windows?b=function(e){switch(e){case"NT":return"NT";case"XP":return"XP";case"NT 5.0":return"2000";case"NT 5.1":return"XP";case"NT 5.2":return"2003";case"NT 6.0":return"Vista";case"NT 6.1":return"7";case"NT 6.2":return"8";case"NT 6.3":return"8.1";case"NT 10.0":return"10";default:return}}(e(/Windows ((NT|XP)( \d\d?.\d)?)/i)):a.windowsphone?b=e(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):a.mac?b=(b=e(/Mac OS X (\d+([_\.\s]\d+)*)/i)).replace(/[_\s]/g,"."):r?b=(b=e(/os (\d+([_\s]\d+)*) like mac os x/i)).replace(/[_\s]/g,"."):i?b=e(/android[ \/-](\d+(\.\d+)*)/i):a.webos?b=e(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):a.blackberry?b=e(/rim\stablet\sos\s(\d+(\.\d+)*)/i):a.bada?b=e(/bada\/(\d+(\.\d+)*)/i):a.tizen&&(b=e(/tizen[\/\s](\d+(\.\d+)*)/i)),b&&(a.osversion=b);var E=!a.windows&&b.split(".")[0];return y||o||"ipad"==r||i&&(3==E||4<=E&&!h)||a.silk?a.tablet=I:(h||"iphone"==r||"ipod"==r||i||s||a.blackberry||a.webos||a.bada)&&(a.mobile=I),a.msedge||a.msie&&10<=a.version||a.yandexbrowser&&15<=a.version||a.vivaldi&&1<=a.version||a.chrome&&20<=a.version||a.samsungBrowser&&4<=a.version||a.firefox&&20<=a.version||a.safari&&6<=a.version||a.opera&&10<=a.version||a.ios&&a.osversion&&6<=a.osversion.split(".")[0]||a.blackberry&&10.1<=a.version||a.chromium&&20<=a.version?a.a=I:a.msie&&a.version<10||a.chrome&&a.version<20||a.firefox&&a.version<20||a.safari&&a.version<6||a.opera&&a.version<10||a.ios&&a.osversion&&a.osversion.split(".")[0]<6||a.chromium&&a.version<20?a.c=I:a.x=I,a}function a(e){return e.split(".").length}function r(e,t){var n,a=[];if(Array.prototype.map)return Array.prototype.map.call(e,t);for(n=0;n<e.length;n++)a.push(t(e[n]));return a}function o(e){for(var n=Math.max(a(e[0]),a(e[1])),t=r(e,function(e){var t=n-a(e);return r((e+=new Array(1+t).join(".0")).split("."),function(e){return new Array(20-e.length).join("0")+e}).reverse()});0<=--n;){if(t[0][n]>t[1][n])return 1;if(t[0][n]!==t[1][n])return-1;if(0===n)return 0}}function i(e,t,n){var a=c;"string"==typeof t&&(n=t,t=void 0),void 0===t&&(t=!1),n&&(a=s(n));var r=""+a.version;for(var i in e)if(e.hasOwnProperty(i)&&a[i]){if("string"!=typeof e[i])throw new Error("Browser version in the minVersion map should be a string: "+i+": "+String(e));return o([r,e[i]])<0}return t}var I,c;e.bowser=(I=!0,(c=s("undefined"!=typeof navigator&&navigator.userAgent||"")).test=function(e){for(var t=0;t<e.length;++t){var n=e[t];if("string"==typeof n&&n in c)return!0}return!1},c.isUnsupportedBrowser=i,c.compareVersions=o,c.check=function(e,t,n){return!i(e,t,n)},c._detect=s,c)}(this),function(){var _SgmntfY_=window._SgmntfY_={LOG_LEVELS:{SILENT:0,ERROR:1,WARN:2,INFO:3,DEBUG:4},_variables:{jq:window.SegmentifyjQuery||null,mustache:null,domain:window.SegmentifyDomain||window.location.hostname,ua:{agentString:window.navigator.userAgent,type:null,name:null,version:null,os:null,osversion:null},userStorageKey:"_sgf_user_id",sessionStorageKey:"_sgf_session_id",testMode:"_sgf_test_mode",tracking:"_sgf_tracking",storage:{delayedActions:{key:"_sgf_delayed_actions",local:!0},delayedCampaigns:{key:"_sgf_delayed_campaigns",local:!0},retryQueue:{key:"_sgf_rq",local:!0},extensionStatus:{key:"segmentifyExtension",local:!0},clickedBanners:{key:"_sgf_clicked_banners",local:!1},nextPageQueue:{key:"_sgf_npq",local:!0},user:{key:"_sgf_user_id",local:!1},session:{key:"_sgf_session_id",local:!1}},logLevel:"ERROR",segmentifyObj:null,recommendedProducts:[],recommendedPromotions:[],waitingKeys:!1,apiKey:null,skipProductDetail:{device:[]},offerRecommendedProducts:!1,offerRecommendedPromotions:!1,runTimer:null,initTimer:null,initTryCount:0,initTryLimit:50,isUnload:!1,cssPreload:!1,constants:{frequency:100,redirectDelay:1e3,retryLimit:3,eventTimeout:10,clickedBannersLimit:20,recommendationSelectorFindLimit:50},ga:{enabled:!1},requiredParams:{PAGE_VIEW:[],PRODUCT_VIEW:["productId"],BASKET_OPERATIONS:["productId","basketId","step"],CHECKOUT:["totalPrice","basketId","step"],USER_OPERATIONS:["step"],FORM:["formName","fields"],CUSTOM_EVENT:["type"],INTERACTION:["type"],BANNER_OPERATIONS:["type","title","group","order"],BANNER_GROUP_VIEW:["group"],INTERNAL_BANNER_GROUP:["group"],USER_CHANGE:["oldUserId"],PROMOTION:["type","code"]},optionalParams:{PAGE_VIEW:["category","subCategory"],PRODUCT_VIEW:["title","url","mUrl","image","imageXS","imageS","imageM","imageL","imageXL","additionalImages","category","categories","price","oldPrice","specialPrice","lastUpdateTime","inStock","stockCount","stockRatio","stockStatus","brand","gender","labels","sizes","colors","publishTime","source","noUpdate","activeBanners","groupId"],BASKET_OPERATIONS:["price","quantity","activeBanners"],CHECKOUT:["productList","orderNo","paymentType","activeBanners","cartUrl","totalDiscount","discounts","shipment","tax"],USER_OPERATIONS:["username","fullName","phone","gender","birthDate","segments","memberSince","service","isRegistered","isLogin","location","emailNtf","mailTest","pushTest","custom"],FORM:[],CUSTOM_EVENT:[],INTERACTION:["interactionId","instanceId"],BANNER_OPERATIONS:["productId","category","brand","label"],BANNER_GROUP_VIEW:[],INTERNAL_BANNER_GROUP:["banners"],USER_CHANGE:[],PROMOTION:["title","url","mUrl","image","mImage","startDate","endDate","categories","brands","labels","productIds","publishTime"]},segmentifyApiUrl:"//rest.segmentify.com/",segmentifyCDNUrl:"//cdn.segmentify.com/",jQueryUrl:"//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",dataLayer:"sgfLayer",consumeDataLayer:!0,dataLayerConfig:{},categoryHierarchy:!1,disableNextPage:!1,language:"EN",currency:"",region:""},_loadJavascript:function(e,t,n){var a=document.createElement("script");return a.type="text/javascript",a.async=t,n&&"function"==typeof n&&(void 0!==a.onreadystatechange?a.onreadystatechange=function(){"loaded"!==this.readyState&&"complete"!==this.readyState||(n(),a.onreadystatechange=null)}:a.onload=n),a.src=e,document.getElementsByTagName("head")[0].appendChild(a),a},_loadCSS:function(e,t){var n=document.createElement("link");return n.type="text/css",_SgmntfY_._variables.cssPreload?(n.rel="preload",n.as="style"):n.rel="stylesheet",n.media="screen",t&&"function"==typeof t&&(void 0!==n.onreadystatechange?n.onreadystatechange=function(){"loaded"!==this.readyState&&"complete"!==this.readyState||(t(),n.onreadystatechange=null)}:n.onload=t),n.href=e,document.getElementsByTagName("head")[0].appendChild(n),n},_actions:{_notificationWindow:function(params){var config={title:params.notificationTitle,vertical:"middle",horizontal:"center"},title=params.notificationTitle;switch(params.windowPosition){case"top":config.vertical="top";break;case"bottom":config.vertical="bottom";break;case"left":config.horizontal="left";break;case"right":config.horizontal="right";break;case"top-left":config.vertical="top",config.horizontal="left";break;case"top-right":config.vertical="top",config.horizontal="right";break;case"bottom-left":config.vertical="bottom",config.horizontal="left";break;case"bottom-right":config.vertical="bottom",config.horizontal="right"}var outerHtml=_SgmntfY_._getJq()('<div class="seg-popup seg-[[vertical]]-[[horizontal]] segFadeInUp fancybox-segmentify"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>'),notificationBody=_SgmntfY_._getJq()('<div class="fancybox-body" />').appendTo(outerHtml.find(".fancybox-inner"));params.html instanceof _SgmntfY_._getJq()?notificationBody.append(params.html):notificationBody.html(params.html);for(var button_overlay=_SgmntfY_._getJq()("<div />").appendTo(notificationBody),buttons=params.buttons||[],i=0;i<buttons.length;i++)_SgmntfY_._getJq()('<button data-newWindow="'+buttons[i].newWindow+'" data-target="'+buttons[i].buttonUrl+'" class="fancybox-button '+buttons[i].buttonColor+'">'+buttons[i].buttonTitle+"</button>").appendTo(button_overlay);"seamless"===params.windowStyle&&(title&&_SgmntfY_._getJq()('<div class="overlay-area-title" ><span>'+title+"</span></div>").appendTo(notificationBody),button_overlay.addClass("overlay-area-buttons").addClass("right"),title=null),"false"===params.isModal&&_SgmntfY_._getJq()('<span class="seg-popup-close"></span>').appendTo(outerHtml);var renderedHtml=_SgmntfY_._getMustache().render(outerHtml.prop("outerHTML"),config);_SgmntfY_._getJq()("body").prepend(renderedHtml),"true"===params.overlay&&(_SgmntfY_._getJq()('<div class="seg-popup-overlay"></div>').prependTo(_SgmntfY_._getJq()("body")),_SgmntfY_._getJq()(".seg-popup-overlay").show()),"false"===params.isModal&&_SgmntfY_._getJq()(".seg-popup-close").bind("click",function(){var e=_SgmntfY_._getJq()(this);e.parent(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),window.setTimeout(function(){e.parent(".seg-popup").remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},1e3),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"close",instanceId:params.instanceId,interactionId:params.instanceId})}),params.cssCode&&_SgmntfY_._getJq()("<style />").html(params.cssCode).prependTo(_SgmntfY_._getJq()("body"));try{params.javascriptCode&&eval(params.javascriptCode)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing javascript code: "+e)}if(_SgmntfY_._getJq()(".seg-popup").find("form")){var $inner=_SgmntfY_._getJq()(".seg-popup .fancybox-body"),$form=$inner.find("form").eq(0);$form.bind("submit",function(e){e.preventDefault(),_SgmntfY_.LOG_MESSAGE("DEBUG","Popup Form button click for actionId: "+params.actionId),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"submit",interactionId:params.formName,instanceId:params.instanceId}),_SgmntfY_._variables.segmentifyObj("user:form",{formName:params.formName,fields:$form.sgmSerializeForm()}),$inner.html(params.successHtml),setTimeout(function(){$inner.parents(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),$inner.parents(".seg-popup").remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},1e3)})}var redirectFn=function(e){function t(e,t){window.open(e.data("target"),t),e.parents(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),window.setTimeout(function(){e.parent(".seg-popup").remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},1e3)}"true"===e.data("newwindow")||!0===e.data("newwindow")?t(e,"_blank"):setTimeout(function(){t(e,"_self")},_SgmntfY_._variables.constants.redirectDelay)};_SgmntfY_._getJq()(".seg-popup .fancybox-button").click(function(){_SgmntfY_.LOG_MESSAGE("DEBUG","Notification Window button click for actionId: "+params.actionId),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"click",interactionId:_SgmntfY_._getJq()(this).text(),instanceId:params.instanceId}),redirectFn(_SgmntfY_._getJq()(this))}),_SgmntfY_._getJq()(".seg-popup a img").bind("click",function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"click",instanceId:params.instanceId,interactionId:params.instanceId})}),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",instanceId:params.instanceId,interactionId:params.instanceId})},notificationBanner:function(t){var n=[];try{t.buttons&&(n=JSON.parse(t.buttons))}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Cannot parse buttons json, str: "+t.buttons),n=[]}t.buttons=n,t.html=_SgmntfY_._getJq()('<div><a href="'+t.redirectUrl+'"><img id="sgm_img" src="'+t.imageUrl+'"></a></div>'),_SgmntfY_._actions._notificationWindow(t)},notificationMessage:function(t){var n=[];try{t.buttons&&(n=JSON.parse(t.buttons))}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Cannot parse buttons json, str: "+t.buttons),n=[]}t.html=t.notificationText,t.buttons=n,_SgmntfY_._actions._notificationWindow(t)},visitorForm:function(e){switch(e.actionType){case"INPAGE_WIDGET":(function e(){var t=this.params,n=this.selectorCount,a=t.selector;if(a&&_SgmntfY_._getJq()(a).length)try{a.addClass("sgm-recommendation sgm-clearcss").html(t.formHtml);var r=a.find("form").eq(0);r.submit(function(e){e.preventDefault(),_SgmntfY_.LOG_MESSAGE("DEBUG","In-page Form button click for actionId: "+t.actionId),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"submit",interactionId:t.formName,instanceId:t.instanceId}),_SgmntfY_._variables.segmentifyObj("user:form",{formName:t.formName,fields:r.sgmSerializeForm()}),setTimeout(function(){a.html(t.successHtml)},1e3)})}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Error in filling target element["+t.selector+"] with visitor form: "+e)}else if(_SgmntfY_.LOG_MESSAGE("WARN","Error in finding target element["+target+"], element does not exist"),n<_SgmntfY_._variables.constants.recommendationSelectorFindLimit){++this.selectorCount;var i=e.bind(this);setTimeout(i,100)}}).bind({params:e,selectorCount:1})();break;case"POPUP_WINDOW":default:e.html=e.formHtml,_SgmntfY_._actions._notificationWindow(e)}},recommendProducts:function(params,request){var previousMetadata={productId:request.originalParams.productId,productUrl:request.originalParams.productUrl,instanceId:params.instanceId};function dynamicItemKey(e){var t=e.recommendationSource;return void 0!==e.timeFrame&&_SgmntfY_._isNotEmpty(e.timeFrame)&&(t+="|"+e.timeFrame,void 0!==e.score&&_SgmntfY_._isNotEmpty(e.score)&&(t+="|"+e.score)),t}function checkDynamicItemCount(e,t){for(var n=0;n<e.length;++n)if(dynamicItemKey(e[n])===t)return e[n].itemCount;return null}function checkProductInList(e,t){for(var n=0;n<e.length;n++)if(e[n].productId==t)return 1}function isElemVisible(e){try{if(_SgmntfY_._exists(e)&&"none"!==e.css("display")){var t=_SgmntfY_._getJq()(window),n=t.scrollTop(),a=n+t.height();e instanceof HTMLElement?e=_SgmntfY_._getJq()(e):e instanceof HTMLCollection&&(e=_SgmntfY_._getJq()(e[0]));var r=e.offset().top;return r+100<=a&&n<=r}return}catch(e){return}}function decodeHtml(e){var t=document.createElement("textarea");return t.innerHTML=e,t.value}function checkSelectorAndRender(){var params=this.params,selectorCount=this.selectorCount,target=params.selector;if(target&&_SgmntfY_._getJq()(target).length){var renderIdx=0,reConf={title:notificationTitle,products:productList,index:function(){return++renderIdx},discount:function(){try{var e=this.price,t=this.oldPrice;if(!e||!t||e==t)return null;var n=100-100*e/t;return 0<n&&Math.round(n)}catch(e){return null}},commaFormatPrice:function(){return this.toFixed(2).toString().replace(/\./g,",")},dotFormatPrice:function(){return this.toFixed(2).toString()}};try{if(params.preJsCode){eval(params.preJsCode);var retVal=preRenderConf(reConf);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing product recommendation pre js code: "+e)}_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",interactionId:params.actionId,instanceId:params.instanceId}),reConf.brandingEnabled&&(reConf.title+='<a target="_blank" class="seg-rec-logo" href="//www.segmentify.com">Recommended by <img src="//cdn.segmentify.com/images/sgm-logo.svg" /></a>');var renderedHtml=_SgmntfY_._getMustache().render(params.recommendationTemplate,reConf);try{var targetElement=_SgmntfY_._getJq()(target).first();if("SELF"===params.insertType)targetElement.html(renderedHtml),wvCB&&wvCB(targetElement);else{var $div=_SgmntfY_._getJq()("<div/>",{class:"seg-reco-wrapper seg-clear"});"AFTER"===params.insertType||"BEFORE"===params.insertType?"AFTER"===params.insertType?$div.html(renderedHtml).insertAfter(targetElement):$div.html(renderedHtml).insertBefore(targetElement):"APPEND"!==params.insertType&&"PREPEND"!==params.insertType||("APPEND"===params.insertType?$div.html(renderedHtml).appendTo(targetElement):$div.html(renderedHtml).prependTo(targetElement)),wvCB&&wvCB($div)}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in filling target element["+target+"] with product recommendations: "+e)}try{params.postJsCode&&eval(params.postJsCode)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing product recommendation post js code: "+e)}}else if(_SgmntfY_.LOG_MESSAGE("WARN","Error in finding target element["+target+"], element does not exist"),selectorCount<_SgmntfY_._variables.constants.recommendationSelectorFindLimit){++this.selectorCount;var binded=checkSelectorAndRender.bind(this);setTimeout(binded,100)}}var productList=[],recommendedProducts=params.recommendedProducts||{},dynamicItems=JSON.parse(params.dynamicItems)||[];if("SHUFFLE"===params.ordering){function allNull(e){for(var t in e)if(e.hasOwnProperty(t)&&(void 0!==e[t]||null!==e[t]))return!1;return!0}function arrayRandom(){return parseInt(100*Math.random())}function randomInt(e,t){return Math.floor(Math.random()*(t-e))+e}var itemCounts=[],dynamicLengths=[];for(var idx in dynamicItems)if(dynamicItems.hasOwnProperty(idx)){itemCounts.push(parseInt(dynamicItems[idx].itemCount||0));var source=dynamicItemKey(dynamicItems[idx]);recommendedProducts.hasOwnProperty(source)?dynamicLengths.push(recommendedProducts[source].length):dynamicLengths.push(0)}var firstLevel=[],firstLevelTotal=itemCounts.reduce(function(e,t){return e+t},0);for(idx in itemCounts)if(itemCounts.hasOwnProperty(idx)){var _idx=parseInt(idx);if(_idx===itemCounts.length-1)firstLevel.push(100);else{var pct=parseInt(itemCounts[idx]/firstLevelTotal*100);0===_idx?firstLevel.push(pct):firstLevel.push(firstLevel[firstLevel.length-1]+pct)}}var secondLevel=[];for(var dl in dynamicLengths)if(dynamicLengths.hasOwnProperty(dl)){for(var len=dynamicLengths[dl],sumOfSquares=len*(len+1)*(2*len+1)/6,tmpArr=[],l=len;0<l;--l)1===l?tmpArr.push(100):(pct=parseInt(Math.pow(l,2)/sumOfSquares*100),l===len?tmpArr.push(pct):tmpArr.push(tmpArr[tmpArr.length-1]+pct));secondLevel.push(tmpArr)}for(var dynamicProducts=[],iteration=0;!(1e4<++iteration||dynamicProducts.length>=firstLevelTotal);){var allNullCheck=!0;for(idx in dynamicItems)if(dynamicItems.hasOwnProperty(idx)){source=dynamicItemKey(dynamicItems[idx]);var tmpCheck=!0;if(recommendedProducts.hasOwnProperty(source)&&(tmpCheck=allNull(recommendedProducts[source])),!tmpCheck){allNullCheck=!1;break}}if(allNullCheck)break;var rand=arrayRandom(),firstLevelIndex=-1;for(var fl in firstLevel)if(firstLevel.hasOwnProperty(fl)&&rand<firstLevel[fl]){firstLevelIndex=parseInt(fl);break}if(-1!==firstLevelIndex&&dynamicItems.hasOwnProperty(firstLevelIndex.toString())){source=dynamicItemKey(dynamicItems[firstLevelIndex]),rand=arrayRandom();var secondLevelIndex=-1;for(var sl in secondLevel[firstLevelIndex])if(secondLevel[firstLevelIndex].hasOwnProperty(sl)&&rand<secondLevel[firstLevelIndex][sl]){secondLevelIndex=parseInt(sl);break}if(-1!==secondLevelIndex&&recommendedProducts[source].hasOwnProperty(secondLevelIndex.toString())){var candidate=recommendedProducts[source].splice(secondLevelIndex,1)[0];if(null!=candidate){recommendedProducts[source].splice(secondLevelIndex,0,null);var eliminationFuncRetVal=!1;if(params.eliminationFunction){var func=_SgmntfY_._getObjectByString(window,params.eliminationFunction);if("function"==typeof func)try{eliminationFuncRetVal=func.call(null,candidate)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing product recommendation elimination js function: "+e)}}if(!eliminationFuncRetVal){candidate.name=decodeHtml(candidate.name);var sourceLastVisited="RECOMMENDATION_SOURCE_LAST_VISITED"===dynamicItems[firstLevelIndex].recommendationSource||"RECOMMENDATION_EVENT_DATA"===dynamicItems[firstLevelIndex].recommendationSource;switch(params.elimination){case"ELIMINATE_DUPLICATES":case"ELIMINATE_PREVIOUS":checkProductInList(productList,candidate.productId)||!sourceLastVisited&&_SgmntfY_._containsRecommendedProduct(candidate.productId)&&!_SgmntfY_._variables.offerRecommendedProducts||(productList.push(candidate),dynamicProducts.push(candidate),sourceLastVisited||_SgmntfY_._addRecommendedProduct(candidate.productId));break;case"NO_ELIMINATION":default:productList.push(candidate),dynamicProducts.push(candidate),sourceLastVisited||_SgmntfY_._addRecommendedProduct(candidate.productId)}}}}}}for(var i=0;i<recommendedProducts.RECOMMENDATION_SOURCE_STATIC_ITEMS.length;++i){var elm=recommendedProducts.RECOMMENDATION_SOURCE_STATIC_ITEMS[i];checkProductInList(productList,elm.productId)||productList.splice(randomInt(0,productList.length),0,elm)}}else{for(var missingCount=0,i=0;i<recommendedProducts.RECOMMENDATION_SOURCE_STATIC_ITEMS.length;++i){var elm=recommendedProducts.RECOMMENDATION_SOURCE_STATIC_ITEMS[i];checkProductInList(productList,elm.productId)||productList.push(elm)}for(var ri=0;ri<dynamicItems.length;++ri){var curRecommendationSource=dynamicItemKey(dynamicItems[ri]),curCatItemCount=parseInt(checkDynamicItemCount(dynamicItems,curRecommendationSource));if(isNaN(curCatItemCount)&&(curCatItemCount=0),recommendedProducts.hasOwnProperty(curRecommendationSource)&&curCatItemCount){missingCount+=curCatItemCount;for(var index=0,i=0;i<recommendedProducts[curRecommendationSource].length;++i){var elm=recommendedProducts[curRecommendationSource][i];if(elm.name=decodeHtml(elm.name),curCatItemCount<=index&&0===missingCount)break;var eliminationFnRetVal=!1;if(params.eliminationFunction){var fx=_SgmntfY_._getObjectByString(window,params.eliminationFunction);if("function"==typeof fx)try{eliminationFnRetVal=fx.call(null,elm)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing product recommendation elimination js function: "+e)}}if(!eliminationFnRetVal){var sourceLastVisited="RECOMMENDATION_SOURCE_LAST_VISITED"===dynamicItems[ri].recommendationSource||"RECOMMENDATION_EVENT_DATA"===dynamicItems[ri].recommendationSource;switch(params.elimination){case"ELIMINATE_DUPLICATES":case"ELIMINATE_PREVIOUS":checkProductInList(productList,elm.productId)||!sourceLastVisited&&_SgmntfY_._containsRecommendedProduct(elm.productId)&&!_SgmntfY_._variables.offerRecommendedProducts||(productList.push(elm),sourceLastVisited||_SgmntfY_._addRecommendedProduct(elm.productId),++index,--missingCount);break;case"NO_ELIMINATION":default:productList.push(elm),sourceLastVisited||_SgmntfY_._addRecommendedProduct(elm.productId),++index,--missingCount}}}}}}var notificationTitleMap=JSON.parse(params.notificationTitleMap||"{}"),notificationTitle=notificationTitleMap[request.data.lang]||params.notificationTitle;if(0!==productList.length){"INPAGE_WIDGET"!==params.actionType&&_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",interactionId:params.actionId,instanceId:params.instanceId});var wvInteractionId=params.interactionId,wvInstanceId=params.instanceId,wvCB=function(e){var t=!1;if(!t&&isElemVisible(e))_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",interactionId:wvInteractionId,instanceId:wvInstanceId}),t=!0;else if(!t)var n=setInterval(function(){!t&&isElemVisible(e)&&(_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",interactionId:wvInteractionId,instanceId:wvInstanceId}),t=!0,window.clearInterval(n))},100)};switch(params.actionType){case"CALLBACK":request.recommendationCallback&&request.recommendationCallback(notificationTitle,productList,previousMetadata,wvCB);break;case"INPAGE_WIDGET":var binded_context=checkSelectorAndRender.bind({params:params,selectorCount:1});binded_context();break;case"JAVASCRIPT_FUNCTION":var fx=_SgmntfY_._getObjectByString(window,params.jsFunction);if("function"==typeof fx)try{fx.call(null,notificationTitle,productList,previousMetadata,wvCB)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing product recommendation js function: "+e)}else _SgmntfY_.LOG_MESSAGE("WARN","Product Recommendation javascript function("+params.jsFunction+") does not exist");break;case"POPUP_RECO":var config={title:params.notificationTitle,vertical:params.verticalPosition,horizontal:params.horizontalPosition};if(productList.length<3)return;config.products=productList;try{if(params.preJsCode){eval(params.preJsCode);var retVal=preRenderConf(config);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign pre js code: "+e)}var _products=[],_productId="";request.originalParams&&request.originalParams.params&&(_productId=request.originalParams.params.productId||"");for(var i=0;i<config.products.length&&3!==_products.length;++i){var _product=config.products[i];_product.productId!==_productId&&_products.push(_product)}if(3!==_products.length)return;config.products=_products;var renderedHtml=_SgmntfY_._getMustache().render(params.recommendationTemplate,config);_SgmntfY_._getJq()("body").prepend(renderedHtml),params.cssCode&&_SgmntfY_._getJq()("<style />").html(params.cssCode).prependTo(_SgmntfY_._getJq()("body"));try{params.postJsCode&&eval(params.postJsCode)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign post js code: "+e)}"true"===params.overlay&&_SgmntfY_._getJq()(".seg-popup-overlay").show(),_SgmntfY_._getJq()(".seg-popup-close").bind("click",function(){var e=_SgmntfY_._getJq()(this);e.parent(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),window.setTimeout(function(){e.parent(".seg-popup").remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},1e3)}),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",interactionId:params.interactionId,instanceId:params.instanceId})}}else"CALLBACK"===params.actionType&&request.recommendationCallback&&request.recommendationCallback(notificationTitle,[],previousMetadata,null)},recommendPromotion:function(params,request){var metadata={title:params.notificationTitle};function checkDynamicItemCount(e,t){for(var n=0;n<e.length;++n)if(e[n].recommendationSource+"|"+e[n].timeFrame===t)return e[n].itemCount;return null}function checkPromotionInList(e,t){for(var n=0;n<e.length;n++)if(e[n].code===t)return 1}function isElemVisible(e){try{if(_SgmntfY_._exists(e)){var t=_SgmntfY_._getJq()(window),n=t.scrollTop(),a=n+t.height();e instanceof HTMLElement?e=_SgmntfY_._getJq()(e):e instanceof HTMLCollection&&(e=_SgmntfY_._getJq()(e[0]));var r=e.offset().top;return r+100<=a&&n<=r}return}catch(e){return}}function decodeHtml(e){var t=document.createElement("textarea");return t.innerHTML=e,t.value}function checkSelectorAndRender(){var params=this.params,selectorCount=this.selectorCount,target=params.selector;if(target&&_SgmntfY_._getJq()(target).length){var renderIdx=0,reConf={title:params.notificationTitle,promotionList:promotionList,index:function(){return++renderIdx}};try{if(params.preJsCode){eval(params.preJsCode);var retVal=preRenderConf(reConf);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing promotion recommendation pre js code: "+e)}reConf.brandingEnabled&&(reConf.title+='<a target="_blank" class="seg-rec-logo" href="//www.segmentify.com">Recommended by <img src="//cdn.segmentify.com/images/sgm-logo.svg" /></a>');var renderedHtml=_SgmntfY_._getMustache().render(params.recommendationTemplate,reConf);try{var targetElement=_SgmntfY_._getJq()(target).first();if("SELF"===params.insertType)targetElement.addClass("seg-promotion-wrapper").html(renderedHtml),wvCB&&wvCB(targetElement);else{var $div=_SgmntfY_._getJq()("<div/>",{class:"seg-promotion-wrapper"});"AFTER"===params.insertType||"BEFORE"===params.insertType?"AFTER"===params.insertType?$div.html(renderedHtml).insertAfter(targetElement):$div.html(renderedHtml).insertBefore(targetElement):"APPEND"!==params.insertType&&"PREPEND"!==params.insertType||("APPEND"===params.insertType?$div.html(renderedHtml).appendTo(targetElement):$div.html(renderedHtml).prependTo(targetElement)),wvCB&&wvCB($div)}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in filling target element["+target+"] with promotion recommendations: "+e)}try{params.postJsCode&&eval(params.postJsCode)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing promotion recommendation post js code: "+e)}}else if(_SgmntfY_.LOG_MESSAGE("WARN","Error in finding target element["+target+"], element does not exist"),selectorCount<_SgmntfY_._variables.constants.recommendationSelectorFindLimit){++this.selectorCount;var binded=checkSelectorAndRender.bind(this);setTimeout(binded,100)}}for(var promotionList=[],recommendedPromotions=params.recommendedPromotions||{},dynamicItems=JSON.parse(params.dynamicItems)||[],i=0;i<recommendedPromotions.RECOMMENDATION_SOURCE_STATIC_ITEMS.length;++i){var elm=recommendedPromotions.RECOMMENDATION_SOURCE_STATIC_ITEMS[i];checkPromotionInList(promotionList,elm.code)||promotionList.push(elm)}for(var missingCount=0,ri=0;ri<dynamicItems.length;++ri){void 0===dynamicItems[ri].timeFrame&&(dynamicItems[ri].timeFrame="null");var curRecommendationSource=dynamicItems[ri].recommendationSource+"|"+dynamicItems[ri].timeFrame,curCatItemCount=parseInt(checkDynamicItemCount(dynamicItems,curRecommendationSource));if(isNaN(curCatItemCount)&&(curCatItemCount=0),recommendedPromotions.hasOwnProperty(curRecommendationSource)&&curCatItemCount){missingCount+=curCatItemCount;for(var index=0,i=0;i<recommendedPromotions[curRecommendationSource].length;++i){var elm=recommendedPromotions[curRecommendationSource][i];if(elm.name=decodeHtml(elm.name),curCatItemCount<=index&&0==missingCount)break;var eliminationFnRetVal=!1;if(params.eliminationFunction){var fx=_SgmntfY_._getObjectByString(window,params.eliminationFunction);if("function"==typeof fx)try{eliminationFnRetVal=fx.call(null,elm)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing promotion recommendation elimination js function: "+e)}}if(!eliminationFnRetVal)switch(params.elimination){case"ELIMINATE_DUPLICATES":case"ELIMINATE_PREVIOUS":checkPromotionInList(promotionList,elm.code)||_SgmntfY_._containsRecommendedPromotion(elm.code)&&!_SgmntfY_._variables.offerRecommendedPromotions||(promotionList.push(elm),_SgmntfY_._addRecommendedPromotion(elm.code),++index,--missingCount);break;case"NO_ELIMINATION":default:promotionList.push(elm),_SgmntfY_._addRecommendedPromotion(elm.code),++index,--missingCount}}}}if(0!==promotionList.length){"SHUFFLE"===params.ordering&&(promotionList=_SgmntfY_._shuffle(promotionList)),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",interactionId:params.actionId,instanceId:params.instanceId});var wvInteractionId=params.interactionId,wvInstanceId=params.instanceId,wvCB=function(e){var t=!1;if(!t&&isElemVisible(e))_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",interactionId:wvInteractionId,instanceId:wvInstanceId}),t=!0;else if(!t)var n=setInterval(function(){!t&&isElemVisible(e)&&(_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",interactionId:wvInteractionId,instanceId:wvInstanceId}),t=!0,window.clearInterval(n))},100)};switch(params.actionType){case"CALLBACK":request.recommendationCallback&&request.recommendationCallback(promotionList,metadata,wvCB);break;case"INPAGE_WIDGET":var binded_context=checkSelectorAndRender.bind({params:params,selectorCount:1});binded_context()}}else"CALLBACK"===params.actionType&&request.recommendationCallback&&request.recommendationCallback([],metadata,null)},recommendKeyword:function(params,request){var metadata={title:params.notificationTitle};function checkDynamicItemCount(e,t){for(var n=0;n<e.length;++n)if(e[n].recommendationSource+"|"+e[n].timeFrame==t)return e[n].itemCount;return null}function checkKeywordInList(e,t){for(var n=0;n<e.length;n++)if(e[n]==t)return 1}function isElemVisible(e){try{if(_SgmntfY_._exists(e)){var t=_SgmntfY_._getJq()(window),n=t.scrollTop(),a=n+t.height();e instanceof HTMLElement?e=_SgmntfY_._getJq()(e):e instanceof HTMLCollection&&(e=_SgmntfY_._getJq()(e[0]));var r=e.offset().top;return r+100<=a&&n<=r}return}catch(e){return}}function decodeHtml(e){var t=document.createElement("textarea");return t.innerHTML=e,t.value}function checkSelectorAndRender(){var params=this.params,keywordList=this.keywordList,selectorCount=this.selectorCount,target=params.selector;if(target&&_SgmntfY_._getJq()(target).length){for(var keywords=[],k=0;k<keywordList.length;++k)keywords.push({name:keywordList[k],url:""});var recoTitle=params.notificationTitle,renderIdx=0,reConf={title:recoTitle,keywords:keywords,index:function(){return++renderIdx}};try{if(params.preJsCode){eval(params.preJsCode);var retVal=preRenderConf(reConf);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing product recommendation pre js code: "+e)}var renderedHtml=_SgmntfY_._getMustache().render(params.recommendationTemplate,reConf);try{var targetElement=_SgmntfY_._getJq()(target).first();if("SELF"===params.insertType)targetElement.html(renderedHtml),wvCB&&wvCB(targetElement);else{var $div=_SgmntfY_._getJq()("<div/>",{class:"seg-reco-wrapper seg-clear"});"AFTER"===params.insertType||"BEFORE"===params.insertType?"AFTER"===params.insertType?$div.html(renderedHtml).insertAfter(targetElement):$div.html(renderedHtml).insertBefore(targetElement):"APPEND"!==params.insertType&&"PREPEND"!==params.insertType||("APPEND"===params.insertType?$div.html(renderedHtml).appendTo(targetElement):$div.html(renderedHtml).prependTo(targetElement)),wvCB&&wvCB($div)}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in filling target element["+target+"] with product recommendations: "+e)}try{params.postJsCode&&eval(params.postJsCode)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing product recommendation post js code: "+e)}_SgmntfY_._getJq()(".seg-label a").on("click",function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"click",interactionId:params.actionId,instanceId:params.instanceId})})}else if(_SgmntfY_.LOG_MESSAGE("WARN","Error in finding target element["+target+"], element does not exist"),selectorCount<_SgmntfY_._variables.constants.recommendationSelectorFindLimit){++this.selectorCount;var binded=checkSelectorAndRender.bind(this);setTimeout(binded,100)}}for(var keywordList=[],recommendedKeywords=params.recommendedKeywords||{},dynamicItems=JSON.parse(params.dynamicItems)||[],i=0;i<recommendedKeywords.RECOMMENDATION_SOURCE_STATIC_ITEMS.length;++i){var elm=recommendedKeywords.RECOMMENDATION_SOURCE_STATIC_ITEMS[i];checkKeywordInList(keywordList,elm)||keywordList.push(elm)}for(var missingCount=0,ri=0;ri<dynamicItems.length;++ri){void 0===dynamicItems[ri].timeFrame&&(dynamicItems[ri].timeFrame="null");var curRecommendationSource=dynamicItems[ri].recommendationSource+"|"+dynamicItems[ri].timeFrame,curCatItemCount=parseInt(checkDynamicItemCount(dynamicItems,curRecommendationSource));if(isNaN(curCatItemCount)&&(curCatItemCount=0),recommendedKeywords.hasOwnProperty(curRecommendationSource)&&curCatItemCount){missingCount+=curCatItemCount;for(var index=0,i=0;i<recommendedKeywords[curRecommendationSource].length;++i){var elm=recommendedKeywords[curRecommendationSource][i];if(elm.name=decodeHtml(elm.name),curCatItemCount<=index&&0==missingCount)break;keywordList.push(elm),++index,--missingCount}}}if(0!==keywordList.length){"SHUFFLE"===params.ordering&&(keywordList=_SgmntfY_._shuffle(keywordList)),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",interactionId:params.actionId,instanceId:params.instanceId});var wvInteractionId=params.interactionId,wvInstanceId=params.instanceId,wvCB=function(e){var t=!1;if(!t&&isElemVisible(e))_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",interactionId:wvInteractionId,instanceId:wvInstanceId}),t=!0;else if(!t)var n=setInterval(function(){!t&&isElemVisible(e)&&(_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",interactionId:wvInteractionId,instanceId:wvInstanceId}),t=!0,window.clearInterval(n))},100)};switch(params.actionType){case"CALLBACK":request.recommendationCallback&&request.recommendationCallback(keywordList,metadata,wvCB);break;case"INPAGE_WIDGET":var binded_context=checkSelectorAndRender.bind({params:params,keywordList:keywordList,selectorCount:1});binded_context()}}else request.recommendationCallback&&request.recommendationCallback([],metadata,null)},webNotification:function(e){},redirectUrl:function(e){_SgmntfY_.LOG_MESSAGE("DEBUG","Redirecting action to url: "+e.redirectUrl),window.location=e.redirectUrl},jsFunctionCall:function(e){e.actionType="JAVASCRIPT_FUNCTION",_SgmntfY_._actions.jsAction(e)},jsAction:function(params){var actionType=params.actionType;switch(actionType){case"JAVASCRIPT_EVENT":var event=params.event,parameters=[];try{params.parameters&&(parameters=JSON.parse(params.parameters))}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Js Action (Event Trigger) - Cannot parse parameters json, str: "+params.parameters),parameters=[]}parameters.push(function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"js_success",interactionId:params.actionId,instanceId:params.instanceId})}),parameters.push(function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"js_reject",interactionId:params.actionId,instanceId:params.instanceId})}),_SgmntfY_._getJq()(document).trigger(event,parameters),_SgmntfY_.LOG_MESSAGE("DEBUG","Js Action (Event Trigger) - Triggered Event: "+event);break;case"JAVASCRIPT_CODE":try{eval(params.javascriptCode),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"js_success",interactionId:params.actionId,instanceId:params.instanceId}),_SgmntfY_.LOG_MESSAGE("DEBUG","Js Action (Execute Code) successfully executed")}catch(e){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"js_reject",interactionId:params.actionId,instanceId:params.instanceId}),_SgmntfY_.LOG_MESSAGE("WARN","Error in JS Action (Execute Code): "+e)}break;case"JAVASCRIPT_FUNCTION":default:var fx=window[params.function],parameters=[];if("function"==typeof fx){try{params.parameters&&(parameters=JSON.parse(params.parameters))}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Js Action (Function Call) - Cannot parse parameters json, str: "+params.parameters),parameters=[]}parameters.push(function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"js_success",interactionId:params.actionId,instanceId:params.instanceId})}),parameters.push(function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"js_reject",interactionId:params.actionId,instanceId:params.instanceId})}),fx.apply(null,parameters),_SgmntfY_.LOG_MESSAGE("DEBUG","Js Action (Function Call) successfully run for function: "+params.function)}else _SgmntfY_.LOG_MESSAGE("WARN","Js Action (Function Call) failed, non existing function: "+params.function)}},jsCountdownTimer:function(e){var t=e.timeout;_SgmntfY_.LOG_MESSAGE("DEBUG","Starting countdown timer with "+1e3*(t||0)+" second(s)"),setTimeout(function(){_SgmntfY_.LOG_MESSAGE("DEBUG","Countdown timer finished after "+1e3*(t||0)+" second(s)"),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"timeout",interactionId:e.actionId,instanceId:e.instanceId})},1e3*(t||0))},sendBannerDetails:function(e,t){var n=t.originalParams;n.group=e.group;var a=[],r=_SgmntfY_._functions.bannerGroupDetail(n);r&&a.push(r),_SgmntfY_._sendRequestToServer(a)}},_campaigns:{NEWSLETTER:function(campaign,request){var config={title:campaign.title,description:campaign.description,placeholder:campaign.placeholder,termsUrl:campaign.termsUrl,termsText:campaign.termsText,buttonSubmitText:campaign.buttonSubmitText,buttonThanksText:campaign.buttonThanksText,buttonBgColor:campaign.buttonBgColor,buttonTextColor:campaign.buttonTextColor,vertical:campaign.verticalPosition,horizontal:campaign.horizontalPosition};try{if(campaign.preJs){eval(campaign.preJs);var retVal=preRenderConf(config);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign pre js code: "+e)}var renderedHtml=_SgmntfY_._getMustache().render(campaign.html,config);_SgmntfY_._getJq()("body").prepend(renderedHtml),campaign.css&&_SgmntfY_._getJq()("<style />").html(campaign.css).prependTo(_SgmntfY_._getJq()("body"));try{campaign.postJs&&eval(campaign.postJs)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign post js code: "+e)}_SgmntfY_.LOG_MESSAGE("DEBUG","Newsletter popup appended to html body for campaign("+campaign.instanceId+")"),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",instanceId:campaign.instanceId,interactionId:campaign.instanceId}),_SgmntfY_._getJq()(".seg-popup-close").bind("click",function(){var e=_SgmntfY_._getJq()(this);e.parent(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),window.setTimeout(function(){e.parent(".seg-popup").remove()},1e3)}),_SgmntfY_._getJq()(".seg-form-submit").bind("click",function(e){_SgmntfY_._getJq()(".seg-form-input").removeClass("seg-form-invalid"),_SgmntfY_._getJq()(".seg-email-collection .seg-checkbox").removeClass("seg-form-invalid"),e.preventDefault();var t=_SgmntfY_._getJq()(".seg-form-input"),n=_SgmntfY_._getJq()('.seg-email-collection .seg-form-footer input[type="checkbox"]');if(isEmail(t.val())&&1==n.is(":checked")){_SgmntfY_._getJq()(this).addClass("seg-sending"),_SgmntfY_._getJq()(this).css({"pointer-events":"none"}),setTimeout(function(){_SgmntfY_._getJq()(".seg-email-collection").addClass("seg-popup-thanks").removeClass("segFadeInUp")},1300),setTimeout(function(){_SgmntfY_._getJq()(".seg-email-collection").addClass("segFadeOutDown")},3e3),setTimeout(function(){_SgmntfY_._getJq()(".seg-email-collection").remove()},6e3);var a=_SgmntfY_._getJq()("#seg-email-collection");0<a.length&&(_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"submit",interactionId:campaign.name,instanceId:campaign.instanceId}),_SgmntfY_._variables.segmentifyObj("user:form",{formName:campaign.name,fields:a.sgmSerializeForm()}))}isEmail(t.val())||t.addClass("seg-form-invalid"),0==n.is(":checked")&&_SgmntfY_._getJq()(".seg-terms .seg-checkbox").addClass("seg-form-invalid")});var isEmail=function(e){return/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(e)}},FORM:function(campaign,request){for(var config={title:campaign.title,description:campaign.description,buttonSubmitText:campaign.buttonSubmitText,vertical:campaign.verticalPosition,horizontal:campaign.horizontalPosition},fields=campaign.fields||[],i=0;i<fields.length;++i){var field=fields[i];config["ff"+i+"_required"]=field.required,"INPUT"===field.type?(config["ff"+i+"_name"]=field.name,config["ff"+i+"_placeholder"]=field.placeholder,config["ff"+i+"_inputType"]=field.inputType,field.name?config["ff"+i+"_fieldName"]=field.name:config["ff"+i+"_fieldName"]="input-"+i):"TEXT_AREA"===field.type?(config["ff"+i+"_name"]=field.name,config["ff"+i+"_placeholder"]=field.placeholder,field.name?config["ff"+i+"_fieldName"]=field.name:config["ff"+i+"_fieldName"]="textarea-"+i):"CHECKBOX"!==field.type&&"RADIO_BUTTON"!==field.type||(config["ff"+i+"_groupTitle"]=field.groupTitle,config["ff"+i+"_options"]=field.options,field.groupTitle?config["ff"+i+"_fieldName"]=field.groupTitle:"CHECKBOX"===field.type?config["ff"+i+"_fieldName"]="checkbox-"+i:config["ff"+i+"_fieldName"]="radiobutton-"+i)}try{if(campaign.preJs){eval(campaign.preJs);var retVal=preRenderConf(config);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign pre js code: "+e)}var renderedHtml=_SgmntfY_._getMustache().render(campaign.html,config);_SgmntfY_._getJq()("body").prepend(renderedHtml),campaign.css&&_SgmntfY_._getJq()("<style />").html(campaign.css).prependTo(_SgmntfY_._getJq()("body"));try{campaign.postJs&&eval(campaign.postJs)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign post js code: "+e)}_SgmntfY_.LOG_MESSAGE("DEBUG","Form popup appended to html body for campaign("+campaign.instanceId+")"),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",instanceId:campaign.instanceId,interactionId:campaign.instanceId}),_SgmntfY_._getJq()(".seg-form-survey").each(function(){var e=_SgmntfY_._getJq()(this);-1===e.attr("class").indexOf("cmp_")&&e.addClass(campaign.instanceId)}),"true"===campaign.overlay&&_SgmntfY_._getJq()(".seg-popup-overlay").show(),_SgmntfY_._getJq()("."+campaign.instanceId+" .seg-popup-close").bind("click",function(){var e=_SgmntfY_._getJq()(this);e.parent(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),window.setTimeout(function(){e.parent(".seg-popup").remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},1e3)}),_SgmntfY_._getJq()("."+campaign.instanceId+" .seg-form-submit").bind("click",function(e){e.preventDefault();var t=_SgmntfY_._getJq()(this),n=_SgmntfY_._getJq()("."+campaign.instanceId+".seg-form-survey"),a=n.find(".seg-form");checkValidity(a)&&(t.addClass("seg-sending"),t.css({"pointer-events":"none"}),setTimeout(function(){n.addClass("seg-popup-thanks").removeClass("segFadeInUp")},1300),setTimeout(function(){n.addClass("segFadeOutDown")},3e3),setTimeout(function(){n.remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},6e3),0<a.length&&(_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"submit",interactionId:campaign.name,instanceId:campaign.instanceId}),_SgmntfY_._variables.segmentifyObj("user:form",{formName:campaign.name,fields:a.sgmSerializeForm()})))});var checkValidity=function(e){try{e.find(".seg-form-invalid").removeClass("seg-form-invalid");for(var t=e.find("input,textarea"),n=!0,a=0;a<t.length;++a){var r=t[a],i=_SgmntfY_._getJq()(r);"checkbox"!==i.attr("type")&&(r.checkValidity()||("radio"===i.attr("type")?i.parent().addClass("seg-form-invalid"):i.addClass("seg-form-invalid"),n=!1))}var s=e.find('input[type="checkbox"]'),o=[];s.each(function(){-1==o.indexOf(this.name)&&o.push(this.name)});for(var c=0;c<o.length;++c)0<e.find('input[name="'+o[c]+'"]:required').length&&0==e.find('input[name="'+o[c]+'"]:checked').length&&(e.find('input[name="'+o[c]+'"]').parent().addClass("seg-form-invalid"),n=!1);return n}catch(e){return!0}}},POPUP_BANNER:function(campaign,request){var config={title:campaign.title,image:campaign.image,url:campaign.url,vertical:campaign.verticalPosition,horizontal:campaign.horizontalPosition};try{if(campaign.preJs){eval(campaign.preJs);var retVal=preRenderConf(config);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign pre js code: "+e)}var renderedHtml=_SgmntfY_._getMustache().render(campaign.html,config);_SgmntfY_._getJq()("body").prepend(renderedHtml),campaign.css&&_SgmntfY_._getJq()("<style />").html(campaign.css).prependTo(_SgmntfY_._getJq()("body"));try{campaign.postJs&&eval(campaign.postJs)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign post js code: "+e)}"true"===campaign.overlay&&_SgmntfY_._getJq()(".seg-popup-overlay").show(),_SgmntfY_._getJq()(".seg-popup-close").bind("click",function(){var e=_SgmntfY_._getJq()(this);e.parent(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),window.setTimeout(function(){e.parent(".seg-popup").remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},1e3),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"close",instanceId:campaign.instanceId,interactionId:campaign.instanceId})}),_SgmntfY_._getJq()(".seg-banner-container img").bind("click",function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"click",instanceId:campaign.instanceId,interactionId:campaign.instanceId})}),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",instanceId:campaign.instanceId,interactionId:campaign.instanceId})},POPUP_RECOMMENDATION:function(campaign,request){for(var config={title:campaign.title,vertical:campaign.verticalPosition,horizontal:campaign.horizontalPosition},productsList=campaign.productsList||[],products=[],i=0;i<productsList.length;++i)for(var j=0;j<productsList[i].length;++j)products.push(productsList[i][j]);if(!(products.length<3)){"SHUFFLE"===campaign.ordering&&(products=_SgmntfY_._shuffle(products)),config.products=products;try{if(campaign.preJs){eval(campaign.preJs);var retVal=preRenderConf(config);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign pre js code: "+e)}var _products=[],_productId="";request.originalParams&&request.originalParams.params&&(_productId=request.originalParams.params.productId||"");for(var i=0;i<config.products.length&&3!==_products.length;++i){var _product=config.products[i];_product.productId!==_productId&&_products.push(_product)}if(3===_products.length){config.products=_products;var renderedHtml=_SgmntfY_._getMustache().render(campaign.html,config);_SgmntfY_._getJq()("body").prepend(renderedHtml),campaign.css&&_SgmntfY_._getJq()("<style />").html(campaign.css).prependTo(_SgmntfY_._getJq()("body"));try{campaign.postJs&&eval(campaign.postJs)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign post js code: "+e)}"true"===campaign.overlay&&_SgmntfY_._getJq()(".seg-popup-overlay").show(),_SgmntfY_._getJq()(".seg-popup-close").bind("click",function(){var e=_SgmntfY_._getJq()(this);e.parent(".seg-popup").removeClass("segFadeInUp").addClass("segFadeOutDown"),window.setTimeout(function(){e.parent(".seg-popup").remove(),_SgmntfY_._getJq()(".seg-popup-overlay").remove()},1e3),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"close",instanceId:campaign.instanceId,interactionId:campaign.instanceId})}),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",instanceId:campaign.instanceId,interactionId:campaign.instanceId}),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"widget-view",instanceId:campaign.instanceId,interactionId:campaign.instanceId})}}},NOTIFICATION_BAR:function(campaign,request){var config={title:campaign.title,image:campaign.image,bgColor:campaign.bgColor,textColor:campaign.textColor,url:campaign.url,instanceId:campaign.instanceId,divClass:"sgf-notif-bar-"+(campaign.verticalPosition||"top")};try{if(campaign.preJs){eval(campaign.preJs);var retVal=preRenderConf(config);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign pre js code: "+e)}var renderedHtml=_SgmntfY_._getMustache().render(campaign.html,config);_SgmntfY_._getJq()("body").prepend(renderedHtml),campaign.css&&_SgmntfY_._getJq()("<style />").html(campaign.css).prependTo(_SgmntfY_._getJq()("body"));try{campaign.postJs&&eval(campaign.postJs)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign post js code: "+e)}_SgmntfY_.LOG_MESSAGE("DEBUG","Notification Bar appended to html body for campaign("+campaign.instanceId+")"),"true"===campaign.sticky&&(_SgmntfY_._getJq()(".seg-notification-bar").addClass("seg-notification-bar-sticky"),_SgmntfY_._getJq()(".seg-notification-bar-sticky:not([data-loaded])").each(function(){var e=_SgmntfY_._getJq()(this);if(e.attr("data-loaded","true"),e.find("img").length){var t=e.find("img:first"),n=t.attr("src")||t.attr("data-src");t.on("load",function(){var e=_SgmntfY_._getJq()(this).parents(".seg-notification-bar:first"),t=parseInt(_SgmntfY_._getJq()("body").css("padding-top").replace("px","")),n=parseInt(_SgmntfY_._getJq()("body").css("padding-bottom").replace("px",""));e.hasClass("sgf-notif-bar-top")?t+=e.height():e.hasClass("sgf-notif-bar-bottom")&&(n+=e.height()),_SgmntfY_._getJq()("body").css("padding-top",t).css("padding-bottom",n)}),t[0].src=n}})),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",instanceId:campaign.instanceId,interactionId:campaign.instanceId}),_SgmntfY_._getJq()(".seg-notification-bar-v2-"+campaign.instanceId).length?_SgmntfY_._getJq()(".seg-notification-bar-v2-"+campaign.instanceId).bind("click",function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"click",instanceId:campaign.instanceId,interactionId:campaign.instanceId})}):_SgmntfY_._getJq()(".sgf-link").bind("click",function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"click",instanceId:campaign.instanceId,interactionId:campaign.instanceId})})},PUSH_PERMISSION:function(campaign,request){var config={title:campaign.title,text:campaign.text,icon:campaign.icon,buttonLaterText:campaign.buttonLaterText,buttonAllowText:campaign.buttonAllowText},pushFadeUp=function(e){_SgmntfY_._getJq()(".seg-popup-push").addClass("seg-fade-up"),window.setTimeout(function(){_SgmntfY_._getJq()(".seg-popup-push").remove()},e)};try{if(campaign.preJs){eval(campaign.preJs);var retVal=preRenderConf(config);if(void 0!==retVal&&!retVal)return void _SgmntfY_.LOG_MESSAGE("WARN","preRenderConf returned false exiting!")}}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign pre js code: "+e)}var renderedHtml=_SgmntfY_._getMustache().render(campaign.html,config);_SgmntfY_._getJq()("body").prepend(renderedHtml),campaign.css&&_SgmntfY_._getJq()("<style />").html(campaign.css).prependTo(_SgmntfY_._getJq()("body"));try{campaign.postJs&&eval(campaign.postJs)}catch(e){_SgmntfY_.LOG_MESSAGE("WARN","Error in executing campaign post js code: "+e)}_SgmntfY_.LOG_MESSAGE("DEBUG","Push Permission appended to html body for campaign("+campaign.instanceId+")"),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"impression",instanceId:campaign.instanceId,interactionId:campaign.instanceId}),_SgmntfY_._getJq()(".seg-popup-push-bttn-later").click(function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"later",instanceId:campaign.instanceId,interactionId:campaign.instanceId}),pushFadeUp(500)}),_SgmntfY_._getJq()(".seg-popup-push-bttn-allow").click(function(){_SgmntfY_._variables.segmentifyObj("event:interaction",{type:"click",instanceId:campaign.instanceId,interactionId:campaign.instanceId}),pushFadeUp(500);var e=_SgmntfY_._variables.apiKey,t=_SgmntfY_._getUserId(),n=campaign.instanceId||"";if(e&&t){var a=(campaign.url||"https://"+e.split("-").join("")+".app.segmentify.com/push/ecommerce.en.html")+"?apiKey="+e+"&userId="+t+"&instanceId="+n;campaign.dataCenterNo&&(a+="&dcn="+campaign.dataCenterNo),window.open(a,"Push Permission","width=600,height=350")}})}},_functions:{getFunction:function(t){switch(t.toLowerCase()){case"apikey":return _SgmntfY_._functions.setApiKey;case"loglevel":return _SgmntfY_._functions.setLogLevel;case"variables":return _SgmntfY_._functions.setVariables;case"userid":return _SgmntfY_._functions.setUserId;case"view:page":return _SgmntfY_._functions.pageView;case"view:product":return _SgmntfY_._functions.productView;case"basket:add":return _SgmntfY_._functions.addToBasket;case"basket:remove":return _SgmntfY_._functions.removeFromBasket;case"basket:clear":return _SgmntfY_._functions.clearBasket;case"checkout:basket":return _SgmntfY_._functions.checkoutViewBasket;case"checkout:customer":return _SgmntfY_._functions.checkoutCustomerInfo;case"checkout:payment":return _SgmntfY_._functions.checkoutPaymentInfo;case"checkout:purchase":return _SgmntfY_._functions.checkoutPurchase;case"user:signin":return _SgmntfY_._functions.userSignIn;case"user:signout":return _SgmntfY_._functions.userSignOut;case"user:signup":return _SgmntfY_._functions.userSignUp;case"user:subscribe":return _SgmntfY_._functions.userSubscribe;case"user:unsubscribe":return _SgmntfY_._functions.userUnsubscribe;case"user:update":return _SgmntfY_._functions.userInfoUpdate;case"event:custom":return _SgmntfY_._functions.customEvent;case"event:interaction":return _SgmntfY_._functions.interaction;case"user:form":return _SgmntfY_._functions.userForm;case"banner:impression":return _SgmntfY_._functions.bannerImpression;case"banner:click":return _SgmntfY_._functions.bannerClick;case"banner:update":return _SgmntfY_._functions.bannerUpdate;case"bannergroup:view":return _SgmntfY_._functions.bannerGroupView;case"bannergroup:detail":return _SgmntfY_._functions.bannerGroupDetail;case"impression:promotion":return _SgmntfY_._functions.promotionImpression;case"view:promotion":return _SgmntfY_._functions.promotionView;case"push:interaction":return _SgmntfY_._functions.pushInteraction;default:return function(e){_SgmntfY_.LOG_MESSAGE("WARN","Unexpected Command: "+t)}}},getDataLayerFunction:function(t,e){switch(t.toLowerCase()){case"page":return _SgmntfY_._functions.pageView;case"product":return _SgmntfY_._functions.productView;case"basket":switch(e.step.toLowerCase()){case"add":return _SgmntfY_._functions.addToBasket;case"remove":return _SgmntfY_._functions.removeFromBasket;case"clear":return _SgmntfY_._functions.clearBasket;default:return function(e){_SgmntfY_.LOG_MESSAGE("WARN","Unexpected Basket Operations Step: "+e.step)}}case"checkout":switch(e.step.toLowerCase()){case"basket":return _SgmntfY_._functions.checkoutViewBasket;case"customer":return _SgmntfY_._functions.checkoutCustomerInfo;case"payment":return _SgmntfY_._functions.checkoutPaymentInfo;case"purchase":return _SgmntfY_._functions.checkoutPurchase;default:return function(e){_SgmntfY_.LOG_MESSAGE("WARN","Unexpected Checkout Step: "+e.step)}}case"user":switch(e.step.toLowerCase()){case"signin":return _SgmntfY_._functions.userSignIn;case"signout":return _SgmntfY_._functions.userSignOut;case"signup":return _SgmntfY_._functions.userSignUp;case"subscribe":return _SgmntfY_._functions.userSubscribe;case"unsubscribe":return _SgmntfY_._functions.userUnsubscribe;case"update":return _SgmntfY_._functions.userInfoUpdate;default:return function(e){_SgmntfY_.LOG_MESSAGE("WARN","Unexpected User Operations Step: "+e.step)}}case"interaction":return _SgmntfY_._functions.interaction;case"form":return _SgmntfY_._functions.userForm;case"banners":return _SgmntfY_._functions.bannerGroupView;case"banner":switch(e.type.toLowerCase()){case"impression":return _SgmntfY_._functions.bannerImpression;case"click":return _SgmntfY_._functions.bannerClick;case"update":return _SgmntfY_._functions.bannerUpdate;default:return function(e){_SgmntfY_.LOG_MESSAGE("WARN","Unexpected Banner Operations Type: "+e.type)}}case"custom":return _SgmntfY_._functions.customEvent;case"promotion":switch(e.type.toLowerCase()){case"impression":return _SgmntfY_._functions.promotionImpression;case"view":return _SgmntfY_._functions.promotionView;default:return function(e){_SgmntfY_.LOG_MESSAGE("WARN","Unexpected Promotion Type: "+e.type)}}default:return function(e){_SgmntfY_.LOG_MESSAGE("WARN","Unexpected Command: "+t)}}},callFunction:function(e){var t=[];e=e||[];for(var n=0;n<e.length;n++){var a=e[n],r=_SgmntfY_._functions.getFunction(a[0]),i=Array.prototype.slice.call(a,1);try{var s=r.apply(null,i);s&&(t=t.concat(s)),_SgmntfY_.LOG_MESSAGE("INFO","Event triggered: "+a[0])}catch(e){_SgmntfY_.LOG_MESSAGE("Error","Can't convert command("+a[0]+") into request data. Details: "+e)}}_SgmntfY_._sendRequestToServer(t)},setApiKey:function(e,t){if(_SgmntfY_._variables.apiKey=e,_SgmntfY_.LOG_MESSAGE("DEBUG","Api Key: "+e),t)_SgmntfY_.LOG_MESSAGE("INFO","Account specific style is disabled, skipping...");else{var n=_SgmntfY_._variables.segmentifyCDNUrl+e+"/segmentify.css";_SgmntfY_.LOG_MESSAGE("INFO","Loading account specific css file: "+n),_SgmntfY_._loadCSS(n)}_SgmntfY_._isNotEmpty(_SgmntfY_._variables.apiKey)&&(_SgmntfY_._consumeNextPageQueue(),_SgmntfY_._consumeRetryQueue())},setLogLevel:function(e){var t=_SgmntfY_.LOG_LEVELS[e];void 0!==t&&(_SgmntfY_._variables.logLevel=t,_SgmntfY_.LOG_MESSAGE("DEBUG","Segmentify Log Level Changed to: "+e))},setVariables:function(e){e=e||{},_SgmntfY_._extend(_SgmntfY_._variables,e),_SgmntfY_.LOG_MESSAGE("DEBUG","Segmentify Variables are updated - New Values: "+e)},setUserId:function(e){var t=_SgmntfY_._getUserId();if(_SgmntfY_._storePersistentData(_SgmntfY_._variables.userStorageKey,e,390,_SgmntfY_._variables.storage.user.local),_SgmntfY_.LOG_MESSAGE("DEBUG","Segmentify User Id Changed to: "+e),t!==e){var n={};return n.oldUserId=t||"",_SgmntfY_._prepareRequest(n,"USER_CHANGE")}},pageView:function(e){return e=e||{},_SgmntfY_._prepareRequest(e,"PAGE_VIEW")},productView:function(e){if((e=e||{}).url=e.url||document.URL,e.productUrl=e.productUrl||e.url||document.URL,"number"==typeof e.productId&&(e.productId=e.productId.toString()),"string"==typeof e.categories)if(-1!==e.categories.indexOf("|")){var t=e.categories.split("|");for(var n in e.categories=[],t)t.hasOwnProperty(n)&&e.categories.push(t[n].trim())}else e.categories=[e.categories];else for(var a in e.categories)e.categories.hasOwnProperty(a)&&"string"==typeof e.categories[a]&&(e.categories[a]=e.categories[a].trim());e.categories=(e.categories||[]).filter(_SgmntfY_._null),e.source=e.source||_SgmntfY_._sourceOfUrl();var r=_SgmntfY_._getClickedBanners();if(0<r.length){var i=[];for(a=0;a<r.length;++a){var s=_SgmntfY_._split(r[a],":",4);4!==s.length||isNaN(parseInt(s[2]))||i.push({title:s[0],group:s[1],order:parseInt(s[2])})}e.activeBanners=i}return 0<=_SgmntfY_._variables.skipProductDetail.device.indexOf(_SgmntfY_._variables.ua.type)&&(e.noUpdate=["all"]),_SgmntfY_._prepareRequest(e,"PRODUCT_VIEW")},addToBasket:function(e){(e=e||{}).step="add",e.quantity=e.quantity||1;var t=_SgmntfY_._getClickedBanners();if(0<t.length){for(var n=[],a=0;a<t.length;++a){var r=_SgmntfY_._split(t[a],":",4);4!==r.length||isNaN(parseInt(r[2]))||n.push({title:r[0],group:r[1],order:parseInt(r[2])})}e.activeBanners=n}return _SgmntfY_._variables.disableNextPage||void 0!==e.nextPage||(e.nextPage=!0),e.basketId=e.basketId||"basket_"+_SgmntfY_._getUserId(),_SgmntfY_._prepareRequest(e,"BASKET_OPERATIONS")},removeFromBasket:function(e){return(e=e||{}).step="remove",_SgmntfY_._variables.disableNextPage||void 0!==e.nextPage||(e.nextPage=!0),e.basketId=e.basketId||"basket_"+_SgmntfY_._getUserId(),_SgmntfY_._prepareRequest(e,"BASKET_OPERATIONS")},clearBasket:function(e){return(e=e||{}).step="clear",_SgmntfY_._variables.disableNextPage||void 0!==e.nextPage||(e.nextPage=!0),e.basketId=e.basketId||"basket_"+_SgmntfY_._getUserId(),_SgmntfY_._prepareRequest(e,"BASKET_OPERATIONS")},checkoutViewBasket:function(e){if((e=e||{}).step="view-basket",e.hasOwnProperty("productList"))for(var t=0;t<e.productList.length;++t)e.productList[t].quantity=e.productList[t].quantity||1;return e.basketId=e.basketId||"basket_"+_SgmntfY_._getUserId(),_SgmntfY_._prepareRequest(e,"CHECKOUT")},checkoutCustomerInfo:function(e){return(e=e||{}).step="customer-info",e.basketId=e.basketId||"basket_"+_SgmntfY_._getUserId(),_SgmntfY_._prepareRequest(e,"CHECKOUT")},checkoutPaymentInfo:function(e){return(e=e||{}).step="payment-info",e.basketId=e.basketId||"basket_"+_SgmntfY_._getUserId(),_SgmntfY_._prepareRequest(e,"CHECKOUT")},checkoutPurchase:function(e){if((e=e||{}).step="purchase",e.basketId=e.basketId||"basket_"+_SgmntfY_._getUserId(),e.hasOwnProperty("productList"))for(var t=0;t<e.productList.length;++t)e.productList[t].quantity=e.productList[t].quantity||1;var n=_SgmntfY_._getClickedBanners();if(0<n.length){for(var a=[],r=0;r<n.length;++r){var i=_SgmntfY_._split(n[r],":",4);4!==i.length||isNaN(parseInt(i[2]))||a.push({title:i[0],group:i[1],order:parseInt(i[2])})}e.activeBanners=a}return _SgmntfY_._prepareRequest(e,"CHECKOUT")},userSignIn:function(e){return(e=e||{}).step="signin",e.isLogin=!0,e.isRegistered=!0,_SgmntfY_._prepareRequest(e,"USER_OPERATIONS")},userSignOut:function(e){return(e=e||{}).step="signout",e.isLogin=!1,_SgmntfY_._prepareRequest(e,"USER_OPERATIONS")},userSignUp:function(e){return(e=e||{}).step="signup",e.isRegistered=!0,_SgmntfY_._prepareRequest(e,"USER_OPERATIONS")},userSubscribe:function(e){return(e=e||{}).step="subscribe",_SgmntfY_._prepareRequest(e,"USER_OPERATIONS")},userUnsubscribe:function(e){return(e=e||{}).step="unsubscribe",_SgmntfY_._prepareRequest(e,"USER_OPERATIONS")},userInfoUpdate:function(e){(e=e||{}).step="update",void 0!==e.isLogin&&(e.isRegistered="true"===e.isLogin||!0===e.isLogin?"true":e.isRegistered);var t=JSON.stringify(e),n=_SgmntfY_._getPersistentData("sgfUserUpdateData",!0);if(void 0===n||t!==n)return _SgmntfY_._storePersistentData("sgfUserUpdateData",t,-1,!0),_SgmntfY_._prepareRequest(e,"USER_OPERATIONS")},userForm:function(e){return e=e||{},_SgmntfY_._prepareRequest(e,"FORM")},customEvent:function(e){return e=e||{},_SgmntfY_._prepareRequest(e,"CUSTOM_EVENT")},interaction:function(e){return e=e||{},_SgmntfY_._variables.disableNextPage||void 0!==e.nextPage||(e.nextPage=!0),"impression"!==e.type&&"widget-view"!==e.type||(e.nextPage=!1),_SgmntfY_._prepareRequest(e,"INTERACTION")},bannerImpression:function(e){return(e=e||{}).async="false",e.type="impression",_SgmntfY_._prepareRequest(e,"BANNER_OPERATIONS")},bannerClick:function(e){return(e=e||{}).async="false",e.type="click",_SgmntfY_._variables.disableNextPage||void 0!==e.nextPage||(e.nextPage=!0),_SgmntfY_._addClickedBanner(e.title,e.group,e.order,e.url),_SgmntfY_._prepareRequest(e,"BANNER_OPERATIONS")},bannerUpdate:function(e){return(e=e||{}).async="false",e.type="update",_SgmntfY_._prepareRequest(e,"BANNER_OPERATIONS")},bannerGroupView:function(e){return e=e||{},_SgmntfY_._prepareRequest(e,"BANNER_GROUP_VIEW")},bannerGroupDetail:function(e){return e=e||{},_SgmntfY_._prepareRequest(e,"INTERNAL_BANNER_GROUP")},promotionImpression:function(e){return(e=e||{}).type="impression","string"==typeof e.categories&&(e.categories=[e.categories]),e.categories=(e.categories||[]).filter(_SgmntfY_._null),"string"==typeof e.brands&&(e.brands=[e.brands]),e.brands=(e.brands||[]).filter(_SgmntfY_._null),"string"==typeof e.labels&&(e.labels=[e.labels]),e.labels=(e.labels||[]).filter(_SgmntfY_._null),"string"==typeof e.productIds&&(e.productIds=[e.productIds]),e.productIds=(e.productIds||[]).filter(_SgmntfY_._null),_SgmntfY_._prepareRequest(e,"PROMOTION")},promotionView:function(e){return(e=e||{}).type="view","string"==typeof e.categories&&(e.categories=[e.categories]),e.categories=(e.categories||[]).filter(_SgmntfY_._null),"string"==typeof e.brands&&(e.brands=[e.brands]),e.brands=(e.brands||[]).filter(_SgmntfY_._null),"string"==typeof e.labels&&(e.labels=[e.labels]),e.labels=(e.labels||[]).filter(_SgmntfY_._null),"string"==typeof e.productIds&&(e.productIds=[e.productIds]),e.productIds=(e.productIds||[]).filter(_SgmntfY_._null),_SgmntfY_._prepareRequest(e,"PROMOTION")},pushInteraction:function(a){var r={data:null,url:_SgmntfY_._variables.segmentifyApiUrl+"interaction/notification?apiKey="+_SgmntfY_._variables.apiKey+"&instanceId="+a.instanceId+"&userId="+_SgmntfY_._getUserId()+"&type="+a.type+"&segmentify=true&device="+a._device};_SgmntfY_._getJq().ajax({contentType:"text/plain",processData:!1,type:"GET",url:r.url,timeout:1e3*_SgmntfY_._variables.constants.eventTimeout}).done(function(e,t,n){_SgmntfY_._ajaxSuccess(r,e,t),_SgmntfY_._storePersistentData(a.instanceId,"1",.006),_SgmntfY_.LOG_MESSAGE("INFO","Push campaign interaction is sent for campaign: "+a.instanceId)}).fail(function(e,t,n){_SgmntfY_._ajaxError(r,e,t,n)})}},_prepareRequest:function(e,t,n){if(void 0===e.noSend||"true"!==e.noSend)if(_SgmntfY_._getJq()("html").hasClass("translated-ltr")||_SgmntfY_._getJq()("html").hasClass("translated-rtl"))_SgmntfY_.LOG_MESSAGE("DEBUG","Page is translated, ignoring event");else if(navigator&&navigator.language&&"c"===navigator.language)_SgmntfY_.LOG_MESSAGE("DEBUG","This is a bot, ignoring event");else if(_SgmntfY_._isEmpty(_SgmntfY_._variables.apiKey))_SgmntfY_.LOG_MESSAGE("ERROR","Api Key is not set, not sending event: "+t);else if(_SgmntfY_._isEmpty(_SgmntfY_._getUserId()))_SgmntfY_.LOG_MESSAGE("ERROR","userId is not set, not sending event: "+t);else{if(!_SgmntfY_._isEmpty(_SgmntfY_._getSessionId())){if(void 0===n&&(n=!1),!n&&"boolean"==typeof e.nextPage&&!0===e.nextPage)return _SgmntfY_._addToNextPageQueue({eventName:t,params:e}),null;var a=new Date,r={data:{name:t,userId:_SgmntfY_._getUserId(),sessionId:_SgmntfY_._getSessionId(),testMode:_SgmntfY_._getTestMode()||"false",device:_SgmntfY_._variables.ua.type||"PC",noProcess:e.noProcess||!1,tryCount:0,nextPage:e.nextPage||!1,params:e.params||{},recommendIds:(e.recommendIds||[]).filter(_SgmntfY_._null),pageUrl:e.pageUrl||document.URL,referrer:e.referrer||document.referrer,browser:e.browser||_SgmntfY_._variables.ua.name,os:e.os||_SgmntfY_._variables.ua.os,osversion:e.osversion||_SgmntfY_._variables.ua.osversion,userAgent:e.userAgent||_SgmntfY_._variables.ua.agentString,lang:e.lang||_SgmntfY_._variables.language,currency:e.currency||_SgmntfY_._variables.currency,region:e.region||_SgmntfY_._variables.region,async:e.async||"true",email:e.email||"",ft:_SgmntfY_._getFireTime(a)||"",tz:_SgmntfY_._getTimeZone(a)||""},originalParams:e,eventName:t};"function"==typeof e.recommendationCallback&&_SgmntfY_._getJq().extend(r,{recommendationCallback:e.recommendationCallback});for(var i=_SgmntfY_._variables.requiredParams[t],s=0;s<i.length;++s){if(!_SgmntfY_._isNotEmpty(e[i[s]]))return void _SgmntfY_.LOG_MESSAGE("ERROR","Missing parameter["+i[s]+"] in event: "+t);r.data[i[s]]=e[i[s]],"string"==typeof r.data[i[s]]&&(r.data[i[s]]=_SgmntfY_._clearNullByte(r.data[i[s]]).trim())}var o=_SgmntfY_._variables.optionalParams[t];for(s=0;s<o.length;++s)_SgmntfY_._isNotEmpty(e[o[s]])&&(r.data[o[s]]=e[o[s]],"string"==typeof r.data[o[s]]&&(r.data[o[s]]=_SgmntfY_._clearNullByte(r.data[o[s]]).trim()));return r}_SgmntfY_.LOG_MESSAGE("ERROR","sessionId is not set, not sending event: "+t)}else _SgmntfY_.LOG_MESSAGE("DEBUG","No send flag is set for event: "+t+", ignoring event")},_storePersistentData:function(t,n,e,a){if("undefined"!=typeof Storage&&a)try{localStorage.setItem(t,n),_SgmntfY_.LOG_MESSAGE("DEBUG","Segmentify Persistent Data (Local Storage) Update: "+t+": "+n)}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't store Persistent Data (Local Storage) Update: "+t+": "+n)}else{"string"==typeof n&&(n=encodeURIComponent(n));var r,i,s="",o="";e&&((r=new Date).setTime(r.getTime()+24*e*60*60*1e3),s="; expires="+r.toGMTString()),_SgmntfY_._variables.domain&&2<=_SgmntfY_._variables.domain.split(".").length&&(o="; domain="+_SgmntfY_._variables.domain),i=t+"="+n+s+o+"; path=/";try{document.cookie=i,_SgmntfY_.LOG_MESSAGE("DEBUG","Segmentify Persistent Data (Cookie) Update: "+i)}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't store Persistent Data (Cookie) Update: "+i)}}},_getPersistentData:function(t,e){if("undefined"!=typeof Storage&&e)try{return localStorage.getItem(t)}catch(e){return _SgmntfY_.LOG_MESSAGE("ERROR","Can't get Persistent Data (Local Storage): "+t),null}else{var n=t+"=";try{for(var a=document.cookie.split(";"),r=0;r<a.length;r++){var i=a[r].trim();if(0===i.indexOf(n))return decodeURIComponent(i.substring(n.length,i.length))}return null}catch(e){return _SgmntfY_.LOG_MESSAGE("ERROR","Can't get Persistent Data (Cookie): "+t),null}}},_clearProductUrl:function(e){return _SgmntfY_._stripQueryParameters(e,["_sgm_source","_sgm_campaign","_sgm_action","_sgm_type","_sgm_test","utm_source","utm_medium","utm_term","utm_content","utm_campaign","utm_type","p_id","gclid","ds_p","ds_eid","ds_aid","ds_e","ds_c","ds_cid","ds_ag","ds_agid","ds_k","ds_kid","ds_kids","ds_kidnl","gclick","gsrc","gclsrc"])},_stripQueryParameters:function(e,t){if(void 0===t||!t)return e;"string"==typeof t&&(t=[t]);var n=(e||"").split("?");if(2<=n.length){for(var a=[],r=0;r<(t||[]).length;r++)a.push(encodeURIComponent(t[r])+"=");var i=n[1].split(/[&;]/g);for(r=i.length;0<r--;)for(var s=0;s<a.length;s++)if(-1!==i[r].lastIndexOf(a[s],0)){i.splice(r,1);break}return 0<i.length?n[0]+"?"+i.join("&"):n[0]}return e},_getQueryParameter:function(e,t){var n=location.search;void 0!==t&&(n=t),e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var a=new RegExp("[\\?&]"+e+"=([^&#?]*)").exec(n);return null===a?"":decodeURIComponent(a[1].replace(/\+/g," "))},_sendTrackedEvent:function(e){var t,n,a;if(a="segmentify"===_SgmntfY_._getQueryParameter("utm_source",e)?(t=_SgmntfY_._getQueryParameter("utm_campaign",e),n=_SgmntfY_._getQueryParameter("utm_medium",e),_SgmntfY_._getQueryParameter("utm_content",e)):(t=_SgmntfY_._getQueryParameter("_sgm_campaign",e),n=_SgmntfY_._getQueryParameter("_sgm_action",e),_SgmntfY_._getQueryParameter("_sgm_source",e)),t&&n&&a&&(_SgmntfY_.LOG_MESSAGE("DEBUG","Sending tracked event: "+n+" - "+t+" - "+a),_SgmntfY_._variables.segmentifyObj("event:interaction",{type:n,interactionId:a,instanceId:t})),"push"===n){var r=_SgmntfY_._getPersistentData(t);(_SgmntfY_._isEmpty(r)||_SgmntfY_._isNotEmpty(r)&&"0"===r)&&_SgmntfY_._variables.segmentifyObj("push:interaction",{type:"click",interactionId:a,instanceId:t,_device:_SgmntfY_._variables.ua.type||"PC"})}},_setTestMode:function(e){var t=e||_SgmntfY_._getQueryParameter("_sgm_test");if(_SgmntfY_._toggleTestMode(t),"exists"!==_SgmntfY_._getExtensionStatus()&&"true"===_SgmntfY_._getTestMode())try{var n=['<div class="sgm-test-mode-header">','<a href="http://www.segmentify.com" target="_blank" class="sgm-logo"> </a>','<a href="https://chrome.google.com/webstore/detail/segmentify/dhcffckfimabfhbbjdngnajhnlohfjeo" target="_blank" class="sgm-ext"><span>Get <strong>Chrome Extension</strong> Now!</span></a>','<span class="sgm-test-mode-Show-Hide" data-hide="Hide" data-show="Show"></span>','<div class="sgm-test-mode-key">','<h2 id="sgm-test-mode-message"> Your browser is in<strong>Segmentify Test Mode</strong> </h2>','<div class="sgm-test-mode-radio">','<input class="sgm-tgl sgm-tgl-ios" id="sgm-cb1" type="checkbox" checked>','<label class="sgm-tgl-btn" for="sgm-cb1"></label>',"</div>","</div>","</div>"].join("\n");setTimeout(function(){_SgmntfY_._getJq()("body").prepend(n),"chrome"!==_SgmntfY_._variables.ua.name.toLowerCase()&&_SgmntfY_._getJq()(".sgm-test-mode-header .sgm-ext").hide(),_SgmntfY_._getJq()("body").addClass("sgm-test-body"),_SgmntfY_._getJq()("#sgm-cb1").change(function(){var e=_SgmntfY_._getJq()(this);setTimeout(function(){_SgmntfY_._toggleTestMode(e.is(":checked")?"on":"off")},400)}),_SgmntfY_._getJq()(".sgm-test-mode-Show-Hide").click(function(){_SgmntfY_._getJq()("body").toggleClass("sgm-test-header-open")})},800)}catch(e){_SgmntfY_.LOG_MESSAGE("DEBUG","Can't show test mode header: "+e)}},_getTestMode:function(){return _SgmntfY_._getPersistentData(_SgmntfY_._variables.testMode)},_toggleTestMode:function(e){"on"===e?(_SgmntfY_._getJq()("#sgm-test-mode-message").html("Your browser is in<strong>Segmentify Test Mode</strong>"),_SgmntfY_._getJq()("#sgm-test-mode-message").find("strong").css("color","#50BC61"),_SgmntfY_.LOG_MESSAGE("INFO","Segmentify Test Mode activated"),_SgmntfY_._storePersistentData(_SgmntfY_._variables.testMode,"true",180)):"off"===e&&(_SgmntfY_._getJq()("#sgm-test-mode-message").html("<strong>Segmentify Test Mode</strong> is disabled"),_SgmntfY_._getJq()("#sgm-test-mode-message").find("strong").css("color","#fff"),_SgmntfY_.LOG_MESSAGE("INFO","Segmentify Test Mode deactivated"),_SgmntfY_._storePersistentData(_SgmntfY_._variables.testMode,"false",180),window.alert("You are out of Segmentify Test Mode, you will not see test campaigns."),window.location=_SgmntfY_._stripQueryParameters(document.URL,"_sgm_test"))},_getTracking:function(){var e=_SgmntfY_._getPersistentData(_SgmntfY_._variables.tracking);return _SgmntfY_._isNotEmpty(e)&&_SgmntfY_._setTracking(e),e},_setTracking:function(e){"disabled"!==e&&(e="enabled"),_SgmntfY_._storePersistentData(_SgmntfY_._variables.tracking,e,390)},_getSessionId:function(){var e=_SgmntfY_._getPersistentData(_SgmntfY_._variables.sessionStorageKey,_SgmntfY_._variables.storage.session.local);return e?e.trim():""},_getUserId:function(){var e=_SgmntfY_._getPersistentData(_SgmntfY_._variables.userStorageKey,_SgmntfY_._variables.storage.user.local);return e?e.trim():""},_shuffle:function(e){for(var t,n,a=e.length;a;t=Math.floor(Math.random()*a),n=e[--a],e[a]=e[t],e[t]=n);return e},_getClickedBanners:function(){try{var e=_SgmntfY_._variables.storage.clickedBanners;return JSON.parse(_SgmntfY_._getPersistentData(e.key,e.local))||[]}catch(e){_SgmntfY_.LOG_MESSAGE("DEBUG","Can't read clicked banners: "+e)}return[]},_addClickedBanner:function(e,t,n,a){if(void 0!==e&&void 0!==t&&void 0!==n&&void 0!==a){var r=e+":"+t+":"+n+":"+a,i=_SgmntfY_._getClickedBanners();-1===i.indexOf(r)&&i.push(r),i.length>_SgmntfY_._variables.constants.clickedBannersLimit&&(i=i.splice(i.length-_SgmntfY_._variables.constants.clickedBannersLimit));var s=_SgmntfY_._variables.storage.clickedBanners;_SgmntfY_._storePersistentData(s.key,JSON.stringify(i),0,s.local)}},_getDelayedActions:function(){try{var e=_SgmntfY_._variables.storage.delayedActions;return JSON.parse(_SgmntfY_._getPersistentData(e.key,e.local))||[]}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't read delayed actions: "+e)}return[]},_setDelayedActions:function(e){var t=_SgmntfY_._variables.storage.delayedActions;_SgmntfY_._storePersistentData(t.key,JSON.stringify(e),0,t.local)},_addDelayedAction:function(a){for(var e=_SgmntfY_._getDelayedActions(),t=0;t<e.length;t++)if(e[t].params.actionId===a.params.actionId)return!1;var n=new Date;if(a.delayDate.getTime()<n.getTime())return!1;var r=a.type,i=_SgmntfY_._actions[a.type],s=a.params,o=a.request;return setTimeout(function(){for(var e=_SgmntfY_._getDelayedActions(),t=!1,n=0;n<e.length;n++)e[n].params.actionId===a.params.actionId&&(t=!0);t&&(_SgmntfY_.LOG_MESSAGE("INFO","Action("+r+") is triggered after delay"),i.call(null,s,o),_SgmntfY_._removeDelayedAction(s.actionId))},a.delayDate.getTime()-n.getTime()+Math.floor(750*Math.random())),e.push(a),_SgmntfY_._setDelayedActions(e),!0},_removeDelayedAction:function(e){for(var t=_SgmntfY_._getDelayedActions(),n=0;n<t.length;n++)if(t[n].params.actionId===e)return t.splice(n,1),void _SgmntfY_._setDelayedActions(t)},_getRetryQueue:function(){try{var e=_SgmntfY_._variables.storage.retryQueue;return JSON.parse(_SgmntfY_._getPersistentData(e.key,e.local))||[]}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't read retry queue: "+e)}return[]},_setRetryQueue:function(e){var t=_SgmntfY_._variables.storage.retryQueue;_SgmntfY_._storePersistentData(t.key,JSON.stringify(e),0,t.local)},_addToRetryQueue:function(e){for(var t=_SgmntfY_._getRetryQueue();0<e.length;){var n=e.shift();if("CHECKOUT"===n.eventName||"BASKET_OPERATIONS"===n.eventName||"INTERACTION"===n.eventName){var a=n.data.tryCount||0;a<_SgmntfY_._variables.constants.retryLimit&&(n.data.tryCount=a+1,_SgmntfY_._variables.isUnload&&(n.originalParams.discardResponse="true"),t.push(n))}}_SgmntfY_._setRetryQueue(t)},_consumeRetryQueue:function(){var e=_SgmntfY_._getRetryQueue();if(e&&0<e.length){for(var t=[];0<e.length;){var n=e.shift();n.data.userId=_SgmntfY_._getUserId(),n.data.sessionId=_SgmntfY_._getSessionId(),t.push(n)}_SgmntfY_._sendRequestToServer(t),_SgmntfY_._setRetryQueue([])}},_getDataLayer:function(){return window[_SgmntfY_._variables.dataLayer]},_consumeDataLayer:function(){if(_SgmntfY_._variables.consumeDataLayer){function e(e,t){if(!t.hasOwnProperty("__processed__")||!0!==t.__processed__){var n=_SgmntfY_._extend(t,i),a=_SgmntfY_._functions.getDataLayerFunction(e,n).apply(null,[n]);a&&r.push(a)}}function t(e,t){var n=JSON.parse(JSON.stringify(t)),a=_SgmntfY_._variables.dataLayerConfig[e]||{};for(var r in a)if(a.hasOwnProperty(r)){var i=a[r];if(n.hasOwnProperty(i)){var s=n[i];delete n[i],n[r]=s}}return n}var r=[],n=_SgmntfY_._getDataLayer()||{},i=t("common",n.common||{});for(var a in i.hasOwnProperty("userId")&&_SgmntfY_._functions.setUserId(i.userId),n)if(n.hasOwnProperty(a)){if("common"===a)continue;if(_SgmntfY_._getJq().isArray(n[a]))for(var s=0;s<n[a].length;++s)e(a,t(a,n[a][s])),_SgmntfY_._getDataLayer()[a][s].__processed__=!0;else e(a,t(a,n[a])),_SgmntfY_._getDataLayer()[a].__processed__=!0}0<r.length&&_SgmntfY_._sendRequestToServer(r)}},_getNextPageQueue:function(){try{var e=_SgmntfY_._variables.storage.nextPageQueue;return JSON.parse(_SgmntfY_._getPersistentData(e.key,e.local))||[]}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't read next page queue: "+e)}return[]},_setNextPageQueue:function(e){var t=_SgmntfY_._variables.storage.nextPageQueue;_SgmntfY_._storePersistentData(t.key,JSON.stringify(e),0,t.local)},_addToNextPageQueue:function(e){var t=_SgmntfY_._getNextPageQueue();t.push(e),_SgmntfY_._setNextPageQueue(t)},_consumeNextPageQueue:function(){var e=_SgmntfY_._getNextPageQueue();if(e&&0<e.length){for(var t=[];0<e.length;){var n=e.shift();n.hasOwnProperty("data")||(n=_SgmntfY_._prepareRequest(n.params,n.eventName,!0)),n.data.userId=_SgmntfY_._getUserId(),n.data.sessionId=_SgmntfY_._getSessionId(),t.push(n)}_SgmntfY_._sendRequestToServer(t),_SgmntfY_._setNextPageQueue([])}},_addRecommendedProduct:function(e){_SgmntfY_._variables.recommendedProducts.push(e)},_containsRecommendedProduct:function(e){return 0<=_SgmntfY_._variables.recommendedProducts.indexOf(e)},_addRecommendedPromotion:function(e){_SgmntfY_._variables.recommendedPromotions.push(e)},_containsRecommendedPromotion:function(e){return 0<=_SgmntfY_._variables.recommendedPromotions.indexOf(e)},_getExtensionStatus:function(){try{var e=_SgmntfY_._variables.storage.extensionStatus;return _SgmntfY_._getPersistentData(e.key,e.local)||""}catch(e){_SgmntfY_.LOG_MESSAGE("DEBUG","Can't read extension status: "+e)}return""},_getDelayedCampaigns:function(){try{var e=_SgmntfY_._variables.storage.delayedCampaigns;return JSON.parse(_SgmntfY_._getPersistentData(e.key,e.local))||[]}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't read delayed campaigns: "+e)}return[]},_setDelayedCampaigns:function(e){var t=_SgmntfY_._variables.storage.delayedCampaigns;_SgmntfY_._storePersistentData(t.key,JSON.stringify(e),0,t.local)},_addDelayedCampaign:function(a){for(var e=_SgmntfY_._getDelayedCampaigns(),t=0;t<e.length;++t)if(e[t].campaign.instanceId===a.campaign.instanceId)return!1;var n=new Date;if(a.time.getTime()<n.getTime())return!1;var r=a.campaign,i=a.request,s=_SgmntfY_._campaigns[r.type];return setTimeout(function(){for(var e=_SgmntfY_._getDelayedCampaigns(),t=!1,n=0;n<e.length;++n)e[n].campaign.instanceId===a.campaign.instanceId&&(t=!0);t&&(_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+r.type+") triggered after delay"),s.call(null,r,i),_SgmntfY_._removeDelayedCampaign(r.instanceId))},a.time.getTime()-n.getTime()+Math.floor(750*Math.random())),e.push(a),_SgmntfY_._setDelayedCampaigns(e),!0},_removeDelayedCampaign:function(e){for(var t=_SgmntfY_._getDelayedCampaigns(),n=0;n<t.length;n++)if(t[n].campaign.instanceId===e)return t.splice(n,1),void _SgmntfY_._setDelayedCampaigns(t)},_getFireTime:function(e){function t(e,t){for(var n=e.toString();n.length<t;)n="0"+n;return n}try{return e.getFullYear()+"."+t(e.getMonth(),2)+"."+t(e.getDate(),2)+" "+t(e.getHours(),2)+":"+t(e.getMinutes(),2)+":"+t(e.getSeconds(),2)+"."+t(e.getMilliseconds(),3)}catch(e){return""}},_getTimeZone:function(e){try{return e.getTimezoneOffset().toString()}catch(e){return""}},_getJq:function(){return _SgmntfY_._variables.jq},_getMustache:function(){return _SgmntfY_._variables.mustache},_getObjectByString:function(e,t){for(var n=(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),a=0,r=n.length;a<r;++a){var i=n[a];if(!(i in e))return;e=e[i]}return e},_isUndefined:function(e){return void 0===e},_notNull:function(e){return void 0!==e&&null!=e},_isEmpty:function(e){return void 0===e||null==e||""===e},_isNotEmpty:function(e){return!_SgmntfY_._isEmpty(e)},_isPlainObject:function(e){if("object"!=typeof e||null===e)return!1;if("function"!=typeof Object.getPrototypeOf)return"[object Object]"==Object.prototype.toString.call(e);var t=Object.getPrototypeOf(e);return t===Object.prototype||null===t},_exists:function(e){return e instanceof HTMLElement?null!==e:(e instanceof HTMLCollection||e instanceof _SgmntfY_._getJq()||e instanceof jQuery||e instanceof $)&&0<e.length},_extend:function(){var e,t,n,a,r,i=arguments[0]||{},s=1,o=arguments.length,c=!1;for("boolean"==typeof i&&(c=i,i=arguments[s]||{},s++);s<o;s++)if(null!=(e=arguments[s]))for(t in e)if(e.hasOwnProperty(t)){if(n=i[t],i===(a=e[t]))continue;c&&a&&_SgmntfY_._isPlainObject(a)?(r=n&&"object"==typeof n&&null!==n?n:{},i[t]=_SgmntfY_._extend(c,r,a)):void 0!==a&&(i[t]=a)}return i},_split:function(e,t,n){if(e&&"string"==typeof e){var a,r=e.split(t);for(a=0;a<r.length;a++)r[a]=r[a].trim();if(n&&n<r.length){var i=r.splice(0,n-1);i.push(r.join(t)),r=i}return r}return null},_parseFloat:function(e){return null==e?e:void 0===e?null:"number"==typeof e?e:"string"==typeof e?parseFloat(e):e},_parseBoolean:function(e){return void 0===e?null:"number"==typeof e?0===e?"false":"true":"string"==typeof e?"0"===e||"false"===e.toLowerCase()?"false":"true":"boolean"==typeof e?e.toString():e},_null:function(e){return null!=e&&""!=e},_clearNullByte:function(e){return e.replace(/\0/g,"")},_checkVersion:function(e,t){var n=t.split("."),a=e.split(".");prevs=[];for(var r=0,i=Math.max(n.length,a.length);r<i;r++){if(n[r]=parseInt(n[r]),isNaN(n[r])&&(n[r]=0),a[r]=parseInt(a[r]),isNaN(a[r])&&(a[r]=0),n[r]<a[r])return!1;if(n[r]>a[r])return!0}return!0},_updateBrowserAndDeviceInfo:function(){if(void 0!==window.bowser){var e=window.bowser._detect(_SgmntfY_._variables.ua.agentString);null==_SgmntfY_._variables.ua.type&&(e.tablet?_SgmntfY_._variables.ua.type="tablet":e.mobile?_SgmntfY_._variables.ua.type="mobile":_SgmntfY_._variables.ua.type="PC",e.chromium?_SgmntfY_._variables.ua.name="Chrome":_SgmntfY_._variables.ua.name=e.name,_SgmntfY_._variables.ua.version=e.version),null==_SgmntfY_._variables.ua.os&&(_SgmntfY_._variables.ua.os=e.osname||"Other",_SgmntfY_._variables.ua.osversion=e.osversion)}},_addLeavePageHandler:function(e,t){var n=e.type,a=e.params,r=_SgmntfY_._actions[n];_SgmntfY_.LOG_MESSAGE("INFO","Action("+n+") will be triggered when user leaves page");var i=function(e){e.clientY<0&&(_SgmntfY_.LOG_MESSAGE("INFO","Action("+n+") is triggered at user leave page"),_SgmntfY_._getJq()(document).unbind("mouseleave",i),r.call(null,a,t))};_SgmntfY_._getJq()(document).bind("mouseleave",i)},_addWaitPageHandler:function(e,t){var n=e.type,a=e.params,r=e.delayAction||null,i=_SgmntfY_._actions[n],s=parseInt(r.time);_SgmntfY_.LOG_MESSAGE("INFO","Action("+n+") will be triggered after "+s+" second(s) delay on same page"),setTimeout(function(){_SgmntfY_.LOG_MESSAGE("INFO","Action("+n+") is triggered after delay"),i.call(null,a,t)},1e3*s)},_addScrollHandler:function(e,t){var n=e.type,a=e.delayAction,r=parseInt(a.time)||0;_SgmntfY_.LOG_MESSAGE("INFO","Action ("+n+") will be triggered after "+r+"% of page is scrolled");var i=function(){r<=_SgmntfY_._getScrollPercent()&&(_SgmntfY_.LOG_MESSAGE("INFO","Action ("+n+") triggered after "+r+"% of page is scrolled"),_SgmntfY_._getJq()(document).unbind("scroll",i),_SgmntfY_._actions[n].call(null,e.params,t))};_SgmntfY_._getJq()(document).bind("scroll",i)},_addCampaignDelayHandler:function(e,t){var n=e.type,a=e.timing,r=parseInt(a.param);_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+n+") will be triggered after "+r+" second(s) delay on same page"),window.setTimeout(function(){_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+n+") triggered after "+r+" delay"),_SgmntfY_._campaigns[n].call(null,e,t)},1e3*r)},_addCampaignDelayAllPagesHandler:function(e,t){var n=e.timing||"0",a={campaign:e,request:t,time:new Date((new Date).getTime()+1e3*parseInt(n.param))};_SgmntfY_._addDelayedCampaign(a)?_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+e.instanceId+") added for delayed campaign in future"):_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+e.instanceId+") already added for delayed campaign")},_addCampaignScrollHandler:function(e,t){var n=e.type,a=e.timing,r=parseInt(a.param);_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+n+") will be triggered after "+r+"% of page is scrolled");var i=function(){r<=_SgmntfY_._getScrollPercent()&&(_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+n+") triggered after "+r+"% of page is scrolled"),_SgmntfY_._getJq()(document).unbind("scroll",i),_SgmntfY_._campaigns[n].call(null,e,t))};_SgmntfY_._getJq()(document).bind("scroll",i)},_addCampaignLeaveHandler:function(t,n){var a=t.type;_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+a+") will be triggered when user leaves page");var r=function(e){e.clientY<0&&(_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+a+") triggered at user leave page"),_SgmntfY_._getJq()(document).unbind("mouseleave",r),_SgmntfY_._campaigns[a].call(null,t,n))};_SgmntfY_._getJq()(document).bind("mouseleave",r)},_addCampaignInteractionHandler:function(e,t){},_getScrollPercent:function(){var e=document.documentElement,t=document.body,n="scrollTop",a="scrollHeight";return(e[n]||t[n])/((e[a]||t[a])-e.clientHeight)*100},_updateUserAndSessionId:function(r){_SgmntfY_._variables.waitingKeys=!0;var i={data:null,url:_SgmntfY_._variables.segmentifyApiUrl+"/get/key/v1.json?count="+r};_SgmntfY_._getJq().ajax({contentType:"text/plain",processData:!1,type:"GET",url:i.url,timeout:1e3*_SgmntfY_._variables.constants.eventTimeout}).done(function(e,t,n){_SgmntfY_._ajaxSuccess(i,e,t),2===r&&_SgmntfY_._storePersistentData(_SgmntfY_._variables.userStorageKey,e[1],390,_SgmntfY_._variables.storage.user.local);var a=_SgmntfY_._getUserId();_SgmntfY_._isEmpty(a)?_SgmntfY_.LOG_MESSAGE("ERROR","Can't update User Id"):(_SgmntfY_.LOG_MESSAGE("INFO","User Id Changed: "+a),_SgmntfY_._storePersistentData(_SgmntfY_._variables.sessionStorageKey,e[0],0,_SgmntfY_._variables.storage.session.local),_SgmntfY_._isEmpty(_SgmntfY_._getSessionId())?_SgmntfY_.LOG_MESSAGE("ERROR","Can't update User Session"):(_SgmntfY_.LOG_MESSAGE("INFO","User Session Changed: "+e[0]),_SgmntfY_._variables.waitingKeys=!1))}).fail(function(e,t,n){_SgmntfY_._ajaxError(i,e,t,n),_SgmntfY_._variables.waitingKeys=!1})},_sendRequestToServer:function(e){if(e&&!(e.length<=0)){for(var t=[],n=[],a=0;a<e.length;++a)"false"===e[a].data.async?t.push(e[a]):n.push(e[a]);0<t.length&&_SgmntfY_._syncRequest(t),0<n.length&&_SgmntfY_._asyncRequest(n)}},_syncRequest:function(a){for(var r=[],e=0;e<a.length;e++)r.push(a[e].data);_SgmntfY_._getJq().ajax({contentType:"text/plain",processData:!1,type:"POST",url:_SgmntfY_._variables.segmentifyApiUrl+"/sync/events/v1.json?apiKey="+_SgmntfY_._variables.apiKey,data:JSON.stringify(r),timeout:1e3*_SgmntfY_._variables.constants.eventTimeout}).done(function(e,t,n){_SgmntfY_._ajaxSuccess(r,e,t),"SUCCESS"!==e.statusCode&&_SgmntfY_.LOG_MESSAGE("WARN","Segmentify response is ("+e.statusCode+")")}).fail(function(e,t,n){_SgmntfY_._addToRetryQueue(a),_SgmntfY_._ajaxError(r,e,t,n)})},_asyncRequest:function(_){for(var g=[],e=0;e<_.length;e++)g.push(_[e].data);_SgmntfY_._getJq().ajax({contentType:"text/plain",processData:!1,type:"POST",url:_SgmntfY_._variables.segmentifyApiUrl+"/add/events/v1.json?apiKey="+_SgmntfY_._variables.apiKey,data:JSON.stringify(g),timeout:1e3*_SgmntfY_._variables.constants.eventTimeout}).done(function(e,t,n){_SgmntfY_._ajaxSuccess(g,e,t);var a=e.statusCode||"";if("SUCCESS"===a){var r=e.responses,i=e.campaigns;if(r.length===_.length&&i.length===_.length)for(var s=0;s<r.length;s++){var o=_[s],c=r[s],m=i[s];"true"!==o.originalParams.discardResponse?(_SgmntfY_._getResponse(o,c),_SgmntfY_._getCampaign(o,m)):_SgmntfY_.LOG_MESSAGE("DEBUG","Action("+o.eventName+") responses are discarded")}else _SgmntfY_.LOG_MESSAGE("WARN","Segmentify response length("+r.length+") doesn't match request length("+_.length+")")}else _SgmntfY_.LOG_MESSAGE("WARN","Segmentify response is ("+a+")"),"NO_SESSIONID"===a?_SgmntfY_._updateUserAndSessionId(1):"NO_USERID"===a&&_SgmntfY_._updateUserAndSessionId(2)}).fail(function(e,t,n){_SgmntfY_._addToRetryQueue(_),_SgmntfY_._ajaxError(g,e,t,n)})},_getResponse:function(e,t){for(var n=0;n<t.length;n++){var a=t[n];if(a.hasOwnProperty("type")){var r=a.type,i=a.delayAction||null,s=a.params,o=(a.instanceId,_SgmntfY_._actions[r]);if(!1===s.isControlGroup){_SgmntfY_.LOG_MESSAGE("DEBUG","User is in control group for campaign: "+s.instanceId);continue}if("function"==typeof o)if(i&&"LEAVE_PAGE"===i.type)_SgmntfY_._addLeavePageHandler(a,e);else if(i&&"WAIT_SAME_PAGE"===i.type&&0<parseInt(i.time))_SgmntfY_._addWaitPageHandler(a,e);else if(i&&"WAIT_ALL_PAGES"===i.type&&0<parseInt(i.time)){var c={delayDate:new Date((new Date).getTime()+1e3*parseInt(i.time)),params:s,type:r,request:e};_SgmntfY_._addDelayedAction(c)?_SgmntfY_.LOG_MESSAGE("INFO","Action(id="+c.params.actionId+") is added for delayed action in future"):_SgmntfY_.LOG_MESSAGE("INFO","Action(id="+c.params.actionId+") is already added for delayed action")}else i&&"SCROLL"===i.type?_SgmntfY_._addScrollHandler(a,e):(_SgmntfY_.LOG_MESSAGE("INFO","Action("+r+") triggered immediately"),o.call(null,s,e));else _SgmntfY_.LOG_MESSAGE("WARN","Unknown action: "+r)}}},_getCampaign:function(e,t){for(var n=0;n<t.length;n++){var a=t[n]||{};if(a.hasOwnProperty("type")){var r=a.type,i=_SgmntfY_._campaigns[r];if("function"==typeof i){var s=a.timing||{};"DELAY"===s.type?_SgmntfY_._addCampaignDelayHandler(a,e):"DELAY_ALL_PAGES"===s.type?_SgmntfY_._addCampaignDelayAllPagesHandler(a,e):"SCROLL"===s.type?_SgmntfY_._addCampaignScrollHandler(a,e):"PAGELEAVE"===s.type?_SgmntfY_._addCampaignLeaveHandler(a,e):"INTERACTION"===s.type?_SgmntfY_._addCampaignInteractionHandler(a,e):(_SgmntfY_.LOG_MESSAGE("INFO","Campaign ("+r+") triggered immediately."),i.call(null,a,e))}else _SgmntfY_.LOG_MESSAGE("WARN","Unknown campaign: "+r)}}},_sourceOfUrl:function(){var e="";if(document.URL||document.referrer){if(_SgmntfY_._getQueryParameter("gclid").length)return"PAID";var t=_SgmntfY_._getQueryParameter("utm_medium");if(t.length)switch(t){case"social":e="SOCIAL";break;case"organic":e="SEARCH";break;case"cpc":case"cpm":case"ocpm":case"paid-media":case"affiliate":case"banner":case"retargeting":case"shopping":e="PAID";break;case"email":e="EMAIL"}if(!e.length){var n=document.referrer.replace("https://","").replace("http://","");-1!==(n=n.substring(0,n.indexOf("/"))).indexOf(_SgmntfY_._variables.domain)?e="INTERNAL":-1!==n.indexOf("facebook")||-1!==n.indexOf("twitter")||-1!==n.indexOf("t.co")||-1!==n.indexOf("instagram")||-1!==n.indexOf("pinterest")?e="SOCIAL":-1!==n.indexOf("google")||-1!==n.indexOf("g.co")||-1!==n.indexOf("bing")||-1!==n.indexOf("yandex")||-1!==n.indexOf("yahoo")?e="SEARCH":-1===n.indexOf("cimri.com")&&-1===n.indexOf("akakce.com")&&-1===n.indexOf("ucuzcu.com")&&-1===n.indexOf("bilio.com")&&-1===n.indexOf("auspreiser.de")&&-1===n.indexOf("billiger.de")&&-1===n.indexOf("dooyoo.de")&&-1===n.indexOf("geizhals.de")&&-1===n.indexOf("guenstiger.de")&&-1===n.indexOf("idealo.de")&&-1===n.indexOf("kelkoo.de")&&-1===n.indexOf("preis.de")&&-1===n.indexOf("preissuchmaschine.de")&&-1===n.indexOf("geizkragen.de")&&-1===n.indexOf("preisvergleich.de")&&-1===n.indexOf("preisroboter.de")&&-1===n.indexOf("vergelijk.be")&&-1===n.indexOf("pazaruvaj")&&-1===n.indexOf("nabava.net")&&-1===n.indexOf("ceneje.si")&&-1===n.indexOf("heureka")&&-1===n.indexOf("pricerunner")&&-1===n.indexOf("hinnavaatlus")&&-1===n.indexOf("skroutz.gr")&&-1===n.indexOf("agrep.hu")&&-1===n.indexOf("arukereso.hu")&&-1===n.indexOf("trovaprezzi.it")&&-1===n.indexOf("prisjakt.no")&&-1===n.indexOf("prisguiden.no")&&-1===n.indexOf("ceneo.pl")&&-1===n.indexOf("kuantokusta.pt")&&-1===n.indexOf("compari.ro")||(e="LISTING")}e.length||(e="OTHER")}return e},_enableSerializeForm:function(r){r.fn.sgmSerializeForm||(r.fn.sgmSerializeForm=function(){"use strict";var a={};return r.each(this.serializeArray(),function(e,t){var n=a[t.name];null!=n?r.isArray(n)?n.push(t.value):a[t.name]=[n,t.value]:a[t.name]=t.value}),r.each(a,function(e,t){null!=t&&r.isArray(t)&&(a[e]=t.join())}),a})},init:function(){_SgmntfY_._variables.namespace=window.SegmentifyTrackingObject,_SgmntfY_._variables.segmentifyObj=window[_SgmntfY_._variables.namespace];var e=_SgmntfY_._getQueryParameter("_sgm_tracking");if(_SgmntfY_._isNotEmpty(e)&&_SgmntfY_._setTracking(e),"disabled"!==_SgmntfY_._getTracking())if(_SgmntfY_._notNull(_SgmntfY_._variables.segmentifyObj)&&_SgmntfY_._notNull(_SgmntfY_._variables.segmentifyObj.q)){if(_SgmntfY_._variables.initTimer&&window.clearTimeout(_SgmntfY_._variables.initTimer),_SgmntfY_.modernize(),_SgmntfY_.LOG_MESSAGE("DEBUG","*** Segmentify is loading... ***"),_SgmntfY_._extend(!0,_SgmntfY_._variables,_SgmntfY_._variables.segmentifyObj.config),_SgmntfY_._functions.setLogLevel(_SgmntfY_._variables.logLevel),!(_SgmntfY_._variables.domain&&0<=document.URL.indexOf(_SgmntfY_._variables.domain)))return void console.error("Segmentify domain is not set properly: "+_SgmntfY_._variables.domain);if(window.onunload=_SgmntfY_._windowUnload,null==_SgmntfY_._variables.jq)_SgmntfY_._loadJavascript(_SgmntfY_._variables.jQueryUrl,!0,function(){_SgmntfY_._variables.jq=jQuery.noConflict(!0),_SgmntfY_._enableSerializeForm(_SgmntfY_._variables.jq),_SgmntfY_._initializeDelayedActions(),_SgmntfY_._initializeDelayedCampaigns(),_SgmntfY_._sendTrackedEvent(),_SgmntfY_._setTestMode()});else{if(!_SgmntfY_._checkVersion("1.7",_SgmntfY_._variables.jq.fn.jquery))return void console.error("Segmentify requires jQuery version >= 1.7");_SgmntfY_._enableSerializeForm(_SgmntfY_._variables.jq),_SgmntfY_._initializeDelayedActions(),_SgmntfY_._initializeDelayedCampaigns(),_SgmntfY_._sendTrackedEvent(),_SgmntfY_._setTestMode()}null==_SgmntfY_._variables.mustache&&(_SgmntfY_._variables.mustache={},initializeMustache(_SgmntfY_._variables.mustache),_SgmntfY_._variables.mustache.tags=["[[","]]"]),_SgmntfY_._updateBrowserAndDeviceInfo(),_SgmntfY_.LOG_MESSAGE("DEBUG","*** Running on a "+_SgmntfY_._variables.ua.type+" ***"),_SgmntfY_.LOG_MESSAGE("DEBUG","*** Segmentify loaded and started... ***"),_SgmntfY_.run(),_SgmntfY_._dispatchInitEvent()}else{if(++_SgmntfY_._variables.initTryCount,_SgmntfY_._variables.initTryCount>_SgmntfY_._variables.initTryLimit)return void window.clearTimeout(_SgmntfY_._variables.initTimer);window.clearTimeout(_SgmntfY_._variables.initTimer),_SgmntfY_._variables.initTimer=window.setTimeout(_SgmntfY_.init,100)}else _SgmntfY_.LOG_MESSAGE("DEBUG","End-user opted-out Segmentify tracking!")},_initializeDelayedActions:function(){try{var e=_SgmntfY_._getDelayedActions();_SgmntfY_._setDelayedActions([]);for(var t=new Date,n=0;n<e.length;n++)e[n].delayDate=new Date(e[n].delayDate),e[n].delayDate.getTime()>t.getTime()&&_SgmntfY_._addDelayedAction(e[n])}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't initialize delayed actions: "+e)}},_initializeDelayedCampaigns:function(){try{var e=_SgmntfY_._getDelayedCampaigns();_SgmntfY_._setDelayedCampaigns([]);for(var t=new Date,n=0;n<e.length;++n)e[n].time=new Date(e[n].time),e[n].time.getTime()>t.getTime()&&_SgmntfY_._addDelayedCampaign(e[n])}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Can't initialize delayed campaigns: "+e)}},_dispatchInitEvent:function(){try{if(window.dispatchEvent){var e={testMode:_SgmntfY_._getTestMode()};window.dispatchEvent(new CustomEvent("segmentifyInited",{detail:e}))}}catch(e){}},_ajaxError:function(e,t,n,a){_SgmntfY_.LOG_MESSAGE("WARN","Error in sending event:\nEvent Data: "+JSON.stringify(e.data)+"\nResponse: "+t.responseText+"\nStatus: "+n+"\nError: "+a)},_ajaxSuccess:function(e,t,n){_SgmntfY_.LOG_MESSAGE("DEBUG","Success in sending event:\nEvent Data: "+JSON.stringify(e)+"\nStatus: "+n+"\nResponse Data: "+JSON.stringify(t))},_windowUnload:function(){_SgmntfY_._variables.isUnload=!0,window.clearTimeout(_SgmntfY_._variables.runTimer);for(var e=[];0<_SgmntfY_._variables.segmentifyObj.q.length;)try{var t=_SgmntfY_._variables.segmentifyObj.q.shift(),n=_SgmntfY_._functions.getFunction(t[0]),a=Array.prototype.slice.call(t,1);(i=n.apply(null,a)).originalParams.discardResponse="true",e.push(i)}catch(e){}for(var r=_SgmntfY_._getRetryQueue();0<r.length;)try{var i;(i=r.shift()).originalParams.discardResponse="true",e.push(i)}catch(e){}_SgmntfY_._setRetryQueue(e)},run:function(){try{if(_SgmntfY_._variables.jq&&(_SgmntfY_._variables.segmentifyObj.q&&0<_SgmntfY_._variables.segmentifyObj.q.length||_SgmntfY_._getDataLayer())&&!_SgmntfY_._variables.waitingKeys){var e=0,t=_SgmntfY_._getUserId(),n=_SgmntfY_._getSessionId();if(_SgmntfY_._isEmpty(t)?e=2:_SgmntfY_._isEmpty(n)?e=1:_SgmntfY_._isNotEmpty(n)&&0<_SgmntfY_._variables.segmentifyObj.q.length&&(_SgmntfY_._storePersistentData(_SgmntfY_._variables.sessionStorageKey,n,0,_SgmntfY_._variables.storage.session.local),_SgmntfY_._storePersistentData(_SgmntfY_._variables.userStorageKey,t,390,_SgmntfY_._variables.storage.user.local)),0<e)_SgmntfY_._updateUserAndSessionId(e);else{if(_SgmntfY_._variables.segmentifyObj.q&&0<_SgmntfY_._variables.segmentifyObj.q.length){var a=_SgmntfY_._variables.segmentifyObj.q.splice(0,_SgmntfY_._variables.segmentifyObj.q.length);_SgmntfY_._functions.callFunction(a)}_SgmntfY_._getDataLayer()&&_SgmntfY_._consumeDataLayer()}}window.clearTimeout(_SgmntfY_._variables.runTimer),_SgmntfY_._variables.runTimer=window.setTimeout(_SgmntfY_.run,_SgmntfY_._variables.constants.frequency)}catch(e){_SgmntfY_.LOG_MESSAGE("ERROR","Error in run: "+e),window.clearTimeout(_SgmntfY_._variables.runTimer),_SgmntfY_._variables.runTimer=window.setTimeout(_SgmntfY_.run,_SgmntfY_._variables.constants.frequency)}},modernize:function(){"function"!=typeof String.prototype.startsWith&&(String.prototype.startsWith=function(e){return 0===this.lastIndexOf(e,0)}),"function"!=typeof String.prototype.endsWith&&(String.prototype.endsWith=function(e){return-1!==this.indexOf(e,this.length-e.length)}),"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),Array.prototype.indexOf||(Array.prototype.indexOf=function(e,t){if(null==this)throw new TypeError('"this" is null or not defined');var n=Object(this),a=n.length>>>0;if(0==a)return-1;var r=+t||0;if(Math.abs(r)===1/0&&(r=0),a<=r)return-1;for(var i=Math.max(0<=r?r:a-Math.abs(r),0);i<a;){if(i in n&&n[i]===e)return i;i++}return-1}),Array.prototype.map||(Array.prototype.map=function(e,t){var n,a,r;if(null==this)throw new TypeError(" this is null or not defined");var i=Object(this),s=i.length>>>0;if("function"!=typeof e)throw new TypeError(e+" is not a function");for(1<arguments.length&&(n=t),a=new Array(s),r=0;r<s;){var o,c;r in i&&(o=i[r],c=e.call(n,o,r,i),a[r]=c),r++}return a});var i=JSON.stringify;if(JSON.stringify=function(e){var t=Array.prototype.toJSON,n=Number.prototype.toJSON,a=String.prototype.toJSON;delete Number.prototype.toJSON,delete Array.prototype.toJSON,delete String.prototype.toJSON;var r=void 0;try{r=i(e)}catch(e){r=void 0}return t&&(Array.prototype.toJSON=t),n&&(Number.prototype.toJSON=n),a&&(String.prototype.toJSON=a),r},"function"!=typeof window.CustomEvent){function e(e,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n}e.prototype=window.Event.prototype,window.CustomEvent=e}},LOG_MESSAGE:function(e,t){var n=_SgmntfY_._variables.logLevel,a=_SgmntfY_.LOG_LEVELS[e];void 0!==a&&a<=n&&console.log("Segmentify["+e+"]: "+t)}};_SgmntfY_.init()}(window);