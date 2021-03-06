let addItemForm = document.querySelector('#addItemForm');
let itemsList = document.querySelector('.actionItems');
//let storage = chrome.storage.sync;

//chrome.storage.sync.clear();

storage.get(['actionItems'], (data) => {
    let actionItems = data.actionItems;
    renderActionItems(actionItems);
});

const renderActionItems = (actionItems) => {
    actionItems.forEach((item) => {
        renderActionItem(item.text, item.id, item.completed);
    });
}

addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let itemText = addItemForm.elements.namedItem('itemText').value;
    if (itemText) {
        add(itemText);
        renderActionItem(itemText);
        addItemForm.elements.namedItem('itemText').value = '';
    }

});

const add = (text) => {
    let actionItem = {
        id: uuidv4(),
        added: new Date().toString(),
        text: text,
        completed: null
    }



    chrome.storage.sync.get(['actionItems'], (data) => {
        //   console.log(data);
        let items = data.actionItems;
        if (!items) {
            items = [actionItem];
        } else {
            items.push(actionItem);
        }

        chrome.storage.sync.set({
            actionItems: items
        }, () => {
            chrome.storage.sync.get(['actionItems'], (data) => {
                console.log(data);
            });
        });
    });
}

const markUnmarkCompleted = () => {
    storage.get(['actionItems'], (data) => {
        let items = data.actionItems;
        let foundItemIndex = items.findIndex((item) => {
            item.id == id;
        });
        if (foundItemIndex >= 0) {
            items[foundItemIndex].completed = true;
            chrome.storage.sync.set({ actionItems: items })
        }
    });
}

const handleCompletedEventListener = (e) => {
    //console.log(e.target);
    const i e.target.parentElement.parentElement.getAttribute('data-id');
    const parent = e.target.parentElement.parentElement;
    parent.classList.add('completed');
    markUnmarkCompleted(id);
}

const renderActionItem = (text, id) => {

    let element = document.createElement('div');
    element.classList.add('actionItem__item');
    let mainElement = document.createElement('div');
    mainElement.classList.add('actionItem__main');
    let checkEl = document.createElement('div');
    checkEl.classList.add('actionItem__check');
    let textEl = document.createElement('div');
    textEl.classList.add('actionItem__text');
    let deleteEl = document.createElement('div');
    deleteEl.classList.add('actionItem__delete');

    checkEl.innerHTML = ` <div class="actionItem__checkBox">
                                <i class="fas fa-check" aria-hidden="true"></i>
                            </div>`

    if (completed) {
        element.classList.add('completed');
    }

    element.setAttribute('data-id', id);
    checkEl.addEventListener('click', handleCompletedEventListener);

    textEl.textContent = text;

    deleteEl.innerHTML = `
    <i class="fas fa-times"></i>
    `
    mainElement.appendChild(checkEl);
    mainElement.appendChild(textEl);
    mainElement.appendChild(deleteEl);

    element.appendChild(mainElement);
    //   console.log(element);
    itemsList.prepend(element);
}

var circle = new ProgressBar.Circle('#container', {
    color: '#65463E',
    // This has to be the same size as the maximum width to
    // prevent clipping
    strokeWidth: 4,
    trailWidth: 1,
    easing: 'easeInOut',
    duration: 1400,
    text: {
        autoStyleContainer: false
    },
    from: { color: '#D2E5D0', width: 2 },
    to: { color: '#AAD6A0', width: 6 },
    // Set default step function for all animate calls
    step: function(state, circle) {
        circle.path.setAttribute('stroke', state.color);
        circle.path.setAttribute('stroke-width', state.width);

        var value = Math.round(circle.value() * 100);
        if (value === 0) {
            circle.setText('');
        } else {
            circle.setText(value);
        }

    }
});
circle.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
circle.text.style.fontSize = '2rem';

circle.animate(1.0); // Number from 0.0 to 1.0