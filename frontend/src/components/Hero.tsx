export const Hero = () => {
  return (
    <section 
      className="relative py-20 px-4 text-center flex justify-center items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '700px'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative z-10 max-w-3xl text-white">
        <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
          Beauty Marketplace
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Showcase Your Beauty Products on <span className="text-pink-400">Rembeka Hub</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mb-8">
          Connect with customers, show off your beauty items, and grow your brand through social media.
        </p>
        <div className="flex justify-center">
          <button 
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-md font-medium"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};