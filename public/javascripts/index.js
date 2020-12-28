function init() {

    var cartButs = document.getElementsByClassName('cartBut');
    for (let i = 0; i < cartButs.length; i++) {
        cartButs[i].addEventListener('click', function (e) {
            this.children[0].setAttribute('display', 'none');
            this.children[1].setAttribute('display', 'inline');
            let productId = this.getAttribute('productId');
            addToCart(productId);
            
        })
    }
    function addToCart(productId) {
        var xhr = new XMLHttpRequest();
        var url = `/carts/${productId}`;
        xhr.onload = () => {
            if (xhr.status === 200) getCartNum();
        }
        xhr.open('post', url, true);
        xhr.send();
    }

    var emptyHearts = document.getElementsByClassName('emptyHeart');
    var fullHearts = document.getElementsByClassName('fullHeart');
    let productId = document.getElementsByClassName('productId');
    function changeHeart(list) {
        for (var i = 0; i < productId.length; i++) {
            if (list.indexOf(productId[i].innerText.trim()) != -1) {
                emptyHearts[i].setAttribute('display', 'none');
                fullHearts[i].setAttribute('display', 'inline');
            }
        }
    }

    let getCarts = function () {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status == 200) {
                changeHeart(xhr.responseText);
            }
        }
        var url = '/carts/ajax';
        xhr.open('get', url, true);
        xhr.send();
    }();

    let cartNum = document.getElementById("shopping_cart_num");

    let getCartNum = function() {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status == 200) {
                cartNum.innerHTML = xhr.responseText;
            }
        }
        let url = '/carts/cartNum';
        xhr.open('get', url, true);
        xhr.send();
    };

    getCartNum();

    // 分頁開始
        var tr = document.querySelectorAll(".card-product-list"); //抓取所有內容行 
        var num = tr.length; //表格所有行數 
       var ary = [];
       for (var i = 0; i < num.length; i++) {
           ary.push(num[i]);
       }

        /*--------設定每頁顯示行數------*/
        var pageSize = 3;         //*
        /*-------------------------*/

        var totalPage = Math.ceil(num / pageSize); //算出總共有幾頁
        var str = '';
        for (var i = 0; i < totalPage; i++) {       //產生對應按鈕數
            str += `<li class="page-item" value="${i+1}"><a class="page-link">${i+1}</a></li>`;
        }
        $(".Next").before(str);

        var btn = document.querySelectorAll('.page-item'); //每個按鈕註冊除了第一個跟最後一個
        for (var i = 1; i < btn.length - 1; i++) {
            btn[i].addEventListener('click', goPage.bind(this, i));
        }
        var previous = document.querySelector('.Previous'); //第一頁按鈕 各別註冊
        previous.addEventListener('click', goPage.bind(this, 1));
        var next = document.querySelector('.Next'); 		//最末頁按鈕 各別註冊
        next.addEventListener('click', goPage.bind(this, totalPage));


        function goPage(page) { 			//切換頁數函式 page > 當前頁數
            var startRow = (page - 1) * pageSize + 1; //開始顯示的行
            var endRow = page * pageSize; 		//結束顯示的行
            endRow = (endRow > num) ? num : endRow; //num > 表格所有行數

            //遍歷顯示資料實現分頁
            for (var i = 1; i < (num + 1); i++) {
                var trrow = tr[i - 1];
                if (i >= startRow && i <= endRow) {
                    trrow.style.display = "table-row";
                } else {
                    trrow.style.display = "none";
                }
            }
        }
        goPage(1);
    //	分頁結束

    //    搜尋開始
        let prod_names = document.getElementsByClassName("name");
        let search = document.getElementById("search");
        search.addEventListener("keyup", function(e) {
            var query = this.value.trim().toLowerCase();
            if (query.trim().length == 0){
                goPage(1);
                document.getElementById("pagination").style.display = "inline";
                return;
        }
        let display = false;

            for (let i = 0; i < prod_names.length; i++) {
                let name = prod_names[i].innerHTML.trim().toLowerCase();
                console.log(name);
                if(name.indexOf(query) !== -1) {
                    prod_names[i].closest("article").style.display = "inline";
                    display = true;
                } else {
                    prod_names[i].closest("article").style.display =  "none";
                }
            }
            console.log(display);
            if (!display) { 
                document.getElementById("pagination").style.display = "none";
            }
        })

}
window.addEventListener('load', init);