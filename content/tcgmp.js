async function tcgmp() {
    console.log('┣ Start tcgmp script');

    function keyPressListener() {
        document.addEventListener('keydown', function (e) {
            switch (e.keyCode) {
                case 37:
                    document.querySelector(".prev").click()
                    break;
                case 39:
                    document.querySelector(".next").click()
                    break;
            }
        });
    }
    keyPressListener();

    function hideWorldShipping() {
        setTimeout(function () {
            console.log('loop');
            var shippingElem = document.getElementById("zigzag-worldshopping-checkout");
            if(shippingElem!=null){
                document.getElementById("zigzag-worldshopping-checkout").style.all="";
                document.getElementById("zigzag-worldshopping-checkout").style.display="none";
            }else{
                hideWorldShipping();
            }

        }, 100)
    }
    hideWorldShipping();
    console.log('┗ End tcgmp script');
}
tcgmp();