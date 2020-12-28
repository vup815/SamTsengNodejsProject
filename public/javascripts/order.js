function init() {
    var card_headers = document.getElementsByClassName("card-header");

    for (let i = 0; i < card_headers.length; i++) {
        card_headers[i].addEventListener("click", function (e) {
            var up = this.closest(".card-header").children[0];
            var down = this.closest(".card-header").children[1];
            if (up.getAttribute("style") == "display:inline") {
                up.setAttribute("style", "display:none");
                down.setAttribute("style", "display:inline");
            } else {
                up.setAttribute("style", "display:inline");
                down.setAttribute("style", "display:none");
            }
        })
    }

    let modalTitle = document.getElementsByClassName("modal-title")[0];
    
    



    let myBtn = document.getElementsByClassName("myBtn");
    let confirm = document.getElementById("confirm");
    for (let i = 0; i < myBtn.length; i++) {
        myBtn[i].addEventListener("click", function (e) {
            $('#orderModal').modal('show');
            e.stopPropagation();
            modalTitle.innerText = this.innerText + "?";
            let orderId = this.getAttribute("data-orderId");
            var btnText = this.textContent;
            let status = "";
            if (btnText === "確認取貨") {
                status = "finished";
            }
            if (btnText === "取消訂單") {
                status = "canceled";
                confirm.setAttribute('url', '/orders/canceled');
            }
            confirm.setAttribute("status", status);
            confirm.setAttribute('orderId', orderId);
        })
    }


    confirm.addEventListener("click", function (e) {
        let status = this.getAttribute("status");
        let orderId = this.getAttribute('orderId');
        let url = this.getAttribute('url');
        ajaxChangeStatus(status, orderId);
        window.setTimeout(() => location.href=url, 200);
    })

    function ajaxChangeStatus(status, orderId) {
        var xhr = new XMLHttpRequest();
        var url = `/orders/${orderId}`;
        xhr.open("put", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(`statusToChange=${status}`);
    }

    var navBar = document.getElementById("myNav");
    var navs = navBar.children;
    var hr = document.createElement("hr");
    hr.classList.add("text-primary");
    var status = document.getElementById("status").textContent;
    var index = 0;
    switch (status) {
        case "all":
            index = 0;
            break;
        case "ordered":
            index = 1;
            break;
        case "shipped":
            index = 2;
            break;
        case "finished":
            index = 3;
            break;
        case "canceled":
            index = 4;
            break;
    }
    navs[index].children[0].appendChild(hr);
    navs[index].children[0].classList.add("text-primary");
}

window.addEventListener("load", init);