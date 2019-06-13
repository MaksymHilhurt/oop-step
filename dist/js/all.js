const doc = document;

const desk = doc.getElementById('desk');



updateDatePickers();

getCardsFromLocalStorage();

doc.addEventListener('click', (e) => {
    let target = e.target;
    if (target.classList.contains('header-btn')) {
        doc.getElementsByClassName('overlay')[0].classList.remove('overlay-hidden');
    }
    if (target.classList.contains('overlay') || target.classList.contains('cross')) {
        closeModal();
        clearModalSettings();
    }
    if (target.id === 'select-input') {
        doc.getElementsByClassName('select-wrapper')[0].classList.toggle('select-opened');
    }
    if (target.classList.contains('doctor')) {
        chooseDoctorSettings(target);
    }
    if (target.id !== 'select-input' && !target.classList.contains('doctor')) {
        doc.getElementsByClassName('select-wrapper')[0].classList.remove('select-opened');
    }
    if (target.classList.contains('show-more')) {
        showMoreInfo(target);
    }
    if (target.classList.contains('submit-btn')) {
        e.preventDefault();
        let parent = target.parentElement;
        let inputs = parent.querySelectorAll('input');
        const arr = [];
        inputs.forEach((item) => {
            arr.push(item.value);
        });
        if (arr.every((e) => {
            return e !== "";
        })) {
            saveInputVal();
            closeModal();
            clearModalSettings();
        }
    }
    if (target.classList.contains('delete-card')) {
        closeCard(target);
    }
});


function clearCurrentDoctorChoice() {
    if (doc.getElementsByClassName('form-shown').length) {
        doc.getElementsByClassName('form-shown')[0].classList.remove('form-shown');
    }
}

function clearModalSettings() {
    clearCurrentDoctorChoice();
    doc.getElementById('select-input').innerHTML = 'Choose a doctor';
    doc.getElementById('select-input').setAttribute('data-doc', '');
    const forms = doc.querySelectorAll('.info-input');
    forms.forEach((item) => {
        item.value = '';
    });
    const textareas = doc.querySelectorAll('textarea');
    textareas.forEach((item) => {
        item.value = '';
    })
}

function chooseDoctorSettings(doctor) {
    doc.getElementById('select-input').innerHTML = doctor.innerHTML;
    doc.getElementById('select-input').setAttribute('data-doc', `${doctor.id}`);
    doc.getElementsByClassName('select-wrapper')[0].classList.toggle('select-opened');
    clearCurrentDoctorChoice();
    doc.getElementById(`${doctor.id}-form`).classList.add('form-shown');
}

function closeModal() {
    doc.getElementsByClassName('overlay')[0].classList.add('overlay-hidden');
}

function updateDatePickers() {
    let today = new Date().toISOString().substr(0, 10);
    document.querySelectorAll('.visit-date').forEach((item) => {
        item.setAttribute('min', `${today}`);
    });
    document.querySelector('.prev-visit-date').setAttribute('max', `${today}`);
}

function showMoreInfo(btn) {
    let parentCard = btn.parentElement;
    let hiddenInfo = parentCard.querySelectorAll('.card-info-additional');
    hiddenInfo.forEach((item) => {
        item.classList.toggle('card-info-hidden');
    });
    if (btn.innerHTML === 'Show more') {
        btn.innerHTML = 'Hide';
    } else {
        btn.innerHTML = 'Show more';
    }
}

function saveInputVal(chosenDoctor) {
    chosenDoctor = doc.getElementById('select-input').getAttribute('data-Doc').split('-')[0];
    if (chosenDoctor === 'therapist') {
        let form = doc.querySelector(`#${chosenDoctor}-form`);
        let name = form.querySelector('[name=name]').value;
        let date = form.querySelector('[name=date]').value;
        let purpose = form.querySelector('[name=visit-reason]').value;
        let comment = form.querySelector('[name=comment]').value;
        let age = form.querySelector('[name=age]').value;
        const item = new Therapist(name, date, purpose, comment, age);
        item.createNoteCard();
    }
    if (chosenDoctor === 'cardiologist') {
        let form = doc.querySelector(`#${chosenDoctor}-form`);
        let name = form.querySelector('[name=name]').value;
        let date = form.querySelector('[name=date]').value;
        let purpose = form.querySelector('[name=visit-reason]').value;
        let comment = form.querySelector('[name=comment]').value;
        let age = form.querySelector('[name=age]').value;
        let pressure = form.querySelector('[name=pressure]').value;
        let index = form.querySelector('[name=index-mass]').value;
        let diseases = form.querySelector('[name=cardio-disease]').value;
        const item = new Cardiologist(name, date, purpose, comment, age, pressure, index, diseases);
        item.createNoteCard();
    }
    if (chosenDoctor === 'dentist') {
        let form = doc.querySelector(`#${chosenDoctor}-form`);
        let name = form.querySelector('[name=name]').value;
        let date = form.querySelector('[name=date]').value;
        let purpose = form.querySelector('[name=visit-reason]').value;
        let comment = form.querySelector('[name=comment]').value;
        let prevDate = form.querySelector('[name=prev-visit]').value;
        const item = new Dentist(name, date, purpose, comment, prevDate);
        item.createNoteCard();

    }
}

function getCardsFromLocalStorage() {
    let local = localStorage.length;
    if (local > 0) {
        desk.querySelector('p').innerHTML = '';
        for (let l = 0; l < local; l++) {
            let key = localStorage.key(l);
            let item = localStorage.getItem(key);
            desk.innerHTML += item;
        }
    }
}

