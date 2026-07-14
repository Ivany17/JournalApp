const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteResult = document.getElementById('noteResult');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

addNoteBtn.addEventListener('click', async () => {
    const postResult = await fetch("/api/notes", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: titleInput.value,
            content: contentInput.value,
        }),
    });
    if (postResult.ok) {
        renderNotes();
        titleInput.value = "";
        contentInput.value = "";
    } else {
        console.error("Failed to add note");
    }
});

async function displayNotes(data) {
    noteResult.innerHTML = "";
    data.forEach(d => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'note-title';
        titleContainer.textContent = d.title;
        noteCard.appendChild(titleContainer);

        const contentContainer = document.createElement('div');
        contentContainer.className = 'note-content';
        contentContainer.textContent = d.content;
        noteCard.appendChild(contentContainer);

        const dateTime = document.createElement('div');
        dateTime.className = 'note-date';
        dateTime.textContent = new Date(d.createdAt).toLocaleString();
        noteCard.appendChild(dateTime);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = "Delete";
        noteCard.appendChild(deleteButton);
        deleteButton.addEventListener('click', async () => {
            const deleteResult = await fetch(`/api/notes/${d.id}`, {method: 'DELETE'});
            renderNotes();
        });
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = "Edit";
        noteCard.appendChild(editButton);
        editButton.addEventListener('click', async() => {
            const askEditTitle = window.prompt("Edit your Title");
            const askEditContent = window.prompt("Edit your Content");
            if(askEditTitle != null || askEditContent != null){
                const putResult = await fetch(`/api/notes/${d.id}`, {
                    method: 'PUT',
                    headers: { "Content-Type" : "application/json" },
                    body: JSON.stringify({
                        title: askEditTitle,
                        content: askEditContent,
                    }),
                });
                renderNotes();
            }
        });

        noteResult.appendChild(noteCard);
    });
}

async function renderNotes() {
    const getResult = await fetch("/api/notes/search");
    const data = await getResult.json();
    displayNotes(data);
}

searchBtn.addEventListener('click', async() => {
    const searchText = searchInput.value;
    const getResult = await fetch(`/api/notes/search?search=${encodeURIComponent(searchText)}`);
    const data = await getResult.json();
    displayNotes(data);
    searchInput.value = "";
});

renderNotes();