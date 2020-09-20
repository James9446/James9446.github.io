document.addEventListener("click", event => {
  const elem = event.target;
  if (elem.matches(".btn-add-to-cart")) {
    const payload = JSON.parse(
      elem.getAttribute("data-product-clicked-payload")
    );
    analytics.track("Product Clicked", payload);
  }
});       

//      View Control
const updateView = (targetId, newId, label, element, method='') => {
  let newElement = document.createElement(element);
  newElement.id = newId;
  let content = document.createTextNode(label + method);
  newElement.appendChild(content);
  
  let currentElement = document.getElementById(targetId);
  let parentElement = currentElement.parentNode;
  parentElement.replaceChild(newElement, currentElement);
}

const updateAllUserInfo = () => {
  // Anonymous ID View
  updateView("anony", "anony", "anonymousId: ", "P", analytics.user().anonymousId());
  
  // User ID View
  updateView("user", "user", "userId: ", "P", analytics.user().id());

  // Traits View
  updateView("traits", "traits", "traits: ", "p", JSON.stringify(analytics.user()._getTraits(), null, '\t'));
}

// Button Functions
const fireEvent = (e) => {
  let event = ecommerceEvents[document.getElementById("dropdown").value]
  if (e.shiftKey) {
    return console.log(`analytics.track(${JSON.stringify(event.eventName)}, ${JSON.stringify(event.properties, null, ' ')})`);
  }
  analytics.track(event.eventName, event.properties)
}

const getWriteKey = () => {
  let wk = document.getElementById("writeKeyInput").value;
  if (wk) {
      location.replace("https://james9446.github.io/?wk=" + wk);
  }
}
const getRandomNumber = () => {
  let random = Math.floor(Math.random() * 10) + 1;
  let x = Date.now();
  analytics.track('Number Generated', {
    range: '1 to 10',
    number: random
  });
}

const resetAnalytics = () => {
    analytics.reset();
    updateAllUserInfo();
}

const getOS = () => {
  var OSName="Unknown OS";
  if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
  if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
  if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
  if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";
  if (navigator.appVersion.indexOf("Android")!=-1) OSName="Android";
  if (navigator.appVersion.indexOf("iOS")!=-1) OSName="iOS";
  console.log(`The operating system is ${OSName}`);
  analytics.track('Get OS', {
    os: OSName
  });
}

const logInt = () => {
  console.info(analytics.Integrations);
}

const callIdentify = (e) => {
  if (e.shiftKey) {
    return console.log(
      `analytics.identify("80085", {
        name: "Luigi Mario",
        email: "luigi@brothersplumbing.it",
        address: {
          street: "1 Up St",
          city: "Toad Town",
          state: "Dinosour Land",
          postalCode: "94025",
          country: "Mushroom Kingdom"
        }
      });`
    );
  }
  analytics.identify("80085", {
    name: "Luigi Mario",
    email: "luigi@brothersplumbing.it",
    address: {
      street: "1 Up St",
      city: "Toad Town",
      state: "Dinosour Land",
      postalCode: "94025",
      country: "Mushroom Kingdom"
    }
  });
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
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
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
    return pick[Math.floor(Math.random() * pick.length)]
  }
  updateView("passwordValue", "passwordValue", "", "P", password.join(""));
  updateView("copyPassword", "copyPassword", "", "button", "copy text");
  document.getElementById("copyPassword").addEventListener("click", copyPassword);
}

const copyPassword = () => {
  let text = document.getElementById("passwordValue").textContent;
  navigator.clipboard.writeText(text);
};


// Button Event Listeners
// document.getElementById("genNum").addEventListener("click", getRandomNumber);
document.getElementById("reset").addEventListener("click", resetAnalytics);
// document.getElementById("getOS").addEventListener("click", getOS);
document.getElementById("getWriteKey").addEventListener("click", getWriteKey);
document.getElementById("callIdentify").addEventListener("click", callIdentify);
document.getElementById("logInt").addEventListener("click", logInt);
document.getElementById("getPassword").addEventListener("click", getPassword);
document.getElementById("fireEvent").addEventListener("click", fireEvent);


// Initial View
analytics.ready(() => {
  updateAllUserInfo();
});

analytics.on('identify', () => {
  updateAllUserInfo();
});

updateView("writeKeyValue", "writeKeyValue", "Write Key: ", "P", writeKey);


// Display track call
analytics.on('track', function(event, properties, options) {
  // updateView("track", "track", "Track Event Fired", "H4");
  updateView("event", "event", "Event Fired: " + event, "P");
  // updateView("prop", "prop", JSON.stringify(properties, null, '\t'), "textArea");
  updateAllUserInfo();
});   

analytics.on('track', function(event, properties, options) {

  console.log('event', event);
  console.log('properties', properties);
  console.log('options', options);

});
  
// analytics.ready(() => {
//   console.log('Ready');
//   console.log('userId:', analytics.user().id())
// });