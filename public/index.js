window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('window-scroll', window.scrollY > 0)
});

const faqs = document.querySelectorAll('.faq');
faqs.forEach(faq => {
    faq.addEventListener('click', () => {
        faq.classList.toggle('open');

        const icon = faq.querySelector('.faq__icon i');
        if(icon.className === 'uil uil-plus') {
            icon.className = 'uil uil-minus';
        } else {
            icon.className = 'uil uil-plus';
        }
    })
});

// var api = 'http://localhost:8080/api/data';
// function start(data) {
//     fetch(api)
//         .then(res => {
//             return res.json();
//     })
//         .then(data);
// }

// function render(data) {
//     var category = document.querySelector('.category');
//     var html = data.map(function(person) {
//         return `<p> ${person.name} </p>`
//     });
//     category.innerHTML = html.join('');
// }

// start(render);