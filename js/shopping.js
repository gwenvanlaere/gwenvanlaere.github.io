/** @format */

const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

// make object to recreate 'state' of our app

let items = [];

function handleSubmit(e) {
    e.preventDefault();

    const name = e.currentTarget.item.value;
    if (!name) return;
    const item = {
        name,
        id: Date.now(), // unique id by referring to timestamp
        complete: false,
    };

    items.push(item);
    e.target.reset();
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function displayItems() {
    const html = items
        .map(
            (item) => `<li class="shopping-item">
            <input value="${item.id}" type="checkbox" ${item.complete ? 'checked' : ''}>
            <span class="itemName">${item.name}</span>
            <button aria-label="remove ${item.name}" value="${item.id}">&times;</button>           
            </li>`
        )
        .join('');

    list.innerHTML = html;
}

function mirrorToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}

function restoreFromLocalStorage() {
    // make temporary items from local storage
    const lsItems = JSON.parse(localStorage.getItem('items'));
    // if there are any, push them into items array
    if (lsItems.length) {
        items.push(...lsItems);
        list.dispatchEvent(new CustomEvent('itemsUpdated'));
    }
}

function deleteItem(id) {
    // newItems is new array with items without the passed id
    // overwrite our state items array
    items = items.filter((item) => item.id !== id);
    // display en local storage updaten
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

function markAsComplete(id) {
    const itemRef = items.find((item) => item.id === id);
    itemRef.complete = !itemRef.complete; // toggles true / false
    list.dispatchEvent(new CustomEvent('itemsUpdated'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('itemsUpdated', displayItems);
list.addEventListener('itemsUpdated', mirrorToLocalStorage);
list.addEventListener('click', function (e) {
    const id = parseInt(e.target.value); // gets id from item
    if (e.target.matches('button')) {
        deleteItem(id);
    }
    if (e.target.matches('input[type="checkbox"]')) {
        markAsComplete(id);
    }
});
// run on pageload
restoreFromLocalStorage();
