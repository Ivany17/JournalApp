const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteResult = document.getElementById('noteResult');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const filterDate = document.getElementById('filterDate');
const filterBtn = document.getElementById('filterBtn');

addNoteBtn.addEventListener('click', async () => {
    if(!titleInput.value.trim() || !contentInput.value.trim()){
        alert("Title and Content cannot be empty!");
    } else {
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
            showMessage("Note added successfully!");
        } else {
            showMessage("Failed to add note");
        }
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
            const deleteAnswer = confirm("Are you sure you want to delete this note?");
            if(deleteAnswer){
                const deleteResult = await fetch(`/api/notes/${d.id}`, {method: 'DELETE'});
                if (deleteResult.ok) {
                renderNotes();
                    showMessage("Note deleted successfully!");
                } else {
                    showMessage("Failed to delete note");
                }
            }
        });
        
        const editButton = document.createElement('button');
        editButton.className = 'edit-btn';
        editButton.textContent = "Edit";
        noteCard.appendChild(editButton);
        editButton.addEventListener('click', async() => {
            const editAnswer = confirm("Are you sure you want to edit this note?");
            if(editAnswer){
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
                    if (putResult.ok) {
                        renderNotes();
                        showMessage("Note updated successfully!");
                    } else {
                        showMessage("Failed to updated note");
                    }
                }
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
filterBtn.addEventListener('click', async() => {
    const searchDate = filterDate.value;
    console.log("Search date:", searchDate);
    const getResult = await fetch(`/api/notes/search?date=${encodeURIComponent(searchDate)}`);
    const data = await getResult.json();
    displayNotes(data);
    filterDate.value = "";
});

function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    if(type === 'error'){
        message.style.color = "#ff6b6b";
    } else{
        message.style.color = "#2ecc71";
    }
    message.style.display = "block";
    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}

renderNotes();