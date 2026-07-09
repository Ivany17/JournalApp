var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

List<Note> notes = new List<Note> { };

app.MapPost("/api/notes", (Note note) =>
{
    note.Id = notes.Count + 1;
    notes.Add(note);
    return note;
});

app.MapGet("/api/notes", () => notes);

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

app.MapPut("/api/notes/{id}", (int id, Note noteFromTheUser) =>
{
    var idToEdit = notes.FirstOrDefault(n => n.Id == id);
    if (idToEdit != null)
    {
        idToEdit.Title = noteFromTheUser.Title;
        idToEdit.Content = noteFromTheUser.Content;
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
}