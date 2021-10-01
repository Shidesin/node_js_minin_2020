const toCurrency = (price) => {
    return new Intl.NumberFormat('en-EN', {
        currency: 'usd',
        style: 'currency'
    }).format(+price)
}

const toDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach((node) => {
    node.textContent = toDate(node.textContent)
})

document.querySelectorAll('.price').forEach((node) => {
    node.textContent = toCurrency(node.textContent)
})

const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf
            fetch('/card/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                },
            })
                .then(response => response.json())
                .then((card) => {
                    if (card.courses.length) {
                        const html = card.courses.map((course) => {
                            return `
                        <tr>
                            <td>${course.title}</td>
                            <td>${course.count}</td>
                            <td>
                                <button class="btn btn-small js-remove" data-id="${course.id}">Delete</button>
                            </td>
                        </tr>
                    `
                        }).join('')
                        $card.querySelector('tbody').innerHTML = html
                        $card.querySelector('.price').textContent = toCurrency(card.price)
                    } else {
                        $card.innerHTML = '<p>Empty...</p>'
                    }
                })
        }
    })
}


M.Tabs.init(document.querySelectorAll('.tabs'));