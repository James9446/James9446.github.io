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

  console.log(friendbuyLocalStorage);

  // User ID View
  updateView("customerId", "customerId", "", "P", friendbuyLocalStorage.customer.id);
      
  // Email View
  updateView("fnd-email", "fnd-email", "", "p", friendbuyLocalStorage.customer.email);

  friendbuyAPI.push([
    "getVisitorStatus",
    function (status) {
      try {
        console.log(status.payload.attributionId);
        updateView("attributionId", "attributionId", "", "p", status.payload.attributionId);
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

// Button Functions
const fireEvent = (e) => {
  let event = ecommerceEvents[document.getElementById("eventDropdown").value];
  if (e.shiftKey) {
    return console.log(`analytics.track(${JSON.stringify(event.eventName)}, ${JSON.stringify(event.properties, null, ' ')})`);
  }
  analytics.track(event.eventName, event.properties)
}

// const eventFunnel = (e) => {
//   console.log(e.target.id)
//   let eventList = funnels[e.target.id];
//   let events = ecommerceEvents;
//   if (e.target.id === 'demo_events') {
//     events = demo_events;
//   }
//   for (let i = 0; i < events.length; i++) {
//     let event = events[eventList[i]];
//     analytics.track(event.eventName, event.properties);
//   }
// }

// const eventFunnel = (e) => {
//   let eventList = funnels[e.target.id];
//   let events = ecommerceEvents;
//   if (e.target.id === 'demo_events') {
//     events = demoEvents;
//   }
//   for (let i = 0; i < eventList.length; i++) {
//     let event = ecommerceEvents[eventList[i]];
//     setTimeout(
//       () => { 
//         analytics.track(event.eventName, event.properties); 
//       }
//       , 9000);
//   }
// }
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

const logInt = () => {
  console.info(analytics.Integrations);
}

const getPassword = () => {
  let length = document.getElementById("lengthInput").value || 16;
  let arg = document.getElementById("specialInput").value || "~!@#$%^&*()_+-=[]{}|;:.,?><";
  if (length < 4) {
    updateView("passwordValue", "passwordValue", "", "P", "Length must be at least 4");
    return console.error("Length must be at least 4")
  }
  const lowercase = ["a","b","c","d","e","f","g","h","i","j","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  const uppercase = lowercase.join("").toUpperCase().split("");
  const specialChars = arg.split("").filter(item => item.trim().length);
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let hasNumber = false;
  let hasUpper = false;
  let hasLower = false;
  let hasSpecial = false;

  if ( Number(length)) {
    length = Number(length)
  } else {
    return console.error("Enter a valid length for the first argument.")
  }

  let password = [];
  let lastChar;
  for (let i = 0; i < length; i++) {
    let char = newChar(lowercase, uppercase, numbers, specialChars);
    if (char !== lastChar) {
      password.push(char);
      lastChar = char
      if (Number(char)) {
        hasNumber = true
      }
      if (lowercase.indexOf(char)> -1) {
        hasLower = true
      } 
      if (uppercase.indexOf(char) > -1) {
        hasUpper = true
      }
      if (specialChars.indexOf(char)> -1) {
        hasSpecial = true
      }
    } else {
      i--
    }
    if (i === length -1 && (!hasNumber || !hasUpper || !hasLower || !hasSpecial)) {
      hasNumber = false;
      hasUpper = false;
      hasLower = false;
      hasSpecial = false;
      password = [];
      i = -1;
    }
  }
  function newChar(lower, upper, nums, specials) {
    let set = [lower, upper, nums, specials];
    let pick = set[Math.floor(Math.random() * set.length)];
    return pick[Math.floor(Math.random() * pick.length)];
  }
  updateView("passwordValue", "passwordValue", "", "P", password.join(""));
  updateView("copyPassword", "copyPassword", "", "button", "copy text");
  document.getElementById("copyPassword").addEventListener("click", copyPassword);
}

const copyPassword = () => {
  let text = document.getElementById("passwordValue").textContent;
  navigator.clipboard.writeText(text);
};

// HubSpot Form Submission Events
// const createEventsFromHubSpotForm = () => {
//   const firstName = document.getElementById("firstname-d000eed0-eae2-496b-862c-162334695925").value;
//   const lastName = document.getElementById("lastname-d000eed0-eae2-496b-862c-162334695925").value;
//   const email = document.getElementById("email-d000eed0-eae2-496b-862c-162334695925").value;
//   const phone = document.getElementById("phone-d000eed0-eae2-496b-862c-162334695925").value;
//   const companyName = document.getElementById("company-d000eed0-eae2-496b-862c-162334695925").value;
//   const country = document.getElementById("country-d000eed0-eae2-496b-862c-162334695925").value;
//   cosnole.log('For Submitted');
//   console.log(firstName, lastName);
// };

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

}

function fBuyTrackPage() {
  console.log("fBuy Track Page");
  friendbuyAPI.push([
    "track",
    "page",
    {
      name: "Home",
    }
  ]);
}

function fBuyTrackPurchase() {
  console.log("fBuy Track Purchase");
  let user = getUserData();
  let products = ecommerceEvents["Order Completed"].products;
  friendbuyAPI.push([
    "track",
    "purchase",
    {
      id: crypto.randomUUID(),
      amount: 22,
      currency: "USD", 
      isNewCustomer: true, 
      couponCode: "code001",   
      products,
    }
  ]);
}

function fBuyTrackSignUp() {
  console.log("fBuy Track Sign Up");
  let user = getUserData();
  friendbuyAPI.push([
    "track",
    "customer",
    {
      email: user.traits.email,
      id: user.userId, 
      name: `${user.traits.first_name} ${user.traits.last_name}` 
    },
  ]);
}


// ---- FRIENDBUY CODE SECTION END ----

// Button Event Listeners
document.getElementById("reset").addEventListener("click", resetAnalytics);
document.getElementById("getWriteKey").addEventListener("click", getWriteKey);
document.getElementById("callIdentify").addEventListener("click", callIdentify);
document.getElementById("logInt").addEventListener("click", logInt);
document.getElementById("getPassword").addEventListener("click", getPassword);
document.getElementById("fireEvent").addEventListener("click", fireEvent);
document.getElementById("funnel").addEventListener("click", eventFunnel);
document.getElementById("demo_pages").addEventListener("click", demoPageFunnel);
document.getElementById("demo_events").addEventListener("click", eventFunnel);
document.getElementById("fbuy-customer").addEventListener("click", fBuyTrackCustomer);
document.getElementById("fbuy-page").addEventListener("click", fBuyTrackPage);
document.getElementById("fbuy-purchase").addEventListener("click", fBuyTrackPurchase);
// document.getElementById("fbuy-product").addEventListener("click", );
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


// analytics.on('track', function(event, properties, options) {

//   console.log('event', event);
//   console.log('properties', properties);
//   console.log('options', options);

// });
  
// analytics.ready(() => {
//   console.log('Ready');
//   console.log('userId:', analytics.user().id())
// });

// const getRandomNumber = () => {
//   let random = Math.floor(Math.random() * 10) + 1;
//   let x = Date.now();
//   analytics.track('Number Generated', {
//     range: '1 to 10',
//     number: random
//   });
// }

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
