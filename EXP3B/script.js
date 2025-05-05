// Function to save form data to localStorage
function saveFormData(formId) {
    let form = document.getElementById(formId);
    let formData = {};

    form.querySelectorAll("input, textarea, select").forEach(input => {
        formData[input.id] = input.value;
    });

    localStorage.setItem(formId, JSON.stringify(formData));
}

// Function to load form data from localStorage
function loadFormData(formId) {
    let formData = JSON.parse(localStorage.getItem(formId));
    
    if (formData) {
        let form = document.getElementById(formId);
        Object.keys(formData).forEach(id => {
            let input = form.querySelector(`#${id}`);
            if (input) input.value = formData[id];
        });
    }
}

// Function to validate form inputs
function validateForm(formId) {
    let form = document.getElementById(formId);
    let isValid = true;

    form.querySelectorAll("input[required], select[required]").forEach(input => {
        if (input.value.trim() === "") {
            input.classList.add("is-invalid");
            isValid = false;
        } else {
            input.classList.remove("is-invalid");
        }
    });

    return isValid;
}

// Function to save and navigate to next page smoothly
function saveAndNext(nextPage) {
    let form = document.querySelector("form");
    if (!form) return;

    saveFormData(form.id);
    flipPage(nextPage);
}

// Function to save and navigate to previous page smoothly
function saveAndPrevious(prevPage) {
    let form = document.querySelector("form");
    if (!form) return;

    saveFormData(form.id);
    flipPage(prevPage);
}

// Function to animate page flip and navigate
function flipPage(page) {
    let book = document.querySelector(".book");
    if (book) {
        book.classList.add("flipping");
    }

    setTimeout(() => {
        window.location.href = page;
    }, 500);
}

// Load form data on page load
window.onload = function () {
    let form = document.querySelector("form");
    if (form) {
        loadFormData(form.id);
    }
};
