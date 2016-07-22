var orderData = Storage.get("orderData");

var vmPayend = avalon.define({
	$id: "payend",
	data: {},
	goOrder: function() {
		location.href = "order.html?id=" + vmPayend.data.id;
	}
});

if(orderData) {
    vmPayend.data = orderData;
} else {
    location.href = "index.html";
}