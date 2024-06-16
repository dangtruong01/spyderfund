import { useState } from "react";
import Layout from "../components/Layout";
import Card from "@/components/home/Card";
import {
  inboxSVG,
  collaborationSVG,
  securitySVG,
  integrationSVG,
  searchSVG,
  customizationSVG,
} from "@/components/home/homeIcons";
import { Button } from "@/components/ui/button";

const homeElements = [
  // {
  //   title:"Transparent Transactions",
  // subtitle:"All your contributions are kept on the chain to uphold accountability",
  // logo:inboxSVG
  // },
  {
    title: "Seamless Integration",
    subtitle: "Easily become a donor with a myriad of payment methods",
    logo: integrationSVG,
  },
  {
    title: "Custom Milestones",
    subtitle:
      "As project owners, set milestones to attract donors and request funds as needed to complete your project milestones",
    logo: customizationSVG,
  },
  {
    title: "Transparent Transactions",
    subtitle:
      "All your contributions are kept on the chain to uphold accountability",
    logo: searchSVG,
  },
  {
    title: "Reliable Security",
    subtitle:
      "Funds are transferred progressively as project milestones are reached",
    logo: securitySVG,
  },
  // {
  //   title: "Easy Collaboration",
  //   subtitle:
  //     "Easy Collaboration allows you to share and edit documents with your team in real time.",
  //   logo: collaborationSVG,
  // },
];

const HomePage = () => {
  return (
    <section className="mx-8 w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background flex flex-col justify-center items-center min-h-screen">
      <div className="container px-4 md:px-6 ">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-pink-100 to-pink-300 pb-4">
                Crowdfund safely with a peace of mind
              </h1>
              <p className="max-w-[600px]  text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
                Our policies foster trust between donors and projects
              </p>
            </div>
            <div className="w-full max-w-full mx-auto">
              <div className="grid grid-cols-2 gap-10">
                {homeElements.map((el, index) => (
                  <Card
                    key={index}
                    title={el.title}
                    subtitle={el.subtitle}
                    logo={el.logo}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <a href="/projects" className="mt-24">
        <Button className="bg-white text-black w-72 h-14 hover:bg-pink-300 hover:text-white">
          View Projects
        </Button>
      </a>
    </section>
  );
};

export default HomePage;
