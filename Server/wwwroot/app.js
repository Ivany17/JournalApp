const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteResult = document.getElementById('noteResult');

addNoteBtn.addEventListener('click', async () => {
    const postResult = await fetch("/api/notes", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: titleInput.value,
            content: contentInput.value,
        }),
    });
    renderNotes();
    titleInput.value = "";
    contentInput.value = "";
});

async function renderNotes() {
    const getResult = await fetch("/api/notes");
    const data = await getResult.json();
    noteResult.innerHTML = "";
    data.forEach(d => {
        const titleContainer = document.createElement('div');
        titleContainer.textContent = d.title;
        noteResult.appendChild(titleContainer);

        const contentContainer = document.createElement('div');
        contentContainer.textContent = d.content;
        noteResult.appendChild(contentContainer);

        const dateTime = document.createElement('div');
        dateTime.textContent = new Date(d.createdAt).toLocaleString();
        noteResult.appendChild(dateTime);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = "Delete";
        noteResult.appendChild(deleteButton);
        deleteButton.addEventListener('click', async () => {
            const deleteResult = await fetch(`/api/notes/${d.id}`, {method: 'DELETE'});
            renderNotes();
        });
        
        const editButton = document.createElement('button');
        editButton.textContent = "Edit";
        noteResult.appendChild(editButton);
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
    });
}

renderNotes();