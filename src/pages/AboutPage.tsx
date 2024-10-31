import React from 'react';

const DiscordIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 127.14 96.36" 
    className="w-5 h-5"
  >
    <path 
      fill="currentColor" 
      d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
    />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    />
  </svg>
);

const AboutIcon = () => (
  <svg 
    width="350" 
    height="350" 
    viewBox="0 0 350 350" 
    className="w-5 h-5 fill-current"
  >
    <path d="M57.8125 45.0742V45.8159L82.6592 69.1792C85.626 72.146 85.9968 73.2585 85.9968 78.0796V272.774C85.9968 277.595 85.626 278.708 82.6592 281.674L57.8125 305.038V305.779H196.88C255.103 305.779 292.188 279.449 292.188 232.723C292.188 192.3 256.957 170.049 207.264 168.937V168.195C253.619 164.116 284.029 142.978 284.029 104.78C284.029 63.9874 248.057 45.0742 190.576 45.0742H57.8125ZM171.292 173.758C206.151 173.758 220.243 195.267 220.243 234.948C220.243 275.37 206.522 298.362 172.404 298.362H162.02C154.233 298.362 153.12 297.992 153.12 290.945V173.758H171.292ZM153.12 59.9081C153.12 53.6037 154.233 52.4911 159.795 52.4911H172.404C199.476 52.4911 213.939 74.7419 213.939 107.747C213.939 144.461 199.105 166.341 170.921 166.341H153.12V59.9081Z" />
  </svg>
);

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Background SVG */}
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] -rotate-[33deg] translate-x-1/4 translate-y-1/4 pointer-events-none opacity-[0.02] dark:opacity-[0.04] transition-opacity duration-300">
        <svg 
          viewBox="0 0 350 350"
          className="w-full h-full"
        >
          <path 
            d="M57.8125 45.0742V45.8159L82.6592 69.1792C85.626 72.146 85.9968 73.2585 85.9968 78.0796V272.774C85.9968 277.595 85.626 278.708 82.6592 281.674L57.8125 305.038V305.779H196.88C255.103 305.779 292.188 279.449 292.188 232.723C292.188 192.3 256.957 170.049 207.264 168.937V168.195C253.619 164.116 284.029 142.978 284.029 104.78C284.029 63.9874 248.057 45.0742 190.576 45.0742H57.8125ZM171.292 173.758C206.151 173.758 220.243 195.267 220.243 234.948C220.243 275.37 206.522 298.362 172.404 298.362H162.02C154.233 298.362 153.12 297.992 153.12 290.945V173.758H171.292ZM153.12 59.9081C153.12 53.6037 154.233 52.4911 159.795 52.4911H172.404C199.476 52.4911 213.939 74.7419 213.939 107.747C213.939 144.461 199.105 166.341 170.921 166.341H153.12V59.9081Z"
            className="fill-current text-black dark:text-white"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Botto</h1>
        </div>

        <div className="space-y-8">
          <section className="bg-white dark:bg-[#212121] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              What's Botto?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Botto is a contemporary autonomous artist whose work explores the relationship between human-machine collaboration and decentralized blockchains. Born and initially programmed by artist Mario Klingemann and a team of technologists and artists, Botto creates artwork based on community feedback. That feedback is provided by BottoDAO in the form of votes, which is then used to train the machine.
            </p>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About This Programme
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              For a bit of fun, BottoDAO is looking to curate artworks outside of Botto's ecosystem: we're trying to discover our favorite artworks available for purchase with $RARE on SuperRare. In true BottoDAO fashion, we'll be curating our favorite artworks through a simple voting mechanism!
            </p>
          </section>

          <section className="bg-white dark:bg-[#212121] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How This Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">1</span>
                </div>
                <div>
                  <h3 className="font-regular text-gray-900 dark:text-white mb-1">
                    Community Curation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    DAO members submit eligible $RARE listed artworks (Up to 10k $RARE) that they want BottoDAO to acquire.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">2</span>
                </div>
                <div>
                  <h3 className="font-regular text-gray-900 dark:text-white mb-1">
                    The DAO Votes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The community votes on the submitted artworks, determining which pieces should be acquired.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">3</span>
                </div>
                <div>
                  <h3 className="font-regular text-gray-900 dark:text-white mb-1">
                    The DAO Collects
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    The highest voted artworks are collected by the DAO and become part of the DAO's permanent collection.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#0f0f0f] rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Join BottoDAO!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Curate with BottoDAO and help shape the future of the decentralized autonomous artist.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://discord.com/invite/botto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <DiscordIcon />
                Curate with us!
              </a>
              <a
                href="https://x.com/bottodao"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black hover:bg-zinc-900 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <XIcon />
                Follow on X
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;