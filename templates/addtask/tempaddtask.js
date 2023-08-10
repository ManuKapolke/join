let lastClickedImage = null;
let priority;
let minwidth = window.matchMedia('(min-width: 900px)');
let bntIdis = 1;
const buttons = [
    { id: "addtask-prio-bnt-urgent", img: "./assets/img/prio-urgent.svg", activeImg: "./assets/img/urgent-white.svg" },
    { id: "addtask-prio-bnt-medium", img: "./assets/img/prio-medium.svg", activeImg: "./assets/img/medium-white.svg" },
    { id: "addtask-prio-bnt-low", img: "./assets/img/prio-low.svg", activeImg: "./assets/img/low-white.svg" },
];

/** Catch window sice */
// window.addEventListener('resize', media);

/**init onload functions */
async function initAddTask() {
    await loadUserData();
    await initHeaderNav();
    // media();
    setMinDate('date');
    // dropdownValueCheck(); 
    renderCategory();
    await renderContacts();
    giveContactListId();
}

/** Manage window sice */
// function media() {
//     const imposter = document.getElementById("imposter");
//     const amogus = document.getElementById("amogus");

//     if (minwidth.matches) {
//         moveContent("imposter");
//     } else {
//         moveContent("amogus");
//     }
// }

/** Fill selected container abot window sice
 * @param {ID} destination - container id
 */
// function moveContent(destination) {
//     const container = document.getElementById(destination);

//     const prio = document.getElementById("addtaskFull-prio");
//     const duedate = document.getElementById("addtaskFull-duedate");
//     const subtasks = document.getElementById("addtaskFull-subtasks");

//     container.appendChild(prio);
//     container.appendChild(duedate);
//     container.appendChild(subtasks);
// }

/** Toggle btn 1 of 3
 * @param {ID} buttonId - select btn id
 */
function setActiveButton(buttonId) {
    const selectedButton = buttons.find((button) => button.id === buttons[buttonId].id);
    priority = buttonId;

    buttons.forEach((button) => {
        const element = document.getElementById(button.id);
        const imgElement = document.getElementById(`${button.id}-img`);

        if (button.id !== selectedButton.id) {
            element.classList.remove("active");
            imgElement.src = button.img;
        } else {
            element.classList.toggle("active");
            if (element.classList.contains("active")) {
                lastClickedImage = imgElement.src;
                imgElement.src = button.activeImg;
            } else {
                imgElement.src = lastClickedImage || button.img;
            }
        }
    });
}

/** Toggle section category
 * @param {*} dropMaster 
 */
function toggleActive(dropMaster) {
    if (dropMaster === 'category-selection') {
        document.getElementById("category-selection").classList.toggle("collapsed");
        document.getElementById('color-pick').classList.add('d-none');

    } else if (dropMaster === 'mail-selection') {
        document.getElementById("mail-selection").classList.toggle("collapsed");
    }
}

/**Save values into backend */
async function addTask() {
    await saveCheckedContacts();
    await setCheckedSubtasksAsDone();
    const newTask = {
        "title": document.getElementById('task-title').value,
        "description": document.getElementById('task-description').value,
        "dueDate": document.getElementById('date').value,
        "prio": priority,
        "category": category[selectCategory],
        "assignedTo": contacts,
        "subtasks": subtasks,
        "boardColumn": localStorage.getItem('boardColumnToAddTask'),
    };
    checkRelevantInputFields(newTask);
}

/**Check input fields for content */
async function checkRelevantInputFields(newTask){
    const prioIsWhat = document.querySelector('.addtask-prio-bnt.active');
    const title = document.getElementById('task-title');
    const description = document.getElementById('task-description');
    const dueDate = document.getElementById('date');
    
    setInputFildsFrame();
    if (
        category[selectCategory] &&
        prioIsWhat !== null && prioIsWhat !== undefined &&
        title.value.trim() !== '' &&
        description.value.trim() !== '' &&
        dueDate.value.trim() !== ''
    ) {
        activeUser.tasks.push(newTask);
        await saveUserData();
        resetAddTaskOverlay();
    }
}

/**Set red Frame for input Fields */
function setInputFildsFrame(){
    setCategoryField();
    setPrioBntField();
    setTitleField();
    setDiscriptionField();
    setDueDateField();
}

