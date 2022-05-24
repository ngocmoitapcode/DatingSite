window.addEventListener("DOMContentLoaded", function () {

  const authenticatedUser = JSON.parse(localStorage.getItem("auth"));

  if (authenticatedUser) {


    let notificationListenerID = authenticatedUser.uid;

    const listenForNotifications = () => {
      CometChat.addMessageListener(
        notificationListenerID,
        new CometChat.MessageListener({
          onTextMessageReceived: (message) => {
            if (message && (!message.category || message.category !== 'call')) {
              const senderUid = message.sender.uid;
              if (selectedContact && selectedContact.uid === senderUid) {
                renderSingleMessage(message);
              } else {
                toastr.info(`There is new message from ${message.sender.name}`);
              }
            }
          },
          onCustomMessageReceived: customMessage => {
            console.log("Custom message received successfully", customMessage);
            // Handle custom message
            if (!selectedContact || (customMessage && customMessage.sender && customMessage.sender.uid && customMessage.sender.uid !== selectedContact.uid && customMessage.data && customMessage.data.customData && customMessage.data.customData.message)) {
              // Display an info toast with no title
              toastr.info(customMessage.data.customData.message);
              if (customMessage && customMessage.type && customMessage.type === 'match') {
                loadFriends();
              }
            }
          }
        })
      );
    };

    listenForNotifications();
  }

});