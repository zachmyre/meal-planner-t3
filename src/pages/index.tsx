import { type NextPage } from "next";
import Head from "next/head";
import MealPlanForm from "~/components/MealPlanForm";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Meal Planner</title>
        <meta name="description" content="Meal Planner" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center mt-8 mb-12">
      <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        Meal Planner
      </span>
    </h1>
      <MealPlanForm />
      </div>
    </>
  );
};

export default Home;
