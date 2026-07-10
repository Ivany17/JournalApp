var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

List<Note> notes = new List<Note> { };

app.MapPost("/api/notes", (Note note) =>
{
    note.Id = notes.Count + 1;
    note.CreatedAt = DateTime.Now;
    notes.Add(note);
    return note;
});

app.MapGet("/api/notes", (string search = null!) =>
{
    if (string.IsNullOrEmpty(search))
    {
        var orderedNotes = notes.OrderByDescending(n => n.CreatedAt).ToList();
        return orderedNotes;
    }
    else
    {
        var searchNote = notes.Where(n => n.Title.Contains(search, StringComparison.OrdinalIgnoreCase));
        return searchNote;
    }
});

app.MapDelete("/api/notes/{id}", (int id) =>
{
    var idToDelete = notes.FirstOrDefault(n => n.Id == id);
    if (idToDelete != null)
    {
        notes.Remove(idToDelete);
        return true;
    }
    else
    {
        return false;
    }
});

app.MapPut("/api/notes/{id}", (int id, Note notesFromTheUser) =>
{
    var idToEdit = notes.FirstOrDefault(n => n.Id == id);
    if (idToEdit != null)
    {
        idToEdit.Title = notesFromTheUser.Title;
        idToEdit.Content = notesFromTheUser.Content;
        return Results.Ok(idToEdit);
    }
    else
    {
        return Results.NotFound();
    }
});

app.Run();

public class Note
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Content { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}