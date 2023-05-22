import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { env } from '~/env.mjs';

const configuration = new Configuration({
  apiKey: env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const generateMealPlan = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { preferredFoods, notPreferredFoods, mealType, mealStyle, numOfDays } = req.body;

    // Step 1: Prepare the input message for the ChatGPT API
    const message = `Generate meal plan for ${numOfDays} days with the following criteria:
      Preferred Foods: ${preferredFoods}
      Not Preferred Foods: ${notPreferredFoods}
      Meal Type: ${mealType}
      Meal Style: ${mealStyle}.
      Give your response in a format of a javascript array where it is an array of objects for each day of the week with the following object format:
      {
        "title": (insert title of the meal as value),
        "mealType": (insert mealType here),
        "ingredients": (insert array of string ingredients here),
        "instructions": (insert array of string instructions here)
      },
      
      So the format of your response should look similar to something like this:
      [
        {...meal data here}
      ]`;

    // Step 2: Make a request to the ChatGPT API using the OpenAI npm library
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are a chef.\n${message}`,
      max_tokens: 3000,
      temperature: 0.7,
      n: 1,
    //   stop: '\n',
    });

    // Step 3: Parse and extract the generated meal plan from the ChatGPT API response
    const generatedText: any = completion.data.choices[0].text ?? null;
    if(generatedText){
      const mealPlan: any = extractMealPlan(generatedText);
    // Step 4: Return the generated meal plan as the API response
      return res.status(200).json({ mealPlan });
    }
    return res.status(200).json(null);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: 'Failed to generate meal plan.' });
  }
};

export default generateMealPlan;

const extractMealPlan = (generatedText: string) => {
    const jsonText: any = JSON.stringify(generatedText.replace("Answer:", ""));
    console.log(JSON.parse(jsonText));
    return JSON.parse(jsonText);
  };
  
  
  
  
  
  
  