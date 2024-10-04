require('dotenv').config();
const userContext = require('../common/userContext');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 


const messages = [
  {
    role: "system",
    content: `You are a helpful recipe assistant. You can create recipes based on the user's profile and inventory. Respond with a JSON object in the following format, note that recipe can be empty if the user is asking for suggestions, IE you do not have to generate a recipe every time. Your response must only include a valid JSON.
{
    "message": "message for the user",
    "recipe": {
      "name": "name goes here",
      "desc": "brief description",
      "ingredients": [
        "ingredient1", "ingredient2"
      ],
      "steps": [
        "step1", "step2"
      ],
      "tools": [
        "tool1", "tool2"
      ],
      "time": "time it will take to prepare the recipe"
    }
}`,
  },
];

exports.recipeAgent = async (userInput) => {
  messages.push(
    {
      role: "system",
      content: userContext(),
    }
  )
  messages.push({
    role: "user",
    content: userInput,
  });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: messages,
  });
  console.log(response);
  return response;
}