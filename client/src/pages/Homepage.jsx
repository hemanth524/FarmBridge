import { useState } from "react";
import { Link } from "react-router-dom";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img1 from "../assets/img1.png"

export default function HomePage() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="font-sans bg-white text-gray-800">
           

            {/* Hero Section */}
        <section id="Hero" className="py-16 px-4 h-screen bg-gray-800 flex items-center justify-center relative">
      <img src={img1} alt="FarmBridge Background" className="absolute inset-0 w-full h-full object-cover opacity-10" />
      <div className="text-center border border-white w-[90%] md:w-[90%] h-[95%] flex flex-col items-center justify-center p-6 bg-opacity-50 rounded-lg relative z-10">
        <h1 className="text-5xl text-white font-bold mb-6">FarmBridge</h1>
        <div className="space-x-4 mb-6">
          <a href="#services" className="bg-yellow-500 hover:bg-white text-black px-6 py-2 rounded transition " onClick={(e) => { e.preventDefault(); document.querySelector('#services').scrollIntoView({ behavior: 'smooth' }); }}>Services</a>
          <a href="#contact" className=" bg-yellow-500 px-6 py-2 rounded hover:bg-white hover:text-black transition" onClick={(e) => { e.preventDefault(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }); }}>Contact</a>
        </div>
      </div>
    </section>

            {/* About and Mission */}
            <section id="about" className="py-16 px-4 bg-gray-900 text-white">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">About Us</h2>
                        <p>At FarmBridge, we harness the power of technology to connect farmers directly with consumers, ensuring fair prices and fresh produce. Our platform is designed to eliminate the middleman, allowing farmers to showcase their crops and engage in bidding with buyers. With a focus on transparency and community, FarmBridge empowers farmers to thrive while providing consumers with quality products straight from the source.</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p>Our mission at FarmBridge is to revolutionize the agricultural marketplace by fostering direct connections between farmers and consumers. We are committed to creating an equitable environment where farmers can sell their produce at fair prices while buyers gain access to fresh, locally sourced crops. Through innovation and collaboration, FarmBridge aims to enhance the farming community and promote sustainable practices.</p>
                    </div>
                </div>
            </section>

            <section id="services" className="py-16 px-2 bg-gray-50">
      <h2 className="text-center text-4xl font-bold mb-12">Services at FarmBridge</h2>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg shadow-black/80 overflow-hidden">
          <img src={img2} alt="Direct Sales Platform" className="w-full md:w-1/2 h-80 object-cover" />
          <div className="p-6 md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Direct Sales Platform</h3>
            <p>Engage with FarmBridge's direct sales platform, where farmers can list their crops for consumers to browse and purchase. Our user-friendly interface allows for easy navigation, ensuring that buyers can find exactly what they need while farmers can reach their target market effectively.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse items-center bg-white rounded-xl shadow-lg shadow-yellow-600/80 overflow-hidden">
          <img src={img3} alt="Bidding Opportunities" className="w-full md:w-1/2 h-80 object-cover" />
          <div className="p-6 md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Bidding Opportunities</h3>
            <p>Participate in FarmBridge's innovative bidding system, where farmers can competitively price their crops. This dynamic approach not only encourages fair pricing but also fosters a sense of community among farmers and buyers, creating an engaging marketplace experience.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg shadow-black/80 overflow-hidden">
          <img src={img4} alt="Support for Farmers" className="w-full md:w-1/2 h-80 object-cover" />
          <div className="p-6 md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Support for Farmers</h3>
            <p>FarmBridge is dedicated to supporting farmers with resources and tools to maximize their sales potential. From market insights to promotional assistance, we empower farmers to succeed in a competitive landscape, ensuring they thrive in their agricultural endeavors.</p>
          </div>
        </div>
      </div>
    </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 px-4 bg-gray-900 text-white">
                <h2 className="text-center text-4xl font-bold mb-8">Contact Us</h2>
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg">Email</h3>
                            <p>info@youraddress.com</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Phone</h3>
                            <p>646-675-5974</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Address</h3>
                            <p>3961 Small Street, New York, United States</p>
                        </div>
                        <p>We welcome your inquiries and feedback. Reach out to us with any questions or suggestions.</p>
                    </div>

                    <form className="space-y-4">
                        <input type="text" placeholder="Name" className="w-full p-2 rounded bg-white text-black" required />
                        <input type="email" placeholder="Email" className="w-full p-2 rounded bg-white text-black" required />
                        <textarea placeholder="Type your message here..." className="w-full p-2 rounded bg-white text-black" rows="5" required></textarea>
                        <button type="submit" className="bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-600 transition">Send</button>
                    </form>
                </div>
            </section>

        </div>
    );
}
