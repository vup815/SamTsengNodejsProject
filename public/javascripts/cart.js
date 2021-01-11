function init() {
	var prices = document.getElementsByClassName("price");
	var total = document.getElementById("total");
	var quantities = document.getElementsByClassName("quantity");
	var amounts = document.getElementsByClassName("amount");
	//刪除按鈕
	var deleteButton = document.getElementsByClassName("deleteButton");
	for (let i = 0; i < deleteButton.length; i++) {
		deleteButton[i].addEventListener("click", function (e) {
			let productId = this.getAttribute('productId');
			//移除tr
			e.target.closest(".productItems").remove();
			ajaxDeleteCart(productId);
			//計算總額
			getPrice();
		});
	}
	function ajaxDeleteCart(productId) {
		var xhr = new XMLHttpRequest();
		var url = `/carts/${productId}`;
		xhr.onload = () => {
            if (xhr.status === 200) getCartNum();
        }
		xhr.open('delete', url, true);
		xhr.send();
	}

	//改變數量就更新總額
	for (let i = 0; i < quantities.length; i++) {
		quantities[i].addEventListener("change", getPrice);
	}

	function getPrice() {
		let totalPrice = 0;
		for (let i = 0; i < quantities.length; i++) {
			var qty = Number(quantities[i].value);
			var price = Number(prices[i].innerText);
			amounts[i].innerText = qty * price;
			totalPrice += (qty * price);
		}
		total.innerText = totalPrice;
	};
	getPrice();


	let order = document.getElementById('order');
	order.addEventListener('click', () => {
		let carts = [];
		let productIds = document.getElementsByClassName('productId');
		for (let i = 0; i < prices.length; i++) {
			cart = {};
			cart.id = productIds[i].innerText;
			cart.amount = Number(quantities[i].value);
			carts.push(cart);
		}
		sendOrder(JSON.stringify(carts));
		window.setTimeout(() => location.href = '/orders', 300);
	})

	function sendOrder(carts) {
		let xhr = new XMLHttpRequest();

		let url = '/orders';
		xhr.open('post', url, true);
		xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
		xhr.send('carts=' + carts);
	}
}
window.addEventListener('load', init);
