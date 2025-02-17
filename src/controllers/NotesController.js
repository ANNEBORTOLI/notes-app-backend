const knex = require("../database/knex");

class NotesController {
  async create(req, res) {
    const { title, description, tags, links } = req.body;
    const { user_id } = req.params;

    // Cadastra a nota no bd e recupera o id da nota que acabamos de criar
    // O [] são necessários, pois quando usamos o insert ele retorna um array
    //com o note_id dentro na primeira posição
    const [note_id] = await knex("notes").insert({
      title,
      description,
      user_id
    });

    // Percorre a array de links e retorna um obj representando a estrutura
    // necessária para guardar na tabela de Links
    const linksInsert = links.map((link) => {
      return {
        note_id,
        url: link
      };
    });

    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id
      };
    });

    await knex("tags").insert(tagsInsert);

    res.json();
  }

  async show(req, res) {
    const { id } = req.params;

    const note = await knex("notes").where({ id }).first();
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");
    const links = await knex("links")
      .where({ note_id: id })
      .orderBy("created_at");

    return res.json({
      ...note,
      tags,
      links
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    await knex("notes").where({ id }).delete();

    return res.json();
  }

  async index(req, res) {
    const { title, user_id, tags } = req.query;

    let notes;

    if (tags) {
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("tags")
        .select(["notes.id", "notes.title", "notes.user_id"])
        .where("notes.user_id", user_id)
        .whereLike("notes.title", `%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title");
    } else {
      notes = await knex("notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const userTags = await knex("tags").where({ user_id });
    const notesWhithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id);

      return {
        ...note,
        tags: noteTags
      };
    });

    return res.json(notesWhithTags);
  }
}

module.exports = NotesController;
