async function loadSubjects() {
    const response = await fetch('subjects.php');

    if (!response.ok) {
        throw new Error('Could not load subjects');
    }

    const subjects = await response.json();

    for (const subject of subjects) {
        const option = document.createElement('option');

        option.value = subject.id;
        option.textContent = subject.name;

        document.querySelector('#subject').append(option);
    }
}

loadSubjects();

const form = document.querySelector('form');

const status = document.querySelector('#status');

const tableBody = document.querySelector('#results tbody');


async function searchBooks() {

    const params = new URLSearchParams(new FormData(form));

    const response = await fetch(`books.php?${params}`);

    if (!response.ok) {
        throw new Error('Could not load books');
    }

    const books = await response.json();

    tableBody.replaceChildren();

    for (const book of books) {

        const row = document.createElement('tr');

        const values = [
            book.title,
            book.author,
            book.year,
            book.subject,
            `${book.available} of ${book.copies}`
        ];

        for (const value of values) {

            const cell = document.createElement('td');

            cell.textContent = value;

            row.append(cell);
        }

        if (Number(book.available) === 0) {
            row.lastElementChild.classList.add('out');
        }

        tableBody.append(row);
    }

    if (books.length === 0) {
        status.textContent = 'No books match your search.';
    } else if (books.length === 1) {
        status.textContent = '1 book found.';
    } else {
        status.textContent = `${books.length} books found.`;
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    searchBooks();
});

searchBooks();

