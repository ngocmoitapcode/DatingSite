window.addEventListener("DOMContentLoaded", function () {
    // main card item.
    const mainCardEmptyMessage = document.getElementById("main__card-empty");
    const mainCardItemContainer = document.getElementById("main__card-item-container");

    // main card actions.
    const mainCardActions = document.getElementById("main__card-actions")
    const dislikeBtn = document.getElementById("dislike");
    const likeBtn = document.getElementById("like");

    const authenticatedUser = JSON.parse(localStorage.getItem("auth"));

    //=============================== Render ===============================//
    // call api to load recommended users.
    const loadRecommendedUsers = () => {
        axios
            .get("/user/recommend")
            .then((res) => {
                if (res && res.data && res.data.length !== 0) {
                    showMainCard();
                    renderCardList(res.data);
                }
            })
            .catch((error) => {
            });
    };

    const showMainCard = () => {
        mainCardActions.classList.remove('hide');
        mainCardItemContainer.classList.remove('hide');
        mainCardEmptyMessage.classList.add('hide');
    };


    const renderCardList = (recommendedUsers) => {
        if (recommendedUsers && recommendedUsers.length !== 0) {

            recommendedUsers.forEach((user, index) => {
                if (index === 0) {
                    mainCardItemContainer.innerHTML += `<div class="main__card-item" style="display: block;" data-id="${user.user_cometchat_uid}" data-name="${user.user_full_name}">
                <div class="avatar" style="display: block; background-image: url(${user.user_avatar})"></div>
                <span>${user.user_full_name}, ${user.user_age}</span>
              </div>`;
                } else {
                    mainCardItemContainer.innerHTML += `<div class="main__card-item" data-id="${user.user_cometchat_uid}" data-name="${user.user_full_name}">
                <div class="avatar" style="display: block; background-image: url(${user.user_avatar})"></div>
                <span>${user.user_full_name}, ${user.user_age}</span>
              </div>`;
                }
            });
            applySwing();
        }
    };
    //=============================== End of Render ===============================//

    //=============================== Request ===============================//
    const applySwing = () => {
        $(".main__card-item").on("swiperight", function () {
            swipeRight(this);
        });
        $(".main__card-item").on("swipeleft", function () {
            swipeLeft(this);
        });
    };
    
    const swipeRight = (element) => {
        $(element).addClass('rotate-left').delay(700).fadeOut(1);
        $('.main__card-item').find('.status').remove();
        $(element).append('<div class="status like">Like!</div>');
        $(element).next().removeClass('rotate-left rotate-right').fadeIn(400);

        const matchRequestTo = $(element).attr('data-id');
        const matchRequestReceiver = $(element).attr('data-name');

        createMatchRequest(matchRequestTo, matchRequestReceiver);
        setTimeout(() => {
            shouldHideMainCard();
        }, 1100)
    };

    const swipeLeft = (element) => {
        $(element).addClass('rotate-right').delay(700).fadeOut(1);
        $('.main__card-item').find('.status').remove();
        $(element).append('<div class="status dislike">Dislike!</div>');
        $(element).next().removeClass('rotate-left rotate-right').fadeIn(400);

        setTimeout(() => {
            shouldHideMainCard();
        }, 1100);
    };

    const getCurrentCard = () => {
        const cards = document.getElementsByClassName("main__card-item");
        if (cards && cards.length !== 0) {
            for (const card of cards) {
                if (card.getAttribute("style")) {
                    if (card.getAttribute("style").indexOf("display: block") != -1) {
                        return card;
                    }
                }
            }
            return null;
        }
        return null;
    };

    const shouldHideMainCard = () => {
        const nextCard = getCurrentCard();
        if (!nextCard) {
            hideMainCard();
        }
    };

    const hideMainCard = () => {
        mainCardActions.classList.add('hide');
        mainCardItemContainer.classList.add('hide');
        mainCardEmptyMessage.classList.remove('hide');
    };

    const createMatchRequest = (matchRequestTo, matchRequestReceiver) => {
        if (authenticatedUser && authenticatedUser.uid && authenticatedUser.name && matchRequestTo && matchRequestReceiver) {
            axios.post('user/request', {
                matchRequestFrom: authenticatedUser.uid,
                matchRequestSender: authenticatedUser.name,
                matchRequestTo,
                matchRequestReceiver
            }).then(res => {
                console.log(res.data.match_request_status);
                if (res && res.data && res.data.match_request_status && res.data.match_request_status === 1) {
                    addFriend(authenticatedUser.uid, matchRequestTo, matchRequestReceiver);
                }
            }).catch(error => { });
        }
    }

    const addFriend = (matchRequestFrom, matchRequestTo, matchRequestReceiver) => {
        if (matchRequestFrom && matchRequestTo) {
            const url = `https://${config.CometChatAppId}.api-${config.CometChatRegion}.cometchat.io/v3.0/users/${matchRequestTo}/friends`;
            axios.post(url, { accepted: [matchRequestFrom] }, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    appId: `${config.CometChatAppId}`,
                    apiKey: `${config.CometChatAPIKey}`,
                }
            }).then(res => {
                const notificationMessage = {
                    message: `Congratulation! ${authenticatedUser.name} and ${matchRequestReceiver} have been matched`,
                    type: 'match',
                    receiverId: matchRequestTo
                };
                toastr.info(notificationMessage.message);
                loadFriends();
                sendNotification(notificationMessage);
            }).catch(error => {
            });
        }
    };

    const sendNotification = ({ message, type, receiverId }) => {
        const receiverID = receiverId;
        const customType = type;
        const receiverType = CometChat.RECEIVER_TYPE.USER;
        const customData = {
            message
        };
        const customMessage = new CometChat.CustomMessage(
            receiverID,
            receiverType,
            customType,
            customData
        );

        CometChat.sendCustomMessage(customMessage).then(
            message => {
            },
            error => {
            }
        );
    };
    //=============================== End of Request ===============================//

    if (authenticatedUser) {
        loadRecommendedUsers();

        if (dislikeBtn) {
            dislikeBtn.addEventListener('click', function () {
                const currentCard = getCurrentCard();
                if (currentCard) {
                    swipeLeft(currentCard);
                } else {
                    hideMainCard();
                }
            });
        }

        if (likeBtn) {
            likeBtn.addEventListener('click', function () {
                const currentCard = getCurrentCard();
                if (currentCard) {
                    swipeRight(currentCard);
                } else {
                    hideMainCard();
                }
            });
        }
    }
});