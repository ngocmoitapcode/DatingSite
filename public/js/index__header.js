window.addEventListener("DOMContentLoaded", function () {
    // show authenticated user on the header.
    const headerRight = document.getElementById("header__right");
    const userImage = document.getElementById("user__image");
    const userName = document.getElementById("user__name");

    const logoutButon = document.getElementById("header__logout");

    const authenticatedUser = JSON.parse(localStorage.getItem("auth"));

    const showHeaderInformation = () => {
        if (headerRight && userImage && userName && authenticatedUser && authenticatedUser.uid) {
            headerRight.classList.remove("header__right--hide");
            userImage.src = authenticatedUser.avatar;
            userName.innerHTML = `Hello, ${authenticatedUser.name}`;
        }
    };

    if (authenticatedUser) {
        showHeaderInformation();

        // add event for logout
        if (logoutButon) {
            logoutButon.addEventListener("click", function () {
                const isLeaved = confirm("Do you want to log out?");
                if (isLeaved) {
                    // logout from cometchat and then clear storage.
                    CometChat.logout().then((response) => {
                        // User successfully logged out.
                        // Perform any clean up if required.
                        localStorage.removeItem("auth");
                        // redirect to login page.
                        window.location.href = "/logout";
                    });
                }
            });
        }
    }
});