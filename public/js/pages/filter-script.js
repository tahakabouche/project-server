window.chosenSizes= [];

window.sizeFilterButtons = Array.from(document.querySelectorAll('.btn--filter'));
sizeFilterButtons.forEach(element => element.addEventListener('click', toggleSizeButton));

function toggleSizeButton(event){

    let element = event.currentTarget;
    if(!element.classList.contains('btn--filter-clicked')){
        element.classList.add('btn--filter-clicked');
        element.classList.add('btn--black-hov');
        element.classList.remove('btn--gray-hov');
        window.chosenSizes.push(element);
     }
    else{ 
        element.classList.remove('btn--filter-clicked');
        element.classList.remove('btn--black-hov');
        element.classList.add('btn--gray-hov');
        window.chosenSizes = window.chosenSizes.filter(elem => elem !== element);
    }
     
}


function toggleSubMenu(button){
    button.nextElementSibling.classList.toggle('expanded');
    button.querySelector('.filters-arrow').classList.toggle('down');
}