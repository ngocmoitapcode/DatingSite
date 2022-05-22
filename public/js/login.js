window.addEventListener("DOMContentLoaded", function () {
    axios.get('/user/info')
        .then(res => {
            if (res && res.data && res.data.user_cometchat_uid) {
                if (res.data.user_avatar) {
                    createAccount(res);
                } else {
                    login(res);
                }
            }
        })

});

let createAccount = function (res) {
    const user = new CometChat.User(res.data.user_cometchat_uid);
    user.setName(res.data.user_full_name);
    user.setAvatar(`${window.location.origin}${res.data.user_avatar}`);

    const appSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(config.CometChatRegion)
        .build();

    CometChat.init(config.CometChatAppId, appSetting).then(
        () => {
            console.log("Initialization completed successfully");
            CometChat.createUser(user, config.CometChatAuthKey).then(
                (user) => {
                    console.log("User created", user);

                    // store logged in user in the local storage.
                    localStorage.setItem("auth", JSON.stringify({ ...user, gender: res.data.user_gender }));
                },
                (error) => {
                    console.log("Some Error Occured", { error });
                }
            );
        },
        (error) => {
            // Check the reason for error and take appropriate action.
            console.log("Some Error Occured", { error });
        }
    );
}

let login = function (res) {
    const appSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(config.CometChatRegion)
        .build();

    CometChat.init(config.CometChatAppId, appSetting).then(
        () => {
            // You can now call login function.
            CometChat.login(res.data.user_cometchat_uid, config.CometChatAuthKey).then(
                (loggedInUser) => {
                    console.log("Login Successful:", { loggedInUser });

                    // store logged in user in the local storage.
                    localStorage.setItem("auth", JSON.stringify({ ...loggedInUser, gender: res.data.user_gender }));
                },
                (error) => {
                    console.log("Some Error Occured", { error });
                }
            );
        },
        (error) => {
            // Check the reason for error and take appropriate action.
            console.log("Some Error Occured", { error });
        }
    );
}