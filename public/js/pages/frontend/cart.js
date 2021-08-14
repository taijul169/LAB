// Variable-declaration-----------------
const addTocartBtn = document.getElementById("addTocartBtn");
const cartContentHome = document.getElementById("cart-content-home");
const cartItemNumber = document.getElementById("cartItemNumber");
const cartTotalAmount = document.getElementById("cartTotalAmount");
const cartBoxHome = document.getElementById("cart-box-home-top");
const clearCartBtn = document.getElementById("clearCartBtn");
const singleCartItem = document.querySelector('.single-product-cart');
const cartPageCartWrapper = document.querySelector('.cart-page-cart-wrapper');

//cart-----------
let cart = [];
// custom-products- start ----taijul islam------------------------
class Products{

 getProducts() {
       
        
        const modalTitle = document.querySelector(".modal-title").innerText;
        // const itemOnePrice = document.querySelector(".itemOnePrice").innerText;
        const itemPriceOneDom = document.getElementById('itemPriceOne');
        const itemPriceTwoDom = document.getElementById('itemPriceTwo');
        const itemPriceThreeDom = document.getElementById('itemPriceThree');
        const itemPriceFourDom = document.getElementById('itemPriceFour');
        let  itemPriceOne = 0;
        let  itemPriceTwo = 0;
        let  itemPriceThree = 0;
        let  itemPriceFour = 0;
        if(itemPriceOneDom.checked == true){
             itemPriceOne = itemPriceOneDom.value;
        }
        if(itemPriceTwoDom.checked == true){
            itemPriceTwo = itemPriceTwoDom.value;
        }
        if(itemPriceThreeDom.checked == true){
            itemPriceThree = itemPriceThreeDom.value;
        }
        if(itemPriceFourDom.checked == true){
            itemPriceFour = itemPriceFourDom.value;
        }
       
        // const itemTwoPrice = document.querySelector(".itemTwoPrice").innerText;
        // const itemThreePrice = document.querySelector(".itemThreePrice").innerText;
        // const itemFourPrice = document.querySelector(".itemFourPrice").innerText;
        let quantity = document.querySelector('.quantityNumber').innerText;
        quantity = parseInt(quantity);
        let totalPrice= (parseInt(itemPriceOne) + parseInt(itemPriceTwo) +parseInt(itemPriceThree)+ parseInt(itemPriceFour))*quantity;
        const id = document.querySelector(".ProId").innerText;
        
        if(itemThreePrice == ''){
            itemThreePrice.innerText ="0";
        }
        if(itemFourPrice == ''){
            itemFourPrice.innerText ="0";
        }
        let products = {id, modalTitle, itemPriceOne,itemPriceTwo, itemPriceThree,itemPriceFour,quantity,totalPrice};
        return products;
    }

}
// custom-products- end ----taijul islam------------------------


// display products
class UI {
    

    addTocart() {

       //get product from prducts
      let cartItem = {...Storage.getProduct(), amount: 1 };
       // add product to the cart
       cart = [...cart, cartItem]; 
       //save cart in local storage
       Storage.saveCart(cart);
       //set cart values
       this.setCartValues(cart);
       //display cart item
       this.addCartItem(cartItem);
       //display cart item in cart page
       // this.addCartItemInCartPage(cartItem);
       // show the cart  
        
    }
    setCartValues(cart){
        let tempTotal = 0.00;
        let itemsTotal = 0;
        
        cart.map(item => {
            let unitPrice = 0;
            unitPrice=  parseInt(item.totalPrice) / parseInt(item.quantity);
            tempTotal +=  unitPrice * parseInt(item.quantity);
            // itemsTotal += item.amount;
            
        })
        cartTotalAmount.innerHTML =`$${parseFloat(tempTotal.toFixed(2))}`;
        // cartItemNumber.innerHTML = itemsTotal;
    }
  
