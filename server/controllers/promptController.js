const ingredientAgent = require('../openai/ingredientAgent');
const recipeAgent = require('../openai/recipeAgent');

// Controller function to handle output from chatbot to the user
exports.promptMessage = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const result = await recipeAgent.agent(prompt);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.promptItem = async (req, res) => {
    try {
      console.log(req.params.item);
      const result = await ingredientAgent.agent(req.params.item);
      res.status(200).json({ result });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };