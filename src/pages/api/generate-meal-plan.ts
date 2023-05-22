/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '~/env.mjs';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const generateMealPlan = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { preferredFoods, notPreferredFoods, mealType, mealStyle, numOfDays } = req.body;

    const message = `Generate meal plan for ${numOfDays} days with the following criteria:\n
      Preferred Foods: ${preferredFoods}\n
      Not Preferred Foods: ${notPreferredFoods}\n
      Meal Type: ${mealType}\n
      Meal Style: ${mealStyle}.\n
      Give your response in a format of a javascript array where it is an array of objects for each day of the week with the following object format:\n
      {\n
        "title": (insert title of the meal as value),\n
        "mealType": (insert mealType here),\n
        "ingredients": (insert array of string ingredients here),\n
        "instructions": (insert array of string instructions here)\n
      },\n
      So the format of your response should look similar to something like this:\n
      [\n
        {...meal data here}\n
      ]`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are a chef.\n${message}`,
      max_tokens: 3000,
      temperature: 0.7,
      n: 1,
    });

    const generatedText: string | undefined = completion?.data?.choices[0]?.text;
    if (generatedText) {
      const mealPlan: any = extractMealPlan(generatedText);
      return res.status(200).json({ mealPlan: mealPlan });
    }
    return res.status(200).json(null);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ error: 'Failed to generate meal plan.' });
  }
};

export default generateMealPlan;

const extractMealPlan = (generatedText: string): any => {
  const jsonText: any = JSON.stringify(generatedText.replace("Answer:", ""));
  console.log(JSON.parse(jsonText));
  return JSON.parse(jsonText);
};
