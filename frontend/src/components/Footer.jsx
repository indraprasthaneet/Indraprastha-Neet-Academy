import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/companylogo.png"; // replace with actual path
import { MdEmail } from "react-icons/md";
import { FaTelegram, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  let navigate = useNavigate();
  
  // Social media links
  const socialLinks = [
    { 
      name: "Email", 
      url: "mailto:contact@indraprasthaneetacademy.com", 
      icon: <MdEmail className="text-2xl" /> 
    },
    { 
      name: "Telegram", 
      url: "https://t.me/+WdazjSGbdVJiZWY1", 
      icon: <FaTelegram className="text-2xl" /> 
    },
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/neet.academy_?igsh=MWpwZXpibXJicGV1bQ==", 
      icon: <FaInstagram className="text-2xl" /> 
    },
    { 
      name: "YouTube", 
      url: "https://youtube.com/@indraprasthaneetacademy?si=_SRHo3Ylroh8T1sT", 
      icon: <FaYoutube className="text-2xl" /> 
    }
  ];

  return (
    <footer className="bg-black text-gray-300 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center items-start justify-center gap-8 lg:gap-12 xl:gap-24">
        {/* Logo + Description */}
        <div className="lg:w-[40%] w-full">
          <img src={logo} alt="Logo" className="h-16 mb-2 rounded-[5px]" />
          <h2 className="text-xl font-bold text-white mb-3">Indraprastha Neet Academy</h2>
          <p className="text-sm mb-4">
            Online learning platform to help you grow smarter. Learn anything, anytime, anywhere.
          </p>
          
          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:w-[30%] w-full">
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors duration-300" onClick={() => navigate("/")}>Home</li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300" onClick={() => navigate("/test-series")}>Test Series</li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300" onClick={() => navigate("/login")}>Login</li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300" onClick={() => navigate("/profile")}>My Profile</li>
          </ul>
        </div>

        {/* Explore Categories */}
        <div className="lg:w-[30%] w-full">
          <h3 className="text-white font-semibold mb-2">Explore Categories</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:text-white cursor-pointer transition-colors duration-300">Chemistry</li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300">Physics</li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300">Biology</li>
            <li className="hover:text-white cursor-pointer transition-colors duration-300">Mathematics</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-5 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} Indraprastha Neet Academy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;