//      View Control
const updateView = (targetId, newId, label, element, method='', addElement) => {
  let newElement = document.createElement(element);
  newElement.id = newId;
  
  let content = document.createTextNode(label + method);
  newElement.appendChild(content);
  
  let currentElement = document.getElementById(targetId);
  let parentElement = currentElement.parentNode;
  if (addElement) {
    parentElement.appendChild(newElement, currentElement);
  } else {
    parentElement.replaceChild(newElement, currentElement);
  }
}

const updateAllUserInfo = () => {
  // Segment Data
  // Anonymous ID View
  updateView("anony", "anony", "", "P", analytics.user().anonymousId());
  
  // User ID View
  updateView("user", "user", "", "P", analytics.user().id());

  // Email View
  updateView("seg-email", "seg-email", "", "p", analytics.user().traits().email);

  // Friendbuy Data
  const friendbuyLocalStorage = deepParseJson(localStorage.getItem("persist:friendbuy-msdk-06192019-root"))

  const customerId = friendbuyLocalStorage && friendbuyLocalStorage.customer && friendbuyLocalStorage.customer.id ? friendbuyLocalStorage.customer.id : "";
  const friendbuyEmail = friendbuyLocalStorage && friendbuyLocalStorage.customer && friendbuyLocalStorage.customer.email ? friendbuyLocalStorage.customer.email : "";


  // User ID View
  updateView("customer-id", "customer-id", "", "P", customerId);
      
  // Email View
  updateView("fnd-email", "fnd-email", "", "p", friendbuyEmail);

  friendbuyAPI.push([
    "getVisitorStatus",
    function (status) {
      try {
        const attributionId = status.payload && status.payload.attributionId ? status.payload.attributionId : "";
        const referralCode = status.payload && status.payload.referralCode ? status.payload.referralCode : "";
        updateView("attribution-id", "attribution-id", "", "p", attributionId);
        updateView("referral-code", "referral-code", "", "p", referralCode);
      } catch (error) {
        console.error(error);
      }
    },
  ]);
}

function deepParseJson(json) {
  var obj = JSON.parse(json);
  for (var k in obj) {
      if (typeof obj[k] === "string" && obj[k][0] === "{") {
          obj[k] = deepParseJson(obj[k]);
      }
  }
  return obj;
}

// Segment All Ecommerce Events
const fireEvent = (e) => {
  let event = ecommerceEvents[document.getElementById("eventDropdown").value];
  const coupon = document.getElementById("coupon-header").innerText;

  if (event.properties.coupon) {
    event.properties.coupon = coupon;
  }
  if (event.properties.order_id) {
    event.properties.order_id = crypto.randomUUID();
  }
  if (e.shiftKey) {
    return console.log(`analytics.track(${JSON.stringify(event.eventName)}, ${JSON.stringify(event.properties, null, ' ')})`);
  }
  analytics.track(event.eventName, event.properties)
}

// Segment Dedicated Track Buttons
const orderCompleted = (e) => {
  let event = ecommerceEvents.orderCompleted;
  const coupon = document.getElementById("coupon-header").innerText;
  event.properties.coupon = coupon;
  event.properties.order_id = crypto.randomUUID();
  if (e.shiftKey) {
    return console.log(`analytics.track(${JSON.stringify(event.eventName)}, ${JSON.stringify(event.properties, null, ' ')})`);
  }
  analytics.track(event.eventName, event.properties)
};

const signedUp = (e) => {
  let user = getUserData();
  if (e.shiftKey) {
    return console.log(
      `analytics.track('Signed Up', {
        firstName: ${JSON.stringify(user.traits.first_name)},
        lastName: ${JSON.stringify(user.traits.last_name)},
        email: ${JSON.stringify(user.traits.email)},
      });`
    );
  }
  analytics.track('Signed Up', {
    firstName: user.traits.first_name,
    lastName: user.traits.last_name,
    email: user.traits.email,
  });
};

