let demoEvents = {};

demoEvents.productsSearched = {
  eventName: 'Products Searched',
  properties: {
    query: 'power meter'
  }
};


demoEvents.productViewed = {
  eventName: 'Product Viewed',
  properties: {
    product_id: '507f1f77bcf86cd799439011',
    sku: 'SH810170',
    category: 'Power Meter',
    name: 'PRECISION 3',
    price: 384.99,
    crankset: 'Shimano - GRX FC-RX810 170mm',
    crank_lenght: '170mm',
    crank_type: 'GRX RX810',
    currency: 'usd',
    url: 'https://4iiii.com/usa/products/pdp/left-side-precision-3-powermeter-ride-ready/',
    image_url: 'https://www.example.com/product/path.jpg'
  }
};

demoEvents.productAdded = {
  eventName: 'Product Added',
  properties: {
    cart_id: 'skdjsidjsdkdj29j',
    product_id: '507f1f77bcf86cd799439011',
    sku: 'SH810170',
    category: 'Power Meter',
    name: 'PRECISION 3',
    price: 384.99,
    crankset: 'Shimano - GRX FC-RX810 170mm',
    crank_lenght: '170mm',
    crank_type: 'GRX RX810',
    currency: 'usd',
    url: 'https://4iiii.com/usa/products/pdp/left-side-precision-3-powermeter-ride-ready/',
    image_url: 'https://www.example.com/product/path.jpg'
  }
};


demoEvents.cartViewed = {
  eventName: 'Cart Viewed',
  properties: {
    cart_id: 'd92jd29jd92jd29j92d92jd',
    products: [
      {
        product_id: '507f1f77bcf86cd799439011',
        sku: 'SH810170',
        category: 'Power Meter',
        name: 'PRECISION 3',
        price: 384.99,
        crankset: 'Shimano - GRX FC-RX810 170mm',
        crank_lenght: '170mm',
        crank_type: 'GRX RX810',
        currency: 'usd',
        url: 'https://4iiii.com/usa/products/pdp/left-side-precision-3-powermeter-ride-ready/',
        image_url: 'https://www.example.com/product/path.jpg'
      }
    ]
  }
};

demoEvents.checkoutStarted = {
  eventName: 'Checkout Started',
  properties: {
    order_id: '50314b8e9bcf0',
    currency: 'USD',
    products: [
      {
        product_id: '507f1f77bcf86cd799439011',
        sku: 'SH810170',
        category: 'Power Meter',
        name: 'PRECISION 3',
        price: 384.99,
        crankset: 'Shimano - GRX FC-RX810 170mm',
        crank_lenght: '170mm',
        crank_type: 'GRX RX810',
        currency: 'usd',
        url: 'https://4iiii.com/usa/products/pdp/left-side-precision-3-powermeter-ride-ready/',
        image_url: 'https://www.example.com/product/path.jpg'
      }
    ]
  }
};

demoEvents.paymentInfoEntered = {
  eventName: 'Payment Info Entered',
  properties: {
    checkout_id: '787cg246gc87x',
    order_id: 'dkfsjidfjsdifsdfksdjfkdsfjsdfkdsf'
  }
};

demoEvents.orderCompleted = {
  eventName: 'Order Completed',
  properties: {
    order_id: '50314b8e9bcf0',
    currency: 'USD',
    products: [
      {
        product_id: '507f1f77bcf86cd799439011',
        sku: 'SH810170',
        category: 'Power Meter',
        name: 'PRECISION 3',
        price: 384.99,
        crankset: 'Shimano - GRX FC-RX810 170mm',
        crank_lenght: '170mm',
        crank_type: 'GRX RX810',
        currency: 'usd',
        url: 'https://4iiii.com/usa/products/pdp/left-side-precision-3-powermeter-ride-ready/',
        image_url: 'https://www.example.com/product/path.jpg'
      }
    ]
  }
};
