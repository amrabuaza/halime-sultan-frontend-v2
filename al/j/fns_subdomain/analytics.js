var workLater = function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
}();

var mdnsGTM = {
    currency: (typeof currencyUpper !== 'undefined') ? currencyUpper : '',
    pageType: (typeof gPageType !== 'undefined') ? gPageType == "Home" ? "Homepage" : gPageType : "",
    elementIndex:[],
    getAllElementToIndex() {
        document.querySelectorAll(".promoDataContainer,.promoDataContainerFirstSlider").forEach(function (element, index) {
            mdnsGTM.elementIndex.push(parseInt(element.getAttribute('data-banner-id')));
        });
    },
    getElementIndex(bannerId) {
        return mdnsGTM.elementIndex.indexOf(bannerId)+1;
    },
    isFiltered: function () {
        return location.href.match(/(fcolor|fmarka|ffabric|fpattern|dimensions|height|fsize|prmin|prmax)/) ? " Filtered" : "";
    },
    impressionPromos:[],
    addImpressionPromo: function (id,name,creative,position) {
        index = (typeof index !== "undefined") ? index + 1 : 1;
        if (mdnsGTM.impressionPromos.length > 4) {
            mdnsGTM.sendImpressionPromo();
        }
        mdnsGTM.impressionPromos.push({
            'id': id+'',
            'name': name,
            'position': mdnsGTM.pageType + ' | ' + position + '| ' + mdnsGTM.getElementIndex(id)
        });

        workLater(function () {
            mdnsGTM.sendImpressionPromo();
        }, 3000);
    },
    sendImpressionPromo: function () {
        if (mdnsGTM.impressionPromos.length <= 0 ) {
            return false;
        }
        dataLayer.push({
            'ecommerce': {
                'promoView': {
                    'promotions': mdnsGTM.impressionPromos
                }
            },
            'eventCategory': 'Enhanced Ecommerce',
            'eventAction': 'Promotion',
            'eventLabel': 'Promotion Impression',
            'noninteraction': true,
            'Value': 0,
            'event': 'eecEvent'
        });

        mdnsGTM.impressionPromos = [];
    },
    sendClickPromo: function (id, name, creative, position) {

        dataLayer.push({
            'ecommerce': {
                'promoClick': {
                    'promotions': [{
                        'id': id+'',
                        'name': name,
                        'position': mdnsGTM.pageType + ' | ' + position + ' | ' + mdnsGTM.getElementIndex(id)

                    }]
                }
            },
            'Category': 'Enhanced Ecommerce',
            'Action': 'Promotion',
            'Label': 'Promotion Impression Click',
            'noninteraction': false,
            'Value': 0,
            'event': 'eecEvent'
        });
    },
    impressionProducs:[],
    addImpressionProduct: function (id,name,brand,price,category,list,position,variant) {

        if (mdnsGTM.impressionProducs.length > 4) {
            mdnsGTM.sendImpressionProduct();
        }
        mdnsGTM.impressionProducs.push({
            'id': id + '',
            'name': name,
            'brand': brand,
            'category': category,
            'list': mdnsGTM.pageType + mdnsGTM.isFiltered(),
            'position': position,
            'price': price,
            'variant': variant,
        });
        workLater(function () {
            mdnsGTM.sendImpressionProduct();
        }, 3000);
    },
    sendImpressionProduct: function () {
        if (mdnsGTM.impressionProducs.length <= 0 ) {
            return false;
        }
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Product',
            'Label': 'Product Impressions',
            'Value': 0,
            'noninteraction': true,
            'ecommerce': {
                'currencyCode': mdnsGTM.currency,
                'impressions': mdnsGTM.impressionProducs,
                'actionField': {
                    'list': mdnsGTM.getListName()
                }
            },
            'event': 'eecEvent'
        });

        mdnsGTM.impressionProducs = [];
    },
    sendClickProduct: function (id, name, category, brand, price, color, index) {
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Product Impression',
            'Label': 'Product Impression Click',
            'Value': 0,
            'noninteraction': false,
            'ecommerce': {
                'click': {
                    'actionField': {
                        'list': mdnsGTM.getListName()
                    },
                    'products': [{
                        'id': id+'',
                        'name': name,
                        'brand': brand,
                        'category': category,
                        'list': mdnsGTM.pageType  + mdnsGTM.isFiltered(),
                        'position': index,
                        'price': price,
                        'variant': color
                    }]
                }
            },
            'event': 'eecEvent'
        });
    },
    sendProductDetailDisplay: function (id,name,category,brand,price,variant,dimension39,dimension40,dimension42,dimension44,dimension45,dimension46,dimension51,dimension54) {
        dataLayer.push({
            'Category':'Enhanced Ecommerce',
            'Action':'Detail',
            'Label':'Impression',
            'Value':0,
            'noninteraction':false,
            'ecommerce': {
                'currencyCode': mdnsGTM.currency,
                'detail':{
                    'products': [{
                        'id': id+'',
                        'name': name,
                        'brand': brand,
                        'price': price,
                        'category': category,
                        'variant': variant,
                        'dimension39': dimension39+'', // product availability (1,0)
                        'dimension40': '%' + dimension40+'', //discount rate
                        'dimension42': dimension42+'', // first price
                        'dimension44': dimension44+'', // product fabric
                        'dimension45': dimension45+'', // product season
                        'dimension46': dimension46+'', // product pattern
                        'dimension51': dimension51+'', // pl/stock , product stock type
                        'dimension53': mdnsGTM.isProductExistsFavorite(id), // product exists favorite
                        'dimension54': dimension54+'' // not outlet ( in outlet or not in outlet)
                    }]
                }
            },
            'event':'eeEvent'
        });
    },
    sendAddToCart: function (id,name,category,brand,price,variant,quantity,dimension40,dimension42,dimension44,dimension45,dimension46,dimension51,dimension54) {
        dataLayer.push({
            'Category':'Enhanced Ecommerce',
            'Action':'addToCart',
            'Label':'Add to Cart',
            'Value':0,
            'noninteraction':false,
            'ecommerce': {
                'currencyCode': mdnsGTM.currency,
                'add':{
                    'products': [{
                        'id': id+'',
                        'name': name,
                        'brand': brand,
                        'price': price,
                        'category': category,
                        'variant': variant,
                        'quantity' : quantity,
                        'dimension39': "1", // product availability (1,0)
                        'dimension40': '%' + dimension40+'', //discount rate
                        'dimension42': dimension42+'', // first price
                        'dimension44': dimension44+'', // product fabric
                        'dimension45': dimension45+'', // product season
                        'dimension46': dimension46+'', // product pattern
                        'dimension51': dimension51+'', // pl/stock , product stock type
                        'dimension53': mdnsGTM.isProductExistsFavorite(id), // product exists favorite
                        'dimension54': dimension54+'' // not outlet ( in outlet or not in outlet)
                    }]
                }
            },
            'event':'eeEvent'
        });

        if (typeof window.pintrk !== "undefined") {
            pintrk('track', 'addtocart', {
                value: price,
                order_quantity: 1,
                currency: mdnsGTM.currency
            });
        }
    },
    removeFromCart: function (id,name,category,brand,price,variant,dimension40,dimension42) {
        dataLayer.push({
            'Category':'Enhanced Ecommerce',
            'Action':'removeFromCart',
            'Label':'Remove from Cart',
            'Value':0,
            'noninteraction':false,
            'ecommerce': {
                'currencyCode': mdnsGTM.currency,
                'remove':{
                    'products': [{
                        'id': id+'',
                        'name': name,
                        'brand': brand,
                        'price': price,
                        'category': category,
                        'variant': variant,
                        'dimension39': "1", // product availability (1,0)
                        'dimension40': '%' + dimension40+'', //discount rate
                        'dimension42': dimension42+'', // first price
                        'dimension53': mdnsGTM.isProductExistsFavorite(id)
                    }]
                }
            },
            'event':'eeEvent'
        });
    },
    checkoutProduct:[],
    addCheckoutProduct: function (id,name,category,brand,price,variant,dimension40,dimension42) {
        mdnsGTM.checkoutProduct.push({
            'id': id+'',
            'name': name,
            'brand': brand,
            'price': price+'',
            'category': category,
            'variant': variant,
            'quantity': 1,
            'dimension39': "1",
            'dimension40': '%' + dimension40+'',
            'dimension42': dimension42+'',
            'dimension53': mdnsGTM.isProductExistsFavorite(id)
        });
    },
    sendCheckout : function (step) {
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Checkout',
            'Label': 'Cart View',
            'Value': 0,
            'noninteraction': true,
            'ecommerce': {
                'currencyCode': mdnsGTM.currency,
                'checkout': {
                    'actionField': {
                        'step': step+''
                    },
                    'products': mdnsGTM.checkoutProduct
                }
            },
            'event': 'eeEvent'
        });
        mdnsGTM.checkoutProduct = [];
    },
    purchaseConfirmation: function (paymentId, paymentType, revenue, tax, shipping, coupon, countryCurrency, usedRecordedCard, usedNewAddress) {
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Checkout',
            'Label': 'Purchase Confirmation',
            'Value': 0,
            'noninteraction': true,

            'ecommerce': {
                'currencyCode': countryCurrency,
                'purchase': {
                    'actionField': {
                        'dimension63': paymentType,
                        'cd_registeredCreditCard': usedRecordedCard,
                        'cd_registeredAdress': usedNewAddress,
                        'id': paymentId+'',
                        'revenue': revenue+'',
                        'tax': tax+'',
                        'shipping': shipping+'',
                        'coupon': coupon
                    },

                    'products': mdnsGTM.checkoutProduct
                }
            },
            'event': 'eeEvent'
        });
    },
    pushEvent: function (category,action,label) {
        dataLayer.push({
            'Category': category,
            'Action': action,
            'Label': label,
            'event': 'gaEvent'
        });
    },
    impressionCombines:[],
    addImpressionCombine: function (name,id,brand,category,variant,position,price) {
        if (mdnsGTM.impressionCombines.length > 7) {
            mdnsGTM.sendImpressionCombine();
        }
        mdnsGTM.impressionCombines.push({
            'name': name,
            'id': id+'',
            'price': price,
            'brand': brand,
            'category': category,
            'variant': variant,
            'list': 'Kombinini Tamamla',
            'position': position
        });

        workLater(function () {
            mdnsGTM.sendImpressionCombine();
        }, 100);

    },
    sendImpressionCombine:function () {
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Product',
            'Label': 'Impression',
            'event': 'eeEvent',
            'ecommerce': {
                'currencyCode': mdnsGTM.currency,
                'impressions':mdnsGTM.impressionCombines
            }
        });
    },
    sendClickCombine: function (masterProduct,name,id,brand,category,variant,price) {
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Product',
            'Label': 'Click',
            'Value': 0,
            'noninteraction': false,
            'event': 'eeEvent',
            'ecommerce': {
                'click': {
                    'actionField': {'list': 'Kombinini Tamamla'},
                    'products': [{
                        'name': name,
                        'id': id+'',
                        'price': price,
                        'brand': brand,
                        'category': category,
                        'variant': variant
                    }]
                }
            }
        });

    },
    sendAddToCartCombine: function($products){
        var productsData = [];
        $.map($products,function (product){
            var $product = $(product);
            productsData.push({
                'id': $product.data('id')+'',
                'name': $product.data('name'),
                'brand': $product.data('brand'),
                'price': $product.data('price'),
                'category': $product.data('category'),
                'variant': $product.data('variant'),
                'quantity' : $product.data('quantity'),
                'dimension39': $product.data('quantity'),
                'dimension40': '%' + $product.data('dimension40')+'', //discount rate
                'dimension42': $product.data('dimension42')+'', // first price
                'dimension44': $product.data('dimension44')+'', // product fabric
                'dimension45': $product.data('dimension45')+'', // product season
                'dimension46': $product.data('dimension46')+'', // product pattern
                'dimension51': $product.data('dimension51')+'', // pl/stock , product stock type
                'dimension53': mdnsGTM.isProductExistsFavorite($product.data('id')), // product exists favorite
                'dimension54': $product.data('dimension54')+'' // not outlet ( in outlet or not in outlet)
            })
        });
        if(productsData.length == 0){
            return true;
        }

        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'addToCart',
            'Label': 'Add to Cart',
            'Value': 0,
            'noninteraction': false,
            'ecommerce': {
                'add': {
                    'products': productsData
                },
            },
            'event': 'eeEvent'
        });
    },
    sendClickPredict: function (id,name,brand,price,category,position){
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Product',
            'Label': 'Click',
            'Value': 0,
            'noninteraction': false,
            'ecommerce': {
                'currencyCode': 'TRY',
                'click': {
                    'actionField': {'list': ' Benzer Ürünler'},
                    'products': [{
                        'id': id+'',
                        'name': name,
                        'brand': brand,
                        'price':price,
                        'category': category,
                        'position': position
                    }]
                }
            },
            'event': 'eeEvent'
        });
    },
    impressionPredict:[],
    addImpressionPredict: function (id,name,brand,price,category,position){
        if (mdnsGTM.impressionPredict.length > 7) {
            mdnsGTM.sendImpressionPredict();
        }
        mdnsGTM.impressionPredict.push({
            'id': id+'',
            'name': name,
            'brand': brand,
            'price': price,
            'category': category,
            'list': 'Benzer Ürünler',
            'position': position
        });

        workLater(function () {
            mdnsGTM.sendImpressionPredict();
        }, 100);
    },
    sendImpressionPredict:function () {
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Product',
            'Label': 'Impression',
            'noninteraction': true,
            'ecommerce': {
                'currencyCode': 'TRY',
                'impressions': mdnsGTM.impressionPredict
            },
            'event': 'eeEvent'
        });
    },
    sendAddCoupon: function () {
        dataLayer.push({
            'Category': 'Sepet',
            'Action': 'Kupon Kodu',
            'Label': 'Uygula',
            'dimension70': 'byHand',
            'dimension71':'No',
            'event':'gaEvent'
        });
    },
    sendOpenCoupon: function () {
        dataLayer.push({
            'Category':'Sepet',
            'Action':'Kupon Kodu',
            'Label':'Goster',
            'event':'gaEvent'
        });
    },
    userLoginOrRegisterEvent: function (eventType, userWith) {
        var label = "";

        if (userWith === 'email') {
            label = 'by Email';
        } else if (userWith === 'sms' || userWith === 'phone') {
            label = 'by Phone';
        } else if (userWith === 'Facebook') {
            label = 'by Facebook';
        }

        dataLayer.push({
            'Category': 'Sign Up/Login',
            'Action': eventType,
            'Label': 'Success - ' + label,
            'event': 'gaEvent',
            'dimension75': per_email,
            'dimension76': per_tel_sale,
            'dimension77': per_sms
        });

        if (eventType === "Sign Up" && typeof window.pintrk !== "undefined") {
            pintrk('track', 'signup');
        }
    },
    isProductExistsFavorite: function (productId) {
        productId = parseInt(productId, 10);
        return typeof userFavoriteProducts !== 'undefined' && userFavoriteProducts.indexOf(productId) !== -1 ? "Yes" : "No";
    },
    sendFavoriteEvent: function (event,list,id, name, category, brand, price) {
        dataLayer.push({
            'Category': 'Enhanced Ecommerce',
            'Action': 'Favorite',
            'Label': event,
            'Value': 0,
            'noninteraction': true,
            'ecommerce': {
                'click': {
                    'actionField': {
                        'list': list
                    },
                    'products': [{
                        'id': id+'',
                        'name': name,
                        'brand': brand,
                        'price': price,
                        'category': category,
                        'position': ""
                    }],
                }
            },
            'event': 'eeEvent'
        });
    },
    getListName: function () {
        return sessionStorage.getItem("GTMProductDetailViewListName") ? sessionStorage.getItem("GTMProductDetailViewListName") : "0";
    }

};
document.addEventListener("DOMContentLoaded", function() {
    mdnsGTM.getAllElementToIndex();
})
