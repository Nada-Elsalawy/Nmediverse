// import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@heroui/react";
// import logo from "../../assets/img/WhatsApp Image 2025-10-28 at 8.26.50 PM.jpeg"
// import { NavLink, useNavigate } from "react-router-dom";


// export default function App() {
//   const navigate = useNavigate();
//   return (
//     <Navbar className="bg-gray-50">
//       <NavbarBrand>
//        <img onClick={()=> navigate("")} src={logo} className="w-[30%] cursor-pointer active"  alt="" />
       
//       </NavbarBrand>
//       <NavbarContent className="hidden sm:flex gap-4 " justify="center">
//         <NavbarItem>
//           <NavLink color="foreground" to={"/"}>
//            Home
//           </NavLink>
//         </NavbarItem>
//         <NavbarItem >
//           <NavLink  to={"/Register"}>
//             Register
//           </NavLink>
//         </NavbarItem>
//         <NavbarItem>
//           <NavLink color="foreground" to={"/chatbot"}>
//            ChatBot
//           </NavLink>
//         </NavbarItem>
        
          
//       </NavbarContent>
      
//     </Navbar>
//   );
// }


import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Link, Button} from "@heroui/react";
import logo from "../../assets/img/logo (1).PNG"
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function App() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
  
    { name: "Patient login", path: "/Register" },
    { name: " doctor login", path: "/login" },

      { name: "Doctor", path: "/dr" },
      { name: "Waiting queue", path: "/wating" },

    { name: "ChatBot", path: "/chatbot" },

  ];

  return (
    <Navbar 
      className="bg-gray-50"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        {/* Mobile Menu Toggle */}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <img 
            onClick={() => navigate("/")} 
            src={logo} 
            className="w-[30%] max-sm:w-[50%] cursor-pointer" 
            alt="Logo" 
          />
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
       
        <NavbarItem>
          <NavLink 
            to="/Register"
            className={({isActive}) => 
              isActive ? "text-[#597b97]  font-semibold" : "text-foreground"
            }
          >
           patient Login
          </NavLink>
        </NavbarItem>
         <NavbarItem>
          <NavLink 
            to="/login"
            className={({isActive}) => 
              isActive ? "text-[#597b97] font-semibold" : "text-foreground"
            }
          >
           doctor login
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink 
            to="/wating"
            className={({isActive}) => 
              isActive ? "text-[#597b97] font-semibold" : "text-foreground"
            }
          >
           Wating Queue
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink 
            to="/chatbot"
            className={({isActive}) => 
              isActive ? "text-[#597b97] font-semibold" : "text-foreground"
            }
          >
            ChatBot
          </NavLink>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <NavLink
              to={item.path}
              className={({isActive}) => 
                `w-full text-lg ${isActive ? 'text-[#597b97]  font-semibold' : 'text-foreground'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </NavLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
