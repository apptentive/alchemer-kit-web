document.addEventListener("apptentive:error", (event) => {
  console.log("apptentive:error:", event.detail);
});

document.addEventListener("apptentive:render:interaction", (event) => {
  const { interaction } = event.detail;
  console.log("apptentive:render:interaction:", interaction);
});

// Setup & Configuration
ApptentiveSDK.createConversation();
ApptentiveSDK.setOption("domNode", "#domNode");

// Survey
document.getElementById("survey").addEventListener("click", (event) => {
  ApptentiveSDK.engage("displaySurvey");
});

// Note
document.getElementById("note").addEventListener("click", (event) => {
  ApptentiveSDK.engage("displayNote");
});

// Message Center
document.getElementById("mc").addEventListener("click", (event) => {
  // ApptentiveSDK.engage('displayMC');
  ApptentiveSDK.showMessageCenter();
});

// Love Dialog
document.getElementById("love").addEventListener("click", (event) => {
  ApptentiveSDK.engage("displayLoveDialog");
});

// Language change buttons
document
  .getElementById("language-en")
  .addEventListener("click", (event) => {
    ApptentiveSDK.setLocale("en");
  });

document
  .getElementById("language-fr")
  .addEventListener("click", (event) => {
    ApptentiveSDK.setLocale("fr");
  });

document
  .getElementById("language-zh")
  .addEventListener("click", (event) => {
    ApptentiveSDK.setLocale("zh");
  });