const customEvent = (e) => {
  const coupon = document.getElementById("coupon-header").innerText;
  const attributionId = document.getElementById("attribution-id").innerText;
  const referralCode = document.getElementById("referral-code").innerText;

  if (e.shiftKey) {
    return console.log(
      `analytics.track("custom_event", {
        coupon: ${JSON.stringify(coupon)},
        attributionId: ${JSON.stringify(attributionId)},
        referralCode: ${JSON.stringify(referralCode)}
      })`
    );
  }
  analytics.track("custom_event", {
    coupon,
    attributionId,
    referralCode
  })
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const eventFunnel = (e) => {
  let eventList = funnels[e.target.id];
  let events = ecommerceEvents;
  if (e.target.id === 'demo_events') {
    events = demoEvents;
  }
  for (let i = 0; i < eventList.length; i++) {
    sleep(i * 1500).then(() => { 
      if ( eventList[i] === 'identify') {
        callIdentify(e);
      } else {
          let event = events[eventList[i]];
          analytics.track(event.eventName, event.properties); 
        }
      });
  }
};

const demoPageFunnel = (e) => {
  console.log(e.target.id);
  const pageList = pages[e.target.id];
  for (i = 0; i < pageList.length; i++) {
    let page = pageList[i];

    sleep(i * 6000).then(() => { 
      analytics.page(page.name, {
        title: page.title
      }, {
        campaign: page.utm
      });
    })

  }
};


const callIdentify = (e) => {
  let user = users[document.getElementById("usersDropdown").value];
  if (e.shiftKey) {
    return console.log(`analytics.identify(${JSON.stringify(user.userId)}, ${JSON.stringify(user.traits, null, ' ')})`);
  }
  analytics.identify(user.userId, user.traits);
}

const getWriteKey = () => {
  let wk = document.getElementById("writeKeyInput").value;
  if (wk) {
      location.replace("https://james9446.github.io/?wk=" + wk);
  }
}

const resetAnalytics = () => {
  analytics.reset();
  updateAllUserInfo();
}

const clearStorageAndCookies = () => {
  localStorage.removeItem("persist:friendbuy-msdk-06192019-root");
  document.cookie = "name=globalId; expires=Thu, 01 Jan 1970 00:00:00 UTC"; 
  updateAllUserInfo();
}

const logInt = () => {
  console.info(analytics.Integrations);
}

const logVisitor = () => {
  friendbuyAPI.push([
    "getVisitorStatus",
    function (status) {
      try {
        console.log(status)
      } catch (error) {
        console.error(error);
      }
    },
  ]);
}

const copyPassword = () => {
  let text = document.getElementById("passwordValue").textContent;
  navigator.clipboard.writeText(text);
};

// ---- FRIENDBUY CODE SECTION START ----

function getUserData() {
  return users[document.getElementById("usersDropdown").value];
};

const fBuyTrackCustomer = (e) => {
  let user = getUserData();
  if (e.shiftKey) {
    // return console.log(`analytics.identify(${JSON.stringify(user.userId)}, ${JSON.stringify(user.traits, null, ' ')})`);
    return console.log(
      `friendbuyAPI.push([
        "track",
        "customer",
        {
          email: ${JSON.stringify(user.traits.email)},
          id: ${JSON.stringify(user.userId)}, 
          firstName: ${JSON.stringify(user.traits.first_name)}, 
          lastName: ${JSON.stringify(user.traits.last_name)} 
        },
      ]);`
    );
  }
  friendbuyAPI.push([
    "track",
    "customer",
    {
      email: user.traits.email,
      id: user.userId, 
      firstName: user.traits.first_name, 
      lastName: user.traits.last_name 
    },
  ]);
  setTimeout(() => {
    // wait for local storage to update
    updateAllUserInfo()
  }, 200)
}

function fBuyTrackPage(e) {
  const page = document.getElementById("page").innerText;
  console.log("fBuy Track Page: ", page);
  
  if (e.shiftKey) {
    return console.log(
      `friendbuyAPI.push([
        "track",
        "page",
        {
          name: ${JSON.stringify(page)},
        }
      ]);`
    )
  }
  friendbuyAPI.push([
    "track",
    "page",
    {
      name: page,
    }
  ]);
}

function fBuyTrackPurchase(e) {
  console.log("fBuy Track Purchase");
  const user = getUserData();
  const products = ecommerceEvents.orderCompleted.properties.products;
  const coupon = document.getElementById("coupon-header").innerText;

  if (e.shiftKey) {
    return console.log(
      `friendbuyAPI.push([
        "track",
        "purchase",
        {
          id: ${JSON.stringify(crypto.randomUUID())},
          amount: 22,
          currency: "USD", 
          couponCode: ${JSON.stringify(coupon)},   
          products: ${JSON.stringify(deepParseJson(JSON.stringify(products)), null, 2)},
          customer: {
            email: "",
            id: "", 
            firstName: "", 
            lastName: ""
          }
        },
      ]);`
      // Leaving this option here in comments to pull customer data from the user dropdown
      // customer: {
      //   email: ${JSON.stringify(user.traits.email)},
      //   id: ${JSON.stringify(user.userId)}, 
      //   firstName: ${JSON.stringify(user.traits.first_name)}, 
      //   lastName: ${JSON.stringify(user.traits.last_name)}
      // }
    );
  }
  friendbuyAPI.push([
    "track",
    "purchase",
    {
      id: crypto.randomUUID(),
      amount: 22,
      currency: "USD", 
      couponCode: coupon,   
      products,
      // customer: {
      //   email: user.traits.email,
      //   id: user.userId, 
      //   firstName: user.traits.first_name, 
      //   lastName: user.traits.last_name 
      // }
    },
  ]);
  setTimeout(() => {
    // wait for local storage to update
    updateAllUserInfo()
  }, 200)
}

function fBuyTrackSignUp(e) {
  console.log("fBuy Track Sign Up");
  let user = getUserData();
  if (e.shiftKey) {
    return console.log(
      `friendbuyAPI.push([
        "track",
        "sign_up",
        {
          email: ${JSON.stringify(user.traits.email)},
          id: ${JSON.stringify(user.userId)}, 
          name: ${JSON.stringify(`${user.traits.first_name} ${user.traits.last_name}`)} 
        },
      ]);`
    )
  }
  friendbuyAPI.push([
    "track",
    "sign_up",
    {
      email: user.traits.email,
      id: user.userId, 
      name: `${user.traits.first_name} ${user.traits.last_name}` 
    },
  ]);
  setTimeout(() => {
    // wait for local storage to update
    updateAllUserInfo()
  }, 200)
}

// function deepParseJson(json) {
//   var obj = JSON.parse(json);
//   for (var k in obj) {
//       if (typeof obj[k] === "string" && obj[k][0] === "{") {
//           obj[k] = deepParseJson(obj[k]);
//       }
//   }
//   return obj;
// }


// ---- FRIENDBUY CODE SECTION END ----

// Button Event Listeners

// addEventListener("load", () => {updateAllUserInfo()});
document.getElementById("reset").addEventListener("click", resetAnalytics);
document.getElementById("clear-local-storage").addEventListener("click", clearStorageAndCookies);
document.getElementById("getWriteKey").addEventListener("click", getWriteKey);
document.getElementById("callIdentify").addEventListener("click", callIdentify);
document.getElementById("logInt").addEventListener("click", logInt);
document.getElementById("logVisitor").addEventListener("click", logVisitor);
document.getElementById("fireEvent").addEventListener("click", fireEvent);
document.getElementById("order-completed").addEventListener("click", orderCompleted);
document.getElementById("signed-up").addEventListener("click", signedUp);
document.getElementById("custom-event").addEventListener("click", customEvent);
document.getElementById("funnel").addEventListener("click", eventFunnel);
document.getElementById("demo_pages").addEventListener("click", demoPageFunnel);
document.getElementById("demo_events").addEventListener("click", eventFunnel);
document.getElementById("fbuy-customer").addEventListener("click", fBuyTrackCustomer);
document.getElementById("fbuy-page").addEventListener("click", fBuyTrackPage);
document.getElementById("fbuy-purchase").addEventListener("click", fBuyTrackPurchase);
document.getElementById("fbuy-sign-up").addEventListener("click", fBuyTrackSignUp);


// Initial View
analytics.ready(() => {
  updateAllUserInfo();

  friendbuyAPI.push([
    "subscribe",
    "couponReceived",
    function (coupon) {
      console.log("coupon: ", coupon); 
      updateView("coupon-header", "coupon-header", "", "H3", `Coupon Applied: ${coupon}`);
      updateAllUserInfo();
    },
  ]);

  friendbuyAPI.push([
    "subscribe",
    "widgetActionTriggered",
    function (action) {
      if (action.actionName === "emailShare" || action.actionName === "copyText" || action.actionName === "advocateEmailCaptured") {
        updateAllUserInfo();
      }
    },
  ]);
});

// <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/shell.js"></script>
// <script>
//   hbspt.forms.create({
// 	region: "na1",
// 	portalId: "21231932",
// 	formId: "d000eed0-eae2-496b-862c-162334695925"
// });
// </script>

analytics.on('identify', () => {
  updateAllUserInfo();
});

updateView("writeKeyValue", "writeKeyValue", "Write Key: ", "P", writeKey);


// Display track call
analytics.on('track', function(event, properties, options) {
  // updateView("track", "track", "Track Event Fired", "H4");
  updateView("event", "event", event, "P", '', true);
  // updateView("prop", "prop", JSON.stringify(properties, null, '\t'), "textArea");
  updateAllUserInfo();
});   

// Display Page call
analytics.on('page', function(event, properties, options) {
  // updateView("track", "track", "Track Event Fired", "H4");
  console.log("event", event);
  console.log("properties", properties);
  console.log("options", options);
  updateView("event", "event", `Page Viewed: ${properties || options.title}`, "P", '', true);
  // updateView("prop", "prop", JSON.stringify(properties, null, '\t'), "textArea");
  updateAllUserInfo();
}); 




// const getOS = () => {
//   var OSName="Unknown OS";
//   if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
//   if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
//   if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
//   if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
//   if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
//   if (navigator.appVersion.indexOf("iOS")!=-1) OSName="iOS";
//   console.log(`The operating system is ${OSName}`);
//   analytics.track('Get OS', {
//     os: OSName
//   });
// }
