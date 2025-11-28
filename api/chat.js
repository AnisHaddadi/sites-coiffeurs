const OpenAI = require("openai");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const { message } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un assistant pour Valessio à Paris.
Ton style doit être :
- professionnel
- chaleureux
- utile
- concis

NE JAMAIS inventer de prix si on te les demande.
Si le client demande les tarifs : réponds "Les prix varient selon la prestation. Précisez ce que vous souhaitez et je vous guide."`,
        },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: "Erreur lors de la génération de la réponse" });
  }
};

