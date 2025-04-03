function toggleAvatarListVisibility() {
    const $avatarList = document.querySelector(".avatar-selector section");
    $avatarList.style.display = ($avatarList.style.display === "none") ? "block" : "none";
}

export { toggleAvatarListVisibility };
