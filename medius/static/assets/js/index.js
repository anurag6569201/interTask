const icons = document.querySelectorAll('.info-btn');
const infoData = document.querySelectorAll('.info-data');

icons.forEach(icon => {
    icon.addEventListener('click', () => {
        const infoToShow = document.querySelector(`.${icon.dataset.info}`);
        infoData.forEach(info => info.classList.remove('active'));
        icons.forEach(icon => icon.classList.remove('active-btn'));
        icon.classList.add('active-btn');
        infoToShow.classList.add('active');
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Hide all but the first 10 list items initially
    const lists = document.querySelectorAll("ul");
    lists.forEach(list => {
        const items = list.querySelectorAll("li");
        items.forEach((item, index) => {
            if (index >= 10) {
                item.style.display = "none";
            }
        });
    });

    // Handle the View More button click
    const viewMoreButtons = document.querySelectorAll(".view-more");
    viewMoreButtons.forEach(button => {
        button.addEventListener("click", function() {
            const targetId = this.getAttribute("data-target");
            const targetList = document.getElementById(targetId);
            const hiddenItems = targetList.querySelectorAll("li[style*='display: none']");
            
            // Show next 10 hidden items
            for (let i = 0; i < 10 && i < hiddenItems.length; i++) {
                hiddenItems[i].style.display = "list-item";
            }

            // If no more hidden items, hide the button
            if (targetList.querySelectorAll("li[style*='display: none']").length === 0) {
                this.style.display = "none";
            }
        });
    });
});