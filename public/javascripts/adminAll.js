function init() {

	var checks = document.getElementsByClassName("check");
	var crosses = document.getElementsByClassName("cross");
	var ups = document.getElementsByClassName("up");
	var downs = document.getElementsByClassName("down");
	var upDowns = document.getElementsByClassName("upDown");
	var myStatus = document.getElementsByClassName("myStatus");
	for (let i = 0 ; i < upDowns.length; i++) {
		upDowns[i].addEventListener("click", function(e){
			var up = this.children[0];
			var down = this.children[1];
			if(this.children[0].getAttribute("display") === "inline"){
				up.setAttribute("display", "none");
				checks[i].setAttribute("display", "none");
				down.setAttribute("display", "inline");
				crosses[i].setAttribute("display", "inline");
			} else {
				down.setAttribute("display", "none");
				crosses[i].setAttribute("display", "none");
				up.setAttribute("display", "inline");
				checks[i].setAttribute("display", "inline");
			}
			let productId = this.getAttribute('productId');
			ajaxToggleStatus(productId);
		});
	}

	function ajaxToggleStatus(productId) {
		var xhr = new XMLHttpRequest();

		var url=`/products/${productId}`;
		xhr.open('put', url, true);
		xhr.send();
	}

	for (let i = 0; i < myStatus.length; i++) {
		if (myStatus[i].innerText.trim() === "false"){
			ups[i].setAttribute("display", "inline");
			checks[i].setAttribute("display", "none");
			downs[i].setAttribute("display", "none");
			crosses[i].setAttribute("display", "inline");
		} else {
			downs[i].setAttribute("display", "inline");
			crosses[i].setAttribute("display", "none");
			ups[i].setAttribute("display", "none");
			checks[i].setAttribute("display", "inline");
		}
	}
}
window.addEventListener("load", init);