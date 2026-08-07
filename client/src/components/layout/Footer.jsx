import { Link } from 'react-router-dom';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo-white.png" alt="CubeTech Shop" className="h-8" />
              <h3 className="text-white text-lg font-bold">CubeTech Shop</h3>
            </div>
            <p className="text-sm">
              Your one-stop shop for quality products at affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: admin@cubetech.cloud</li>
              <li>Phone: +63 995 194 5607</li>
              <li>Address: 14th Floor, Latitude Corporate Center Ayala, Cebu City, 6000 Cebu</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <IoLogoFacebook size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <IoLogoInstagram size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <IoLogoTwitter size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CubeTech Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