    addCartItem(item) {

            let quantity = parseInt(item.quantity);
            let total = (parseInt(item.itemPriceOne) +parseInt(item.itemPriceTwo)+ parseInt(item.itemPriceThree)+parseInt(item.itemPriceFour));
            const div = document.createElement('div');
            div.classList.add('single-product-cart');
            const singleService =  document.getElementById(item.id);
            singleService.disabled  = true;
            singleService.parentElement.style.opacity="0.3";
            div.innerHTML = `
                    <div class="cart-product-img" id="${item.id}">
                        <img src="images/icon/slide-icon4.png" alt="1.jpg">
                    </div>
                    <div class="cart-product-details-home">
                        <p>${item.modalTitle}<button onclick= "itemRemoveCart('${item.id}')" class="float-right closeBtn"><i class="far fa-times-circle"></i></button></p>
                        <div class="cart-midle-home">
                          <div class="cart-midle-right-home">
                          <ul class="service-list service-list-cart">
                           <li>Dry Wash- ${item.itemPriceOne}</li>
                           <li>Steam Wash- ${item.itemPriceTwo}</li>
                           <li>Dry iron -${item.itemPriceThree}</li>
                           <li>Steam Iron -${item.itemPriceFour}</li>
                          </ul>
                           <div class="cart-bottom d-flex">
                            <ul class="quantity-controler-cart">
                                <li><button class="decrease-btn-cart" onclick="decrease('cart-quantity${item.id}','cart-item-amount${item.id}','${item.id}',${total})"><i class="fas fa-minus"></i></button></li>
                                <li class="cart-quantity" id="cart-quantity${item.id}">${item.quantity}</li>
                                <li><button class="increase-btn-cart" onclick="increase('cart-quantity${item.id}','cart-item-amount${item.id}','${item.id}',${total})"><i class="fas fa-plus"></i></button></li>
                            </ul>
                            <p class="mr-5 mt-2"><b id="cart-item-amount${item.id}">${item.totalPrice}</b>Tk</p>
                           </div>
                        </div>
                        </div>
                        
                    </div>
                    <div class="cart-item-del-btn-home">
                        <b class="fa fa-close" data-id="${item.id}"></b>
                    </div>`;
            cartBoxHome.appendChild(div);

        
       
    }
    setupAPP() {
        cart = Storage.getCart();
        //display cart item into cart ------
        // this.addCartItem(cart);
           this.setCartValues(cart);
           this.populateCart(cart);
        
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartBoxHome.children.length > 0) {
            cartBoxHome.removeChild(cartBoxHome.children[0]);
        }
        
        }
   

    
}
// local storage
class Storage{
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct() {
        let product = JSON.parse(localStorage.getItem('products'));
        return product;
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() { 
      return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }


}

document.addEventListener("DOMContentLoaded", ()=> {
    const ui = new UI();
    // add product to the cart
    //setup application--------------
    ui.setupAPP();
    
    // .then(() => {
    //     alert("loaded");
    //     ui.addTocart();
    //     ui.cartLogic();
    // });
    
});
document.querySelector('.addToCartBtn').addEventListener('click',()=>{
    const ui = new UI();
    const products = new Products();
    // get all products
    const product = products.getProducts();
    Storage.saveProducts(product);
    ui.addTocart();
    //setup application--------------
   
})


// cart-quantity-controler-----------------------
function increase(id1,id2,id3,unitPrice){
    var unitPrice = parseInt(unitPrice);
    var element = (document.getElementById(id1));
    var amountElement = (document.getElementById(id2));
    var amount = parseInt(amountElement.innerText);
    var cartQuantity = parseInt(element.innerText);
    // var unitPrice = Math.round(amount*cartQuantity);
    cartQuantity+=1;
    var total = unitPrice * cartQuantity;
    element.innerText = cartQuantity;
    amountElement.innerText  = total;

    // cart update------

    var cart = JSON.parse(localStorage.cart);
    for (var i = 0; i < cart.length; i++) {
    if(id3 === cart[i].id){  //look for match with id
        cart[i].quantity = cartQuantity;// updating cart quantity
        cart[i].totalPrice = total;// updating cart quantity
        break;  //exit loop since you found the person
     }
    }
    const ui = new UI();
    ui.setCartValues(cart);
    localStorage.setItem("cart", JSON.stringify(cart));  //put the object back
  
}


  function decrease(id1,id2,id3,unitPrice){
    var unitPrice = parseInt(unitPrice);
    var element = (document.getElementById(id1));
    var amountElement = (document.getElementById(id2));
    var amount = parseInt(amountElement.innerText);
    var cartQuantity = parseInt(element.innerText);
    cartQuantity-=1;
    if(cartQuantity<1){
        cartQuantity = 1;
    }
    var total = unitPrice * cartQuantity;
    element.innerText = cartQuantity;
    amountElement.innerText  = total;

     // cart update------

     var cart = JSON.parse(localStorage.cart);
     for (var i = 0; i < cart.length; i++) {
     if(id3 === cart[i].id){  //look for match with id
         cart[i].quantity = cartQuantity;// updating cart quantity
         cart[i].totalPrice = total;
         break;  //exit loop since you found the person
      }
     }
     const ui = new UI();
     ui.setCartValues(cart);
     localStorage.setItem("cart", JSON.stringify(cart));  //put the object back
    
  }


//   cartTotal value-------



// Remove item---------------------
function itemRemoveCart(id){
    const items =  JSON.parse(localStorage.getItem('cart'));
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(filtered));
    const element = document.getElementById(id);
    element.parentElement.remove();
    
}