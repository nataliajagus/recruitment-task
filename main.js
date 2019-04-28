const inputButton = document.querySelector('.form__button');
const formInput = document.querySelector('.form__input');
const container = document.querySelector('.container');
let citiesList = document.createElement('div');
citiesList.classList.add('cities__wrapper');


inputButton.addEventListener('click', function(e) {
    e.preventDefault();
    citiesList.innerHTML = '';
    let countryCode = '';
    localStorage.setItem('inputValue', formInput.value);

    if(formInput.value == 'Poland' || formInput.value == 'poland') {
        countryCode = 'PL';
    } else if (formInput.value == 'Germany' || formInput.value == 'germany') {
        countryCode = 'DE';
    } else if (formInput.value == 'Spain' || formInput.value == 'spain') {
        countryCode = 'ES';
    } else if (formInput.value == 'France' || formInput.value == 'france') {
        countryCode = 'FR';
    } else {
        countryCode = null;
        citiesList.innerHTML = '<p style="color:red; font-size: 12px; text-align:center;">Wrong country</p>';
    }

    if(countryCode) {
        fetch(`https://api.openaq.org/v1/cities?country=${countryCode}&order_by=count&sort=desc&limit=10`)
        .then(resp => resp.json())
        .then(resp => {
            return resp.results.map(function(result) {
                const itemHtml = `
                    <button class="accordion__title" onclick="accordion(this)">${result.city}</button>
                    <div class="accordion__panel">
                        <p>Loading...</p>
                    </div>
                `
                citiesList.innerHTML = citiesList.innerHTML.concat(itemHtml);
                localStorage.setItem('citiesList', citiesList.innerHTML);
            })
    
        })
        .catch(error => citiesList.innerHTML = `<p style="color:red; font-size: 12px; text-align:center;">${error}</p>`);
    }
    container.appendChild(citiesList);

})

function accordion(element) {
    element.classList.toggle("active");
    let panel = element.nextElementSibling;
    if (panel.style.maxHeight){
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = "300px";
      }

    fetch(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=${element.innerText}&redirects=true&origin=*`)
    .then(resp => resp.json())
    .then(resp => {
        let pageId = Object.keys(resp.query.pages)[0];
        panel.innerHTML = resp.query.pages[pageId].extract;
    })
    .catch(error => panel.innerHTML = `<p style="color:red; font-size: 12px; text-align:center;">${error}</p>`);

}

if(localStorage.getItem('inputValue')) {
    formInput.value = localStorage.getItem('inputValue');
}

if(localStorage.getItem('citiesList') && formInput.value == 'Poland' || formInput.value == 'poland' || formInput.value == 'Germany' || formInput.value == 'germany' || formInput.value == 'Spain' || formInput.value == 'spain' || formInput.value == 'France' || formInput.value == 'france') {
    citiesList.innerHTML = localStorage.getItem('citiesList');
    container.appendChild(citiesList);
}