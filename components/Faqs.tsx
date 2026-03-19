"use client";
import React, { useState } from "react";

const Faqs = () => {
  const faqs = [
    {
      question: "What is Tech It Easy?",
      answer:
        "Tech It Easy is a 24-hour hackathon focused on building full-stack agentic AI applications. It's an opportunity for developers, designers, and AI enthusiasts to come together and create innovative solutions using the latest AI technologies.",
    },
    {
      question: "Who can participate?",
      answer:
        "Tech It Easy is open to anyone interested in AI and technology, regardless of skill level. Whether you're a seasoned developer or a beginner, you can join a team and contribute to building an exciting AI application.",
    },
    {
      question: "When and where is the event?",
      answer:
        "Tech It Easy will take place on April 29-30, 2026, at the AMC in Bangalore. It's a weekend filled with coding, collaboration, and fun!",
    },
    {
      question: "What kind of projects can we build?",
      answer:
        "Participants are encouraged to build full-stack agentic AI applications. This could include anything from AI-powered chatbots and virtual assistants to innovative tools that leverage machine learning and natural language processing.",
    },
    {
      question: "Are there any prizes?",
      answer:
        "Yes! There are over $1000 worth of prizes available for the best projects. It's a great opportunity to showcase your skills and win exciting rewards.",
    },
    {
      question: "Is there a registration fee?",
      answer:
        "No, Tech It Easy is completely free to attend. We want to make it accessible for everyone who wants to participate and build amazing AI applications.",
    },
    {
      question: "Will there be mentors available?",
      answer:
        "Yes, we will have experienced mentors available throughout the event to provide guidance and support to all teams. Whether you need help with technical challenges or want feedback on your project, our mentors are here to assist you.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-3xl font-bold text-left mb-12">Got Questions?</h2>

      <div className="space-y-4 max-w-3xl md:max-w-5xl mx-auto">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl transition duration-300 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-white"
              >
                {faq.question}

                <span
                  className={`text-orange-400 text-xl transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              {/* Animated Content */}
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 py-4 text-neutral-300 border-t border-white/10">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faqs;
