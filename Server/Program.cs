using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlite("Data Source=journal.db");
});
builder.Services.AddHttpContextAccessor();
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/notes", async (Note note) =>
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    note.CreatedAt = DateTime.Now;
    dbContext.Notes.Add(note);
    await dbContext.SaveChangesAsync();
    return note;
});

app.MapGet("/api/notes/search", async (string search = null!, string date = null!) =>
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var query = dbContext.Notes.AsQueryable();
    if (!string.IsNullOrEmpty(search))
    {
        query = query.Where(q => q.Title.Contains(search));
    }
    if (!string.IsNullOrEmpty(date))
    {
        var parsedDate = DateTime.Parse(date);
        query = query.Where(q => q.CreatedAt.Date == parsedDate.Date);
    }
    var result = await query.OrderByDescending(q => q.CreatedAt).ToListAsync();
    return result;
});

app.MapDelete("/api/notes/{id}", async (int id) =>
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var idToDelete = dbContext.Notes.FirstOrDefault(n => n.Id == id);
    if (idToDelete != null)
    {
        dbContext.Notes.Remove(idToDelete);
        await dbContext.SaveChangesAsync();
        return true;
    }
    else
    {
        return false;
    }
});

app.MapPut("/api/notes/{id}", async (int id, Note notesFromTheUser) =>
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    var idToEdit = dbContext.Notes.FirstOrDefault(n => n.Id == id);
    if (idToEdit != null)
    {
        idToEdit.Title = notesFromTheUser.Title;
        idToEdit.Content = notesFromTheUser.Content;
        await dbContext.SaveChangesAsync();
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