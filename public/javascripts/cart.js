function init() {
    var prices = document.getElementsByClassName("price");
    var total = document.getElementById("total");
    var quantities = document.getElementsByClassName("quantity");
    var amounts = document.getElementsByClassName("amount");
	//刪除按鈕
	var deleteButton = document.getElementsByClassName("deleteButton");
	for (let i = 0; i < deleteButton.length; i++) {
		deleteButton[i].addEventListener("click", function(e) {
            let productId = this.getAttribute('productId');
    		//移除tr
			e.target.closest(".productItems").remove();
	 		ajaxDeleteCart(productId);
	 		//計算總額
	 		getPrice();
	 		getCartNum();
		});
	}
    function ajaxDeleteCart(productId) {
        var xhr = new XMLHttpRequest();
        var url = `/carts/${productId}`;
        xhr.open('delete', url, true);
        xhr.send();
    }

	//改變數量就更新總額
	for (let i = 0; i < quantities.length; i++) {
		quantities[i].addEventListener("change", getPrice);
	}

	function getPrice() {
		let totalPrice = 0;
		for (let i = 0; i <quantities.length; i++) {
			var qty = Number(quantities[i].value);
			var price = Number(prices[i].innerText);
			amounts[i].innerText = qty * price;
			totalPrice += (qty*price);
		}
		total.innerText = totalPrice;
	};
	getPrice();
} 
window.addEventListener('load', init);