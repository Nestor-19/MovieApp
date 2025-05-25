'use client';



export default function Home() {
  return (
    <>
  
      <div
        className="
          min-h-screen flex items-center justify-center
          bg-thio from-slate-800 to-black
          px-4 py-10
        "
      >
        <main
          className="
            bg-thio shadow-lg rounded-2xl p-10
            w-full max-w-sm
            flex flex-col gap-6 items-center
          "
        >
          <div className="border border-pink p-6 rounded-lg w-full text-center">
            <h1 className="text-6xl font-bold text-yellow-400">MovieApp</h1>
            <p className="text-gray-600 text-lg mt-2 mb-6">
              Sign in to continue using MovieApp
            </p>

           <div className="flex flex-col items-center justify-center gap-6">
  <div>
    <a
      href="http://localhost:8080/oauth2/authorization/google"
      className="
        flex items-center gap-2
        bg-thio hover:bg-gray-600
        rounded-lg px-4 py-2
        transition-colors duration-300
        cursor-pointer
        text-white
      "
    >
      <img
        src="icons/googleIcon.png"
        alt="Google icon"
        className="w-8 h-auto"
      />
      <span>Jump In With Google</span>
    </a>
  </div>

  <div>
    <a
      href="http://localhost:8080/oauth2/authorization/google"
      className="
        flex items-center gap-2
        bg-thio hover:bg-gray-600
        rounded-lg px-4 py-2
        transition-colors duration-300
        cursor-pointer
        text-white
      "
    >
      <img
        src="icons/icloud.png"
        alt="Google icon"
        className="w-8 h-auto"
      />
      <span>Jump In With iCloud</span>
    </a>
  </div>
</div>

          </div>
        </main>
      </div>
    </>
  );
}