/**Check and set input field */
function setCategoryField(){
    const categorySelection = document.getElementById('category-selection');

    if (!category[selectCategory]) {
        categorySelection.style.border = "1px solid #ff0000";
    } else {
        categorySelection.style.border = "1px solid #FFFFFF";
    }
}

/**Check and set bnt frame */
function setPrioBntField(){
    const prioIsWhat = document.querySelector('.addtask-prio-bnt.active');

    if (prioIsWhat === null || prioIsWhat === undefined) {
        document.getElementById('addtask-prio-whichBnt').style.border = "1px solid #ff0000";
        document.getElementById('addtask-prio-whichBnt').style.border.radius = "10px";
    } else {
        document.getElementById('addtask-prio-whichBnt').style.border = "1px solid #ffffff";
    }
}

/**Check and set title frame */
function setTitleField(){
    const title = document.getElementById('task-title');

    if (!title.value.trim()) {
        title.style.border = "1px solid #ff0000";
    } else {
        title.style.border = "1px solid #FFFFFF";
    }
}

/**Check and set discription field */
function setDiscriptionField(){
    const description = document.getElementById('task-description');

    if (!description.value.trim()) {
        description.style.border = "1px solid #ff0000";
    } else {
        description.style.border = "1px solid #FFFFFF";
    }
}

/**Check and set due dtae frame */
function setDueDateField(){
    const dueDate = document.getElementById('date');

    if (!dueDate.value.trim()) {
        dueDate.style.border = "1px solid #ff0000";
    } else {
        dueDate.style.border = "1px solid #FFFFFF";
    }
}

/**Close and reset add task overlay */
function resetAddTaskOverlay() {
    closeAddTaskOverlay();
    renderBoardColumns();
    resetInputFields();
}

/**Refresh Category */
function renderHtmlCategory() {
    return /*html*/`
    <div id="selected-element" class="paddings d-flex" onclick="toggleActive('category-selection');">
      Select task category
    </div>
    `;
}

/**Reset Subtasks */
async function resetSubtasks() {
    subtasks = [];
    await setItem('subtasks', JSON.stringify(subtasks));
    renderSubtaskArray();
}

/** Catch btn id
 * @param {Number} bntId - select btn with number
 */
function givebntid(bntId) {
    bntIdis = bntId
}

/** Load btn img and remove class
 * @param {Number} bntIdis - select btn with number
 */
function resetbnts(bntIdis) {
    const bntis = document.querySelector('.addtask-prio-bnt.active');
    if (bntis === null || bntis === undefined) { /*console.log("Try chatch E")*/ } else {
        letbntimgis = bntis.id + "-img"
        document.getElementById(letbntimgis).src = buttons[bntIdis].img
        document.getElementById(bntis.id).classList.remove('active');
    }
}

/**Reset all inputs */
async function resetInputFields() {
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('date').value = '';
    document.getElementById('currentItem').innerHTML = renderHtmlCategory();
    document.getElementById('mail-selection').classList.toggle("collapsed");
    await resetbnts(bntIdis);
    await resetSubtasks();
}

/**Render input field for new Catergory */
function newInput(section) {
    if (section === 'category') {
        generateHTMLNewCategory();
        document.getElementById('color-pick').classList.remove('d-none');
    }
    else if (section === 'new-mail') {
        linkToUrl('contacts.html');
    }
    else if (section === 'subtask') {
        setHTMLSubtaskImg();
    }
}

/**Cancel input and load drop down list */
function cancelSection(section) {
    if (section === 'category') {
        document.getElementById('category-selection').classList.remove('height-46');
        resetCetegory('category');
        renderCategory();
    } else if (section === 'new-mail') {
        generateHTMLSelectMail();
    } else if (section === 'subtask') {
        removeHTMLSubtaskImg();
    }
}

/** Fill section category
 * @param {Number} i 
 */
function selectedCategory(i) {
    let showSelectedCategory = document.getElementById('selected-element');

    selectCategory = i

    showSelectedCategory.innerHTML = `
        <div>${category[i].name}</div>
        <div class="addtask-item-color color-cicle img-20 bg-${category[i].color}"></div>
    `;
    document.getElementById("category-selection").classList.remove("collapsed");
    document.getElementById('color-pick').classList.add('d-none');
}

