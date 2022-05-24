window.addEventListener("DOMContentLoaded", function () {
    // show authenticated user on the header.
    const headerRight = document.getElementById("header__right");
    const userImage = document.getElementById("user__image");
    const userName = document.getElementById("user__name");

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
    }
});