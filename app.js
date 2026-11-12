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