/**Load all categorys with color */
function renderCategory() {
    let categoryList = document.getElementById('dropNum(category)');
    categoryList.innerHTML = '';

    for (let i = 0; i < category.length; i++) {
        let categoryElement = category[i];

        categoryList.innerHTML += /*html*/`
        <div onclick="selectedCategory(${i})" class="addtask-item paddings addtask-id">
            <div class="addtask-item-color color-cicle img-20 bg-${categoryElement.color}"></div>
            ${categoryElement.name}
		</div>
        `;
    }
}

/**Save new category */
async function saveNewCategory(section) {
    if (section === 'category') {
        let inputValue = document.getElementById('new-category');
        if (categoryColorPick !== undefined && inputValue.value !== '') {
            category.push({ name: inputValue.value, color: categoryColorPick });
            document.getElementById('category-selection').classList.remove('height-46');
            resetCetegory(inputValue);
            renderCategory();
        }
    }
    else if (section === 'subtask') {
        initSubtask();
    }
}

/**After save new category, reset the selection */
function resetCetegory(inputValue) {
    let editColor = document.getElementById('color-selected');
    let editContainer = document.getElementById('category-selection');

    document.getElementById('color-pick').classList.add('d-none');
    editColor.classList.remove(`bg-${categoryColorPick}`);
    editContainer.classList.remove('d-flex');
    editContainer.classList.remove('a-item');
    inputValue.value = '';
    categoryColorPick = undefined;
    generateHTMLSelectCategory();
}

/**Color pick category */
function addColorCategory(id) {
    let editContainer = document.getElementById('category-selection');
    let editColor = document.getElementById('color-selected');

    editContainer.classList.add('d-flex');
    editContainer.classList.add('a-item');

    categoryColorPick = id;
    editColor.classList.add(`bg-${id}`);
    document.getElementById('color-pick').classList.add('d-none');
}

/**Render all contacts */
async function renderContacts() {
    let contactList = document.getElementById('apicontact-list');
    let contactsArray = activeUser.contacts;

    contactList.innerHTML = '';

    for (let i = 0; i < contactsArray.length; i++) {
        const contact = contactsArray[i].name;

        contactList.innerHTML += /*html*/`
        <div class="addtask-item paddings pos-re" onclick="checkboxSwitch(id)">${contact}
            <input id="contact-checkbox${i}" type="checkbox">
		</div>
        `;
    }
}

/**Save checked Contacts */
async function saveCheckedContacts() {
    let contactsArray = activeUser.contacts;

    for (let i = 0; i < contactsArray.length; i++) {
        const contact = contactsArray[i];
        if (document.getElementById(`contact-checkbox${i}`).checked == true) {
            contacts.push(contact);
        }
    }
}

/**Save & load subtasks */
function initSubtask() {
    let inputValue = document.getElementById('subtask');
    subtasks.push({
        name: inputValue.value,
        done: false
    });
    inputValue.value = '';
    renderSubtaskArray();
}

/**Save only checked Subtasks */
async function setCheckedSubtasksAsDone() {
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        if (document.getElementById(`subtask-checkbox${i}`).checked == true) {
            subtask.done = true;
        }
    }
}

/**Load temporary Subtasks */
function renderSubtaskArray() {
    let subtaskList = document.getElementById("dropNum(subtask)");

    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];

        subtaskList.innerHTML += /*html*/`
    <div>
        <input type="checkbox" name="" id="subtask-checkbox${i}">
        <label for="subtask-checkbox${i}">${subtask.name}</label>
    </div>
    `;
    }
}

/**Change subtask img*/
function setHTMLSubtaskImg() {
    document.getElementById('subtask-img-add').classList.add('d-none');
    document.getElementById('subtask-img-activ').classList.remove('d-none');
}

/**Reset subtask img*/
function removeHTMLSubtaskImg() {
    document.getElementById('subtask-img-add').classList.remove('d-none');
    document.getElementById('subtask-img-activ').classList.add('d-none');


    document.getElementById('subtask').value = '';
}

function giveContactListId(params) {
    const idList = document.getElementById('apicontact-list');

    const childElements = idList.children;
    for (let index = 2; index <= childElements.length + 1; index++) {
        const currentElement = childElements[index - 2];
        currentElement.setAttribute('id', `contact-${index}`);
    }
}

async function trueFalesTranslater(params) {
    const activeList = document.querySelectorAll('.addtask-id-contact');
    // console.log(activeList);
}