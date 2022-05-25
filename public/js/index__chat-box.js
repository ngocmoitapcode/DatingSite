window.addEventListener("DOMContentLoaded", function () {
    // set header information
    const authenticatedUser = JSON.parse(localStorage.getItem("auth"));
    if (authenticatedUser) {

        // chatbox
        const chatBox = document.getElementById("chatbox");
        const chatBoxUserAvatar = document.getElementById("chatbox__user-avatar");
        const chatBoxUserName = document.getElementById("chatbox__user-name");
        const chatBoxClose = document.getElementById("chatbox__close");
        const messageBottom = document.getElementById("message-bottom");
        const messageContainer = document.getElementById("message__container");

        let selectedContact = null;
        let notificationListenerID = authenticatedUser.uid;

        const scrollToBottom = () => {
            if (messageBottom && messageBottom) {
                messageBottom.parentNode.scrollTop = messageBottom.offsetTop;
            }
        }

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

        const sendMessage = (inputMessage) => {
            if (inputMessage) {
                // call cometchat service to send the message.
                const message = new CometChat.TextMessage(
                    selectedContact.uid,
                    inputMessage,
                    CometChat.RECEIVER_TYPE.USER
                );
                CometChat.sendMessage(message).then(
                    msg => {
                        // append new message on the UI.
                        const sentMessage = {
                            text: inputMessage,
                            sender: {
                                avatar: authenticatedUser.avatar
                            },
                            isRight: true
                        }
                        renderSingleMessage(sentMessage);
                        // scroll to bottom.
                        scrollToBottom();
                    },
                    error => {
                        alert('Cannot send you message, please try later');
                    }
                );
            }
        };

        const isRight = (message) => {
            if (message.isRight !== null && message.isRight !== undefined) {
                return message.isRight;
            }
            return message.sender.uid === authenticatedUser.uid;
        }

        const renderSingleMessage = (message) => {
            if (message && isRight(message)) {
                messageContainer.innerHTML += `
            <div class="message__right">
              <div class="message__content message__content--right">
                <p>${message.text}</p>
              </div>
              <div class="message__avatar">
               <img src="${message.sender.avatar}"/>
              </div>
            </div>`;
            } else {
                messageContainer.innerHTML += `
            <div class="message__left">
              <div class="message__avatar">
                <img src="${message.sender.avatar}"/>
              </div>
              <div class="message__content message__content--left">
                <p>${message.text}</p>
              </div>
            </div>`;
            }
        };

        const renderMessages = (messages) => {
            if (messages && messages.length !== 0) {
                messages.forEach(message => {
                    if (message) {
                        renderSingleMessage(message);
                    }
                });
                // scroll to bottom.
                scrollToBottom();
            }
        };

        const loadMessages = () => {
            const limit = 50;
            const messageRequestBuilder = new CometChat.MessagesRequestBuilder()
                .setCategories(["message"])
                .setTypes(["text"])
                .setLimit(limit)
            messageRequestBuilder.setUID(selectedContact.uid);

            const messagesRequest = messageRequestBuilder.build();

            messagesRequest
                .fetchPrevious()
                .then((messages) => {
                    if (messages && messages.length !== 0) {
                        renderMessages(messages);
                    }
                })
                .catch((error) => { });
        };

        isCurrentUser = (selectedContact, selectedUid) => {
            return selectedContact && selectedUid && selectedContact.uid && selectedContact.uid === selectedUid;
        };

        // ??
        window.openChatBox = (selectedUid, name, avatar) => {
            if (selectedUid && name && avatar && !isCurrentUser(selectedContact, selectedUid)) {
                selectedContact = { uid: selectedUid };
                chatBox.classList.remove("hide");
                chatBoxUserName.innerHTML = name;
                chatBoxUserAvatar.src = avatar;
                messageContainer.innerHTML = '';
                loadMessages();
            }
        }

        if (chatBoxClose) {
            chatBoxClose.addEventListener('click', function () {
                messageContainer.innerHTML = '';
                chatBox.classList.add("hide");
                CometChat.removeMessageListener(selectedContact.uid);
                selectedContact = null;
            });
        }

        $("#message-input").keyup(function (e) {
            if (e.keyCode == 13) {
                const inputMessage = e.target.value;
                if (inputMessage) {
                    sendMessage(inputMessage);
                    $(this).val("");
                }
            }
        });

        listenForNotifications();
    }

});