
export function setCart(value) {
    const now = new Date();
  
    const item = {
      value: value,
      expiry: now.getTime() + 1000 * 60 * 60 * 2, // 2 hours expiration date
    };

    localStorage.setItem('cart', JSON.stringify(item));
}

export function clearCart(){
  localStorage.removeItem('cart');
}

export function getCart() {
    const itemStr = localStorage.getItem('cart');
    
    if (!itemStr) {
      return [];
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      // Item has expired
      localStorage.removeItem('cart');
      return [];
    }
    
    return item.value;
  }
