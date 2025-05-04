// Import the motion component from Framer Motion
'use client';
import { useEffect } from "react";
import { motion } from "framer-motion"; // Correct import
import gsap from "gsap";

export default function Home() {
  // useEffect(() => {
  //   // Example of using GSAP for more complex animations
  //   gsap.from(".card", {
  //     opacity: 0,
  //     y: 100,
  //     duration: 1,
  //     stagger: 0.3,
  //     ease: "power4.out",
  //     delay: 1,
  //   });
  // }, []);

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
      {/* Hero Section */}
      <section className="text-center py-16 px-6">
        <motion.h1
          className="text-5xl font-bold leading-tight mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          🧠 Welcome to My AI Tool Suite
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Explore powerful, AI-driven tools for a variety of tasks—from summarizing text to analyzing resumes!
        </motion.p>
        <motion.a
          href="/summarizer"
          className="inline-block px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg text-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Start Exploring
        </motion.a>
      </section>

      {/* AI Tools Cards */}
      <section className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-12">
        {/* Card 1 - Text Summarizer */}
        <motion.div
          className="card p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="flex justify-center mb-4">
            <img
              src="https://img.icons8.com/ios/50/000000/summary.png"
              alt="summarizer-icon"
              className="w-16 h-16"
            />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">Text Summarizer</h3>
          <p className="text-gray-600 mb-4">
            Paste long articles, and get concise summaries powered by OpenAI.
          </p>
          <a
            href="/summarizer"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Try Now
          </a>
        </motion.div>

        {/* Repeat for other cards... */}
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          &copy; 2025 My AI Tool Suite. All rights reserved.
        </motion.p>
      </footer>
    </main>
  );
}
