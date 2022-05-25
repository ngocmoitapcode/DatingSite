// main left messages
const mainLeftMessagesContainer = document.getElementById("main__left-messages");
const mainLeftEmpty = document.getElementById("main__left-empty");

// hàm này được viết bên ngoài để các file khác có thể dùng được
const loadFriends = () => {
    const appSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(config.CometChatRegion)
        .build();
    CometChat.init(config.CometChatAppId, appSetting).then(
        () => {
            // You can now call login function.
            const limit = 30;
            const usersRequest = new CometChat.UsersRequestBuilder()
                .setLimit(limit)
                .friendsOnly(true)
                .build();;
            usersRequest.fetchNext().then(
                userList => {
                    if (userList && userList.length !== 0) {
                        mainLeftEmpty.classList.add('hide');
                        mainLeftMessagesContainer.innerHTML = '';
                        renderFriends(userList);
                    } else {
                        mainLeftEmpty.classList.remove('hide');
                        mainLeftEmpty.innerHTML = 'You do not have any contact';
                    }
                },
                error => {
                }
            );
        },
        (error) => {
            // Check the reason for error and take appropriate action.
        }
    );
};

const renderFriends = (userList) => {
    if (userList && userList.length !== 0) {
        userList.forEach(user => {
            if (user) {
                mainLeftMessagesContainer.innerHTML += `<div class="main__left-message" onclick="openChatBox('${user.uid}', '${user.name}', '${user.avatar}')">
            <img
              src="${user.avatar}"
              alt="${user.name}"
            />
            <span>${user.name}</span>
          </div>`;
            }
        });
    }
};

window.addEventListener("DOMContentLoaded", function () {
    const authenticatedUser = JSON.parse(localStorage.getItem("auth"));

    if (authenticatedUser) {
        loadFriends();
    }
});