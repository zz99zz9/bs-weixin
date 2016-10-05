function goPromotion() {
    var promotionUrl = '';
    ajaxJsonp({
        url: urls.promotionList,
        successCallback: function(json) {
            if (json.status == 1) {
                if(json.data.length > 0) {
                    json.data.map(function(p) {
                        if(p.status == 2) {
                            promotionUrl = 'promotion-detail.html';
                        }
                    });
                }
                
                if(promotionUrl == '') {
                    promotionUrl = 'promotion-apply.html';
                }

                location.href = promotionUrl;
            }
        }
    });
}