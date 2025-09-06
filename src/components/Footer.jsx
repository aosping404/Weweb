import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-screen bg-[#535353] py-4 text-black">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-center text-sm font-light md:text-left">
          Intelligent Wearable Technology Lab © 2025
        </p>

        <div className="flex justify-center md:justify-start">
          <a
            href="https://github.com/aosping404"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black transition-colors duration-500 ease-in-out hover:text-white -ml-[100px]"
            title="访问我的GitHub博客"
          >
            <FaGithub className="text-xl" />
          </a>
        </div>

        <a
          href="#privacy-policy"
          className="text-center text-sm font-light hover:underline md:text-right"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
