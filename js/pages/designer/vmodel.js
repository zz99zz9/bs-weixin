var Designerid = getParam("id");
if(Designerid != "") {
    if(isNaN(Designerid)) {
        location.href = document.referrer || "index.html";
    } else {
        Designerid = parseInt(Designerid);
    }
} else {
    location.href = "index.html";
}

var vmDesigner= avalon.define({
    $id: "designer",
    designer: {}
});

ajaxJsonp({
    url: urls.getDesigner,
    data: {id:Designerid},
    successCallback: function(json) {
        if(json.status === 1){
            vmDesigner.designer = json.data;
        }
    }
});