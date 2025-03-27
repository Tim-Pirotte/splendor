/*** Toggle the visibility of the avatar selection list ***/
function toggleVisibility(e) {
    e.preventDefault();

    const $avatarList = document.querySelector(".avatar-selector section");
    $avatarList.style.display = ($avatarList.style.display === "none")
        ? "block" : "none";
}

export { toggleVisibility };
