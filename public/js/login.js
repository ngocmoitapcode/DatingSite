const emailInputElement = document.getElementById("email");
const passwordInputElement = document.getElementById("password");

const fullNameInputElement = document.getElementById("fullname");
const ageInputElement = document.getElementById("age");
const avatarInputElement = document.getElementById("avatar");
const genderInputElement = document.getElementById("gender");

const submitBtn = document.getElementById("submit");

if (submitBtn) {
    submitBtn.addEventListener("click", function () {
        if (emailInputElement && passwordInputElement) {
            const email = emailInputElement.value;
            const password = passwordInputElement.value;

            //signup
            if (fullNameInputElement && ageInputElement && avatarInputElement && genderInputElement) {
                const form = new FormData();

                const fullname = fullNameInputElement.value;
                const age = ageInputElement.value;
                const avatars = avatarInputElement.files;
                const gender = genderInputElement.value;

                form.append("email", email);
                form.append("password", password);
                form.append("avatar", avatars[0]);
                form.append("age", age);
                form.append("gender", gender);
                form.append("fullname", fullname);

                axios.post("/signup", form)
                    .then((res) => {
                        if (res && res.data) {
                            if (res.data.user_cometchat_uid) {
                                createAccount(res);
                            } else if (res.data.message) {
                                alert(res.data.message);
                            }
                        }
                    })
                return;
            }

            //login
            axios.post("/login", { email, password })
                .then((res) => {
                    if (res && res.data) {
                        if (res.data.user_cometchat_uid) {
                            login(res);
                        } else if (res.data.message) {
                            alert(res.data.message);
                        }
                    }
                })
        }
    });
}


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

                    CometChat.login(res.data.user_cometchat_uid, config.CometChatAuthKey).then(
                        (loggedInUser) => {
                            console.log("Login Successful:", { loggedInUser });
        
                            // store logged in user in the local storage.
                            localStorage.setItem("auth", JSON.stringify({ ...loggedInUser, gender: res.data.user_gender }));
        
                            // redirect to home page.
                            window.location.href = "/";
                        },
                        (error) => {
                            console.log("Some Error Occured", { error });
                        }
                    );
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

                    // redirect to home page.
                    window.location.href = "/";
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