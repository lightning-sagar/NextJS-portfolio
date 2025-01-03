'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '@/sanityClient';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';

const builder = imageUrlBuilder(client);
function urlFor(source: string) {
  return builder.image(source);
}

interface Skill {
  _id: string;
  name: string;
  image: string;
  description: string;
}

const SkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await client.fetch(`
          *[_type == "skill"] {
            _id,
            name,
            image,
            description
          }
        `);

        setSkills(skillsData);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const openModal = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSkill(null);
  };

  return (
    <section id="skills" className="min-h-screen bg-black py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          My Technical Skills
        </h2>

        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.div
                key={skill._id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-gray-800 rounded-lg p-3 sm:p-4 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
                onClick={() => openModal(skill)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-4 flex items-center justify-center">
                    <Image
                      src={urlFor(skill.image).url()} 
                      alt={skill.name} 
                      height={128}
                      width={128}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-center text-white mb-1 sm:mb-2">
                    {skill.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <AnimatePresence>
        {isModalOpen && selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <Image
                  src={urlFor(selectedSkill.image).url()} 
                  alt={selectedSkill.name } 
                  className="w-16 h-16 object-contain mr-4"
                  height={128}
                  width={128}
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedSkill.name}</h3>
                </div>
              </div>
              <p className="text-gray-300 mb-4">{selectedSkill.description}</p>
              <button
                onClick={closeModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SkillsSection;