function closeCard(card) {
    let parent = card.closest('.card');
    let currentID = parent.getAttribute('data-id');
    window.localStorage.removeItem(currentID);
    desk.removeChild(parent);
    checkEmptyDesk();
}

function checkEmptyDesk() {
    if (!doc.querySelectorAll('.card').length) {
        desk.querySelector('p').innerHTML = 'No items have been added';
    }
}

class Visit {
    constructor(doctor, name, date, purpose, comment, color = '#7cfff0') {
        this.name = {
            description: 'Name:',
            text: name
        };
        this.doctor = {
            description: 'Doctor:',
            text: doctor
        };
        this.date = {
            description: 'Date:',
            text: date
        };
        this.purpose = {
            description: 'Visit purpose:',
            text: purpose
        };
        this.comment = {
            description: 'Comments:',
            text: comment
        };
        this.color = color;
        this.mainInfoArr = [this.name, this.doctor];
        this.additInfoArr = [this.date, this.purpose, this.comment];
    }

    createNoteCard() {
        let card = doc.createElement('div');
        card.classList.add('card');
        card.style.backgroundColor = `${this.color}`;
        desk.appendChild(card);
        if (desk.querySelector('p').innerHTML !== "") {
            desk.querySelector('p').innerHTML = "";
        }
        for (let i = 0; i < this.mainInfoArr.length; i++) {
            let info = doc.createElement('p');
            info.classList.add('card-info');
            info.innerText = `${this.mainInfoArr[i].description} ${this.mainInfoArr[i].text}`;
            card.appendChild(info);
        }
        for (let i = 0; i < this.additInfoArr.length; i++) {
            let info = doc.createElement('p');
            info.classList.add('card-info');
            info.classList.add('card-info-additional');
            info.classList.add('card-info-hidden');
            info.innerText = `${this.additInfoArr[i].description} ${this.additInfoArr[i].text}`;
            card.appendChild(info);
        }
        let showMoreBtn = doc.createElement('button');
        showMoreBtn.classList.add('show-more');
        showMoreBtn.innerHTML = 'Show more';
        card.appendChild(showMoreBtn);
        let deleteBtn = doc.createElement('btn');
        deleteBtn.classList.add('delete-card');
        card.appendChild(deleteBtn);

        let newID = new Date().toISOString().substr(0, 19);
        card.setAttribute('data-ID', `${newID}`);

        localStorage.setItem(`${newID}`, card.outerHTML);

        makeDragonDrop(card);
    }

}

class Therapist extends Visit {
    constructor(name, date, purpose, comment, age) {
        super("Therapist", name, date, purpose, comment, '#e5de30');
        this.age = {
            description: 'Age:',
            text: age
        };
        this.additInfoArr.push(this.age);
    }
}

findCard();

function makeDragonDrop(cardTarget) {
    let card = cardTarget;

    function move(e) {
        let cord = card.getBoundingClientRect();
        let dek = desk.getBoundingClientRect();
        if ((cord.x - 20 - dek.x) < 0) {
            card.mousePositionX = e.clientX + card.offsetLeft - 20;
        }
        if ((cord.y - 20 - dek.y) < 0) {
            card.mousePositionY = e.clientY + card.offsetTop - 20;
        }
        if (((dek.x + dek.width) - (cord.x + cord.width + 20)) < 0) {
            card.mousePositionX = (card.offsetLeft + cord.width - dek.width) + e.clientX + 30;
        }
        if (((dek.y + dek.height) - (cord.y + cord.height + 20)) < 0) {
            card.mousePositionY = (card.offsetTop + cord.height - dek.height) + e.clientY + 30;
        }
        card.style.transform = `translate(${e.clientX - card.mousePositionX}px,${e.clientY - card.mousePositionY}px)`;
    }

    card.addEventListener('mousedown', (e) => {
        if (card.style.transform) {
            const transforms = card.style.transform;
            const transformX = parseFloat(transforms.split('(')[1].split(',')[0]);
            const transformY = parseFloat(transforms.split('(')[1].split(',')[1]);
            card.mousePositionX = e.clientX - transformX;
            card.mousePositionY = e.clientY - transformY;
        } else {
            card.mousePositionX = e.clientX;
            card.mousePositionY = e.clientY;
        }
        document.addEventListener('mousemove', move);
    });

    doc.addEventListener('mouseup', e => {
        let card = e.target.closest('.card');
        if(card){
            let id = card.getAttribute('data-ID');
            localStorage.removeItem(id);
            localStorage.setItem(id,card.outerHTML);

            console.log(id);

            doc.removeEventListener('mousemove', move);
        }

        return false;
    });
}

function findCard() {
    if (document.querySelectorAll('.card').length) {
        document.querySelectorAll('.card').forEach((item) => {
            makeDragonDrop(item);
        })
    }
}

class Cardiologist extends Visit {
    constructor(name, date, purpose, comment, age, pressure, index, diseases) {
        super("Cardiologist", name, date, purpose, comment, '#66d9e5');
        this.age = {
            description: 'Age:',
            text: age
        };
        this.pressure = {
            description: 'Pressure:',
            text: age
        };
        this.index = {
            description: 'BMI:',
            text: age
        };
        this.diseases = {
            description: 'Diseases:',
            text: age
        };
        this.additInfoArr.push(this.age);
        this.additInfoArr.push(this.pressure);
        this.additInfoArr.push(this.index);
        this.additInfoArr.push(this.diseases);
    }
}

class Dentist extends Visit {
    constructor(name, date, purpose, comment, prevDate) {
        super("Dentist", name, date, purpose, comment, '#7be57b');
        this.prevDate = {
            description: 'Recent visit date:',
            text: prevDate
        };
        this.additInfoArr.push(this.prevDate);
    }
}